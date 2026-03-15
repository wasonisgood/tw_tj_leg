import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Info, ArrowRight, ShieldCheck, Scale, AlertCircle } from 'lucide-react';

const Guide2002 = ({ intelligence, summaryData }: any) => {
  const [showPopup, setShowPopup] = useState(false);
  const clash = summaryData?.clash_points?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-black selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Logic</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#2980b9] mb-12">Legal Logic & Humanity / 法理與人性</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            舉輕明重與<br/>「樣態補漏」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-black pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 舉輕明重 - 互動解釋彈窗 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-6 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">The Principle of<br/>A Fortiori</h4>
            <div className="h-2 w-24 bg-black"></div>
            
            <button 
              onClick={() => setShowPopup(true)}
              className="group flex items-center space-x-4 px-8 py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-[#8C2F39] transition-all"
            >
              <Info className="w-6 h-6" />
              <span>什麼是「舉輕明重」？</span>
            </button>
          </div>

          <div className="md:col-span-6 flex flex-col justify-center space-y-12 py-20 bg-gray-50 border-4 border-black relative">
             <div className="flex flex-col items-center space-y-8">
                <Scale className="w-32 h-32 text-gray-200" />
                <div className="flex items-center space-x-12">
                   <div className="text-center opacity-40">
                      <span className="text-[10px] font-black uppercase">輕微罪名</span>
                      <p className="text-2xl font-black serif">獲補償</p>
                   </div>
                   <ArrowRight className="w-12 h-12" />
                   <div className="text-center">
                      <span className="text-[10px] font-black uppercase text-[#8C2F39]">嚴重罪名</span>
                      <p className="text-4xl font-black serif underline decoration-[#8C2F39] decoration-8">更應補償</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* 解釋彈窗 */}
        <AnimatePresence>
          {showPopup && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute inset-y-0 right-0 z-50 w-full md:w-1/2 bg-[#1A1A1A] text-white p-6 md:p-20 flex flex-col justify-center border-l-[12px] border-[#8C2F39]"
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Close [X]</button>
              <h5 className="text-4xl font-black serif mb-8 text-[#8C2F39]">舉輕明重 (A Fortiori)</h5>
              <p className="text-xl serif leading-relaxed text-gray-300 italic mb-8">
                「基於法理，情節較輕者若獲補償，情節較重者更不應被排除，必須確保所有受裁判者均能獲致補償。」
              </p>
              <div className="space-y-6 pt-8 border-t border-white/10">
                 <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">2002 年具體應用：</p>
                 <p className="text-lg text-gray-200 serif">將原本模糊的申請期限與程序進行細節對接，確保白色恐怖時期「不當審判」之全部樣態均納入補償範疇。</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 法理補漏 - 雜誌排版 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y-4 border-black">
        <div className="p-6 md:p-20 bg-white border-r-4 border-black space-y-8">
          <div className="flex items-center space-x-4">
            <Gavel className="w-8 h-8 text-black" />
            <h4 className="text-3xl font-black serif uppercase">行政銜接</h4>
          </div>
          <p className="text-xl serif text-gray-600 leading-relaxed italic">
            「配合實務運作，將原本模糊的申請期限與程序進行細節對接，維護法律一致性。」
          </p>
          <div className="h-1 w-12 bg-gray-200"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source: 行政院函請審議</p>
        </div>
        <div className="p-6 md:p-20 bg-white space-y-8">
          <div className="flex items-center space-x-4 text-[#8C2F39]">
            <ShieldCheck className="w-8 h-8" />
            <h4 className="text-3xl font-black serif uppercase">精密補漏</h4>
          </div>
          <p className="text-xl serif text-[#1A1A1A] leading-relaxed italic font-black">
            「2002 年的立法已從『情緒補償』進入『精密法理攻防』階段。」
          </p>
          <div className="h-1 w-12 bg-[#8C2F39]"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Source: 朱鳳芝等委員</p>
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <AlertCircle className="w-12 h-12 opacity-20" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">Closing the Gaps in Justice.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2002 White Terror Legal Correction</p>
      </section>
    </div>
  );
};

export default Guide2002;
