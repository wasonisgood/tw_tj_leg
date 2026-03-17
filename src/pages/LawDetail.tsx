import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GitCompareArrows, BookOpenText } from 'lucide-react';
import { DataManager, LawArticleHistory, LawHistoryData, LawHistoryRevision, LawLegislationVersion } from '../DataManager';

type DisplayMode = 'focus' | 'timeline';

function getActionType(label: string): '制定' | '全文修正' | '修正' {
  if (label.includes('制定')) return '制定';
  if (label.includes('全文修正')) return '全文修正';
  return '修正';
}

function compareDate(a: string, b: string): number {
  return a.localeCompare(b);
}

function getVersionList(data: LawHistoryData): LawLegislationVersion[] {
  const dedupe = (items: LawLegislationVersion[]) => {
    const unique = new Map<string, LawLegislationVersion>();
    items.forEach((item) => {
      const key = `${item.version_date}-${getActionType(item.label || '')}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });
    return Array.from(unique.values()).sort((a, b) => compareDate(a.version_date, b.version_date));
  };

  const versions = data.legislation_versions || [];
  const nth = data.metadata?.filters_applied?.filter_nth;
  if (nth && versions[nth - 1]) {
    return dedupe([versions[nth - 1]]);
  }
  if (data.metadata?.target_date) {
    const target = versions.find((item) => item.version_date === data.metadata?.target_date);
    if (target) return dedupe([target]);
  }
  return dedupe(versions);
}

function getRevisionAtDate(article: LawArticleHistory, date: string): LawHistoryRevision | null {
  const candidates = (article.revisions || []).filter((item) => compareDate(item.date, date) <= 0);
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => compareDate(a.date, b.date))[candidates.length - 1];
}

function getPreviousRevision(article: LawArticleHistory, date: string): LawHistoryRevision | null {
  const candidates = (article.revisions || []).filter((item) => compareDate(item.date, date) < 0);
  if (!candidates.length) return null;
  return [...candidates].sort((a, b) => compareDate(a.date, b.date))[candidates.length - 1];
}

function articleSortIndex(order: string[], articleNo: string): number {
  const idx = order.indexOf(articleNo);
  return idx >= 0 ? idx : Number.MAX_SAFE_INTEGER;
}

/** 從全版本清單計算正式修法次數（去重後扣除制定版本） */
function getAmendmentCount(data: LawHistoryData): number {
  const unique = new Map<string, LawLegislationVersion>();
  (data.legislation_versions || []).forEach((item) => {
    const key = `${item.version_date}-${getActionType(item.label || '')}`;
    if (!unique.has(key)) unique.set(key, item);
  });
  return Array.from(unique.values()).filter((v) => !v.label?.includes('制定')).length;
}

function buildSnapshot(data: LawHistoryData, date: string): Array<{ articleNo: string; content: string[]; reason: string[] }> {
  const order = (data.table_of_contents || []).map((item) => item.article_no);
  return (data.article_history || [])
    .map((article) => ({
      articleNo: article.article_no,
      revision: getRevisionAtDate(article, date)
    }))
    .filter((item) => !!item.revision)
    .sort((a, b) => articleSortIndex(order, a.articleNo) - articleSortIndex(order, b.articleNo))
    .map((item) => ({
      articleNo: item.articleNo,
      content: item.revision?.content || [],
      reason: item.revision?.reason || []
    }));
}

function getChangedArticles(data: LawHistoryData, date: string): Array<{
  articleNo: string;
  prev: string[];
  next: string[];
  reason: string[];
  actionType: string;
}> {
  const order = (data.table_of_contents || []).map((item) => item.article_no);

  return (data.article_history || [])
    .map((article) => {
      const current = (article.revisions || []).find((r) => r.date === date);
      if (!current) return null;
      const prev = getPreviousRevision(article, date);
      return {
        articleNo: article.article_no,
        prev: prev?.content || [],
        next: current.content || [],
        reason: current.reason || [],
        actionType: current.action_type || '修正'
      };
    })
    .filter(Boolean)
    .sort((a, b) => articleSortIndex(order, a!.articleNo) - articleSortIndex(order, b!.articleNo)) as Array<{
    articleNo: string;
    prev: string[];
    next: string[];
    reason: string[];
    actionType: string;
  }>;
}

export default function LawDetail() {
  const { lawSlug } = useParams<{ lawSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lawData, setLawData] = useState<LawHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<DisplayMode>('focus');
  const [selectedArticle, setSelectedArticle] = useState('');

  const lawName = decodeURIComponent(lawSlug || '');
  const fromYear = searchParams.get('fromYear');
  const fromSource = searchParams.get('fromSource');
  const isMissingYearSource = fromSource === 'missing-year';
  const backTo = isMissingYearSource
    ? (fromYear ? `/guide/full-revision?year=${fromYear}` : '/guide/full-revision')
    : (fromYear ? `/${fromYear}/archive` : '/');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await DataManager.getLawHistoryByName(lawName);
      if (!mounted) return;
      setLawData(data);
      setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [lawName]);

  const versions = useMemo(() => (lawData ? getVersionList(lawData) : []), [lawData]);

  const selectedDate = useMemo(() => {
    const fromQuery = searchParams.get('date');
    if (fromQuery && versions.some((v) => v.version_date === fromQuery)) return fromQuery;
    return versions[0]?.version_date || '';
  }, [versions, searchParams]);

  const selectedVersion = versions.find((item) => item.version_date === selectedDate);
  const actionType = getActionType(selectedVersion?.label || '修正');
  const hasSelectedDateRevisionData = useMemo(() => {
    if (!lawData || !selectedDate) return false;
    return (lawData.article_history || []).some((article) =>
      (article.revisions || []).some((revision) => revision.date === selectedDate)
    );
  }, [lawData, selectedDate]);
  const previousVersionDate = useMemo(() => {
    const idx = versions.findIndex((item) => item.version_date === selectedDate);
    if (idx <= 0) return '';
    return versions[idx - 1].version_date;
  }, [versions, selectedDate]);

  const fullRevisions = versions.filter((item) => item.label.includes('全文修正'));
  const enactedVersion = versions.find((item) => item.label.includes('制定'));

  const currentSnapshot = useMemo(() => (lawData && selectedDate ? buildSnapshot(lawData, selectedDate) : []), [lawData, selectedDate]);
  const previousSnapshot = useMemo(
    () => (lawData && previousVersionDate ? buildSnapshot(lawData, previousVersionDate) : []),
    [lawData, previousVersionDate]
  );

  const changedArticles = useMemo(() => (lawData && selectedDate ? getChangedArticles(lawData, selectedDate) : []), [lawData, selectedDate]);

  const selectedNodeSummary = useMemo(() => {
    if (!lawData || !selectedDate) return '';
    const order = (lawData.table_of_contents || []).map((item) => item.article_no);
    const firstArticleNo = order[0] || '第一條';
    const firstArticle = (lawData.article_history || []).find((item) => item.article_no === firstArticleNo)
      || lawData.article_history?.[0];
    if (!firstArticle) return '';
    const revision = getRevisionAtDate(firstArticle, selectedDate);
    return revision?.content?.[0] || '';
  }, [lawData, selectedDate]);

  const selectedArticleHistory = useMemo(() => {
    if (!lawData || !selectedArticle) return null;
    return (lawData.article_history || []).find((item) => item.article_no === selectedArticle) || null;
  }, [lawData, selectedArticle]);

  useEffect(() => {
    if (!selectedArticle && lawData?.article_history?.[0]?.article_no) {
      setSelectedArticle(lawData.article_history[0].article_no);
    }
  }, [lawData, selectedArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lawData) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-black serif mb-4">找不到法律資料</h1>
        <p className="text-sm text-gray-500 mb-8">{lawName}</p>
        <Link to={backTo} className="border border-black px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
          返回
        </Link>
      </div>
    );
  }

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A]">
      <header className="border-b-[3px] border-black mx-4 md:mx-8 pt-8 md:pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-1 hover:text-[#8C2F39] hover:border-[#8C2F39] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {isMissingYearSource ? 'Back to Missing-Year Guide' : 'Back to Archive'}
          </Link>
          <div className="flex bg-black p-1 rounded-sm">
            <button
              onClick={() => setMode('focus')}
              className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'focus' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              當次修法
            </button>
            <button
              onClick={() => setMode('timeline')}
              className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'timeline' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              條文歷程
            </button>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C2F39] mb-3">Law Detail</p>
            <h1 className="text-4xl md:text-6xl font-black serif leading-tight">{lawData.metadata.law_name}</h1>
            <p className="mt-4 text-xs md:text-sm text-gray-600">
              共 {lawData.metadata.total_articles || lawData.article_history?.length || 0} 條，累計修正 {getAmendmentCount(lawData)} 次
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">版本節點</p>
            <div className="flex flex-wrap gap-2">
              {versions.map((version) => (
                <button
                  key={version.version_date + version.label}
                  onClick={() => setSearchParams((prev) => {
                    prev.set('date', version.version_date);
                    return prev;
                  })}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border transition-colors ${
                    version.version_date === selectedDate
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {version.version_date}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              {enactedVersion && (
                <button
                  onClick={() => setSearchParams((prev) => {
                    prev.set('date', enactedVersion.version_date);
                    return prev;
                  })}
                  className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border border-[#8C2F39] text-[#8C2F39] hover:bg-[#8C2F39] hover:text-white transition-colors"
                >
                  跳至制定
                </button>
              )}
              {fullRevisions.map((version) => (
                <button
                  key={`full-${version.version_date}`}
                  onClick={() => setSearchParams((prev) => {
                    prev.set('date', version.version_date);
                    return prev;
                  })}
                  className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border border-gray-300 hover:border-black transition-colors"
                >
                  全文修正 {version.version_date}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8 p-6 border border-gray-200 bg-white">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C2F39]">目前節點</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black serif">{selectedVersion?.label || selectedDate}</h2>
          <p className="mt-2 text-xs md:text-sm text-gray-500">日期 {selectedDate} / 類型 {actionType}</p>
          {!!selectedNodeSummary && (
            <div className="mt-4 border border-[#f2d5cc] bg-[#fff7f4] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">原始法條摘要</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedNodeSummary}</p>
            </div>
          )}

          {!hasSelectedDateRevisionData && (
            <div className="mt-4 border border-amber-300 bg-amber-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 mb-2">資料缺口提示</p>
              <p className="text-sm text-amber-900 leading-relaxed">
                此法在 {selectedDate} 目前只有「版本節點」，缺少逐條修正與立法理由資料，
                因此無法準確回溯前一版條文差異與該次修正理由。
              </p>
            </div>
          )}
        </div>

        {mode === 'focus' && hasSelectedDateRevisionData && actionType === '制定' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#8C2F39]">
              <BookOpenText className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">制定全文</span>
            </div>
            {currentSnapshot.map((article) => (
              <article key={article.articleNo} className="bg-white border border-gray-200 p-5 md:p-8">
                <h3 className="text-xl md:text-2xl font-black serif mb-4">{article.articleNo}</h3>
                <div className="space-y-2 text-sm md:text-base leading-relaxed">
                  {article.content.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
                {!!article.reason.length && (
                  <div className="mt-4 border border-gray-200 bg-gray-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">立法理由</p>
                    {article.reason.map((line, idx) => (
                      <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {mode === 'focus' && hasSelectedDateRevisionData && actionType === '全文修正' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#8C2F39]">
              <GitCompareArrows className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">全文對照（前版 / 本版）</span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 p-5 md:p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">前一版本 {previousVersionDate || '-'}</h3>
                <div className="space-y-6">
                  {previousSnapshot.map((article) => (
                    <article key={`prev-${article.articleNo}`}>
                      <h4 className="font-black serif mb-2">{article.articleNo}</h4>
                      {article.content.map((line, idx) => (
                        <p key={idx} className="text-sm leading-relaxed text-gray-700">{line}</p>
                      ))}
                      {!!article.reason.length && (
                        <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">立法理由</p>
                          {article.reason.map((line, idx) => (
                            <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
              <section className="bg-white border border-[#8C2F39] p-5 md:p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39] mb-4">本次版本 {selectedDate}</h3>
                <div className="space-y-6">
                  {currentSnapshot.map((article) => (
                    <article key={`cur-${article.articleNo}`}>
                      <h4 className="font-black serif mb-2">{article.articleNo}</h4>
                      {article.content.map((line, idx) => (
                        <p key={idx} className="text-sm leading-relaxed">{line}</p>
                      ))}
                      {!!article.reason.length && (
                        <div className="mt-3 border border-[#e7c0b6] bg-[#fff1eb] p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8C2F39] mb-2">立法理由</p>
                          {article.reason.map((line, idx) => (
                            <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {mode === 'focus' && hasSelectedDateRevisionData && actionType === '修正' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#8C2F39]">
              <GitCompareArrows className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">修正條文前後對比</span>
            </div>
            {changedArticles.map((article) => (
              <article key={article.articleNo} className="bg-white border border-gray-200 p-5 md:p-8">
                <h3 className="text-xl md:text-2xl font-black serif mb-4">{article.articleNo}</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-4 bg-gray-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">修正前</p>
                    {article.prev.length ? article.prev.map((line, idx) => <p key={idx} className="text-sm leading-relaxed text-gray-700">{line}</p>) : <p className="text-sm text-gray-500">無前一版本（新增條文）</p>}
                  </div>
                  <div className="border border-[#8C2F39] p-4 bg-[#fff7f4]">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8C2F39] mb-2">修正後</p>
                    {article.next.map((line, idx) => (
                      <p key={idx} className="text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
                {!!article.reason.length && (
                  <div className="mt-4 border border-gray-200 bg-gray-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">立法理由</p>
                    {article.reason.map((line, idx) => (
                      <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {!changedArticles.length && <p className="text-sm text-gray-500">此節點沒有可比對的條文異動資料。</p>}
          </div>
        )}

        {mode === 'focus' && !hasSelectedDateRevisionData && (
          <div className="border border-gray-200 bg-white p-6 text-sm text-gray-600">
            目前無法顯示此版本的逐條前後對照，請改看其他有完整逐條歷史的版本節點。
          </div>
        )}

        {mode === 'timeline' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(lawData.article_history || []).map((article) => (
                <button
                  key={article.article_no}
                  onClick={() => setSelectedArticle(article.article_no)}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] border ${
                    selectedArticle === article.article_no
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {article.article_no}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 p-5 md:p-8">
              <h3 className="text-xl md:text-2xl font-black serif mb-4">{selectedArticle} 歷史變化</h3>
              <div className="space-y-6">
                {(selectedArticleHistory?.revisions || [])
                  .slice()
                  .sort((a, b) => compareDate(a.date, b.date))
                  .map((revision) => (
                    <article key={`${selectedArticle}-${revision.date}-${revision.revision_index || 0}`} className="border-l-4 border-[#8C2F39] pl-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{revision.date} / {revision.action_type}</p>
                      <div className="mt-3 space-y-2">
                        {revision.content.map((line, idx) => (
                          <p key={idx} className="text-sm leading-relaxed">{line}</p>
                        ))}
                      </div>
                      {!!revision.reason?.length && (
                        <div className="mt-3 border border-gray-200 bg-gray-50 p-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">立法理由</p>
                          {revision.reason.map((line, idx) => (
                            <p key={idx} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </motion.main>
  );
}
