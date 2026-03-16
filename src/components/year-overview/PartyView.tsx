import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, GitBranch } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LawHistoryData, LYHistoryData, ProcessedSpeech } from '../../DataManager';
import {
  getLawMilestonesForYear,
  getSortedStageBuckets,
  isOfficialIdentity,
  normalizeIdentity,
  resolveLawHistoryByName,
  toLawSlug
} from './archiveUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PartyViewProps = {
  year: string;
  data: ProcessedSpeech[];
  groupedByLaw: Record<string, Record<string, ProcessedSpeech[]>>;
  getStageColor: (stage: string) => string;
  lyHistoryData: LYHistoryData;
  lawHistoryMap: Record<string, LawHistoryData>;
};

type PartyMode = 'pure' | 'confrontational';

type NormalizedTerm = {
  term: string;
  start: string;
  end: string;
  partyByName: Record<string, string>;
};

function normalizeDate(value: string): string {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length < 8) return '';
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function normalizePersonName(value: string): string {
  return (value || '')
    .replace(/\r?\n/g, '')
    .replace(/\s+/g, '')
    .replace(/（.*?）|\(.*?\)/g, '')
    .trim();
}

function parseTermDateRange(raw: string): { start: string; end: string } {
  const [rawStart = '', rawEnd = ''] = (raw || '').split('至');
  return {
    start: normalizeDate(rawStart),
    end: normalizeDate(rawEnd)
  };
}

function buildTermLookup(lyData: LYHistoryData): NormalizedTerm[] {
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

function resolveTermByDate(date: string, terms: NormalizedTerm[]): NormalizedTerm | null {
  if (!terms.length) return null;
  const normalizedDate = normalizeDate(date);
  if (!normalizedDate) return null;

  const inRange = terms.find((term) => normalizedDate >= term.start && normalizedDate <= term.end);
  if (inRange) return inRange;

  const latestBefore = [...terms]
    .filter((term) => term.start <= normalizedDate)
    .sort((a, b) => b.start.localeCompare(a.start))[0];
  if (latestBefore) return latestBefore;

  return terms[0];
}

function resolveParty(speech: ProcessedSpeech, terms: NormalizedTerm[]): string {
  const term = resolveTermByDate(speech.date || speech.metadata?.date || '', terms);
  if (!term) return '未知政黨';

  const candidates = (speech.speaker || '')
    .split(/[\/／,，、；;]+/)
    .map((name) => normalizePersonName(name))
    .filter(Boolean);

  if (!candidates.length) return '未知政黨';

  const foundParties = Array.from(
    new Set(
      candidates
        .map((candidate) => term.partyByName[candidate])
        .filter((party): party is string => !!party)
    )
  );

  if (!foundParties.length) return '未知政黨';
  if (foundParties.length === 1) return foundParties[0];
  return `跨黨協作（${foundParties.join(' / ')}）`;
}

function getPartyBucketLabel(speech: ProcessedSpeech, terms: NormalizedTerm[], mode: PartyMode): string {
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

function getPartyGroupTheme(groupName: string): { box: string; badge: string } {
  if (groupName.includes('行政官員')) {
    return { box: 'border-amber-300 bg-amber-50', badge: 'bg-amber-700 text-white' };
  }
  if (groupName.includes('民主進步黨')) {
    return { box: 'border-emerald-300 bg-emerald-50', badge: 'bg-emerald-700 text-white' };
  }
  if (groupName.includes('中國國民黨')) {
    return { box: 'border-blue-300 bg-blue-50', badge: 'bg-blue-800 text-white' };
  }
  if (groupName.includes('台灣民眾黨')) {
    return { box: 'border-cyan-300 bg-cyan-50', badge: 'bg-cyan-700 text-white' };
  }
  if (groupName.includes('時代力量')) {
    return { box: 'border-yellow-300 bg-yellow-50', badge: 'bg-yellow-700 text-white' };
  }
  if (groupName.includes('無黨')) {
    return { box: 'border-slate-300 bg-slate-50', badge: 'bg-slate-700 text-white' };
  }
  return { box: 'border-gray-300 bg-white', badge: 'bg-black text-white' };
}

export default function PartyView({ year, data, groupedByLaw, getStageColor, lyHistoryData, lawHistoryMap }: PartyViewProps) {
  const [search, setSearch] = useState('');
  const [splitByStage, setSplitByStage] = useState(true);
  const [partyMode, setPartyMode] = useState<PartyMode>('confrontational');

  const normalizedTerms = useMemo(() => buildTermLookup(lyHistoryData), [lyHistoryData]);

  const preparedByLaw = useMemo(() => {
    return Object.entries(groupedByLaw)
      .map(([lawName, stageMap]) => {
        if (splitByStage) {
          const stageBuckets = getSortedStageBuckets(stageMap).map((stage) => {
            const byParty: Record<string, ProcessedSpeech[]> = {};
            stage.speeches.forEach((speech) => {
              const party = getPartyBucketLabel(speech, normalizedTerms, partyMode);
              if (!byParty[party]) byParty[party] = [];
              byParty[party].push(speech);
            });
            return { stageName: stage.stageName, stageDate: stage.stageDate, byParty };
          });

          return { lawName, stageBuckets };
        }

        const allSpeeches = Object.values(stageMap).flat();
        const byParty: Record<string, ProcessedSpeech[]> = {};
        allSpeeches.forEach((speech) => {
          const party = getPartyBucketLabel(speech, normalizedTerms, partyMode);
          if (!byParty[party]) byParty[party] = [];
          byParty[party].push(speech);
        });

        return { lawName, stageBuckets: [{ stageName: '全部程序', stageDate: '', byParty }] };
      })
      .filter((item) => {
        if (!search.trim()) return true;
        return item.lawName.includes(search.trim());
      });
  }, [groupedByLaw, normalizedTerms, partyMode, search, splitByStage]);

  const partyOrder = [
    '民主進步黨',
    '中國國民黨',
    '台灣民眾黨',
    '時代力量',
    '無黨籍',
    '無',
    '未知政黨'
  ];

  const sortPartyGroups = (groups: Record<string, ProcessedSpeech[]>) => {
    const names = Object.keys(groups);
    return names.sort((a, b) => {
      if (a.includes('行政官員') && !b.includes('行政官員')) return -1;
      if (b.includes('行政官員') && !a.includes('行政官員')) return 1;

      const ai = partyOrder.indexOf(a);
      const bi = partyOrder.indexOf(b);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return groups[b].length - groups[a].length || a.localeCompare(b, 'zh-Hant');
    });
  };

  return (
    <>
      <div className="mb-8 md:mb-16 p-6 md:p-10 bg-white border-2 border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">政黨分類模式</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-black serif">{year} 年立法發言政黨分布</h2>
            <p className="mt-2 text-xs text-gray-500">第一屆僅有第五次增額名單，早期對照不足時會顯示未知政黨。</p>
          </div>

          <div className="w-full lg:w-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-2 border-black p-2 bg-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">分類模式</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPartyMode('pure')}
                    className={cn(
                      'px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border-2',
                      partyMode === 'pure'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-black'
                    )}
                  >
                    單純政黨
                  </button>
                  <button
                    onClick={() => setPartyMode('confrontational')}
                    className={cn(
                      'px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border-2',
                      partyMode === 'confrontational'
                        ? 'border-[#8C2F39] bg-[#8C2F39] text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-[#8C2F39]'
                    )}
                  >
                    對抗模式
                  </button>
                </div>
              </div>

              <div className="border-2 border-black p-2 bg-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">程序視角</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSplitByStage(true)}
                    className={cn(
                      'px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border-2',
                      splitByStage
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-black'
                    )}
                  >
                    區分程序
                  </button>
                  <button
                    onClick={() => setSplitByStage(false)}
                    className={cn(
                      'px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border-2',
                      !splitByStage
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-black'
                    )}
                  >
                    不分程序
                  </button>
                </div>
              </div>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜尋法案"
              className="w-full border-b border-gray-300 px-2 py-2 text-xs font-bold uppercase tracking-[0.15em] focus:outline-none focus:border-black"
            />
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-500">
              {partyMode === 'confrontational' ? '行政官員將獨立於政黨並顯示原屬政黨' : '行政官員視為獨立陣營'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {preparedByLaw.map((law) => (
          <section key={law.lawName} className="space-y-6" id={`party-law-${encodeURIComponent(law.lawName)}`}>
            <h3 className="text-3xl md:text-5xl font-black serif border-b-4 border-black pb-2">{law.lawName}</h3>
            {(() => {
              const resolvedLaw = resolveLawHistoryByName(law.lawName, lawHistoryMap);
              const milestones = getLawMilestonesForYear(law.lawName, year, resolvedLaw.lawHistory);
              const renderedMilestone = new Set<string>();

              return (
                <>
                  {law.stageBuckets.map((stage, stageIndex) => {
                    const stageDate = normalizeDate(stage.stageDate || stage.stageName || '');

                    const sameDateIndexes = law.stageBuckets
                      .map((bucket, index) => ({ bucket, index }))
                      .filter((entry) => normalizeDate(entry.bucket.stageDate || entry.bucket.stageName || '') === stageDate)
                      .map((entry) => entry.index);
                    const lastIndexOfSameDate = sameDateIndexes.length ? sameDateIndexes[sameDateIndexes.length - 1] : -1;

                    const beforeMilestones = milestones.filter((milestone) => {
                      if (renderedMilestone.has(milestone.key)) return false;
                      if (!splitByStage) return false;
                      if (!stageDate) return false;
                      if (milestone.date < stageDate) return true;
                      if (milestone.date > stageDate) return false;
                      return milestone.actionType !== '制定';
                    });

                    const afterMilestones = milestones.filter((milestone) => {
                      if (renderedMilestone.has(milestone.key)) return false;
                      if (!splitByStage) return false;
                      if (!stageDate) return false;
                      if (milestone.date !== stageDate) return false;
                      return milestone.actionType === '制定' && stageIndex === lastIndexOfSameDate;
                    });

                    beforeMilestones.forEach((item) => renderedMilestone.add(item.key));
                    afterMilestones.forEach((item) => renderedMilestone.add(item.key));

                    return (
                      <div key={`${law.lawName}-${stage.stageName}-${stageIndex}`} className="space-y-4">
                        {beforeMilestones.map((milestone) => (
                          <Link
                            key={`party-before-${law.lawName}-${stage.stageName}-${milestone.key}`}
                            to={`/laws/${toLawSlug(law.lawName)}?date=${milestone.date}&fromYear=${year}`}
                            className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                          >
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                            <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                            {!!milestone.summary && (
                              <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                              </div>
                            )}
                          </Link>
                        ))}

                        <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className={cn('px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white', getStageColor(stage.stageName))}>
                    {stage.stageName}
                  </span>
                  <div className="h-[2px] bg-gray-200 flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortPartyGroups(stage.byParty).map((party) => (
                    <div
                      key={`${law.lawName}-${stage.stageName}-${party}`}
                      className={cn('border-2 p-4 space-y-3', getPartyGroupTheme(party).box)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={cn('inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]', getPartyGroupTheme(party).badge)}>
                          <Building2 className="w-3 h-3" />
                          {party}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                          {stage.byParty[party].length} 位發言者
                        </span>
                      </div>

                      <div className="space-y-2">
                        {stage.byParty[party].map((speech) => (
                          <Link
                            key={speech.id}
                            to={`/${year}/archive/speech/${speech.id}`}
                            className="block border border-gray-100 hover:border-black p-3 transition-colors"
                          >
                            <p className="text-sm font-black serif">{speech.speaker}</p>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500 mt-1">
                              {speech.date} / {normalizeIdentity(speech.identity)}
                            </p>
                            <p className="mt-2 text-xs text-gray-700 line-clamp-2 inline-flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              {speech.political_orientation || '未標註'}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                        </div>

                        {afterMilestones.map((milestone) => (
                          <Link
                            key={`party-after-${law.lawName}-${stage.stageName}-${milestone.key}`}
                            to={`/laws/${toLawSlug(law.lawName)}?date=${milestone.date}&fromYear=${year}`}
                            className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                          >
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                            <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                            {!!milestone.summary && (
                              <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    );
                  })}

                  {milestones
                    .filter((item) => !renderedMilestone.has(item.key))
                    .map((milestone) => (
                      <Link
                        key={`party-tail-${law.lawName}-${milestone.key}`}
                        to={`/laws/${toLawSlug(law.lawName)}?date=${milestone.date}&fromYear=${year}`}
                        className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                        <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                        {!!milestone.summary && (
                          <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                          </div>
                        )}
                      </Link>
                    ))}
                </>
              );
            })()}
          </section>
        ))}
      </div>
    </>
  );
}
