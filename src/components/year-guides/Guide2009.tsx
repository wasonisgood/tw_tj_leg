import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Scale, History, ArrowRight, Landmark, Gavel, GraduationCap } from 'lucide-react';

const Guide2009 = ({ intelligence, summaryData }: any) => {
  const [pivot, setPivot] = useState<'money' | 'history'>('history');
  const clash = summaryData?.clash_points?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#d35400] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Pivot</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#d35400] mb-12">The Historical Pivot / 歷史轉軸</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            從發錢到<br/>「寫史」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#d35400] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 轉型天平 - 互動組件 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">The Shift of<br/>Mission</h4>
            <div className="h-2 w-24 bg-[#d35400]"></div>
            
            <div className="bg-orange-50 p-8 border-l-8 border-[#d35400] space-y-4">
               <p className="text-xs font-black uppercase text-[#d35400]">Micro Nuance</p>
               <p className="text-lg serif font-black">從物質到集體記憶</p>
               <p className="text-sm text-gray-600">整理史料、文獻的條文修正，標誌著轉型正義開始建構國家的歷史敘事。</p>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-center space-y-12 py-20 bg-gray-50 border-4 border-black">
             <div className="flex gap-8">
                <button 
                  onClick={() => setPivot('money')}
                  className={`p-10 border-4 transition-all ${pivot === 'money' ? 'bg-black text-white border-black scale-105' : 'bg-white border-gray-200 opacity-40 hover:opacity-100'}`}
                >
                   <Landmark className="w-12 h-12 mb-4" />
                   <span className="text-xl font-black uppercase tracking-tighter">補償金發放</span>
                </button>
                <div className="flex items-center">
                   <ArrowRight className={`w-12 h-12 transition-transform duration-1000 ${pivot === 'history' ? 'rotate-0' : 'rotate-180 opacity-20'}`} />
                </div>
                <button 
                  onClick={() => setPivot('history')}
                  className={`p-10 border-4 transition-all ${pivot === 'history' ? 'bg-[#d35400] text-white border-[#d35400] scale-105' : 'bg-white border-gray-200 opacity-40 hover:opacity-100'}`}
                >
                   <BookOpen className="w-12 h-12 mb-4" />
                   <span className="text-xl font-black uppercase tracking-tighter">史料研究</span>
                </button>
             </div>
             <p className="text-xs font-black uppercase tracking-[0.5em] text-gray-400">Task Re-orientation / 任務重心移位</p>
          </div>
        </div>
      </section>

      {/* 司法後盾 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <div className="flex items-center space-x-4">
            <Gavel className="w-10 h-10 text-rose-500" />
            <h4 className="text-4xl font-black serif uppercase">司法後盾</h4>
          </div>
          <p className="text-2xl serif italic leading-relaxed text-gray-400">
            「翁金珠等委員主張：受難者應得依法提起訴願及行政訴訟。轉型正義不能只有行政裁量。」
          </p>
          <div className="h-1 w-24 bg-rose-500"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <div className="space-y-6">
            <h5 className="text-3xl font-black serif uppercase">從補償到「賠償」</h5>
            <p className="text-lg serif text-gray-600 leading-loose">
              2009 年補償條例正式更名為「賠償條例」。這不僅是名稱的更動，更是法律位階的提升，承認國家行為的不法性已成定論。
            </p>
          </div>
          <div className="pt-8 flex flex-wrap gap-4 border-t border-gray-100">
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#紀念館轉型</span>
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#國際人權交流</span>
          </div>
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <GraduationCap className="w-12 h-12 opacity-20" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">History is the Best Teacher.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2009 Institutional Transformation Archive</p>
      </section>
    </div>
  );
};

export default Guide2009;
