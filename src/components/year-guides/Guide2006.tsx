import React from 'react';
import { motion } from 'framer-motion';
import { Map, Compass, Shield, ArrowRight, Anchor, Users } from 'lucide-react';

const Guide2006 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#16a085] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Frontier</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-emerald-600 mb-12">New Frontiers / 轉型正義的新疆界</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            邊疆正義與<br/>「八年窗期」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#16a085] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 邊疆正義地圖 - 視覺化組件 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5">
           <Map className="w-[30rem] h-[30rem]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
          <div className="md:col-span-5 space-y-12">
            <div className="flex items-center space-x-4">
               <Anchor className="w-8 h-8 text-[#16a085]" />
               <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none tracking-tighter">The Islands<br/>of Silence</h4>
            </div>
            
            <div className="p-8 bg-emerald-50 border-l-8 border-[#16a085] space-y-4">
               <p className="text-xs font-black uppercase text-[#16a085]">Micro Nuance</p>
               <p className="text-lg serif font-black">首次承認離島受難者</p>
               <p className="text-sm text-gray-600">原始資料罕見出現針對「東沙、南沙」的描述，轉型正義終於延伸到偏遠軍事管制區。</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#F9F9F7] p-6 md:p-12 border-4 border-black relative min-h-[500px] flex flex-col justify-center items-center">
             <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="relative">
                <div className="w-64 h-64 border-4 border-dashed border-gray-300 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Compass className="w-24 h-24 text-gray-200" />
                </div>
                {/* 點亮東沙南沙 */}
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-10 left-10 p-4 bg-black text-white rounded-lg shadow-2xl">
                   <p className="text-[10px] font-black uppercase">Dongsha</p>
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-10 right-10 p-4 bg-[#16a085] text-white rounded-lg shadow-2xl">
                   <p className="text-[10px] font-black uppercase">Nansha</p>
                </motion.div>
             </motion.div>
             <p className="mt-12 text-xs font-black uppercase tracking-[0.5em] text-gray-400">Military Exclusion Zone / 曾經的權利真空</p>
          </div>
        </div>
      </section>

      {/* 八年窗期與感化教育 - 粗獷主義視覺 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black border-x-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#16a085] block mb-2">Time Expansion</span>
          <h4 className="text-4xl md:text-7xl font-black serif uppercase leading-none tracking-tighter underline decoration-[#16a085] decoration-8 underline-offset-8">8 Years</h4>
          <p className="text-xl serif text-gray-400 italic leading-relaxed">
            「邊疆地區資訊傳達更慢，必須給予長達八年的申請窗期，避免再次遺漏受難者。」
          </p>
          <div className="h-1 w-24 bg-[#16a085]"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <div className="space-y-6">
            <h5 className="text-3xl font-black serif uppercase">感化教育納入</h5>
            <p className="text-lg serif text-gray-600 leading-loose">
              2006 年修法特別強調了感化教育受難者長期被遺忘的事實，不僅是離島，連同「思想矯正」的受害者也獲得法律地位。
            </p>
          </div>
          <div className="pt-8 flex flex-wrap gap-4 border-t border-gray-100">
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#東沙南沙保衛者</span>
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#思想矯正補償</span>
          </div>
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <Users className="w-12 h-12 opacity-20" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">No Corner Left Behind.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2006 Frontier & Education Compensation Archive</p>
      </section>
    </div>
  );
};

export default Guide2006;
