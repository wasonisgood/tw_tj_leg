import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, EyeOff, Users, ArrowRight, Ghost } from 'lucide-react';

const Guide1992 = ({ intelligence, summaryData, data }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const dialogue = summaryData?.dialogue_flow?.segments?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#8e44ad] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Truth</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#8e44ad] mb-12">Historical Silence / 從沈默到討公道</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter">
            官方黑箱與<br/>「冤魂一大堆」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#8e44ad] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice || "1992 年是台灣從沈默轉向討公道的元年。"}」
          </p>
        </div>
      </section>

      {/* 數據黑箱對比 - 粗獷主義視覺 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black">
        <div className="md:col-span-5 p-6 md:p-16 bg-white border-r-4 border-black space-y-12">
          <div className="flex items-center space-x-4">
            <EyeOff className="w-8 h-8 text-gray-400" />
            <h4 className="text-3xl font-black serif uppercase">數據保守化</h4>
          </div>
          <div className="space-y-8">
            <div className="group">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Government: 內政部戶政司</span>
              <p className="text-3xl md:text-6xl font-black serif leading-tight">數十人</p>
              <p className="mt-4 text-sm font-bold text-gray-500 italic">「以正式戶籍資料為準，試圖縮小補償規模與政治衝擊。」</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-7 p-6 md:p-16 bg-[#1A1A1A] text-white space-y-12 relative overflow-hidden">
          <Ghost className="absolute -right-20 -bottom-20 w-96 h-96 opacity-5 rotate-12" />
          <div className="relative z-10 space-y-12 text-right">
            <h4 className="text-3xl font-black serif uppercase text-[#8e44ad] italic">全面調查的主張</h4>
            <div className="space-y-8">
              <div className="group">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8e44ad] block mb-2">Opposition: 葉菊蘭及家屬</span>
                <p className="text-4xl md:text-7xl font-black serif leading-[0.9] text-white underline decoration-[#8e44ad] underline-offset-8">數千人+</p>
                <p className="mt-6 text-xl serif text-gray-400 italic leading-relaxed ml-auto max-w-lg">「冤魂一大堆而得不到補償...這不是買賣，是尊嚴。」</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 歷史張力描述 */}
      <section className="max-w-4xl mx-auto text-center space-y-12">
        <Users className="w-16 h-16 mx-auto text-[#8e44ad]" />
        <h4 className="text-4xl font-black serif leading-tight">「五年前街頭被包圍，<br/>今日在殿堂討論」</h4>
        <div className="h-1 w-24 bg-black mx-auto"></div>
        <p className="text-xl serif text-gray-600 leading-relaxed italic">
          葉菊蘭在發言中揭示了強烈的時空歷史張力，標誌著二二八不再是禁忌，轉而進入法制化的初步攻防。
        </p>
      </section>

      {/* 權重分析 - 雜誌排版 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center border-t border-gray-200 pt-20">
        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-[0.5em] text-gray-400">Rhetoric Weight / 權重分析</h4>
          <h5 className="text-3xl md:text-6xl font-black serif uppercase tracking-tighter leading-none text-[#2c3e50]">真相 vs. 撫慰</h5>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase"><span>真相調查需求</span><span>High</span></div>
              <div className="h-2 bg-black w-full"></div>
            </div>
            <div className="space-y-2 opacity-30">
              <div className="flex justify-between text-[10px] font-black uppercase"><span>金錢補償細節</span><span>Low</span></div>
              <div className="h-2 bg-black w-1/3"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 md:p-12 shadow-2xl border-2 border-black italic serif text-lg text-gray-700 leading-loose">
          「1992 年的立法氛圍顯示，家屬對於『真相』的渴望遠高於具體的『賠償金額』。政府試圖利用官僚程序與數據門檻進行軟抵抗。」
        </div>
      </section>
    </div>
  );
};

export default Guide1992;
