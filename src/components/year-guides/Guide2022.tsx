import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, FileText, AlertTriangle, Home, Briefcase, Eye, ShieldCheck, ClipboardList } from 'lucide-react';

const Guide2022 = ({ intelligence, summaryData }: any) => {
  const clashPoints = summaryData?.clash_points || [];
  const keywordWar = summaryData?.keyword_war?.entries || [];
  const hiddenTruths = summaryData?.historical_micro_analysis?.hidden_truths;

  return (
    <div className="space-y-40 pb-40 selection:bg-[#c0392b] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none text-[#c0392b]"> Pivot </h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#c0392b] mb-12">Institutional Turn / 轉型正義的制度轉身</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            國家不法與<br/>「七折八扣」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#c0392b] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 沒收財產清冊預覽 - 視覺化 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <div className="flex items-center space-x-4">
               <ClipboardList className="w-12 h-12 text-[#c0392b]" />
               <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-none tracking-tighter">Asset<br/>Inventory</h4>
            </div>
            
            <div className="p-8 bg-rose-50 border-l-8 border-[#c0392b] space-y-4">
               <p className="text-xs font-black uppercase text-[#c0392b]">曾銘宗提案要求</p>
               <p className="text-lg font-black serif">將全台沒收土地清冊（包含管理者、是否閒置）全數上網，逐月更新。</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-gray-50 border-4 border-black p-6 md:p-12 space-y-8 relative">
             <div className="bg-white border-2 border-black p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                   <span className="text-[10px] font-black uppercase">Property Registry Preview</span>
                   <span className="text-[10px] font-black text-rose-600 uppercase animate-pulse">Live Update</span>
                </div>
                <div className="space-y-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex justify-between items-center text-xs serif border-b border-gray-100 py-2">
                        <div className="space-y-1">
                           <p className="font-black text-black">案號：TK-1952-00{i}</p>
                           <p className="text-gray-400">土地標示：台北市大安區...</p>
                        </div>
                        <span className={`px-2 py-1 text-[8px] font-black uppercase ${i===1 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                           {i===1 ? '可返還 (閒置)' : '價金補償 (已轉公用)'}
                        </span>
                     </div>
                   ))}
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">透明化是全民監督行政黑箱的唯一手段</p>
          </div>
        </div>
      </section>

      {/* 七折八扣之戰 - 衝突佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black border-x-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12 border-r-4 border-black">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#c0392b] block mb-2">Legislative Milestone</span>
          <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none text-emerald-500">國家不法</h4>
          <p className="text-2xl serif text-gray-300 italic leading-relaxed">
            「2022 年正式確立『國家不法行為』概念，將過去的補償升格為具法律強制性的回復。」
          </p>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 flex flex-col justify-center">
          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block mb-2">Critical Voice: 賴品妤</span>
            <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none tracking-tighter">七折八扣</h4>
            <p className="text-xl serif text-gray-600 italic leading-relaxed">
              「我必須很直接的說，這是七折八扣後的破碎條文，我投下了棄權。」——反映了正義品質的落差。
            </p>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-4">
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#資訊透明</span>
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#趕進度立法</span>
          </div>
        </div>
      </section>

      {/* 微觀分析 - 權力空窗期 */}
      <section className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
           {hiddenTruths?.map((ht: any, i: number) => (
             <div key={i} className={`p-6 md:p-16 border-4 border-black group transition-all hover:bg-[#c0392b] hover:text-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="flex justify-between items-start mb-8">
                   <ShieldCheck className="w-12 h-12" />
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
        <Landmark className="w-12 h-12 opacity-20" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center text-[#c0392b]">Restoring Rights, Defining Crimes.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2022 Victim Rights Restoration Breakthrough</p>
      </section>
    </div>
  );
};

export default Guide2022;
