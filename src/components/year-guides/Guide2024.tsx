import React from 'react';
import { motion } from 'framer-motion';
import { Umbrella, Heart, ShieldCheck, UserCheck, Zap, Quote, MessageCircle, ArrowUpRight } from 'lucide-react';

const Guide2024 = ({ intelligence, summaryData }: any) => {
  const keywordWar = summaryData?.keyword_war?.entries || [];
  const dialogueFlow = summaryData?.dialogue_flow?.segments || [];
  const microAnalysis = summaryData?.historical_micro_analysis?.hidden_truths || [];

  return (
    <div className="space-y-40 pb-40 selection:bg-emerald-600 selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Mercy</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-emerald-600 mb-12">Beyond Compensation / 補償之外</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter">
            細膩的<br/>「慈悲」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-emerald-500 pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice || "2024 年是台灣轉型正義工程最後拼圖的細膩修補。"}」
          </p>
        </div>
      </section>

      {/* 權利保護傘 - 高級視覺化 */}
      <section className="bg-white border-y-[12px] border-black py-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <div className="space-y-6">
              <ShieldCheck className="w-16 h-16 text-emerald-600" />
              <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter">The Legal<br/>Umbrella</h4>
              <div className="h-2 w-24 bg-emerald-500"></div>
            </div>
            
          </div>

          <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            <div className="absolute -inset-10 bg-emerald-50 rounded-[4rem] -rotate-2 opacity-50"></div>
            
            <motion.div whileHover={{ scale: 1.02 }} className="relative bg-white p-6 md:p-12 shadow-2xl border-2 border-black space-y-8">
              <Zap className="text-emerald-600 w-8 h-8" />
              <h5 className="text-2xl font-black serif">免予強制執行</h5>
              <p className="text-sm text-gray-500 leading-relaxed">
                確保賠償金「不得作為強制執行之標的」。這賦予了這筆資金「神聖不可侵犯」的性質，守護生存底線。
              </p>
              <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1">生存正義最後防線</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative bg-white p-6 md:p-12 shadow-2xl border-2 border-black space-y-8 md:translate-y-12">
              <UserCheck className="text-blue-600 w-8 h-8" />
              <h5 className="text-2xl font-black serif">排除財產計算</h5>
              <p className="text-sm text-gray-500 leading-relaxed">
                賠償金「不列入家庭總收入計算」。徹底終結「領取補償即喪失低收資格」的行政荒謬。
              </p>
              <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1">行政死角精確打擊</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2024 詞彙戰爭 - 兩欄對比排版 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border-4 border-black">
        {keywordWar.map((kw: any, i: number) => (
          <div key={i} className="bg-white p-6 md:p-20 space-y-12 group hover:bg-black hover:text-white transition-all duration-700">
            <h5 className="text-4xl font-black serif tracking-tighter border-b-2 border-current pb-4 inline-block text-[#8C2F39] group-hover:text-emerald-500 transition-colors">「{kw.term}」</h5>
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <span className="text-[9px] font-black uppercase opacity-40 w-24 text-right">Pre-2024</span>
                <span className="text-2xl font-black serif line-through opacity-30">{kw.from}</span>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-[9px] font-black uppercase text-emerald-600 w-24 text-right">Evolution</span>
                <span className="text-2xl font-black serif underline decoration-4 underline-offset-8">{kw.to}</span>
              </div>
            </div>
            <p className="text-lg serif italic opacity-60 leading-relaxed pt-8 border-t border-gray-100 group-hover:border-white/10">
              {kw.shift}
            </p>
          </div>
        ))}
      </section>

      {/* 立法對話流 - 聊天泡泡風格 (雜誌化) */}
      <section className="space-y-20 py-20">
        <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400 text-center">Dialogue Flow</h4>
        <div className="max-w-5xl mx-auto space-y-24">
          {dialogueFlow.map((df: any, i: number) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`relative max-w-2xl group ${i % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 block">
                  {df.speaker} — {df.emotion}
                </span>
                <div className="relative">
                  <Quote className={`absolute -top-10 w-20 h-20 opacity-5 ${i % 2 === 0 ? '-left-4 md:-left-10' : '-right-10'}`} />
                  <p className="text-4xl font-black serif leading-tight tracking-tight relative z-10">
                    「{df.raw_quote}」
                  </p>
                </div>
                <div className={`mt-6 h-1 w-24 bg-black inline-block group-hover:w-full transition-all duration-1000`}></div>
                <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{df.context}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 微觀分析 - 網格 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-4 border-black">
        {microAnalysis.map((ma: any, i: number) => (
          <div key={i} className={`p-6 md:p-16 border-r-4 border-black last:border-r-0 space-y-8 group hover:bg-emerald-50 transition-all`}>
            <ArrowUpRight className="w-8 h-8 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all" />
            <h6 className="text-2xl font-black serif leading-tight border-b-2 border-black pb-4 inline-block">{ma.point}</h6>
            <p className="text-sm serif leading-loose text-gray-600">
              {ma.description}
            </p>
          </div>
        ))}
      </section>

      {/* 結幕 */}
      <section className="py-40 text-center bg-[#1A1A1A] text-white">
        <Heart className="w-16 h-16 text-rose-600 mx-auto mb-12 animate-pulse" />
        <h4 className="text-3xl md:text-6xl font-black serif uppercase tracking-tighter mb-6">Respect For Life</h4>
        <p className="text-xs font-bold uppercase tracking-[0.8em] text-gray-500 italic">2024 Legislative Yuan Transitional Justice Archive</p>
      </section>
    </div>
  );
};

export default Guide2024;
