import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Search, ArrowRight, Scale, HelpCircle } from 'lucide-react';

const Guide2003 = ({ intelligence, summaryData }: any) => {
  const [step, setIsEligible] = useState<null | boolean>(null);
  const clash = summaryData?.clash_points?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-black selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Scale</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#8C2F39] mb-12">Defining Scale / 擴大與精確</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            公平分配與<br/>「重複領取」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-black pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 資格檢查器 - 互動組件 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">Eligibility<br/>Checker</h4>
            <div className="h-2 w-24 bg-black"></div>
            
            <div className="bg-gray-50 p-8 border-l-4 border-black">
               <p className="text-xs font-bold uppercase mb-4 opacity-50 italic text-[#8C2F39]">Clash Point</p>
               「曾依司法程序獲救濟者，是否應排除在補償之外？這涉及資源分配的公平性。」
            </div>
          </div>

          <div className="md:col-span-7 bg-[#F9F9F7] p-6 md:p-12 border-4 border-black space-y-12">
             <h5 className="text-2xl font-black serif uppercase tracking-widest text-center border-b border-gray-200 pb-6">2003 補償申請模擬</h5>
             
             <div className="space-y-8">
                <div className="p-8 bg-white border-2 border-black space-y-6">
                   <p className="text-lg font-bold serif">您是否已透過司法程序（如冤獄賠償）獲得救濟？</p>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setIsEligible(false)}
                        className={`flex-1 py-4 font-black uppercase tracking-widest border-2 border-black transition-all ${step === false ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                      >
                        是 (YES)
                      </button>
                      <button 
                        onClick={() => setIsEligible(true)}
                        className={`flex-1 py-4 font-black uppercase tracking-widest border-2 border-black transition-all ${step === true ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-black hover:bg-gray-50'}`}
                      >
                        否 (NO)
                      </button>
                   </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === false && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-8 bg-rose-50 border-l-8 border-rose-600 space-y-4">
                       <div className="flex items-center text-rose-600 space-x-2">
                          <XCircle className="w-6 h-6" />
                          <span className="font-black uppercase tracking-widest">排除 Exclusion</span>
                       </div>
                       <p className="text-sm serif leading-relaxed text-rose-900">
                         依 2003 年政府立場：為維資源分配公平，已領取司法救濟者不得重複領取補償金。
                       </p>
                    </motion.div>
                  )}
                  {step === true && (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-8 bg-emerald-50 border-l-8 border-emerald-600 space-y-4">
                       <div className="flex items-center text-emerald-600 space-x-2">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-black uppercase tracking-widest">准予受理 Eligible</span>
                       </div>
                       <p className="text-sm serif leading-relaxed text-emerald-900">
                         您可以繼續進行二二八補償申請程序。
                       </p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </section>

      {/* 爭議對照 - 雜誌排版 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y-4 border-black">
        <div className="p-6 md:p-20 bg-[#1A1A1A] text-white space-y-8 border-r-4 border-black">
          <div className="flex items-center space-x-4">
            <Scale className="w-8 h-8 text-gray-400" />
            <h4 className="text-3xl font-black serif uppercase">公平分配論</h4>
          </div>
          <p className="text-xl serif text-gray-400 leading-relaxed italic">
            「司法程序已獲救濟者不應再申請，以確保國家資源精確投放給尚未獲救記者。」
          </p>
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest pt-8 border-t border-white/5">Government: 法務部/二二八基金會</p>
        </div>
        <div className="p-6 md:p-20 bg-white text-black space-y-8">
          <div className="flex items-center space-x-4 text-[#8C2F39]">
            <HelpCircle className="w-8 h-8" />
            <h4 className="text-3xl font-black serif uppercase">本質差異論</h4>
          </div>
          <p className="text-xl serif text-[#1A1A1A] leading-relaxed italic font-black">
            「司法救濟與補償性質不同（一為賠償、一為平反），不應互斥，應放寬認定。」
          </p>
          <p className="text-[10px] font-black uppercase text-[#8C2F39] tracking-widest pt-8 border-t border-gray-100">Opposition: 蔡同榮、黃宗源</p>
        </div>
      </section>

      {/* 微觀分析 - 附帶決議 */}
      <section className="max-w-4xl mx-auto py-20 text-center space-y-12">
        <Search className="w-16 h-16 mx-auto opacity-20" />
        <h4 className="text-4xl font-black serif leading-tight">「立法者對執行細節的控制力在加強」</h4>
        <div className="h-1 w-24 bg-black mx-auto"></div>
        <p className="text-xl serif text-gray-500 italic leading-loose">
          資料中記錄了針對「附帶決議」的討論，顯示 2003 年的轉型正義已不再只是喊口號，而是進入對「誰能領、領多少」的精確微調。
        </p>
      </section>
    </div>
  );
};

export default Guide2003;
