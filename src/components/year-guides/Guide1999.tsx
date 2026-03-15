import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, FileText, AlertTriangle, Home, Briefcase } from 'lucide-react';

const Guide1999 = ({ intelligence, summaryData }: any) => {
  const clash = summaryData?.clash_points?.[0];
  const dialogue = summaryData?.dialogue_flow?.segments?.[0];
  const hiddenTruths = summaryData?.historical_micro_analysis?.hidden_truths;

  return (
    <div className="space-y-40 pb-40 selection:bg-[#2980b9] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Assets</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#2c3e50] mb-12">Property & Recovery / 財產權的奪回</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            沒收財產與<br/>「不當得利」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#2980b9] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 具體案件字號高亮 - 視覺震撼排版 */}
      <section className="bg-white border-y-[12px] border-black py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-8">
            <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none tracking-tighter underline decoration-[#2980b9] decoration-8">四十年度判字<br/>第 562 號</h4>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Case File Highlight / 原始文本高亮</p>
            
          </div>
          <div className="md:col-span-7 bg-gray-50 p-6 md:p-12 border-2 border-dashed border-gray-300 space-y-8">
             <div className="flex items-start space-x-4">
                <AlertTriangle className="text-[#c0392b] w-8 h-8 shrink-0 mt-1" />
                <div className="space-y-4">
                   <h5 className="text-2xl font-black serif text-[#1A1A1A]">荒謬的定罪邏輯</h5>
                   <p className="text-lg serif text-gray-600 leading-loose italic">
                     「細玩語氣充分反映悲觀心理」即可定罪。軍法官以此為由維持原判，並沒收全部財產。
                   </p>
                </div>
             </div>
             <div className="pt-8 border-t border-gray-200">
                <p className="text-sm font-bold text-[#2980b9] uppercase tracking-widest">沈富雄委員回擊：</p>
                <p className="text-2xl font-black serif leading-tight mt-4 italic">「政府不能一邊說要平反，一邊又抱著人家被搶走的土地不放。」</p>
             </div>
          </div>
        </div>
      </section>

      {/* 財產沒收之戰 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-x-4 border-black border-b-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2980b9] block mb-2">Government Stance</span>
          <h4 className="text-4xl font-black serif uppercase leading-none">程序已終結</h4>
          <p className="text-xl serif text-gray-400 leading-relaxed italic">「財產已併入國庫，全面返還將引發法律秩序大動盪。」</p>
          <div className="space-y-4 opacity-50">
             <div className="h-1 bg-white w-full"></div>
             <div className="h-1 bg-white w-2/3"></div>
          </div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">Opposition Stance</span>
          <h4 className="text-4xl font-black serif uppercase leading-none underline decoration-[#2980b9] decoration-8">原物返還</h4>
          <p className="text-xl serif text-[#1A1A1A] leading-relaxed italic">「國家非法剝奪私人財產，不能以程序完成為由據為己有。」</p>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#2980b9]">Focus: 憲法絕對保護、惡法無效</p>
        </div>
      </section>

      {/* 微觀分析 - 檔案控制與生活費 */}
      <section className="py-20 max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
           {hiddenTruths?.map((ht: any, i: number) => (
             <div key={i} className="p-6 md:p-12 border-4 border-black group hover:bg-black hover:text-white transition-all">
                <div className="flex justify-between items-start mb-8">
                   {i === 0 ? <FileText className="w-12 h-12 text-[#2980b9]" /> : <Home className="w-12 h-12 text-[#2980b9]" />}
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
        <div className="flex space-x-2">
           <div className="w-4 h-4 bg-black rounded-full"></div>
           <div className="w-4 h-4 bg-[#2980b9] rounded-full animate-bounce"></div>
           <div className="w-4 h-4 bg-black rounded-full"></div>
        </div>
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase">Justice is not for sale.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">1999 Property Restoration Archive</p>
      </section>
    </div>
  );
};

export default Guide1999;
