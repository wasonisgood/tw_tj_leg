import { AlignmentType, HeadingLevel, Paragraph, TextRun } from 'docx';
import { LYHistoryData, ProcessedSpeech } from '../DataManager';
import {
  buildPartyLawBuckets,
  buildTermLookup,
  getConfrontationalModeDescription,
  getFirstTermFallbackDescription,
  getStageModeDescription,
  groupSpeechesByLaw,
  sortPartyGroupNames
} from '../components/year-overview/partyUtils';

type PartyAppendixOptions = {
  year: string;
  speeches: ProcessedSpeech[];
  lyHistoryData: LYHistoryData;
  compact?: boolean;
};

function createParagraph(text: string, options?: Record<string, unknown>) {
  return new Paragraph({ text, ...options } as any);
}

function createSpeakerSummary(speeches: ProcessedSpeech[], compact: boolean): string {
  const speakers = Array.from(new Set(speeches.map((speech) => speech.speaker).filter(Boolean)));
  if (!speakers.length) return '';
  if (compact) {
    return `代表發言者：${speakers.slice(0, 6).join('、')}${speakers.length > 6 ? `等${speakers.length}位` : ''}`;
  }

  return `代表發言者：${speakers.join('、')}`;
}

function appendPartyBucketParagraphs(children: any[], byParty: Record<string, ProcessedSpeech[]>, compact: boolean) {
  sortPartyGroupNames(byParty).forEach((party) => {
    const speeches = byParty[party];
    const countText = `${party}：${speeches.length} 筆發言`;
    children.push(
      createParagraph(countText, {
        indent: { left: 360 },
        spacing: { before: 60, after: compact ? 40 : 20 }
      })
    );

    const speakerSummary = createSpeakerSummary(speeches, compact);
    if (speakerSummary) {
      children.push(
        createParagraph(speakerSummary, {
          indent: { left: 720 },
          spacing: { after: 60 },
          style: 'Intense Quote'
        })
      );
    }
  });
}

function appendModeSection(children: any[], year: string, speeches: ProcessedSpeech[], lyHistoryData: LYHistoryData, splitByStage: boolean, compact: boolean) {
  const terms = buildTermLookup(lyHistoryData);
  const groupedByLaw = groupSpeechesByLaw(speeches);
  const buckets = buildPartyLawBuckets(groupedByLaw, terms, 'confrontational', splitByStage);
  const modeTitle = splitByStage ? '對抗模式・分程序' : '對抗模式・不分程序';

  children.push(
    new Paragraph({
      text: `${year} ${modeTitle}`,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 500, after: 180 }
    } as any)
  );
  children.push(
    createParagraph(getStageModeDescription(splitByStage), {
      spacing: { after: 120 }
    })
  );

  buckets.forEach((law) => {
    children.push(
      createParagraph(law.lawName, {
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 280, after: 140 }
      })
    );

    law.stageBuckets.forEach((stage) => {
      if (splitByStage) {
        const suffix = stage.stageDate ? `（${stage.stageDate}）` : '';
        children.push(
          createParagraph(`${stage.stageName}${suffix}`, {
            spacing: { before: 120, after: 80 }
          })
        );
      }

      appendPartyBucketParagraphs(children, stage.byParty, compact);
    });
  });
}

export function appendConfrontationalModeAppendix(children: any[], options: PartyAppendixOptions) {
  const { year, speeches, lyHistoryData, compact = false } = options;

  children.push(
    new Paragraph({
      text: `${year} 政黨對抗模式附錄`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 700, after: 200 }
    } as any)
  );
  children.push(
    createParagraph(getConfrontationalModeDescription(), {
      spacing: { after: 100 }
    })
  );
  children.push(
    createParagraph(getFirstTermFallbackDescription(), {
      spacing: { after: 220 }
    })
  );

  if (!speeches.length) {
    children.push(
      createParagraph('目前沒有可匯出的發言資料。', {
        spacing: { after: 160 }
      })
    );
    return;
  }

  appendModeSection(children, year, speeches, lyHistoryData, false, compact);
  appendModeSection(children, year, speeches, lyHistoryData, true, compact);
}