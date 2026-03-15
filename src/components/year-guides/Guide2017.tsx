import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Sword, Users, ArrowRight, Lock, Eye } from 'lucide-react';

const Guide2017 = ({ intelligence, summaryData }: any) => {
  const clashPoints = summaryData?.clash_points || [];
  const expertDebates = summaryData?.expert_debates?.[0];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#8e44ad] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none text-[#8e44ad]"> 실作 </h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#8e44ad] mb-12">Action Year / 從空談轉向實作的元年</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            破解壟斷與<br/>「常識判斷」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#8e44ad] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 解降密權限之爭 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black shadow-2xl">
        <div className="md:col-span-5 p-6 md:p-16 bg-white border-r-4 border-black space-y-12">
          <div className="flex items-center space-x-4">
            <Lock className="w-8 h-8 text-[#2c3e50]" />
            <h4 className="text-3xl font-black serif uppercase">原機關遮羞布</h4>
          </div>
          <p className="text-xl serif leading-relaxed text-gray-600">
            「解降密許可權留在原機關，在真相揭露上確實有窒礙難行之處。」這是對官僚體系『軟抵抗』的直接指控。
          </p>
          <div className="space-y-8 pt-12">
            <div className="group">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50] block mb-2">Bureaucratic Logic</span>
              <p className="text-2xl font-black serif leading-tight underline decoration-4 underline-offset-8">國家安全連續性</p>
              <p className="mt-4 text-sm font-bold text-gray-500 italic">部分檔案涉及現行情報佈建，輕易解密將導致國安危機。</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-7 p-6 md:p-16 bg-black text-white space-y-12 relative overflow-hidden">
          <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -right-20 -bottom-20 opacity-5">
             <Eye className="w-96 h-96" />
          </motion.div>
          <div className="relative z-10 space-y-12 text-right">
            <h4 className="text-3xl font-black serif uppercase text-[#8e44ad] italic">真相強制移轉</h4>
            <div className="space-y-8">
              <div className="group">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8e44ad] block mb-2">Reform Advocates</span>
                <p className="text-2xl md:text-5xl font-black serif leading-[0.9] text-white">強制移轉權限</p>
                <p className="mt-6 text-xl serif text-gray-400 italic leading-relaxed ml-auto max-w-lg">「若解密權仍由保密機關掌控，真相將被鎖死在保險箱中。」</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 加害者 vs 受難者 光譜區辨 */}
      <section className="bg-gray-50 p-6 md:p-20 border-4 border-black relative">
        <h4 className="text-sm font-black uppercase tracking-[0.5em] text-gray-400 mb-16 text-center">Identity Spectrum / 加害者與受難者的區辨</h4>
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto">
           <div className="text-center space-y-4 flex-1">
              <span className="text-[10px] font-black uppercase text-gray-400">鎮壓者</span>
              <p className="text-4xl font-black serif">彭孟緝</p>
           </div>
           <div className="flex-grow flex items-center space-x-4 px-8 opacity-20">
              <div className="h-[2px] bg-black flex-grow"></div>
              <Sword className="w-8 h-8 rotate-45" />
              <div className="h-[2px] bg-black flex-grow"></div>
           </div>
           <div className="text-center space-y-4 flex-1">
              <span className="text-[10px] font-black uppercase text-[#8e44ad]">受難者</span>
              <p className="text-4xl font-black serif">陳澄波</p>
           </div>
        </div>
        <p className="mt-16 text-center text-2xl font-black serif italic text-gray-800">「難道無法區別彭孟緝與陳澄波嗎？」</p>
        <p className="mt-4 text-center text-sm text-gray-500 uppercase tracking-widest">反擊試圖模糊化歷史責任的清談式討論</p>
      </section>

      {/* 專家辯論 & 歷史微觀 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
        <div className="p-6 md:p-12 border-l-[12px] border-[#8e44ad] bg-white shadow-xl space-y-8">
           <div className="flex items-center space-x-3">
              <Users className="text-[#8e44ad] w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Expert Testimony / 周教授觀點</span>
           </div>
           <p className="text-2xl font-black serif leading-tight italic">「{expertDebates?.vivid_quote}」</p>
           <p className="text-sm text-gray-600 leading-relaxed serif border-t border-gray-100 pt-6">強烈建議立法院從法律位階修改，否則真相將永遠無法大白。</p>
        </div>
        <div className="p-6 md:p-12 bg-black text-white space-y-8 relative overflow-hidden">
           <ShieldAlert className="absolute -right-10 -top-10 w-48 h-48 opacity-10" />
           <h5 className="text-[10px] font-black uppercase tracking-widest text-[#8e44ad] mb-4">Privacy vs. Disclosure</h5>
           <p className="text-lg serif italic leading-relaxed text-gray-300">
             「不是毫無區別的將歷史狀態當成檔案申請時需要保護隱私的狀態。」——針對威權檔案不公開藉口的強烈法理回應。
           </p>
        </div>
      </section>
    </div>
  );
};

export default Guide2017;
