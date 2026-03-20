import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DataManager, BillData, SubstantiveComparisonEngine } from '../DataManager';
import { FileText, ArrowLeft, Link2, Columns, LayoutList, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BillDetail() {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillData | null>(null);
  const [relatedBillsData, setRelatedBillsData] = useState<BillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        await DataManager.init();
        const data = await DataManager.getBillById(billId || '');
        if (!mounted) return;
        setBill(data);
        setCompareMode(false); // 重置模式
      } catch (err) {
        console.error('[BillDetail] Failed to load bill:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadData();
    return () => {
      mounted = false;
    };
  }, [billId]);

  // 切換比對模式並加載資料
  const toggleCompareMode = async () => {
    if (!compareMode && bill?.關連議案) {
      setLoadingRelated(true);
      try {
        const promises = bill.關連議案.map(rel => DataManager.getBillById(rel.議案編號));
        const results = await Promise.all(promises);
        setRelatedBillsData(results.filter((b): b is BillData => b !== null));
      } catch (err) {
        console.error('Failed to load related bills', err);
      } finally {
        setLoadingRelated(false);
      }
    }
    setCompareMode(!compareMode);
  };

  const comparisonData = useMemo(() => {
    if (!bill || !compareMode) return [];
    return SubstantiveComparisonEngine.alignArticles([bill, ...relatedBillsData]);
  }, [bill, relatedBillsData, compareMode]);

  const allParticipatingBills = useMemo(() => {
    if (!bill) return [];
    return [bill, ...relatedBillsData];
  }, [bill, relatedBillsData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center font-black uppercase tracking-widest text-[#8C2F39]">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Loading Legislative Data...
        </motion.div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center flex-col">
        <h1 className="text-4xl font-black serif mb-4">Bill Not Found</h1>
        <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-[#8C2F39] transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-12 px-4 md:px-16 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to context
          </button>
          
          {bill.關連議案 && bill.關連議案.length > 0 && (
            <button 
              onClick={toggleCompareMode}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all",
                compareMode ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
              )}
            >
              {compareMode ? <LayoutList className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
              {compareMode ? "Standard View" : "Substantive Comparison Mode"}
            </button>
          )}
        </div>

        <header className="mb-16 border-b-[6px] border-black pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C2F39] mb-4">Legislative Bill Archive</p>
          <h1 className="text-4xl md:text-6xl font-black serif leading-tight tracking-tighter mb-8 max-w-5xl">
            {bill.提案名稱}
          </h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm border-t border-gray-200 pt-8">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">提案人</p>
              <p className="font-bold">{bill.提案人 || '無紀錄'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">提案日期</p>
              <p className="font-bold">{bill.提案日期 || '無紀錄'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">議案狀態</p>
              <p className="font-bold">{bill.議案狀態 || '無紀錄'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">議案編號</p>
              <p className="font-bold font-mono">{bill.議案編號}</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!compareMode ? (
            <motion.div 
              key="standard" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24"
            >
              <div className="lg:col-span-8 space-y-16">
                {/* 案由與說明 */}
                {(bill.案由 || bill.說明) && (
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-black serif">案由與說明</h2>
                      <div className="h-[2px] flex-grow bg-black"></div>
                    </div>
                    <div className="bg-white border-2 border-black p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                      {bill.案由 && (
                        <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39] mb-2">案由</h3>
                          <p className="text-sm leading-loose text-justify">{bill.案由}</p>
                        </div>
                      )}
                      {bill.說明 && (
                        <div className={bill.案由 ? "pt-6 border-t border-gray-200" : ""}>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39] mb-2">說明</h3>
                          <p className="text-sm leading-loose whitespace-pre-wrap text-justify">{bill.說明}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* 法條對照表 (標準視圖) */}
                {bill.對照表 && bill.對照表.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-black serif">法條對照表</h2>
                      <div className="h-[2px] flex-grow bg-black"></div>
                    </div>
                    
                    <div className="space-y-12">
                      {bill.對照表.map((comp, idx) => (
                        <div key={idx} className="space-y-6">
                          <div className="flex items-baseline justify-between border-b-2 border-black pb-2">
                            <h3 className="text-xl font-black serif">{comp.law_name || comp.title}</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#8C2F39] px-2 py-1 bg-red-50">
                              {comp.立法種類}
                            </span>
                          </div>
                          
                          <div className="space-y-8">
                            {comp.rows?.map((row, rowIdx) => (
                              <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-gray-200">
                                <div className="space-y-3">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">增修內容</h4>
                                  <div className="text-sm font-bold leading-relaxed whitespace-pre-wrap">
                                    {row.增訂 || row.修正 || row.條文 || '無條文內容'}
                                  </div>
                                </div>
                                <div className="space-y-3 md:border-l border-gray-200 md:pl-6">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8C2F39]">立法理由</h4>
                                  <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                                    {row.說明 || '無說明'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-4 space-y-12">
                <BillSidebar bill={bill} />
              </aside>
            </motion.div>
          ) : (
            <motion.div 
              key="comparison" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {loadingRelated ? (
                <div className="py-24 text-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Aligning Micro-structures (Paragraphs & Items)...</p>
                </div>
              ) : (
                <div className="relative border-2 border-black bg-white">
                  {/* 黏性表頭 */}
                  <div className="sticky top-0 z-30 bg-black text-white grid grid-cols-12 gap-0 border-b border-black">
                    <div className="col-span-1 p-4 border-r border-gray-800 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">條次</span>
                    </div>
                    {allParticipatingBills.map((b, idx) => (
                      <div key={b.議案編號} className="col-span-3 p-4 border-r border-gray-800 last:border-r-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                            {idx === 0 ? "Current" : `Related #${idx}`}
                          </span>
                          <span className="text-[8px] font-mono text-gray-500">{b.議案編號}</span>
                        </div>
                        <h4 className="text-[11px] font-black leading-tight uppercase line-clamp-1">{b.提案人}</h4>
                      </div>
                    ))}
                  </div>

                  {/* 比對矩陣主體 */}
                  <div className="divide-y-2 divide-black">
                    {comparisonData.map((articleCluster, aIdx) => (
                      <div key={aIdx} className="group relative">
                        {/* 條層級標題 (Sticky) */}
                        <div className="sticky left-0 bg-gray-100 p-2 border-b border-black flex items-center gap-4">
                          <span className="text-sm font-black serif text-[#8C2F39]">{articleCluster.title}</span>
                          {articleCluster.isCommon && (
                            <span className="text-[8px] font-black uppercase bg-emerald-600 text-white px-1 py-0.5">共有核心條款</span>
                          )}
                          {!articleCluster.isCommon && (
                            <span className="text-[8px] font-black uppercase bg-gray-400 text-white px-1 py-0.5">部分提案包含</span>
                          )}
                        </div>

                        {/* 款/項層級對照 */}
                        <div className="divide-y divide-gray-200">
                          {articleCluster.fragments.map((frag, fIdx) => (
                            <div key={fIdx} className="grid grid-cols-12 gap-0 min-h-[100px] hover:bg-gray-50/50 transition-colors">
                              <div className="col-span-1 p-4 border-r border-gray-200 bg-gray-50 flex items-start justify-center">
                                <span className="text-[10px] font-bold text-gray-400">{frag.label}</span>
                              </div>
                              
                              {allParticipatingBills.map((b) => {
                                const align = frag.alignments[b.議案編號];
                                return (
                                  <div key={b.議案編號} className={cn(
                                    "col-span-3 p-6 border-r border-gray-200 last:border-r-0 relative",
                                    !align ? "bg-gray-50/30" : 
                                    frag.isCommon && !frag.hasDiff ? "bg-emerald-50/20" :
                                    frag.isCommon && frag.hasDiff ? "bg-amber-50/20" : ""
                                  )}>
                                    {align ? (
                                      <div className="space-y-4">
                                        <p className="text-sm leading-relaxed font-bold">
                                          {align.text}
                                        </p>
                                        
                                        {/* 立法理由 (懸浮或摺疊) */}
                                        <div className="pt-4 border-t border-dashed border-gray-200">
                                          <details className="group">
                                            <summary className="list-none cursor-pointer flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                                              <Info className="w-3 h-3" /> Legislative Reason
                                            </summary>
                                            <p className="mt-2 text-[11px] leading-relaxed text-gray-500 italic bg-white p-2 border border-gray-100 shadow-sm">
                                              {articleCluster.reasons[b.議案編號] || "未提供詳細理由"}
                                            </p>
                                          </details>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="h-full flex items-center justify-center">
                                        <AlertCircle className="w-4 h-4 text-gray-200" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BillSidebar({ bill }: { bill: BillData }) {
  return (
    <>
      {/* 議案流程 */}
      <section>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2 mb-6">Progress Timeline</h3>
        <div className="relative pl-4 space-y-6">
          <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gray-200"></div>
          {bill.議案流程 && bill.議案流程.length > 0 ? (
            bill.議案流程.map((proc, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-black rounded-full border-4 border-[#F9F9F7]"></div>
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-black font-mono text-gray-400">
                    {proc.日期 && proc.日期.length > 0 ? proc.日期[0] : '未知日期'}
                  </span>
                  <p className="text-sm font-bold serif leading-tight">{proc.狀態}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{proc['院會/委員會'] || ''}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">無流程紀錄</p>
          )}
        </div>
      </section>

      {/* 連署人 */}
      {bill.連署人 && bill.連署人.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2 mb-4">Co-Sponsors</h3>
          <div className="flex flex-wrap gap-2">
            {bill.連署人.map((name, idx) => (
              <span key={idx} className="text-xs font-bold px-2 py-1 bg-white border border-gray-200">
                {name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 附件 */}
      {bill.相關附件 && bill.相關附件.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2 mb-4">Attachments</h3>
          <ul className="space-y-2">
            {bill.相關附件.map((att, idx) => (
              <li key={idx}>
                <a href={att.網址} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-3 bg-white border border-gray-200 hover:border-black transition-colors">
                  <span className="text-xs font-bold truncate pr-4">{att.名稱}</span>
                  <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#8C2F39]" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 關連議案 */}
      {bill.關連議案 && bill.關連議案.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2 mb-4">Related Bills</h3>
          <ul className="space-y-2">
            {bill.關連議案.map((rel, idx) => (
              <li key={idx}>
                <Link to={`/bills/${rel.議案編號}`} className="group block p-3 bg-gray-100 hover:bg-black hover:text-white transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 className="w-3 h-3 opacity-50" />
                    <span className="text-[9px] font-mono tracking-widest opacity-70">{rel.議案編號}</span>
                  </div>
                  <p className="text-xs font-bold leading-tight line-clamp-2">{rel.議案名稱}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
