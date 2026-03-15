import React from 'react';
import { motion } from 'framer-motion';
import { Unlock, ShieldCheck, Trash2, ArrowRight, BookOpen, Scale, Gavel } from 'lucide-react';

const Guide2019 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const dialogue = summaryData?.dialogue_flow?.segments;
  const hiddenTruths = summaryData?.historical_micro_analysis?.hidden_truths;

  return (
    <div className="space-y-40 pb-40 selection:bg-black selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none text-black"> Legal </h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-gray-400 mb-12">Obstacle Removal / 掃除障礙的一年</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            法律位階與<br/>「函釋清理」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-black pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 函釋清理進度條 - 視覺化 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <div className="flex items-center space-x-4">
               <Trash2 className="w-12 h-12 text-rose-600" />
               <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-none tracking-tighter">Directive<br/>Cleaner</h4>
            </div>
            
            <div className="p-8 bg-gray-50 border-l-8 border-black space-y-4">
               <p className="text-xs font-black uppercase text-gray-400 italic">柯建銘強力督促</p>
               <p className="text-lg font-black serif italic leading-tight">「不能當做你們不提供的理由了，全部要照法律來...該撤就撤了吧！」</p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
             <div className="space-y-8">
                <div className="flex justify-between items-end">
                   <span className="text-xs font-black uppercase tracking-widest text-gray-400">違法函釋撤銷進度 (Directive Revocation)</span>
                   <span className="text-4xl font-black serif">90%</span>
                </div>
                <div className="h-12 bg-gray-100 border-4 border-black relative overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '90%' }} transition={{ duration: 2 }} className="h-full bg-black" />
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-xs font-black uppercase text-white mix-blend-difference">Clearing Historical Debris</span>
                   </div>
                </div>
             </div>
             <p className="text-sm text-gray-500 italic serif leading-loose">
               重點在於將「政治檔案法」的法律位階提到最高，終結部會間以內部函釋作為互踢皮球的藉口。
             </p>
          </div>
        </div>
      </section>

      {/* 法律位階 vs 函釋障礙 - 不對稱對照 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black border-x-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Legislative Force</span>
          <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none underline decoration-emerald-500 decoration-8 underline-offset-[12px]">法律位階</h4>
          <p className="text-2xl serif text-emerald-400 italic leading-relaxed">
            「我們第一項寫得很清楚，是『法律』，不是『法規』了嘛！」
          </p>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block mb-2">Administrative Debris</span>
          <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none line-through opacity-30 tracking-widest">行政函釋</h4>
          <p className="text-xl serif text-[#1A1A1A] italic leading-relaxed">
            「查到最後就是這個函釋出問題。」——揭露隱藏在公文堆裡的舊時代阻礙。
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-4">Status: 全數撤銷中</p>
        </div>
      </section>

      {/* 微觀分析 - 歷史學界壓力 */}
      <section className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
           {hiddenTruths?.map((ht: any, i: number) => (
             <div key={i} className={`p-6 md:p-16 border-4 border-black group transition-all hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="flex justify-between items-start mb-8">
                   {i === 0 ? <BookOpen className="w-12 h-12 text-black" /> : <Gavel className="w-12 h-12 text-black" />}
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Micro Analysis</span>
                </div>
                <h5 className="text-3xl font-black serif mb-6 tracking-tighter">{ht.point}</h5>
                <p className="text-lg serif italic opacity-60 leading-relaxed">{ht.description}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <ShieldCheck className="w-12 h-12 opacity-20" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center text-rose-700">Break the Chains of Secrecy.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2019 Political Archive Law Activation</p>
      </section>
    </div>
  );
};

export default Guide2019;
