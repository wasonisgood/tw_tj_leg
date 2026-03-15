import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Banknote, Landmark, HelpCircle, AlertCircle, Quote, TrendingDown } from 'lucide-react';

const Guide1995 = ({ intelligence, summaryData }: any) => {
  const [balance, setBalance] = useState<'compensation' | 'reparation'>('compensation');
  const clash = summaryData?.clash_points?.[0];
  const hiddenTruth = summaryData?.historical_micro_analysis?.hidden_truths?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-black selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -right-10 select-none pointer-events-none text-right">Price</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#8C2F39] mb-12">Fiscal vs. Moral / 正義的定價</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter">
            國家犯罪的<br/>「理賠」修辭
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#8C2F39] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice || "1995 年是二二八正式法制化的轉捩點。"}」
          </p>
        </div>
      </section>

      {/* 名詞之戰 - 互動天平 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-[40px_40px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#8C2F39]"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-none tracking-tighter">The War of<br/>Words</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose border-t border-gray-100 pt-8">
              法律上的「一字之差」，決定了國家是對受難者「認錯」還是僅僅給予「慰問」。
            </p>
            <div className="bg-rose-50 p-6 border-l-4 border-[#8C2F39]">
               <p className="text-xs font-bold text-[#8C2F39] uppercase mb-2 italic">Micro Nuance</p>
               <p className="text-sm text-gray-700 serif italic">
                 「原始紀錄中，委員抨擊行政院版是將農保、公保的『保險理賠』思維套用在歷史創傷上，極度缺乏人文厚度。」
               </p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row gap-8">
              <button 
                onClick={() => setBalance('reparation')}
                className={`flex-1 p-6 md:p-12 border-4 transition-all text-left ${balance === 'reparation' ? 'bg-black text-white border-black scale-105 shadow-2xl' : 'bg-white text-gray-300 border-gray-100 hover:border-black'}`}
              >
                <h5 className="text-2xl md:text-5xl font-black serif mb-6">賠償<br/><span className="text-xs font-normal opacity-50 uppercase tracking-widest">Reparation</span></h5>
                <p className={`text-sm serif italic leading-relaxed ${balance === 'reparation' ? 'text-gray-300' : 'text-gray-400'}`}>「{clash?.actors?.opposition?.logic}」</p>
              </button>

              <button 
                onClick={() => setBalance('compensation')}
                className={`flex-1 p-6 md:p-12 border-4 transition-all text-left ${balance === 'compensation' ? 'bg-[#8C2F39] text-white border-[#8C2F39] scale-105 shadow-2xl' : 'bg-white text-gray-300 border-gray-100 hover:border-[#8C2F39]'}`}
              >
                <h5 className="text-2xl md:text-5xl font-black serif mb-6">補償<br/><span className="text-xs font-normal opacity-50 uppercase tracking-widest">Compensation</span></h5>
                <p className={`text-sm serif italic leading-relaxed ${balance === 'compensation' ? 'text-rose-100' : 'text-gray-400'}`}>「{clash?.actors?.government?.logic}」</p>
              </button>
            </div>
            
            <div className="flex justify-center py-12">
               <motion.div animate={{ rotate: balance === 'reparation' ? -15 : 15 }} transition={{ type: "spring", stiffness: 100 }} className="relative">
                  <Scale className="w-48 h-48 text-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className={`w-4 h-4 rounded-full ${balance === 'reparation' ? 'bg-black' : 'bg-[#8C2F39]'}`}></div>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 隱藏的真相 - 粗獷主義視覺 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-4 border-black">
        <div className="md:col-span-7 bg-[#1A1A1A] text-white p-6 md:p-20 space-y-12">
          <TrendingDown className="w-16 h-16 text-[#8C2F39]" />
          <h4 className="text-4xl md:text-7xl font-black serif uppercase tracking-tighter leading-none">The 6 Million<br/>Ceiling</h4>
          <div className="h-2 w-24 bg-[#8C2F39]"></div>
          <p className="text-3xl serif italic leading-relaxed text-gray-400">
            「{hiddenTruth?.description}」
          </p>
        </div>
        <div className="md:col-span-5 bg-white p-6 md:p-20 flex flex-col justify-center space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Political Compromise / 政治妥協</span>
            <h5 className="text-4xl md:text-8xl font-black serif leading-none tracking-tighter">6,000,000</h5>
            <p className="text-xl font-bold uppercase tracking-widest border-b-4 border-black pb-2 inline-block text-[#8C2F39]">Maximum Cap</p>
          </div>
          <div className="space-y-6 text-gray-600 serif text-lg leading-relaxed">
            <p>這不是基於損害的精確計算，而是基於國庫承受能力的「正義折扣」。</p>
            <p className="text-sm font-bold text-gray-400 italic">這開啟了台灣轉型正義「先行賠付、真相後補」的特殊歷史模式。</p>
          </div>
        </div>
      </section>

      {/* 三疊字排版區 */}
      <section className="py-20 flex flex-col items-center justify-center space-y-12 border-b-4 border-black pb-40">
        <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400">Legislative Milestone</h4>
        <div className="flex flex-col items-center">
           <span className="text-[15vw] md:text-[12vw] font-black serif leading-none uppercase tracking-tighter text-gray-100">Establish</span>
           <span className="text-[15vw] md:text-[12vw] font-black serif leading-none uppercase tracking-tighter -mt-10">Memorial</span>
           <span className="text-[15vw] md:text-[12vw] font-black serif leading-none uppercase tracking-tighter -mt-10 text-[#8C2F39]">Foundation</span>
        </div>
        <p className="max-w-xl text-center text-xl serif leading-relaxed text-gray-500 italic">
          1995 年的法案確立了國家必須面對二二八的義務，但也因財政壓力在名義上退縮了半步。
        </p>
      </section>
    </div>
  );
};

export default Guide1995;
