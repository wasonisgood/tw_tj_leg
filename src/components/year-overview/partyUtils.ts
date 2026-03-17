import { LYHistoryData, ProcessedSpeech } from '../../DataManager';
import { getSortedStageBuckets, isOfficialIdentity } from './archiveUtils';

export type PartyMode = 'pure' | 'confrontational';

export type NormalizedTerm = {
  term: string;
  start: string;
  end: string;
  partyByName: Record<string, string>;
};

export type PartyStageBucket = {
  stageName: string;
  stageDate: string;
  byParty: Record<string, ProcessedSpeech[]>;
};

export type PartyLawBucket = {
  lawName: string;
  stageBuckets: PartyStageBucket[];
};

const FIRST_TERM_FALLBACK_PARTY = '老委員';
const UNKNOWN_PARTY = '未知政黨';

const PARTY_ORDER = [
  '民主進步黨',
  '中國國民黨',
  '台灣民眾黨',
  '時代力量',
  '無黨籍',
  '無',
  FIRST_TERM_FALLBACK_PARTY,
  UNKNOWN_PARTY
];

export function normalizePartyDate(value: string): string {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length < 8) return '';
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function normalizePersonName(value: string): string {
  return (value || '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '')
    .replace(/（.*?）|\(.*?\)/g, '')
    .trim();
}

function parseTermDateRange(raw: string): { start: string; end: string } {
  const [rawStart = '', rawEnd = ''] = (raw || '').split('至');
  return {
    start: normalizePartyDate(rawStart),
    end: normalizePartyDate(rawEnd)
  };
}

export function buildTermLookup(lyData: LYHistoryData): NormalizedTerm[] {
  return Object.entries(lyData || {})
    .map(([term, value]) => {
      const { start, end } = parseTermDateRange(value.時間 || '');
      const partyByName: Record<string, string> = {};

      Object.entries(value.名單 || {}).forEach(([name, party]) => {
        const normalized = normalizePersonName(name);
        if (normalized) {
          partyByName[normalized] = party || '未知';
        }

        const primaryChinese = normalized.match(/^[\u4e00-\u9fff]+/)?.[0] || '';
        if (primaryChinese && !partyByName[primaryChinese]) {
          partyByName[primaryChinese] = party || '未知';
        }
      });

      return { term, start, end, partyByName };
    })
    .filter((item) => !!item.start && !!item.end)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export function resolveTermByDate(date: string, terms: NormalizedTerm[]): NormalizedTerm | null {
  if (!terms.length) return null;
  const normalizedDate = normalizePartyDate(date);
  if (!normalizedDate) return null;

  const inRange = terms.find((term) => normalizedDate >= term.start && normalizedDate <= term.end);
  if (inRange) return inRange;

  const latestBefore = [...terms]
    .filter((term) => term.start <= normalizedDate)
    .sort((a, b) => b.start.localeCompare(a.start))[0];
  if (latestBefore) return latestBefore;

  return terms[0];
}

function isFirstTermFallbackApplicable(speech: ProcessedSpeech, term: NormalizedTerm, candidates: string[]): boolean {
  if (!term.term.includes('第一屆')) return false;
  if (!candidates.length) return false;
  return !isOfficialIdentity(speech.identity || '');
}

export function resolveParty(speech: ProcessedSpeech, terms: NormalizedTerm[]): string {
  const term = resolveTermByDate(speech.date || speech.metadata?.date || '', terms);
  if (!term) return UNKNOWN_PARTY;

  const candidates = (speech.speaker || '')
    .split(/[\/／,，、；;]+/)
    .map((name) => normalizePersonName(name))
    .filter(Boolean);

  if (!candidates.length) return UNKNOWN_PARTY;

  const foundParties = Array.from(
    new Set(
      candidates
        .map((candidate) => term.partyByName[candidate])
        .filter((party): party is string => !!party)
    )
  );

  if (!foundParties.length) {
    return isFirstTermFallbackApplicable(speech, term, candidates) ? FIRST_TERM_FALLBACK_PARTY : UNKNOWN_PARTY;
  }

  if (foundParties.length === 1) return foundParties[0];
  return `跨黨協作（${foundParties.join(' / ')}）`;
}

export function getPartyBucketLabel(speech: ProcessedSpeech, terms: NormalizedTerm[], mode: PartyMode): string {
  const official = isOfficialIdentity(speech.identity || '');
  const baseParty = resolveParty(speech, terms);

  if (mode === 'pure') {
    return official ? '行政官員' : baseParty;
  }

  if (official) {
    return `行政官員｜${baseParty}`;
  }

  return `${baseParty}｜立法委員`;
}

export function groupSpeechesByLaw(speeches: ProcessedSpeech[]): Record<string, Record<string, ProcessedSpeech[]>> {
  return speeches.reduce((acc, speech) => {
    const law = speech.lawName || '其他';
    const stage = speech.stage || '一般會議';

    if (!acc[law]) acc[law] = {};
    if (!acc[law][stage]) acc[law][stage] = [];

    acc[law][stage].push(speech);
    return acc;
  }, {} as Record<string, Record<string, ProcessedSpeech[]>>);
}

export function buildPartyLawBuckets(
  groupedByLaw: Record<string, Record<string, ProcessedSpeech[]>>,
  terms: NormalizedTerm[],
  mode: PartyMode,
  splitByStage: boolean
): PartyLawBucket[] {
  return Object.entries(groupedByLaw).map(([lawName, stageMap]) => {
    if (splitByStage) {
      const stageBuckets = getSortedStageBuckets(stageMap).map((stage) => {
        const byParty: Record<string, ProcessedSpeech[]> = {};
        stage.speeches.forEach((speech) => {
          const party = getPartyBucketLabel(speech, terms, mode);
          if (!byParty[party]) byParty[party] = [];
          byParty[party].push(speech);
        });

        return { stageName: stage.stageName, stageDate: stage.stageDate, byParty };
      });

      return { lawName, stageBuckets };
    }

    const byParty: Record<string, ProcessedSpeech[]> = {};
    Object.values(stageMap)
      .flat()
      .forEach((speech) => {
        const party = getPartyBucketLabel(speech, terms, mode);
        if (!byParty[party]) byParty[party] = [];
        byParty[party].push(speech);
      });

    return { lawName, stageBuckets: [{ stageName: '全部程序', stageDate: '', byParty }] };
  });
}

function getPartyOrderKey(groupName: string): string {
  if (groupName.startsWith('行政官員｜')) {
    return groupName.split('｜')[1] || groupName;
  }

  return groupName.split('｜')[0] || groupName;
}

export function sortPartyGroupNames(groups: Record<string, ProcessedSpeech[]>): string[] {
  const names = Object.keys(groups);
  return names.sort((a, b) => {
    if (a.includes('行政官員') && !b.includes('行政官員')) return -1;
    if (b.includes('行政官員') && !a.includes('行政官員')) return 1;

    const ai = PARTY_ORDER.indexOf(getPartyOrderKey(a));
    const bi = PARTY_ORDER.indexOf(getPartyOrderKey(b));

    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;

    return groups[b].length - groups[a].length || a.localeCompare(b, 'zh-Hant');
  });
}

export function getConfrontationalModeDescription(): string {
  return '對抗模式會將行政官員獨立於政黨陣營之外，並盡量保留其可辨識原屬政黨；非官員則以「政黨｜立法委員」方式呈現。';
}

export function getStageModeDescription(splitByStage: boolean): string {
  return splitByStage
    ? '分程序模式會依一讀、委員會、二讀等議事程序拆分政黨分布。'
    : '不分程序模式會把同一法案全年所有程序合併成單一政黨分布。';
}

export function getFirstTermFallbackDescription(): string {
  return '第一屆僅有第五次增額名單，未列於名單但可判定為委員者，統一歸為老委員。';
}