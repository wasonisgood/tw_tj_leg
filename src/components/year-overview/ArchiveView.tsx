import { Link } from 'react-router-dom';
import { Search, Scale, Landmark } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LawHistoryData, ProcessedSpeech } from '../../DataManager';
import {
  getLawMilestonesForYear,
  getPolicyGroupLabel,
  getSortedStageBuckets,
  normalizeIdentity,
  resolveLawHistoryByName,
  toLawSlug
} from './archiveUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const policyGroupStyle: Record<string, string> = {
  '轉型正義與平反推進': 'bg-emerald-50 border-emerald-300',
  '問責監督與歷史究責': 'bg-rose-50 border-rose-300',
  '法制程序與審慎修法': 'bg-sky-50 border-sky-300',
  '行政執行與制度治理': 'bg-amber-50 border-amber-300',
  '國安防衛與風險管制': 'bg-indigo-50 border-indigo-300',
  '原民與多元族群權益': 'bg-teal-50 border-teal-300',
  '檔案開放與記憶工程': 'bg-cyan-50 border-cyan-300',
  '社會平衡與穩定協商': 'bg-violet-50 border-violet-300',
  '行政官員': 'bg-amber-50 border-amber-300',
  '未標註立場': 'bg-slate-50 border-slate-300'
};

const policyGroupBadge: Record<string, string> = {
  '轉型正義與平反推進': 'bg-emerald-600 text-white',
  '問責監督與歷史究責': 'bg-rose-700 text-white',
  '法制程序與審慎修法': 'bg-sky-700 text-white',
  '行政執行與制度治理': 'bg-amber-700 text-white',
  '國安防衛與風險管制': 'bg-indigo-700 text-white',
  '原民與多元族群權益': 'bg-teal-700 text-white',
  '檔案開放與記憶工程': 'bg-cyan-700 text-white',
  '社會平衡與穩定協商': 'bg-violet-700 text-white',
  '行政官員': 'bg-amber-600 text-white',
  '未標註立場': 'bg-slate-700 text-white'
};

type ArchiveViewProps = {
  year: string;
  data: ProcessedSpeech[];
  groupedByLaw: Record<string, Record<string, ProcessedSpeech[]>>;
  identities: string[];
  filter: string;
  search: string;
  session: any;
  setFilter: (value: string) => void;
  setSearch: (value: string) => void;
  getStageColor: (stage: string) => string;
  getStanceColor: (stance: string) => string;
  lawHistoryMap: Record<string, LawHistoryData>;
};

function groupByPolicy(speeches: ProcessedSpeech[]) {
  const grouped: Record<string, ProcessedSpeech[]> = {};
  speeches.forEach((speech) => {
    const key = getPolicyGroupLabel(speech);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(speech);
  });

  const order = [
    '轉型正義與平反推進',
    '問責監督與歷史究責',
    '法制程序與審慎修法',
    '行政執行與制度治理',
    '國安防衛與風險管制',
    '原民與多元族群權益',
    '檔案開放與記憶工程',
    '社會平衡與穩定協商',
    '行政官員',
    '未標註立場'
  ];
  return order.filter((name) => grouped[name]?.length).map((name) => [name, grouped[name]] as const);
}

function normalizeDateKey(input: string): string {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.length < 8) return '';
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export default function ArchiveView({
  year,
  data,
  groupedByLaw,
  identities,
  filter,
  search,
  session,
  setFilter,
  setSearch,
  getStageColor,
  getStanceColor,
  lawHistoryMap
}: ArchiveViewProps) {
  return (
    <>
      <div className="mb-8 md:mb-16 p-6 md:p-12 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Meeting Info</h3>
            <p className="text-lg md:text-xl font-bold text-gray-800 leading-snug">{session?.meeting_type}</p>
            {session?.analyzed_topics && session.analyzed_topics.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Analyzed Topics</p>
                <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                  {session.analyzed_topics.slice(0, 5).map((topic: string, idx: number) => (
                    <li key={idx} className="border-l-2 border-[#8C2F39] pl-2">• {topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Archive Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-white border border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">Total Speeches</span>
                <span className="text-2xl font-black text-[#8C2F39]">{data.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white border border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">Legislations Discussed</span>
                <span className="text-2xl font-black text-[#8C2F39]">{Object.keys(groupedByLaw).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        <aside className="w-full md:w-80 shrink-0 space-y-8 md:space-y-12">
          <div className="md:sticky md:top-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] border-b-4 border-black pb-2 mb-4 md:mb-8">Table of Contents</h3>
            <nav className="flex flex-wrap md:flex-col gap-2 md:gap-4">
              {Object.keys(groupedByLaw).map((law) => (
                <a
                  key={law}
                  href={`#law-${encodeURIComponent(law)}`}
                  className="block text-xs md:text-sm font-bold hover:text-[#8C2F39] transition-colors serif italic border-l-2 border-transparent hover:border-[#8C2F39] pl-2 md:pl-4 whitespace-nowrap"
                >
                  {law}
                </a>
              ))}
            </nav>

            <div className="mt-8 md:mt-16 pt-8 border-t border-gray-200">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-gray-300 pb-2 mb-4">Filter by Identity</h4>
              <div className="flex flex-wrap md:flex-col gap-2">
                {identities.map((identity) => (
                  <button
                    key={identity}
                    onClick={() => setFilter(identity)}
                    className={cn(
                      'text-left text-xs font-bold uppercase tracking-widest px-3 py-2 border-l-3 transition-all',
                      filter === identity
                        ? 'border-l-[#8C2F39] text-[#8C2F39] bg-gray-50'
                        : 'border-l-gray-200 text-gray-600 hover:border-l-gray-400 hover:text-gray-900'
                    )}
                  >
                    {identity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-16 pt-8 border-t border-gray-200">
              <div className="relative group">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 pl-8 py-2 text-xs font-black uppercase focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow space-y-24 md:space-y-40">
          {Object.entries(groupedByLaw).map(([lawName, stageMap]) => {
            const stageBuckets = getSortedStageBuckets(stageMap);
            const resolvedLaw = resolveLawHistoryByName(lawName, lawHistoryMap);
            const milestones = getLawMilestonesForYear(lawName, year, resolvedLaw.lawHistory);
            const renderedMilestone = new Set<string>();

            return (
              <section key={lawName} id={`law-${encodeURIComponent(lawName)}`} className="space-y-8 md:space-y-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <h2 className="text-4xl md:text-7xl font-black serif uppercase tracking-tighter border-b-[6px] md:border-b-[10px] border-black pb-2 md:pb-4 inline-block max-w-full break-words">{lawName}</h2>
                  <Link
                    to={`/laws/${toLawSlug(lawName)}?fromYear=${year}`}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors"
                  >
                    <Scale className="w-3 h-3" />
                    法律歷程
                  </Link>
                </div>

                {stageBuckets.map((stage, stageIndex) => {
                  const stageDateKey = normalizeDateKey(stage.stageDate);
                  const sameDateIndexes = stageBuckets
                    .map((bucket, index) => ({ bucket, index }))
                    .filter((entry) => normalizeDateKey(entry.bucket.stageDate) === stageDateKey)
                    .map((entry) => entry.index);
                  const lastIndexOfSameDate = sameDateIndexes.length ? sameDateIndexes[sameDateIndexes.length - 1] : -1;

                  const beforeMilestones = milestones.filter((milestone) => {
                    if (renderedMilestone.has(milestone.key)) return false;
                    if (!stageDateKey) return false;

                    const milestoneDateKey = normalizeDateKey(milestone.date);
                    if (!milestoneDateKey) return false;
                    if (milestoneDateKey < stageDateKey) return true;
                    if (milestoneDateKey > stageDateKey) return false;

                    return milestone.actionType !== '制定';
                  });

                  const afterMilestones = milestones.filter((milestone) => {
                    if (renderedMilestone.has(milestone.key)) return false;
                    if (!stageDateKey) return false;

                    const milestoneDateKey = normalizeDateKey(milestone.date);
                    if (!milestoneDateKey) return false;
                    if (milestoneDateKey !== stageDateKey) return false;

                    return milestone.actionType === '制定' && stageIndex === lastIndexOfSameDate;
                  });

                  beforeMilestones.forEach((item) => renderedMilestone.add(item.key));
                  afterMilestones.forEach((item) => renderedMilestone.add(item.key));

                  return (
                    <div key={`${stage.stageName}-${stageIndex}`} className="space-y-6 md:space-y-8">
                      {beforeMilestones.map((milestone) => (
                        <Link
                          key={milestone.key}
                          to={`/laws/${toLawSlug(lawName)}?date=${milestone.date}&fromYear=${year}`}
                          className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                              <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                              <p className="mt-1 text-xs font-bold text-gray-500">{milestone.actionType}</p>
                              {!!milestone.summary && (
                                <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                                </div>
                              )}
                            </div>
                            <Landmark className="w-5 h-5 text-gray-500 shrink-0" />
                          </div>
                        </Link>
                      ))}

                      <div className="flex items-center space-x-4 md:space-x-6">
                        <span className={cn('px-3 md:px-4 py-1 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap', getStageColor(stage.stageName))}>
                          {stage.stageName}
                        </span>
                        <div className="h-[2px] flex-grow bg-gray-200"></div>
                      </div>

                      {groupByPolicy(stage.speeches).map(([policyName, policySpeeches]) => (
                        <div key={policyName} className={cn('border-2 p-4 md:p-6 space-y-4', policyGroupStyle[policyName] || policyGroupStyle['其他立場'])}>
                          <div className="flex items-center gap-3">
                            <span className={cn('px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]', policyGroupBadge[policyName] || policyGroupBadge['其他立場'])}>
                              {policyName}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{policySpeeches.length} 位發言者</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                            {policySpeeches.map((speech) => (
                              <Link
                                key={speech.id}
                                to={`/${year}/archive/speech/${speech.id}`}
                                className="group relative bg-white p-6 md:p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all"
                              >
                                <div className="flex justify-between items-start mb-6 md:mb-12">
                                  <div className="w-8 md:w-12 h-1 bg-black group-hover:w-16 md:group-hover:w-24 transition-all duration-500"></div>
                                  <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{speech.date}</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black serif group-hover:text-[#8C2F39] transition-colors mb-2 md:mb-4 line-clamp-2">{speech.speaker}</h3>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 mb-4 md:mb-8">
                                  {normalizeIdentity(speech.identity)}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4 md:mb-8">
                                  {speech.political_orientation.split('/').map((p, i) => (
                                    <span key={i} className={cn('px-2 py-1 text-[8px] font-black uppercase border', getStanceColor(p))}>{p}</span>
                                  ))}
                                </div>
                                <p className="text-base md:text-lg serif italic text-gray-600 line-clamp-3 md:line-clamp-none">「{speech.discourse_logic}」</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}

                      {afterMilestones.map((milestone) => (
                        <Link
                          key={`after-${milestone.key}`}
                          to={`/laws/${toLawSlug(lawName)}?date=${milestone.date}&fromYear=${year}`}
                          className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                              <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                              <p className="mt-1 text-xs font-bold text-gray-500">{milestone.actionType}</p>
                              {!!milestone.summary && (
                                <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                                </div>
                              )}
                            </div>
                            <Landmark className="w-5 h-5 text-gray-500 shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  );
                })}

                {milestones
                  .filter((item) => !renderedMilestone.has(item.key))
                  .map((milestone) => (
                    <Link
                      key={milestone.key}
                      to={`/laws/${toLawSlug(lawName)}?date=${milestone.date}&fromYear=${year}`}
                      className="block border border-gray-200 bg-white p-4 md:p-6 hover:border-black hover:shadow-sm transition-all"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">法規歷程節點</p>
                      <p className="mt-2 text-lg font-black serif">{milestone.displayLabel}</p>
                      <p className="mt-1 text-xs font-bold text-gray-500">{milestone.actionType}</p>
                      {!!milestone.summary && (
                        <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">原始法條摘要</p>
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{milestone.summary}</p>
                        </div>
                      )}
                    </Link>
                  ))}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
