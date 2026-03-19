import { DataManager, LYHistoryData, ProcessedSpeech } from '../DataManager';
import { getLawVersionDisplayDate } from '../components/year-overview/archiveUtils';

export type LawMenuItem = {
  id: string;
  lawName: string;
  date: string;
  actionType: '制定' | '修正';
  label: string;
  href: string;
};

export type MeetingMenuItem = {
  id: string;
  year: string;
  date: string;
  title: string;
  meetingType: string;
  clashIndex: number;
  lawName: string;
  stageName: string;
  governmentLabel: string;
  oppositionLabel: string;
  governmentLogic: string;
  oppositionLogic: string;
  keywordFocus: string;
  speeches: ProcessedSpeech[];
  href: string;
};

export type TimelineEventItem = {
  id: string;
  date: string;
  year: string;
  eventType: 'meeting' | 'law' | 'bill';
  title: string;
  subtitle: string;
  badge: string;
  href: string;
};

export type LawCumulativePoint = {
  date: string;
  actionType: '制定' | '修正';
  lawName: string;
  totalEnactments: number;
  totalRevisions: number;
};

export type LandingTimelineBundle = {
  lawItems: LawMenuItem[];
  meetingItems: MeetingMenuItem[];
  unifiedEvents: TimelineEventItem[];
  lawCumulativePoints: LawCumulativePoint[];
};

export type SeatPartyStat = {
  party: string;
  seats: number;
  ratio: number;
};

export type SeatContext = {
  term: string;
  termRange: string;
  totalSeats: number;
  rulingParty: string;
  isSupplementaryOnly: boolean;
  parties: SeatPartyStat[];
};

export type LawCumulativeState = {
  totalEnactments: number;
  totalRevisions: number;
  totalActions: number;
};

const CORE_YEARS = [
  '1987', '1992', '1993', '1994', '1995', '1997', '1998', '1999', '2000',
  '2001', '2002', '2003', '2006', '2009', '2013', '2016', '2017', '2019',
  '2022', '2023', '2024'
];

let bundleCache: LandingTimelineBundle | null = null;

function getBasePath(): string {
  const pathname = window.location.pathname;
  return pathname.includes('/tw_tj_leg/') ? '/tw_tj_leg/' : '/';
}

function normalizeDate(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length < 8) return '';
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function extractDateFromStage(rawStage: string): string {
  const match = (rawStage || '').match(/(\d{8})/);
  if (!match) return '';
  return normalizeDate(match[1]);
}

function normalizeStageName(rawStage: string): string {
  const cleaned = (rawStage || '').replace(/^\d{8}_?/, '').trim();
  return cleaned || '一般會議';
}

function isOfficialIdentity(identity: string): boolean {
  return /(行政院|部長|次長|政務官|官員|處長|主委|院長|秘書長)/.test(identity || '');
}

function formatDate(raw: string): string {
  const normalized = normalizeDate(raw);
  if (!normalized) return '';
  return normalized;
}

function getActionType(label: string): '制定' | '修正' {
  return label.includes('制定') ? '制定' : '修正';
}

function toLawSlug(input: string): string {
  return encodeURIComponent((input || '').trim().toLowerCase());
}

export async function buildLandingTimelineBundle(): Promise<LandingTimelineBundle> {
  if (bundleCache) return bundleCache;

  const lawHistoryMap = await DataManager.getAllLawHistory();
  const billTimelineEvents: Array<{ date: string; year: string; billId: string; billName: string; status: string }> = [];
  try {
    const indexResp = await fetch(`${getBasePath()}data/bills_data/_INDEX.json`);
    const indexJson = indexResp.ok ? await indexResp.json() : null;
    const files = Array.isArray(indexJson?.files) ? indexJson.files : [];

    for (const item of files) {
      const fileName = item?.檔案名;
      if (!fileName) continue;

      const billResp = await fetch(`${getBasePath()}data/bills_data/${fileName}`);
      if (!billResp.ok) continue;
      const bill = await billResp.json() as any;

      const billId = bill.提案編號 || bill.議案編號 || '';
      const billName = bill.提案名稱 || '未知議案';

      const proposalDate = formatDate(bill.提案日期 || '');
      if (proposalDate) {
        billTimelineEvents.push({
          date: proposalDate,
          year: proposalDate.slice(0, 4),
          billId,
          billName,
          status: bill.議案狀態 || '提案'
        });
      }

      (bill.議案流程 || []).forEach((process: any) => {
        (process.日期 || []).forEach((rawDate: string) => {
          const date = formatDate(rawDate);
          if (!date) return;
          billTimelineEvents.push({
            date,
            year: date.slice(0, 4),
            billId,
            billName,
            status: process.狀態 || '流程更新'
          });
        });
      });
    }
  } catch {
    // Ignore bill timeline failures; law and meeting events can still render.
  }
  const lawItems: LawMenuItem[] = [];
  const cumulativeRaw: Array<{ date: string; actionType: '制定' | '修正'; lawName: string }> = [];

  Object.values(lawHistoryMap).forEach((lawHistory) => {
    const lawName = lawHistory.metadata?.law_name || '未知法規';
    const versions = lawHistory.legislation_versions || [];

    versions.forEach((version, index) => {
      const date = formatDate(getLawVersionDisplayDate(version));
      if (!date) return;
      const actionType = getActionType(version.label || '');
      const id = `law-${lawName}-${date}-${index}`;
      lawItems.push({
        id,
        lawName,
        date,
        actionType,
        label: version.label || `${date} ${actionType}`,
        href: `/laws/${toLawSlug(lawName)}?date=${date}`
      });
      cumulativeRaw.push({ date, actionType, lawName });
    });
  });

  lawItems.sort((a, b) => a.date.localeCompare(b.date));
  cumulativeRaw.sort((a, b) => a.date.localeCompare(b.date));

  let enactments = 0;
  let revisions = 0;
  const lawCumulativePoints: LawCumulativePoint[] = cumulativeRaw.map((item) => {
    if (item.actionType === '制定') enactments += 1;
    else revisions += 1;
    return {
      date: item.date,
      actionType: item.actionType,
      lawName: item.lawName,
      totalEnactments: enactments,
      totalRevisions: revisions
    };
  });

  const summaryJobs = CORE_YEARS.map(async (year) => {
    try {
      const summaryResp = await fetch(`${getBasePath()}data/summary/${year}.json`);
      const summary = summaryResp.ok ? await summaryResp.json() : null;
      const processed = await DataManager.getProcessedYearData(year);
      return { year, summary, processed };
    } catch {
      return { year, summary: null, processed: { speeches: [], sessionInfo: undefined } };
    }
  });

  const summaryResults = await Promise.all(summaryJobs);
  const meetingItems: MeetingMenuItem[] = [];

  summaryResults.forEach(({ year, summary, processed }) => {
    const meetingType = processed?.sessionInfo?.meeting_type || '議事記錄';
    const clashes = Array.isArray(summary?.clash_points) ? summary.clash_points : [];

    const grouped = (processed?.speeches || []).reduce((acc, speech) => {
      const date = normalizeDate(speech.date || '') || extractDateFromStage(speech.stage || '') || `${year}-01-01`;
      const stageName = normalizeStageName(speech.stage || '');
      const lawName = speech.lawName || '未知法案';
      const key = `${date}|${lawName}|${stageName}`;

      if (!acc[key]) {
        acc[key] = { date, lawName, stageName, speeches: [] as typeof processed.speeches };
      }
      acc[key].speeches.push(speech);
      return acc;
    }, {} as Record<string, { date: string; lawName: string; stageName: string; speeches: typeof processed.speeches }>);

    const entries = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

    if (!entries.length) {
      const fallbackDate = `${year}-01-01`;
      meetingItems.push({
        id: `${year}-m-0000`,
        year,
        date: fallbackDate,
        title: summary?.metadata?.focus || `${year} 年議事重點`,
        meetingType,
        clashIndex: 0,
        lawName: '未知法案',
        stageName: '一般會議',
        governmentLabel: clashes[0]?.actors?.government?.label || '政府方',
        oppositionLabel: clashes[0]?.actors?.opposition?.label || '在野方',
        governmentLogic: summary?.intelligence_layer?.summary_for_ai_voice || '資料不足',
        oppositionLogic: '本年度缺少逐筆會議資料。',
        keywordFocus: '',
        speeches: [],
        href: `/meetings/${year}/m-0000`
      });
      return;
    }

    entries.forEach((entry, index) => {
      const officials = entry.speeches.filter((speech) => isOfficialIdentity(speech.identity || ''));
      const legislators = entry.speeches.filter((speech) => !isOfficialIdentity(speech.identity || ''));
      const clash = clashes[index % Math.max(1, clashes.length)] || null;

      const governmentSpeech = officials[0] || entry.speeches[0];
      const oppositionSpeech = legislators[0] || entry.speeches[1] || entry.speeches[0];
      const meetingId = `${year}-m-${String(index + 1).padStart(4, '0')}`;

      meetingItems.push({
        id: meetingId,
        year,
        date: entry.date,
        title: `${entry.lawName} / ${entry.stageName}`,
        meetingType,
        clashIndex: index,
        lawName: entry.lawName,
        stageName: entry.stageName,
        governmentLabel: clash?.actors?.government?.label || governmentSpeech?.speaker || '政府方',
        oppositionLabel: clash?.actors?.opposition?.label || oppositionSpeech?.speaker || '在野方',
        governmentLogic: clash?.actors?.government?.logic || governmentSpeech?.discourse_logic || '資料不足',
        oppositionLogic: clash?.actors?.opposition?.logic || oppositionSpeech?.discourse_logic || '資料不足',
        keywordFocus: clash?.actors?.opposition?.keyword_focus || clash?.actors?.government?.keyword_focus || '',
        speeches: entry.speeches,
        href: `/meetings/${year}/${meetingId}`
      });
    });
  });

  meetingItems.sort((a, b) => a.date.localeCompare(b.date));

  const unifiedEvents: TimelineEventItem[] = [
    ...lawItems.map((item) => ({
      id: `event-${item.id}`,
      date: item.date,
      year: item.date.slice(0, 4),
      eventType: 'law' as const,
      title: item.lawName,
      subtitle: item.label,
      badge: item.actionType,
      href: item.href
    })),
    ...meetingItems.map((item) => ({
      id: `event-${item.id}`,
      date: item.date,
      year: item.year,
      eventType: 'meeting' as const,
      title: item.title,
      subtitle: `${item.governmentLabel} vs ${item.oppositionLabel}`,
      badge: item.meetingType,
      href: item.href
    })),
    ...billTimelineEvents.map((item: { date: string; year: string; billId: string; billName: string; status: string }, idx: number) => ({
      id: `event-bill-${item.year}-${idx}`,
      date: item.date,
      year: item.year,
      eventType: 'bill' as const,
      title: item.billName,
      subtitle: `議案狀態：${item.status}`,
      badge: '議案',
      href: `/bills/${item.billId}`
    }))
  ].sort((a, b) => a.date.localeCompare(b.date) || a.eventType.localeCompare(b.eventType));

  bundleCache = {
    lawItems,
    meetingItems,
    unifiedEvents,
    lawCumulativePoints
  };

  return bundleCache;
}

function parseRange(raw: string): { start: string; end: string } {
  const [rawStart = '', rawEnd = ''] = (raw || '').split('至');
  return { start: normalizeDate(rawStart), end: normalizeDate(rawEnd) };
}

function normalizePartyName(name: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) return '未知';
  if (trimmed === '無' || trimmed === '無黨籍') return '無黨籍';
  return trimmed;
}

export function getSeatContextByDate(lyData: LYHistoryData, date: string): SeatContext | null {
  if (!lyData || !date) return null;

  const normalizedDate = normalizeDate(date);
  if (!normalizedDate) return null;

  const terms = Object.entries(lyData)
    .map(([term, value]) => {
      const range = parseRange(value.時間 || '');
      return {
        term,
        termRange: value.時間 || '',
        start: range.start,
        end: range.end,
        names: value.名單 || {}
      };
    })
    .filter((item) => item.start && item.end)
    .sort((a, b) => a.start.localeCompare(b.start));

  const inRange = terms.find((term) => normalizedDate >= term.start && normalizedDate <= term.end);
  const resolvedTerm = inRange || terms.find((term) => term.start <= normalizedDate) || terms[0];
  if (!resolvedTerm) return null;

  const seatMap: Record<string, number> = {};
  Object.values(resolvedTerm.names).forEach((partyName) => {
    const party = normalizePartyName(partyName);
    seatMap[party] = (seatMap[party] || 0) + 1;
  });

  const totalSeats = Object.values(seatMap).reduce((sum, value) => sum + value, 0);
  const parties = Object.entries(seatMap)
    .map(([party, seats]) => ({
      party,
      seats,
      ratio: totalSeats > 0 ? seats / totalSeats : 0
    }))
    .sort((a, b) => b.seats - a.seats);

  return {
    term: resolvedTerm.term,
    termRange: resolvedTerm.termRange,
    totalSeats,
    rulingParty: parties[0]?.party || '未知',
    isSupplementaryOnly: resolvedTerm.term.includes('第一屆') && resolvedTerm.term.includes('增額'),
    parties
  };
}

export function getLawCumulativeByDate(points: LawCumulativePoint[], date: string): LawCumulativeState {
  if (!points.length || !date) {
    return { totalEnactments: 0, totalRevisions: 0, totalActions: 0 };
  }

  const normalizedDate = normalizeDate(date);
  if (!normalizedDate) {
    return { totalEnactments: 0, totalRevisions: 0, totalActions: 0 };
  }

  let result: LawCumulativePoint | null = null;
  for (const point of points) {
    if (point.date <= normalizedDate) {
      result = point;
    } else {
      break;
    }
  }

  if (!result) return { totalEnactments: 0, totalRevisions: 0, totalActions: 0 };

  return {
    totalEnactments: result.totalEnactments,
    totalRevisions: result.totalRevisions,
    totalActions: result.totalEnactments + result.totalRevisions
  };
}
