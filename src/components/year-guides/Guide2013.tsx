import React from 'react';
import { motion } from 'framer-motion';
import { Unlock, FileSearch, ArrowRight, History, ShieldAlert, Timer } from 'lucide-react';

const Guide2013 = ({ intelligence, summaryData }: any) => {
  const hiddenTruths = summaryData?.historical_micro_analysis?.hidden_truths;
  const dialogue = summaryData?.dialogue_flow?.segments;

  return (
    <div className="space-y-40 pb-40 selection:bg-[#e67e22] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Unlock</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#e67e22] mb-12">Unlocking the Past / 解除過去的枷鎖</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            解密進度與<br/>「噤聲後代」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#e67e22] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 檔案解密進度與申請窗期 - 視覺化 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter text-[#e67e22]">Trend of<br/>Disclosure</h4>
            <div className="h-2 w-24 bg-black"></div>
            
            <div className="bg-orange-50 p-8 border-l-8 border-[#e67e22]">
               <p className="text-xs font-black uppercase text-[#e67e22] mb-2">Technical Justification</p>
               「政府整理進度緩慢，導致家屬在過去的申請期內根本無法舉證。這是 2013 年修法最重要的正當性。」
            </div>
          </div>

          <div className="md:col-span-7 bg-gray-50 p-6 md:p-12 border-4 border-black space-y-12 relative min-h-[400px] flex flex-col justify-center">
             <div className="space-y-8">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-black uppercase tracking-widest text-gray-400">解密檔案累積量 (Cumulative Records)</span>
                   <Unlock className="text-[#e67e22] w-6 h-6" />
                </div>
                <div className="relative h-48 flex items-end gap-2">
                   {[30, 45, 60, 95].map((h, i) => (
                     <motion.div 
                       key={i} 
                       initial={{ height: 0 }} 
                       animate={{ height: `${h}%` }} 
                       transition={{ delay: i * 0.2, duration: 1 }}
                       className="flex-1 bg-black relative group"
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#e67e22] text-white text-[10px] font-black px-2 py-1">
                           Stage {i+1}
                        </div>
                     </motion.div>
                   ))}
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-[#e67e22] tracking-widest border-t-2 border-[#e67e22] pt-4">
                   <span>1995 第一版</span>
                   <span>2013 第四度延長</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 噤聲的後代 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <div className="flex items-center space-x-4">
            <ShieldAlert className="w-10 h-10 text-[#e67e22]" />
            <h4 className="text-4xl font-black serif uppercase">不可歸責於受難者</h4>
          </div>
          <p className="text-2xl serif italic leading-relaxed text-gray-400">
            「家族恐懼導致口頭傳統斷裂，許多二代與三代完全不知道受難事實。2013 年的修法本質上是為了等待這群噤聲後代的覺醒。」
          </p>
          <div className="h-1 w-24 bg-[#e67e22]"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <div className="space-y-8">
            {dialogue?.map((df: any, i: number) => (
              <div key={i} className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e67e22]">{df.speaker}</span>
                <p className="text-2xl font-black serif italic leading-tight">「{df.raw_quote}」</p>
                <div className="h-[1px] w-12 bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <History className="w-12 h-12 opacity-20 animate-pulse" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">Truth must outlive silence.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2013 Delayed Truth & Extension Archive</p>
      </section>
    </div>
  );
};

export default Guide2013;
