import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DataManager, BillData } from '../DataManager';
import { FileText, ArrowLeft, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BillDetail() {
  const { bill_id } = useParams<{ bill_id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    DataManager.getBillById(bill_id || '')
      .then((data) => {
        if (!mounted) return;
        setBill(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [bill_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center font-black uppercase tracking-widest text-[#8C2F39]">
        Loading Bill Data...
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
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-12 px-6 md:px-16 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Context
        </button>

        <header className="mb-16 border-b-[6px] border-black pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C2F39] mb-4">Legislative Bill Archive</p>
          <h1 className="text-4xl md:text-6xl font-black serif leading-tight tracking-tighter mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-8 space-y-16">
            
            {/* 案由與說明 */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black serif">案由與說明</h2>
                <div className="h-[2px] flex-grow bg-black"></div>
              </div>
              <div className="bg-white border-2 border-black p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39] mb-2">案由</h3>
                  <p className="text-sm leading-loose text-justify">{bill.案由 || '無紀錄'}</p>
                </div>
                {bill.說明 && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39] mb-2">說明</h3>
                    <p className="text-sm leading-loose whitespace-pre-wrap text-justify">{bill.說明}</p>
                  </div>
                )}
              </div>
            </section>

            {/* 法條對照表 */}
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

          </aside>
        </div>
      </div>
    </div>
  );
}
