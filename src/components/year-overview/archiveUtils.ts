import { ProcessedSpeech, LawHistoryData, LawLegislationVersion } from '../../DataManager';

export type LawMilestone = {
  key: string;
  date: string;
  label: string;
  displayLabel: string;
  lawName: string;
  actionType: string;
  summary: string;
};

export type StageBucket = {
  stageName: string;
  stageDate: string;
  speeches: ProcessedSpeech[];
  billEvents?: Array<{
    bill: any;
    status: string;
    date: string;
  }>;
};

const OFFICIAL_KEYWORDS = ['部長', '次長', '主委', '主任委員', '官員', '行政院', '機關', '院長', '政務'];

const POLICY_CATEGORY_RULES: Array<{ label: string; keywords: RegExp[] }> = [
  {
    label: '轉型正義與平反推進',
    keywords: [/轉型正義/, /平反/, /人權/, /受難/, /被害/, /回復/, /補償/, /救濟/, /正義/, /民權/, /自由/]
  },
  {
    label: '問責監督與歷史究責',
    keywords: [/問責/, /究責/, /監督/, /質詢/, /追討/, /揭露/, /批判/, /捍衛/]
  },
  {
    label: '法制程序與審慎修法',
    keywords: [/法制/, /程序/, /法治/, /法律/, /審慎/, /中立/, /協調/, /比例/, /審查/, /修法/, /憲法/, /法源/, /議事/]
  },
  {
    label: '行政執行與制度治理',
    keywords: [/行政/, /執行/, /治理/, /制度/, /配套/, /承接/, /整合/, /分工/, /技術/, /務實/, /效率/, /落地/, /專責/, /組織/, /院層級/]
  },
  {
    label: '國安防衛與風險管制',
    keywords: [/國安/, /保密/, /治安/, /風險/, /防衛/, /軍事/, /情報/, /控管/, /限權/, /警戒/, /管制/, /兩岸/]
  },
  {
    label: '原民與多元族群權益',
    keywords: [/原民/, /原住民/, /原住民族/, /移工/, /金馬/, /族群/, /土地正義/]
  },
  {
    label: '檔案開放與記憶工程',
    keywords: [/檔案/, /史觀/, /教育/, /文化/, /記憶/, /和解工程/]
  },
  {
    label: '社會平衡與穩定協商',
    keywords: [/平衡/, /和解/, /折衷/, /中間/, /溫和/, /穩健/, /雙軌/, /漸進/, /分階段/, /階段/, /穩定優先/]
  }
];

const LAW_NAME_ALIASES: Record<string, string> = {
  '228條例': '二二八事件處理及賠償條例',
  '不當審判條例': '戒嚴時期不當叛亂暨匪諜審判案件補償條例',
  '促轉條例': '促進轉型正義條例',
  '回復條例': '戒嚴時期人民受損權利回復條例',
  '威權時期回復條例': '威權統治時期國家不法行為被害者權利回復條例',
  '年資處理條例': '公職人員年資併社團專職人員年資計發退離給與處理條例',
  '黨產條例': '政黨及其附隨組織不當取得財產處理條例',
  '國家安全法': '國家安全法',
  '國安法': '國家安全法'
};

export function normalizeLawName(input: string): string {
  if (!input) return '';
  return input
    .replace(/（.*?）|\(.*?\)/g, '')
    .replace(/修正草案/g, '')
    .replace(/草案/g, '')
    .replace(/\s+/g, '')
    .trim();
}

export function findLawNameForBill(bill: any, allLawNames: string[]): string {
  const title = bill.提案名稱 || '';
  const normTitle = normalizeLawName(title);

  // 1. 優先從「提案名稱」判斷 (因為發現部分原始資料對照表與標題不符)
  for (const lawName of allLawNames) {
    const normLaw = normalizeLawName(lawName);
    if (normTitle.includes(normLaw)) return lawName;
  }

  // 2. 次之從「對照表」
  if (bill.對照表 && bill.對照表.length > 0) {
    for (const comp of bill.對照表) {
      if (comp.law_name) {
        const norm = normalizeLawName(comp.law_name);
        const match = allLawNames.find(n => normalizeLawName(n) === norm);
        if (match) return match;
      }
    }
  }

  return '其他';
}

function resolveLawNameAlias(input: string): string {
  const normalized = normalizeLawName(input);
  return LAW_NAME_ALIASES[normalized] || normalized;
}

export function resolveLawHistoryByName(
  lawName: string,
  lawHistoryMap: Record<string, LawHistoryData>
): { resolvedName: string; lawHistory: LawHistoryData | null } {
  const direct = lawHistoryMap[lawName];
  if (direct) {
    return { resolvedName: lawName, lawHistory: direct };
  }

  const aliasName = resolveLawNameAlias(lawName);
  if (lawHistoryMap[aliasName]) {
    return { resolvedName: aliasName, lawHistory: lawHistoryMap[aliasName] };
  }

  const normalizedAlias = normalizeLawName(aliasName);
  const matchedKey = Object.keys(lawHistoryMap).find((key) => {
    const normalizedKey = normalizeLawName(key);
    return (
      normalizedKey === normalizedAlias ||
      normalizedKey.includes(normalizedAlias) ||
      normalizedAlias.includes(normalizedKey)
    );
  });

  if (matchedKey) {
    return { resolvedName: matchedKey, lawHistory: lawHistoryMap[matchedKey] };
  }

  return { resolvedName: lawName, lawHistory: null };
}

export function normalizeIdentity(identity: string): string {
  return identity.split('（')[0].split('(')[0].trim();
}

export function isOfficialIdentity(identity: string): boolean {
  return OFFICIAL_KEYWORDS.some((keyword) => identity.includes(keyword));
}

export function getPolicyGroupLabel(speech: ProcessedSpeech): string {
  if (isOfficialIdentity(speech.identity)) {
    return '行政官員';
  }

  const orientation = (speech.political_orientation || '').trim();
  if (!orientation) return '未標註立場';

  const scores = POLICY_CATEGORY_RULES.map((rule, index) => {
    const score = rule.keywords.reduce((sum, pattern) => (pattern.test(orientation) ? sum + 1 : sum), 0);
    return { label: rule.label, score, index };
  });

  const best = scores.sort((a, b) => b.score - a.score || a.index - b.index)[0];
  if (best && best.score > 0) {
    return best.label;
  }

  return '社會平衡與穩定協商';
}

export function parseStageDate(stageName: string, fallbackDate = ''): string {
  const maybeDate = stageName.split('_')[0] || '';
  if (/^\d{8}$/.test(maybeDate)) {
    return `${maybeDate.slice(0, 4)}-${maybeDate.slice(4, 6)}-${maybeDate.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(maybeDate)) {
    return maybeDate;
  }
  return fallbackDate;
}

export function getSortedStageBuckets(
  stageMap: Record<string, { speeches: ProcessedSpeech[]; billEvents?: any[] }>
): StageBucket[] {
  return Object.entries(stageMap)
    .map(([stageName, entry]) => {
      const { speeches, billEvents } = entry;
      const earliestSpeechDate = [...speeches]
        .map((speech) => speech.date || speech.metadata?.date || '')
        .filter(Boolean)
        .sort()[0] || '';
      
      const earliestBillDate = (billEvents || [])
        .map(e => e.date)
        .filter(Boolean)
        .sort()[0] || '';

      const fallbackDate = earliestSpeechDate || earliestBillDate;

      return {
        stageName,
        stageDate: parseStageDate(stageName, fallbackDate),
        speeches,
        billEvents
      };
    })
    .sort((a, b) => {
      if (a.stageDate && b.stageDate && a.stageDate !== b.stageDate) {
        return a.stageDate.localeCompare(b.stageDate);
      }
      return a.stageName.localeCompare(b.stageName);
    });
}

function getActionTypeFromLabel(label: string): string {
  if (label.includes('制定')) return '制定';
  if (label.includes('全文修正')) return '全文修正';
  if (label.includes('修正')) return '修正';
  return '修法';
}

function getRevisionAtDate(
  articleHistory: NonNullable<LawHistoryData['article_history']>[number] | undefined,
  date: string
) {
  if (!articleHistory) return null;
  const revisions = articleHistory.revisions || [];
  const candidates = revisions.filter((item) => item.date <= date);
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => a.date.localeCompare(b.date))[candidates.length - 1];
}

function getMilestoneSummary(data: LawHistoryData, date: string): string {
  const order = (data.table_of_contents || []).map((item) => item.article_no);
  const firstArticleNo = order[0] || '第一條';
  const firstArticle = (data.article_history || []).find((item) => item.article_no === firstArticleNo)
    || data.article_history?.[0];
  const revision = getRevisionAtDate(firstArticle, date);
  const firstLine = revision?.content?.[0]
    || data.current_text?.find((item) => item.article_no === firstArticleNo)?.content?.[0]
    || data.current_text?.[0]?.content?.[0]
    || '';
  return firstLine;
}

function dedupeVersions(versions: LawLegislationVersion[]): LawLegislationVersion[] {
  const unique = new Map<string, LawLegislationVersion>();
  versions.forEach((version) => {
    const key = `${version.version_date}-${getActionTypeFromLabel(version.label || '')}`;
    if (!unique.has(key)) {
      unique.set(key, version);
    }
  });
  return Array.from(unique.values()).sort((a, b) => a.version_date.localeCompare(b.version_date));
}

export function getLawVersionDisplayDate(version: LawLegislationVersion): string {
  return version.publication_date || version.version_date || '';
}

export function getLawVersionDisplayYear(version: LawLegislationVersion): string {
  return getLawVersionDisplayDate(version).slice(0, 4);
}

function normalizeMilestoneVersions(data: LawHistoryData, year: string): LawLegislationVersion[] {
  const versions = data.legislation_versions || [];
  const filterNth = data.metadata?.filters_applied?.filter_nth;

  if (filterNth != null && versions[filterNth - 1]) {
    return dedupeVersions([versions[filterNth - 1]]);
  }

  if (data.metadata?.target_date) {
    const targetVersion = versions.find((v) => v.version_date === data.metadata?.target_date);
    if (targetVersion) {
      return dedupeVersions([targetVersion]);
    }
  }

  return dedupeVersions(versions.filter((version) => getLawVersionDisplayYear(version) === year));
}

export function getLawMilestonesForYear(lawName: string, year: string, lawHistory: LawHistoryData | null): LawMilestone[] {
  if (!lawHistory) return [];

  return normalizeMilestoneVersions(lawHistory, year)
    .filter((version) => !!version.version_date)
    .map((version) => {
      const actionType = getActionTypeFromLabel(version.label || '');
      const displayDate = getLawVersionDisplayDate(version) || version.version_date;
      return {
        key: `${lawName}-${displayDate}-${actionType}`,
        date: displayDate,
        label: version.label,
        displayLabel: displayDate === version.version_date
          ? `${displayDate} ${actionType}`
          : `${displayDate} 公布 / ${version.version_date} ${actionType}`,
        lawName,
        actionType,
        summary: getMilestoneSummary(lawHistory, version.version_date)
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function toLawSlug(lawName: string): string {
  return encodeURIComponent(lawName);
}
