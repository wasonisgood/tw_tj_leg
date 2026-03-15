import React from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Heart, Quote, CloudRain } from 'lucide-react';

const Guide1997 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const dialogue = summaryData?.dialogue_flow?.segments?.[0];

  const wordCloud = [
    { text: "十五年", size: "text-4xl md:text-7xl", opacity: "opacity-100" },
    { text: "埋葬青春", size: "text-2xl md:text-5xl", opacity: "opacity-80" },
    { text: "下營鄉長", size: "text-3xl md:text-6xl", opacity: "opacity-90" },
    { text: "名譽恢復", size: "text-4xl", opacity: "opacity-70" },
    { text: "真相重於形式", size: "text-2xl md:text-5xl", opacity: "opacity-85" },
    { text: "時代意義", size: "text-3xl", opacity: "opacity-60" },
    { text: "身分認同", size: "text-4xl", opacity: "opacity-75" },
  ];

  return (
    <div className="space-y-40 pb-40 selection:bg-rose-100 selection:text-black">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Identity</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-gray-500 mb-12">Identity & Healing / 認同與撫慰</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            家屬告白與<br/>「恢復證書」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#8C2F39] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 家屬告白文字雲 - 藝術排版 */}
      <section className="py-20 bg-white border-y-4 border-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <CloudRain className="w-full h-full" />
        </div>
        <div className="max-w-6xl mx-auto px-8 space-y-12">
          <h4 className="text-sm font-black uppercase tracking-[0.5em] text-gray-400 text-center">Emotional Word Cloud / 家屬自白高頻詞</h4>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 py-20">
            {wordCloud.map((wc, i) => (
              <motion.span 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${wc.size} ${wc.opacity} font-black serif italic hover:text-[#8C2F39] transition-colors cursor-default`}
              >
                {wc.text}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* 名譽恢復的法理爭議 - 二分法佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-black">
        <div className="p-6 md:p-20 bg-[#1A1A1A] text-white space-y-8 border-r-4 border-black">
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-[#8C2F39]" />
            <h4 className="text-3xl font-black serif uppercase">形式的平反</h4>
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Government: 基金會</span>
            <p className="text-2xl font-black serif text-gray-300 italic leading-relaxed">
              「透過發放證書完成象徵性的平反程序。」
            </p>
            <div className="h-1 w-12 bg-gray-700"></div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Stance: 行政確認</p>
          </div>
        </div>
        
        <div className="p-6 md:p-20 bg-white text-black space-y-8">
          <div className="flex items-center space-x-4 text-[#8C2F39]">
            <User className="w-8 h-8" />
            <h4 className="text-3xl font-black serif uppercase">實質的身分</h4>
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Opposition: 姜委員及家屬</span>
            <p className="text-2xl font-black serif text-[#1A1A1A] leading-relaxed underline decoration-[#8C2F39] decoration-4 underline-offset-8">
              「如果不知道誰殺了父親，這張紙只是另一種形式的掩蓋。」
            </p>
            <div className="h-1 w-12 bg-[#8C2F39]"></div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Stance: 真相重於形式</p>
          </div>
        </div>
      </section>

      {/* 微觀分析 - 姜委員自白 */}
      <section className="max-w-4xl mx-auto bg-[#F9F9F7] p-6 md:p-16 border-l-[8px] md:border-l-[16px] border-black shadow-2xl relative">
        <Quote className="absolute -top-8 -left-8 w-20 h-20 text-black opacity-10" />
        <div className="space-y-8 relative z-10">
          <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8C2F39]">Micro Nuance / 家族史的殿堂爆發</h5>
          <p className="text-3xl font-black serif italic leading-tight">
            「我爸爸原本是台南縣下營鄉鄉長...我一出生就沒看過他。證書在林委員手中完成，這具備時代意義。」
          </p>
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 leading-relaxed">
              這是 1997 年轉型正義中「受難者二代」在立法院內最直接的情感爆發。不僅僅是條文，原始資料顯示大量具體的家族史已進入國家敘事。
            </p>
          </div>
        </div>
      </section>

      {/* 結幕 - 情感共鳴 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <Heart className="w-12 h-12 text-[#8C2F39]" />
        <h4 className="text-4xl font-black serif italic">「看見受難者，是正義的第一步」</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">1997 Archive of Witnesses</p>
      </section>
    </div>
  );
};

export default Guide1997;
