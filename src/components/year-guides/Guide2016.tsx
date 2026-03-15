import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Zap, Vote, ShieldAlert, MessageCircle, ArrowRight, Gavel } from 'lucide-react';

const Guide2016 = ({ intelligence, summaryData }: any) => {
  const clashPoints = summaryData?.clash_points || [];
  const keywordWar = summaryData?.keyword_war?.entries || [];
  const dialogue = summaryData?.dialogue_flow?.segments || [];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#e74c3c] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Clash</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#c0392b] mb-12">Structural Conflict / 體系對撞</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            辭彙核爆與<br/>「記名表決」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#e74c3c] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 修辭對撞機 - 高強度對比視覺 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter text-[#e74c3c]">The Rhetoric<br/>Collider</h4>
            <div className="h-2 w-24 bg-black"></div>
            
          </div>

          <div className="md:col-span-7 space-y-8">
            {keywordWar.map((kw: any, i: number) => (
              <div key={i} className="group relative bg-gray-50 p-10 border-2 border-black hover:bg-black hover:text-white transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                   <h5 className="text-3xl font-black serif">「{kw.term}」</h5>
                   <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>
                <div className="flex items-center space-x-8 text-sm mb-6">
                   <div className="flex-1">
                      <span className="block text-[9px] font-black uppercase opacity-50 mb-1">Old Context</span>
                      <p className="font-bold border-l-2 border-current pl-4 italic opacity-40">{kw.transformation.split('轉向')[0]}</p>
                   </div>
                   <ArrowRight className="w-6 h-6" />
                   <div className="flex-1">
                      <span className="block text-[9px] font-black uppercase text-[#e74c3c] mb-1">2016 Weapon</span>
                      <p className="font-black border-l-2 border-[#e74c3c] pl-4 italic text-lg">{kw.transformation.split('轉向')[1]}</p>
                   </div>
                </div>
                <p className="text-xs serif opacity-60 border-t border-gray-200 pt-4 group-hover:border-white/10">{kw.semantic_shift}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 記名表決與第十八條死鬥 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black border-x-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <div className="flex items-center justify-between">
             <Vote className="w-16 h-16 text-[#e74c3c]" />
             <span className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-4 py-2">Clash Severity: 1.0</span>
          </div>
          <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none">第十八條：<br/>調查權與記名表決</h4>
          <p className="text-2xl serif italic text-gray-400 leading-relaxed">
            「讓選民清楚看到誰在阻撓財產歸還國家，這是對歷史負責的武器化表現。」
          </p>
          <div className="h-1 w-24 bg-[#e74c3c]"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <div className="space-y-8">
             <div className="p-8 bg-rose-50 border-l-8 border-[#e74c3c]">
                <p className="text-xs font-black uppercase text-[#e74c3c] mb-2 italic">Opposition Resistance</p>
                <p className="text-xl font-black serif">「程序正義、多數暴力」</p>
                <p className="text-sm text-gray-600 mt-2 italic">國民黨試圖透過頻繁的『在席位上發言』干擾，紀錄中出現多次標註。</p>
             </div>
             <div className="p-8 bg-gray-50 border-l-8 border-black">
                <p className="text-xs font-black uppercase text-gray-400 mb-2 italic">Micro Nuance</p>
                <p className="text-lg serif leading-relaxed italic">「賴士葆委員多次挑戰主席『英明』與否，反映議場內極度緊繃的情緒。」</p>
             </div>
          </div>
        </div>
      </section>

      {/* 立法對話流 - 粗獷主義聊天 */}
      <section className="space-y-20 py-20">
        <div className="text-center space-y-4">
           <MessageCircle className="w-12 h-12 mx-auto text-[#e74c3c]" />
           <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400">Heated Debate Audio Log</h4>
        </div>
        <div className="max-w-5xl mx-auto space-y-16">
          {dialogue.map((df: any, i: number) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-6 md:p-12 border-4 border-black max-w-2xl relative ${i % 2 === 0 ? 'bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]' : 'bg-black text-white shadow-[-20px_20px_0px_0px_rgba(231,76,60,1)]'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4 block">
                  {df.speaker} — {df.timestamp}
                </span>
                <p className="text-3xl font-black serif italic leading-tight">「{df.raw_quote}」</p>
                <p className={`mt-6 text-xs font-bold uppercase tracking-widest ${i % 2 === 0 ? 'text-gray-400' : 'text-gray-500'}`}>{df.context}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <Gavel className="w-12 h-12 opacity-20 animate-bounce" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">Reconstructing the Foundations of Democracy.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2016 Transitional Justice Legislative Breakthrough</p>
      </section>
    </div>
  );
};

export default Guide2016;
