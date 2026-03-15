import React from 'react';
import { motion } from 'framer-motion';
import { Unlock, FileSearch, ArrowRight, Gavel, Timer, ShieldCheck, HelpCircle } from 'lucide-react';

const Guide2023 = ({ intelligence, summaryData }: any) => {
  const clashPoints = summaryData?.clash_points || [];
  const keywordWar = summaryData?.keyword_war?.entries || [];
  const dialogue = summaryData?.dialogue_flow?.segments || [];

  return (
    <div className="space-y-40 pb-40 selection:bg-[#2980b9] selection:text-white">
      {/* 巨型標題區 */}
      <section className="relative">
        <h2 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.8] tracking-tighter opacity-5 absolute -top-10 md:-top-20 -left-4 md:-left-10 select-none pointer-events-none text-[#2980b9]"> Search </h2>
        <div className="relative z-10 pt-12 md:pt-32 max-w-5xl">
          <h4 className="text-[10px] font-black uppercase tracking-[1em] text-[#2980b9] mb-12">Rights Pursuit / 從有法可依邁向有權可追</h4>
          <h3 className="text-2xl md:text-5xl md:text-9xl font-black serif leading-[0.85] uppercase mb-16 tracking-tighter text-[#1A1A1A]">
            檔案正義與<br/>「二月審議」
          </h3>
          <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[12px] md:border-l-[24px] border-[#2980b9] pl-6 md:pl-12 py-6">
            「{intelligence?.summary_for_ai_voice}」
          </p>
        </div>
      </section>

      {/* 救濟流程圖 - 視覺化 */}
      <section className="bg-white border-[10px] border-black p-6 md:p-20 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-center relative z-10">
          <div className="md:col-span-5 space-y-12">
            <div className="flex items-center space-x-4">
               <Timer className="w-12 h-12 text-[#2980b9]" />
               <h4 className="text-3xl md:text-6xl font-black serif uppercase leading-none tracking-tighter text-[#2980b9]">The 2-Month<br/>Deadline</h4>
            </div>
            
            <div className="p-8 bg-blue-50 border-l-8 border-[#2980b9] space-y-4">
               <p className="text-xs font-black uppercase text-[#2980b9]">Legislative Intent</p>
               <p className="text-lg serif font-black">破解國家安全遮羞布</p>
               <p className="text-sm text-gray-600">強制規定屆滿一定年限必須解除遮掩，除非極少數例外，不得由原機關永遠含糊遮蓋。</p>
            </div>
          </div>

          <div className="md:col-span-7 space-y-8">
             <div className="flex flex-col space-y-4">
                {[
                  { step: "1. 檔案申請", status: "機關處分", icon: FileSearch },
                  { step: "2. 不服處分", status: "30 日內申請審議", icon: HelpCircle },
                  { step: "3. 委員會審議", status: "二個月內作成決定", icon: Timer, highlight: true },
                  { step: "4. 行政救濟", status: "逕行提起訴願/訴訟", icon: Gavel }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center p-6 border-2 border-black ${item.highlight ? 'bg-black text-white shadow-xl' : 'bg-white'}`}>
                     <item.icon className={`w-8 h-8 mr-6 ${item.highlight ? 'text-[#2980b9]' : 'text-gray-300'}`} />
                     <div className="flex-grow">
                        <p className="text-xs font-black uppercase opacity-50">{item.step}</p>
                        <p className="text-xl font-black serif uppercase tracking-widest">{item.status}</p>
                     </div>
                     {item.highlight && <span className="text-[10px] font-black uppercase border border-white px-2 py-1">2023 New Requirement</span>}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 第三方制衡 - 衝突對比 */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-0 border-y-4 border-black border-x-4">
        <div className="md:col-span-6 p-6 md:p-20 bg-[#1A1A1A] text-white space-y-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2980b9] block mb-2">Reform Advocates</span>
          <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none">第三方審議</h4>
          <p className="text-2xl serif text-emerald-400 italic leading-relaxed">
            「透過專業委員會制衡原機關的保密慣性，不再讓檔案局成為唯一的守門人。」
          </p>
          <div className="h-1 w-24 bg-emerald-500"></div>
        </div>
        <div className="md:col-span-6 p-6 md:p-20 bg-white text-black space-y-12 border-l-4 border-black flex flex-col justify-center">
          <div className="space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Administrative Logic</span>
            <h4 className="text-2xl md:text-5xl font-black serif uppercase leading-none">程序穩定性</h4>
            <p className="text-xl serif text-gray-600 italic leading-relaxed">
              「參考稅捐/關稅法的先行程序，確保真相追索不致因行政流程過於冗長而停滯。」
            </p>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-[#2980b9]">
             <span className="text-xs font-black uppercase">#時效性正義</span>
             <span className="text-xs font-black uppercase">#不得違背二二八史實</span>
          </div>
        </div>
      </section>

      {/* 微觀分析 - 技術法制化 */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
           <div className="p-6 md:p-12 border-l-[12px] border-[#2980b9] bg-white shadow-xl space-y-6">
              <h5 className="text-2xl font-black serif underline decoration-[#2980b9] decoration-4">對抗「軟性阻礙」</h5>
              <p className="text-lg serif text-gray-600 leading-loose italic">
                資料顯示，2023 年修法針對檔案局內部如何應對國安局、國防部的「不予提供」處分，建立了內部法律對抗機制。
              </p>
           </div>
           <div className="p-6 md:p-12 border-l-[12px] border-black bg-white shadow-xl space-y-6">
              <h5 className="text-2xl font-black serif underline decoration-black decoration-4">法律技術的高水準</h5>
              <p className="text-lg serif text-gray-600 leading-loose italic">
                立法者參考了極其專業的財稅法律救濟機制來設計政治檔案的救濟，顯示轉型正義已具備極高的法律技術水平。
              </p>
           </div>
        </div>
      </section>

      {/* 結幕 */}
      <section className="py-20 flex flex-col items-center space-y-8 border-b-4 border-black">
        <ShieldCheck className="w-12 h-12 text-[#2980b9]" />
        <h4 className="text-4xl font-black serif italic tracking-tighter uppercase text-center">Open Files, Open Future.</h4>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em]">2023 Political Archive Justice Finalization</p>
      </section>
    </div>
  );
};

export default Guide2023;
