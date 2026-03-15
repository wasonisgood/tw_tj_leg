import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowRight, Clock, HelpCircle, X, ShieldCheck } from 'lucide-react';

const Guide1993 = ({ intelligence, summaryData }: any) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const clash = summaryData?.clash_points?.[0];
  const dialogue = summaryData?.dialogue_flow?.segments;

  const modalContent: any = {
    reparation: {
      title: "賠償 (Reparation)",
      legal: "承認國家行為具備『違法性』。意味著國家正式認錯，法律責任無上限。",
      impact: "由國家編列預算，象徵尊嚴與平反。"
    },
    compensation: {
      title: "補償 (Compensation)",
      legal: "法律上指行為合法但造成損失（如土地徵收）。旨在規避政府的『違法性責任』。",
      impact: "設立基金會作為防火牆，減輕財政與法律衝擊。"
    }
  };

  return (
    <div className="space-y-40 pb-40 selection:bg-emerald-700 selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Game</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-gray-500 mb-12">Legislative Game / 立法博弈</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter">
            金流防火牆與<br/>「軟抵抗」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#2d8a4e] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 賠償 vs 補償 - 互動區塊 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">Terminological<br/>Showdown</h4>
            
          </div>
          <div className="md:col-span-7 flex flex-col space-y-6">
            <button 
              onClick={() => setActiveModal('reparation')}
              className="group p-10 bg-black text-white flex justify-between items-center hover:bg-[#c0392b] transition-all"
            >
              <span className="text-4xl font-black serif uppercase">賠償 Reparation</span>
              <HelpCircle className="w-8 h-8 opacity-50 group-hover:opacity-100" />
            </button>
            <div className="h-[2px] w-full bg-gray-200"></div>
            <button 
              onClick={() => setActiveModal('compensation')}
              className="group p-10 border-4 border-black flex justify-between items-center hover:bg-gray-50 transition-all"
            >
              <span className="text-4xl font-black serif uppercase">補償 Compensation</span>
              <HelpCircle className="w-8 h-8 opacity-50 group-hover:opacity-100 text-[#2d8a4e]" />
            </button>
          </div>
        </div>

        {/* 互動 Modal */}
        <AnimatePresence>
          {activeModal && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-white p-6 md:p-20 flex flex-col justify-center border-[10px] border-[#2d8a4e]"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8"><X className="w-12 h-12" /></button>
              <h5 className="text-[10px] font-black uppercase tracking-[1em] text-[#2d8a4e] mb-12">Legal Definition</h5>
              <h6 className="text-4xl md:text-7xl font-black serif uppercase mb-8">{modalContent[activeModal].title}</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase text-gray-400">法理責任</span>
                  <p className="text-2xl serif leading-relaxed">{modalContent[activeModal].legal}</p>
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase text-gray-400">政治影響</span>
                  <p className="text-2xl serif leading-relaxed">{modalContent[activeModal].impact}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 歷史微觀分析 - 時間張力 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-[#1A1A1A] text-white p-6 md:p-20 flex flex-col justify-center space-y-8">
          <Clock className="w-16 h-16 text-[#c0392b]" />
          <h4 className="text-4xl md:text-7xl font-black serif uppercase leading-none tracking-tighter">46 Years of<br/>Waiting</h4>
          <p className="text-2xl serif italic text-gray-400">「不要讓歷史傷痕繼續化膿。」</p>
        </div>
        <div className="bg-white p-6 md:p-20 border-y-4 border-r-4 border-black flex flex-col justify-center space-y-12">
          <div className="space-y-6">
            <h5 className="text-3xl font-black serif border-b-4 border-[#2d8a4e] pb-2 inline-block">檔案開放的「軟抵抗」</h5>
            <p className="text-lg serif text-gray-600 leading-loose">
              資料顯示軍方與情治單位透過行政院的「時空背景特殊」修辭，形成一種無形的防禦屏障，拒絕家屬對真相的調閱權。
            </p>
          </div>
          <div className="p-8 bg-gray-50 border-l-8 border-black italic serif">
            「行政院在 1993 年提出的版本雖然進步，但實際上是為了搶奪『話語解釋權』，防止在野黨提出更激進的方案。」
          </div>
        </div>
      </section>

      {/* 關鍵字進化 */}
      <section className="py-20 border-b-4 border-black">
        <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400 mb-20 text-center">Keyword Evolution</h4>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-20">
           <div className="text-center space-y-4">
              <span className="block text-[8vw] font-black serif leading-none text-gray-100 uppercase">Forbidden</span>
              <span className="block text-4xl font-black serif -mt-8">白色恐怖</span>
              <ArrowRight className="w-12 h-12 mx-auto mt-4 text-[#2d8a4e]" />
              <span className="block text-xl font-bold uppercase tracking-widest text-[#2d8a4e]">Legal Subject</span>
           </div>
           <div className="text-center space-y-4 opacity-30">
              <span className="block text-[8vw] font-black serif leading-none text-gray-100 uppercase">Moral</span>
              <span className="block text-4xl font-black serif -mt-8">真相調查</span>
              <ArrowRight className="w-12 h-12 mx-auto mt-4" />
              <span className="block text-xl font-bold uppercase tracking-widest">Access Right</span>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Guide1993;
