import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldX, UserX, ArrowRight, Ghost, Scale } from 'lucide-react';

const Guide1998 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const keyword = summaryData?.keyword_war?.entries?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-black selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Stigma</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#8e44ad] mb-12">The Shadow of Silence / 沈默的陰影</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            從二二八到<br/>「白色恐怖」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#c0392b] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 匪諜標籤挑戰 - 互動排版 */}
      <section className="bg-[#1A1A1A] text-white p-6 md:p-20 border-[10px] border-black shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5">
           <ShieldX className="w-96 h-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
          <div className="md:col-span-5 space-y-8">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-tight tracking-tighter italic text-[#c0392b]">挑戰「匪諜」<br/>標籤</h4>
            
            <div className="p-8 bg-white/5 border-l-4 border-white italic serif text-gray-300">
               <p className="text-xs font-black uppercase mb-4 opacity-50">Case Study: 辜濂松母親案</p>
               「她像個共產黨員嗎？她只是一個典型的主婦。」這展現了對當年審判極度荒謬性的諷刺。
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 border-2 border-white/20 hover:border-[#c0392b] transition-all group">
                  <span className="block text-[10px] font-black uppercase text-gray-500 mb-2 italic">Official Label</span>
                  <h5 className="text-4xl font-black serif text-[#c0392b] mb-6 tracking-tighter group-hover:scale-110 transition-transform">叛亂/匪諜</h5>
                  <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">依據《懲治叛亂條例》第二條第一項，處死刑並沒收全部財產。</p>
               </div>
               <div className="p-10 border-2 border-white/20 hover:border-emerald-500 transition-all group">
                  <span className="block text-[10px] font-black uppercase text-gray-500 mb-2 italic">True Identity</span>
                  <h5 className="text-4xl font-black serif text-emerald-500 mb-6 tracking-tighter group-hover:scale-110 transition-transform">典型主婦/學生</h5>
                  <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">多數僅為政治鬥爭犠牲品或思想犯，並無任何實際破壞行為。</p>
               </div>
            </div>
            <div className="bg-[#c0392b]/20 p-8 border border-[#c0392b] text-center">
               <p className="text-xl font-black serif italic">1998 年開始，國家正式承認整個戒嚴時期的審判體系存在系統性錯誤。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 排除條款的死鬥 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 border-y-4 border-black">
        <div className="p-6 md:p-20 bg-white border-r-4 border-black flex flex-col justify-center space-y-12">
          <div className="space-y-6 text-right">
            <h4 className="text-sm font-black uppercase tracking-widest text-[#c0392b]">Government: 國防部</h4>
            <h5 className="text-2xl md:text-5xl font-black serif leading-tight">誰是「真匪諜」？</h5>
            <p className="text-xl serif text-gray-600 leading-relaxed italic border-r-8 border-[#c0392b] pr-8">
              「絕對不能補償真正的共產黨員，否則違背國家忠誠。」
            </p>
          </div>
        </div>
        <div className="p-6 md:p-20 bg-white flex flex-col justify-center space-y-12">
          <div className="space-y-6 text-left">
            <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600">Opposition: 黃天福、謝聰敏</h4>
            <h5 className="text-2xl md:text-5xl font-black serif leading-tight underline decoration-black decoration-8 underline-offset-8">全面平反</h5>
            <p className="text-xl serif text-gray-600 leading-relaxed italic border-l-8 border-emerald-600 pl-8">
              「當年的審判紀錄多為屈打成招，不應以自白書作為排除依據。」
            </p>
          </div>
        </div>
      </section>

      {/* 關鍵字進化 */}
      <section className="max-w-4xl mx-auto py-20">
        <div className="text-center space-y-8">
          <Ghost className="w-16 h-16 mx-auto opacity-20" />
          <h4 className="text-sm font-black uppercase tracking-[1em] text-gray-400">Terminological Evolution</h4>
          <div className="bg-[#F9F9F7] p-6 md:p-16 border-2 border-black relative">
             <div className="flex flex-col md:flex-row items-center justify-around gap-12">
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase text-gray-400">Old Myth</span>
                   <p className="text-2xl md:text-5xl font-black serif opacity-20">國家之敵</p>
                </div>
                <ArrowRight className="w-12 h-12 text-[#c0392b]" />
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase text-[#c0392b]">1998 View</span>
                   <p className="text-3xl md:text-6xl font-black serif">「匪諜」</p>
                </div>
                <ArrowRight className="w-12 h-12 text-[#c0392b]" />
                <div className="text-center">
                   <span className="text-[10px] font-black uppercase text-emerald-600">Final Truth</span>
                   <p className="text-2xl md:text-5xl font-black serif">冤案主體</p>
                </div>
             </div>
             <p className="mt-16 text-sm serif text-gray-500 italic leading-loose border-t border-gray-200 pt-8">
                {keyword?.shift}
             </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide1998;
