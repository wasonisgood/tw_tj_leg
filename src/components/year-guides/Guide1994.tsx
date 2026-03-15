import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Unlock, FileX, ArrowRight, Gavel, Briefcase } from 'lucide-react';

const Guide1994 = ({ intelligence, summaryData }: any) => {
  const [isRestored, setIsRestored] = useState(false);
  const keywordWar = summaryData?.keyword_war?.entries;

  return (
    <div className="space-y-40 pb-40 selection:bg-[#f1c40f] selection:text-black">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none">Return</h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl text-left">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#e74c3c] mb-12">Justice Returned / 正義歸位</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            惡法清理與<br/>「複權」之路
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#2980b9] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 權利狀態切換 - 互動組件 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-md space-y-6">
            <h4 className="text-2xl md:text-5xl font-black serif leading-none uppercase">Status<br/>Simulator</h4>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs border-t border-gray-100 pt-6">
              點擊開關模擬 1994 年修正案對政治犯「法律身分」的重構。
            </p>
            <button 
              onClick={() => setIsRestored(!isRestored)}
              className={`flex items-center space-x-4 px-8 py-4 border-4 border-black font-black uppercase tracking-widest transition-all ${isRestored ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-700'}`}
            >
              <RefreshCw className={`w-6 h-6 ${isRestored ? 'rotate-180' : ''} transition-transform duration-700`} />
              <span>{isRestored ? '已完全複權 Restored' : '法律剝奪中 Deprived'}</span>
            </button>
          </div>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`p-8 border-2 transition-all ${!isRestored ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100 opacity-30'}`}>
              <FileX className="w-8 h-8 text-rose-600 mb-4" />
              <h5 className="text-xl font-black serif mb-4 uppercase text-rose-700">被剝奪資格</h5>
              <ul className="text-sm font-bold text-gray-500 space-y-2 uppercase tracking-tighter">
                <li>• 律師/會計師執業禁令</li>
                <li>• 任職公務員消極資格</li>
                <li>• 從刑財產沒收</li>
              </ul>
            </div>
            <div className={`p-8 border-2 transition-all ${isRestored ? 'bg-emerald-50 border-emerald-200 shadow-xl scale-105' : 'bg-gray-50 border-gray-100 opacity-30'}`}>
              <Unlock className="w-8 h-8 text-emerald-600 mb-4" />
              <h5 className="text-xl font-black serif mb-4 uppercase text-emerald-700">憲法權利歸還</h5>
              <ul className="text-sm font-bold text-gray-800 space-y-2 uppercase tracking-tighter">
                <li>• 消除政治身分歧視</li>
                <li>• 恢復專業服務權</li>
                <li>• 財產權追索依據</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 詞彙戰爭 - 1994 版 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start">
        <div className="md:col-span-4 bg-[#1A1A1A] p-6 md:p-12 text-white space-y-8">
          <Gavel className="w-12 h-12 text-[#f1c40f]" />
          <h4 className="text-2xl md:text-5xl font-black serif leading-none uppercase italic">惡法的<br/>終結者</h4>
          <p className="text-gray-400 serif text-lg leading-relaxed">
            原始文本顯示，1994 年委員對「惡法」一詞的使用頻率劇增，試圖在法理上徹底否定威權時期的審判效力。
          </p>
        </div>
        <div className="md:col-span-8 space-y-12">
          {keywordWar?.map((kw: any, i: number) => (
            <div key={i} className="group p-6 md:p-12 border-b-4 border-black hover:bg-gray-50 transition-all">
              <div className="flex justify-between items-center mb-8">
                <h5 className="text-4xl font-black serif">「{kw.term}」</h5>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#2980b9] text-white">Impact: {kw.impact_score}</span>
              </div>
              <div className="flex items-center space-x-8 text-xl font-black serif italic mb-6">
                <span className="text-gray-300 line-through">{kw.from}</span>
                <ArrowRight className="w-8 h-8 text-[#2980b9]" />
                <span className="text-black">{kw.to}</span>
              </div>
              <p className="text-gray-600 serif italic leading-relaxed pt-4 border-t border-gray-100">{kw.shift}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 微觀分析 - 幽靈制度 */}
      <section className="py-32 bg-gray-50 rounded-[5rem] px-20 border-4 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[1em] text-gray-400">The Ghost of Sub-sentences</h4>
            <h5 className="text-3xl md:text-6xl font-black serif uppercase leading-tight tracking-tighter">「從刑」制度<br/>的幽靈</h5>
            <p className="text-xl serif text-gray-600 leading-relaxed italic">
              「戒嚴時期特有的財產沒收機制，往往連動及後代子孫，這在 1994 年成為轉型正義在經濟層面的核心攻防。」
            </p>
          </div>
          <div className="relative">
             <div className="absolute -inset-4 border-4 border-dashed border-[#2980b9] opacity-20 animate-pulse"></div>
             <div className="bg-white p-6 md:p-12 shadow-2xl space-y-6">
                <Briefcase className="w-12 h-12 text-[#2980b9]" />
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">謝聰敏委員觀點</p>
                <p className="text-2xl font-black serif leading-tight italic">「不經審判即沒收其後人之財產，法理上斷為不適當。」</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guide1994;
