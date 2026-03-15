import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, Sword, Zap, Lock } from 'lucide-react';

const Guide1987 = ({ intelligence, summaryData, session }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const keyword = summaryData?.keyword_war?.entries?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-rose-700 selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-10 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Conflict</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#c0392b] mb-12">Historical Perspective / 權力拉鋸</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter">
            戒嚴的<br/>「內化」與「斷層」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#c0392b] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice || "1987 年是權力移轉的拉鋸戰。"}」
          </p>
        </div>
      </section>

      {/* 第九條法理戰爭 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black">
        <div className="md:col-span-5 p-6 md:p-16 bg-white border-r-4 border-black space-y-12">
          <div className="flex items-center space-x-4">
            <Lock className="w-8 h-8 text-[#c0392b]" />
            <h4 className="text-3xl font-black serif uppercase">第九條封鎖線</h4>
          </div>
          <p className="text-xl serif leading-relaxed text-gray-600">
            行政院試圖用國安法將戒嚴體制內化為常態法律，特別是第九條對救濟權的封鎖，是當時最大的法律爭議。
          </p>
          <div className="space-y-8 pt-12">
            <div className="group">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#c0392b] block mb-2">Government Stance</span>
              <p className="text-2xl font-black serif leading-tight underline decoration-4 underline-offset-8 group-hover:text-[#c0392b] transition-colors">{clash?.actors?.government?.label}</p>
              <p className="mt-4 text-sm font-bold text-gray-500 italic">「{clash?.actors?.government?.logic}」</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-7 p-6 md:p-16 bg-black text-white space-y-12 relative overflow-hidden">
          <Sword className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 rotate-12" />
          <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-start">
              <h4 className="text-3xl font-black serif uppercase text-emerald-500 italic">還權於民的對抗</h4>
              <span className="text-[10px] font-black uppercase tracking-widest border border-white/30 px-4 py-2">Clash Index: 1.0</span>
            </div>
            <div className="space-y-8">
              <div className="group">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-2">Opposition Stance</span>
                <p className="text-4xl font-black serif leading-[0.9] group-hover:text-emerald-400 transition-colors">{clash?.actors?.opposition?.label}</p>
                <p className="mt-6 text-xl serif text-gray-400 italic leading-relaxed">「{clash?.actors?.opposition?.logic}」</p>
              </div>
            </div>
            <div className="pt-12 border-t border-white/10">
               <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Core Keywords</p>
               <div className="flex flex-wrap gap-4">
                  {clash?.actors?.opposition?.keyword_focus.split('、').map((k:string, i:number) => (
                    <span key={i} className="text-sm font-black italic border-b-2 border-emerald-500 pb-1">#{k}</span>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 關鍵字戰爭 - 雜誌排版 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
        <div className="md:col-span-4">
          <div className="space-y-6">
            <Zap className="w-12 h-12 text-amber-500" />
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-none tracking-tighter">Keyword<br/>Warfare</h4>
            <div className="h-1 w-24 bg-black"></div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
              1987 年的立法院不只是法理的對撞，更是字詞定義權的奪取與再定義。
            </p>
          </div>
        </div>
        <div className="md:col-span-8 bg-[#1A1A1A] p-6 md:p-20 text-white transform md:translate-x-10 shadow-[-40px_40px_0px_0px_rgba(192,57,43,1)]">
          <h5 className="text-[12vw] md:text-[10vw] font-black serif opacity-10 absolute top-0 left-0 leading-none">RHETORIC</h5>
          <div className="relative z-10 space-y-12">
            <h6 className="text-2xl md:text-5xl font-black serif text-rose-600">「{keyword?.term}」</h6>
            <div className="flex items-center space-x-12 text-2xl font-black serif italic">
              <span className="text-gray-500 line-through">{keyword?.from}</span>
              <ArrowRight className="w-10 h-10 text-rose-600" />
              <span className="text-white underline decoration-rose-600 decoration-8 underline-offset-[12px]">{keyword?.to}</span>
            </div>
            <p className="text-xl serif text-gray-400 leading-relaxed max-w-2xl pt-8 border-t border-white/10">
              {keyword?.shift}
            </p>
          </div>
        </div>
      </section>

      {/* 恐懼數據 - 粗獷主義視覺 */}
      <section className="py-32 space-y-20">
        <div className="text-center space-y-4">
          <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400">Administrative Fear Data</h4>
          <h3 className="text-4xl md:text-7xl font-black serif uppercase">行政焦慮視覺化</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          <div className="p-6 md:p-12 border-[8px] border-black bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-xl font-black serif">預估上訴案件量</span>
              <span className="text-4xl md:text-8xl font-black serif leading-none">3000+</span>
            </div>
            <div className="h-12 bg-gray-100 border-4 border-black relative overflow-hidden">
              <motion.div initial={{width:0}} animate={{width:'90%'}} transition={{duration:2}} className="h-full bg-[#c0392b]" />
            </div>
            <p className="text-sm font-bold text-gray-500 italic">恐懼數據反映了 1987 年官員對「司法癱瘓」的極度不安。</p>
          </div>

          <div className="p-6 md:p-12 border-[8px] border-black bg-white shadow-[20px_20px_0px_0px_rgba(192,57,43,1)] space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-xl font-black serif">司法體系排拒感</span>
              <span className="text-4xl md:text-8xl font-black serif leading-none">95%</span>
            </div>
            <div className="h-12 bg-gray-100 border-4 border-black relative overflow-hidden">
              <motion.div initial={{width:0}} animate={{width:'95%'}} transition={{duration:2, delay:0.5}} className="h-full bg-black" />
            </div>
            <p className="text-sm font-bold text-gray-500 italic">法律安定性成為當時維持戒嚴遺緒最完美的擋箭牌。</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide1987;
