import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, Users, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

const Guide2000 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const hiddenTruths = summaryData?.historical_micro_analysis?.hidden_truths;

  return (
    <div className="space-y-40 pb-40 selection:bg-[#e74c3c] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none text-right">Relay</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#e74c3c] mb-12">Power Transition / 轉型正義的接力賽</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            死限、存續與<br/>「二度創傷」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#e74c3c] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 截止日倒數視覺化 - 震撼排版 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5">
           <Timer className="w-96 h-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">The 2000<br/>Deadline</h4>
            <div className="h-2 w-24 bg-[#e74c3c]"></div>
            
            <div className="p-8 bg-rose-50 border-l-8 border-[#e74c3c] space-y-4">
               <div className="flex items-center text-[#e74c3c] space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-black uppercase">Critical Date</span>
               </div>
               <p className="text-3xl font-black serif">民國 94 年 7 月</p>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Original Dissolution Date</p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
            <div className="space-y-8">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-gray-400">社會壓力與案量湧入</span>
                  <TrendingUp className="text-[#e74c3c]" />
               </div>
               <div className="h-32 bg-gray-100 border-4 border-black relative">
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: '100%' }} 
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#e74c3c] to-rose-400 opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-2xl md:text-5xl font-black serif text-white drop-shadow-lg">SURGING</span>
                  </div>
               </div>
            </div>
            <p className="text-lg serif text-gray-600 leading-loose border-t border-gray-100 pt-8">
              原始文本揭露：朝野針對「延長申請期」進行了激烈的心理攻防，擔心截止日會關上正義的大門，造成家屬的「二度創傷」。
            </p>
          </div>
        </div>
      </section>

      {/* 存續之爭 - 不對稱對照 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y-4 border-black border-x-4">
        <div className="p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Old Regime Stance</span>
          <h4 className="text-4xl font-black serif uppercase leading-none">依限解散</h4>
          <p className="text-xl serif text-gray-400 italic leading-relaxed">「轉型正義應有終結點，完成賠償後即應功成身退。」</p>
          <div className="h-1 w-24 bg-[#1a5a96]"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Logic: 任務編組、不得延長</p>
        </div>
        <div className="p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#27ae60] block mb-2">New Regime Stance</span>
          <h4 className="text-4xl font-black serif uppercase leading-none underline decoration-[#27ae60] decoration-8 underline-offset-8">任務未竟</h4>
          <p className="text-xl serif text-[#1A1A1A] italic leading-relaxed">「許多人因恐懼尚未申請，真相未明前不應急著結束。」</p>
          <div className="h-1 w-24 bg-[#27ae60]"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logic: 家屬傷痛未癒、法律延展</p>
        </div>
      </section>

      {/* 微觀分析 - 政黨輪替後的法制銜接 */}
      <section className="py-20 max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
           {hiddenTruths?.map((ht: any, i: number) => (
             <div key={i} className={`p-6 md:p-16 border-[10px] border-black group transition-all ${i % 2 === 0 ? 'bg-white hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-white hover:text-black'}`}>
                <div className="flex justify-between items-start mb-8">
                   <Users className="w-12 h-12" />
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
        <Clock className="w-12 h-12 text-[#e74c3c] animate-pulse" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">Justice is a Marathon,<br/>Not a Sprint.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2000 Transition & Relay Archive</p>
      </section>
    </div>
  );
};

export default Guide2000;
