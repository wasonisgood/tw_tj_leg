import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, DoorClosed, ArrowRight, Users, History, AlertCircle } from 'lucide-react';

const Guide2001 = ({ intelligence, summaryData }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const clash = summaryData?.clash_points?.[0];

  useEffect(() => {
    const timer = setInterval(() => setIsOpen(prev => !prev), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-40 pb-40 selection:bg-[#e67e22] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Extend</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#27ae60] mb-12">Temporal Extension / 補償期限的延續</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            法律空白與<br/>「再延長」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#e67e22] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 申請窗口開關 - 互動動畫 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center">
          <div className="md:col-span-5 space-y-12">
            <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-[0.9] tracking-tighter text-[#e67e22]">Window of<br/>Justice</h4>
            
            <div className="flex items-center space-x-4 p-6 bg-orange-50 border-l-4 border-[#e67e22]">
               <AlertCircle className="text-[#e67e22] w-6 h-6" />
               <p className="text-sm font-bold text-gray-700">既有期限已屆滿，歷史創傷癒合慢於行政規定。</p>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-center justify-center space-y-12 py-20 bg-gray-50 border-4 border-dashed border-gray-200 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={isOpen ? 'open' : 'closed'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center space-y-8"
              >
                {isOpen ? (
                  <>
                    <DoorOpen className="w-48 h-48 text-[#e67e22]" />
                    <span className="text-4xl font-black serif uppercase tracking-widest text-[#e67e22]">Window Open</span>
                    <p className="text-xs font-black uppercase text-gray-400">2001-2003 Extension Phase</p>
                  </>
                ) : (
                  <>
                    <DoorClosed className="w-48 h-48 text-gray-300" />
                    <span className="text-4xl font-black serif uppercase tracking-widest text-gray-300">Window Closed</span>
                    <p className="text-xs font-black uppercase text-gray-400">Legal Vacuum Period</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 跨黨派合作 - 不對稱佈局 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <div className="flex items-center space-x-4">
            <Users className="w-10 h-10 text-orange-400" />
            <h4 className="text-4xl font-black serif uppercase">跨黨派共識</h4>
          </div>
          <p className="text-2xl serif italic leading-relaxed text-gray-400">
            「許添財與朱立倫聯名提案，顯示二二八補償已成為國家層級的義務，脫離單一政黨色彩。」
          </p>
          <div className="h-1 w-24 bg-orange-400"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legislative Logic</span>
          <h4 className="text-4xl font-black serif uppercase leading-tight underline decoration-[#e67e22] decoration-8 underline-offset-8">撫平歷史傷痕</h4>
          <p className="text-lg serif text-gray-600 leading-loose">
            仍有受難者因旅居海外、恐懼或資訊不足未及申請。轉型正義不應因行政便利而設限。
          </p>
          <div className="pt-8 flex flex-wrap gap-4 border-t border-gray-100">
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#保障受難權益</span>
             <span className="px-4 py-2 bg-gray-100 text-[10px] font-black uppercase">#族群融合</span>
          </div>
        </div>
      </section>

      {/* 歷史微觀分析 */}
      <section className="py-20 flex flex-col items-center space-y-12">
        <History className="w-16 h-16 opacity-20 animate-pulse" />
        <h4 className="text-[15vw] md:text-[12vw] font-black serif leading-none uppercase tracking-tighter text-gray-100">Healing</h4>
        <p className="max-w-2xl text-center text-xl serif leading-relaxed text-gray-500 italic -mt-10 relative z-10">
          「2001 年的立法紀錄反映了國家對『癒合速度』的重新認知：法律期限是死的，但受難者的傷痛是活的。」
        </p>
      </section>
    </div>
  );
};

export default Guide2001;
