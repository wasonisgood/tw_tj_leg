import { ArrowRight } from 'lucide-react';
import Guide1987 from '../year-guides/Guide1987';
import Guide1992 from '../year-guides/Guide1992';
import Guide1993 from '../year-guides/Guide1993';
import Guide1994 from '../year-guides/Guide1994';
import Guide1995 from '../year-guides/Guide1995';
import Guide1997 from '../year-guides/Guide1997';
import Guide1998 from '../year-guides/Guide1998';
import Guide1999 from '../year-guides/Guide1999';
import Guide2000 from '../year-guides/Guide2000';
import Guide2001 from '../year-guides/Guide2001';
import Guide2002 from '../year-guides/Guide2002';
import Guide2003 from '../year-guides/Guide2003';
import Guide2006 from '../year-guides/Guide2006';
import Guide2009 from '../year-guides/Guide2009';
import Guide2013 from '../year-guides/Guide2013';
import Guide2016 from '../year-guides/Guide2016';
import Guide2017 from '../year-guides/Guide2017';
import Guide2019 from '../year-guides/Guide2019';
import Guide2022 from '../year-guides/Guide2022';
import Guide2023 from '../year-guides/Guide2023';
import Guide2024 from '../year-guides/Guide2024';

type YearGuideRendererProps = {
  year?: string;
  intelligence: any;
  session: any;
  data: any[];
  groupedByLaw: Record<string, any>;
  summaryData: any;
  onEnterArchive: () => void;
};

export default function YearGuideRenderer({
  year,
  intelligence,
  session,
  data,
  groupedByLaw,
  summaryData,
  onEnterArchive
}: YearGuideRendererProps) {
  const props = { intelligence, session, data, groupedByLaw, summaryData };

  switch (year) {
    case '1987': return <Guide1987 {...props} setViewMode={() => onEnterArchive()} />;
    case '1992': return <Guide1992 {...props} setViewMode={() => onEnterArchive()} />;
    case '1993': return <Guide1993 {...props} setViewMode={() => onEnterArchive()} />;
    case '1994': return <Guide1994 {...props} setViewMode={() => onEnterArchive()} />;
    case '1995': return <Guide1995 {...props} setViewMode={() => onEnterArchive()} />;
    case '1997': return <Guide1997 {...props} setViewMode={() => onEnterArchive()} />;
    case '1998': return <Guide1998 {...props} setViewMode={() => onEnterArchive()} />;
    case '1999': return <Guide1999 {...props} setViewMode={() => onEnterArchive()} />;
    case '2000': return <Guide2000 {...props} setViewMode={() => onEnterArchive()} />;
    case '2001': return <Guide2001 {...props} setViewMode={() => onEnterArchive()} />;
    case '2002': return <Guide2002 {...props} setViewMode={() => onEnterArchive()} />;
    case '2003': return <Guide2003 {...props} setViewMode={() => onEnterArchive()} />;
    case '2006': return <Guide2006 {...props} setViewMode={() => onEnterArchive()} />;
    case '2009': return <Guide2009 {...props} setViewMode={() => onEnterArchive()} />;
    case '2013': return <Guide2013 {...props} setViewMode={() => onEnterArchive()} />;
    case '2016': return <Guide2016 {...props} setViewMode={() => onEnterArchive()} />;
    case '2017': return <Guide2017 {...props} setViewMode={() => onEnterArchive()} />;
    case '2019': return <Guide2019 {...props} setViewMode={() => onEnterArchive()} />;
    case '2022': return <Guide2022 {...props} setViewMode={() => onEnterArchive()} />;
    case '2023': return <Guide2023 {...props} setViewMode={() => onEnterArchive()} />;
    case '2024': return <Guide2024 {...props} setViewMode={() => onEnterArchive()} />;
    default:
      return (
        <div className="space-y-16 md:space-y-32">
          <div className="relative">
            <h3 className="text-[15vw] md:text-[12vw] font-black serif leading-none uppercase opacity-5 absolute -top-10 -left-4 md:-left-10 select-none pointer-events-none">{year}</h3>
            <div className="relative z-10 pt-12 md:pt-20">
              <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[#8C2F39] mb-4 md:mb-6">Historical Context / 歷史導讀</h2>
              <h3 className="text-4xl md:text-7xl font-black serif leading-[0.8] uppercase mb-8 md:mb-12">{year} Archive</h3>
              <div className="h-1 md:h-2 w-24 md:w-48 bg-black mb-8 md:mb-16"></div>

              {intelligence?.summary_for_ai_voice && (
                <p className="text-2xl md:text-5xl font-black serif italic leading-[1.1] text-gray-800 border-l-[8px] md:border-l-[16px] border-gray-100 pl-6 md:pl-12 py-2 md:py-4 max-w-4xl">
                  「{intelligence.summary_for_ai_voice}」
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20">
            <div className="md:col-span-7 prose prose-lg md:prose-2xl serif text-gray-700 leading-relaxed">
              <p className="first-letter:text-5xl md:first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:leading-none first-letter:text-black">
                在 {year} 年的立法院，關於轉型正義與權利回復的討論呈現了極其豐富的維度。透過對原始議事檔案的數位考古，我們識別出本年度最受關注的核心議題。
              </p>
            </div>
            <div className="md:col-span-5 space-y-8 md:space-y-12">
              <div className="border-t-4 border-black pt-6 md:pt-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 md:mb-8">Yearly Stats / 年度統計</h4>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
                  <div>
                    <span className="block text-[8px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Total Records</span>
                    <span className="text-4xl md:text-6xl font-black serif">{data.length}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] md:text-[10px] font-black text-gray-400 uppercase mb-1">Legislations</span>
                    <span className="text-4xl md:text-6xl font-black serif">{Object.keys(groupedByLaw).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-16 md:py-32 border-y border-gray-200">
            <button onClick={onEnterArchive} className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-black text-white overflow-hidden transition-all hover:pr-12 md:hover:pr-16">
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.5em] relative z-10">Enter Discourse Map</span>
              <ArrowRight className="absolute right-0 opacity-0 group-hover:right-4 md:group-hover:right-6 group-hover:opacity-100 transition-all w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      );
  }
}
