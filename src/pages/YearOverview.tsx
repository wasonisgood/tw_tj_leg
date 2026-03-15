import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DataManager, ProcessedSpeech, SessionInfo } from '../DataManager';
import { User, Filter, Search, BookOpen, Clock, Tag, ArrowLeft, ArrowRight, FileDown, Quote } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';

// Year Guides
import Guide1987 from '../components/year-guides/Guide1987';
import Guide1992 from '../components/year-guides/Guide1992';
import Guide1993 from '../components/year-guides/Guide1993';
import Guide1994 from '../components/year-guides/Guide1994';
import Guide1995 from '../components/year-guides/Guide1995';
import Guide1997 from '../components/year-guides/Guide1997';
import Guide1998 from '../components/year-guides/Guide1998';
import Guide1999 from '../components/year-guides/Guide1999';
import Guide2000 from '../components/year-guides/Guide2000';
import Guide2001 from '../components/year-guides/Guide2001';
import Guide2002 from '../components/year-guides/Guide2002';
import Guide2003 from '../components/year-guides/Guide2003';
import Guide2006 from '../components/year-guides/Guide2006';
import Guide2009 from '../components/year-guides/Guide2009';
import Guide2013 from '../components/year-guides/Guide2013';
import Guide2016 from '../components/year-guides/Guide2016';
import Guide2017 from '../components/year-guides/Guide2017';
import Guide2019 from '../components/year-guides/Guide2019';
import Guide2022 from '../components/year-guides/Guide2022';
import Guide2023 from '../components/year-guides/Guide2023';
import Guide2024 from '../components/year-guides/Guide2024';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const YearGuideRenderer = ({ year, intelligence, session, data, groupedByLaw, setViewMode, summaryData }: any) => {
  const props = { intelligence, session, data, groupedByLaw, setViewMode, summaryData };
  switch (year) {
    case '1987': return <Guide1987 {...props} />;
    case '1992': return <Guide1992 {...props} />;
    case '1993': return <Guide1993 {...props} />;
    case '1994': return <Guide1994 {...props} />;
    case '1995': return <Guide1995 {...props} />;
    case '1997': return <Guide1997 {...props} />;
    case '1998': return <Guide1998 {...props} />;
    case '1999': return <Guide1999 {...props} />;
    case '2000': return <Guide2000 {...props} />;
    case '2001': return <Guide2001 {...props} />;
    case '2002': return <Guide2002 {...props} />;
    case '2003': return <Guide2003 {...props} />;
    case '2006': return <Guide2006 {...props} />;
    case '2009': return <Guide2009 {...props} />;
    case '2013': return <Guide2013 {...props} />;
    case '2016': return <Guide2016 {...props} />;
    case '2017': return <Guide2017 {...props} />;
    case '2019': return <Guide2019 {...props} />;
    case '2022': return <Guide2022 {...props} />;
    case '2023': return <Guide2023 {...props} />;
    case '2024': return <Guide2024 {...props} />;
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
             <button onClick={() => setViewMode('archive')} className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-black text-white overflow-hidden transition-all hover:pr-12 md:hover:pr-16">
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.5em] relative z-10">Enter Discourse Map</span>
                <ArrowRight className="absolute right-0 opacity-0 group-hover:right-4 md:group-hover:right-6 group-hover:opacity-100 transition-all w-5 h-5 md:w-6 md:h-6" />
             </button>
          </div>
        </div>
      );
  }
};

const fetchImageAsUint8Array = async (url: string): Promise<Uint8Array | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (e) {
    console.error("Failed to fetch image", e);
    return null;
  }
};

const YearOverview = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProcessedSpeech[]>([]);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'archive' | 'guide'>('guide');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (year) {
      setLoading(true);
      const getBasePath = (): string => {
        const pathname = window.location.pathname;
        if (pathname.includes('/tw_tj_leg/')) {
          return '/tw_tj_leg/';
        }
        return '/';
      };
      const basePath = getBasePath();
      Promise.all([
        DataManager.init(),
        fetch(`${basePath}summary/${year}.json`).then(res => res.ok ? res.json() : null).catch(() => null)
      ]).then(([_, summary]) => {
        DataManager.getProcessedYearData(year).then(res => {
          setData(res.speeches);
          setSession(res.sessionInfo || null);
          const intel = summary?.intelligence_layer || res.intelligence || null;
          setIntelligence(intel);
          setSummaryData(summary);
          setLoading(false);
        });
      });
    }
  }, [year]);

  const identities = ['All', ...Array.from(new Set(data.map(s => {
    const normalized = s.identity.split('（')[0].split('(')[0].trim();
    return normalized;
  })))];
  
  const filteredData = data.filter(s => {
    const normalized = s.identity.split('（')[0].split('(')[0].trim();
    const matchesFilter = filter === 'All' || normalized === filter;
    const matchesSearch = s.speaker.includes(search) || 
                         s.political_orientation.includes(search) ||
                         s.lawName.includes(search);
    return matchesFilter && matchesSearch;
  });

  const groupedByLaw = filteredData.reduce((acc, speech) => {
    const law = speech.lawName || '其他';
    if (!acc[law]) acc[law] = {};
    const stage = speech.stage || '一般會議';
    if (!acc[law][stage]) acc[law][stage] = [];
    acc[law][stage].push(speech);
    return acc;
  }, {} as Record<string, Record<string, ProcessedSpeech[]>>);

  const exportToWord = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const children: any[] = [
        new Paragraph({ 
          text: `${year} 年度轉型正義立法論述檔案`, 
          heading: HeadingLevel.HEADING_1, 
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 }
        } as any),
        new Paragraph({ 
          children: [
            new TextRun({ text: "DIGITAL ARCHIVE REPORT", bold: true, color: "8C2F39", size: 18 } as any)
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        } as any),
      ];

      for (const s of filteredData) {
        // --- 1. 發言人與身分 (深紅大標) ---
        children.push(new Paragraph({ 
          children: [
            new TextRun({ text: `【${s.speaker}】`, bold: true, size: 32, color: "8C2F39" } as any),
            new TextRun({ text: `  ${s.identity}`, italics: true, size: 22, color: "555555" } as any)
          ],
          spacing: { before: 400, after: 200 }
        } as any));

        // --- 2. 會議細節 (整齊排列) ---
        children.push(new Paragraph({ 
          children: [
            new TextRun({ text: "日期：", bold: true } as any), new TextRun({ text: `${s.date}  |  ` } as any),
            new TextRun({ text: "法案：", bold: true } as any), new TextRun({ text: `${s.lawName}  |  ` } as any),
            new TextRun({ text: "階段：", bold: true } as any), new TextRun({ text: s.stage } as any),
          ],
          spacing: { after: 150 }
        } as any));

        // --- 3. 政治取向與論述 ---
        children.push(new Paragraph({ 
          children: [
            new TextRun({ text: "政治取向：", bold: true } as any),
            new TextRun({ text: s.political_orientation, color: "2E7D32" } as any)
          ],
          spacing: { after: 100 }
        } as any));

        children.push(new Paragraph({ 
          children: [
            new TextRun({ text: "核心論述：", bold: true } as any),
            new TextRun({ text: `「${s.discourse_logic}」`, italics: true, bold: true, size: 26, color: "1A1A1A" } as any)
          ],
          spacing: { after: 200, before: 100 }
        } as any));

        // --- 4. 具體立場 (簡潔項目符號) ---
        if (s.stances && s.stances.length > 0) {
          children.push(new Paragraph({ children: [new TextRun({ text: "具體立場：", bold: true } as any)], spacing: { after: 100 } } as any));
          s.stances.forEach(st => {
            children.push(new Paragraph({ 
              text: `· ${st.topic}: ${st.position}`,
              indent: { left: 360 },
              spacing: { after: 50 }
            } as any));
          });
        }

        // --- 5. 檔案檢索連結 (解決 HYPERLINK 顯示問題) ---
        const linkElements: any[] = [new TextRun({ text: "檔案連結：", bold: true } as any)];
        
        // PDF 連結
        if (s.metadata?.file_stem) {
          const pdfLink = DataManager.getPDFLink(s.metadata.file_stem);
          if (pdfLink) {
            linkElements.push(new ExternalHyperlink({
              children: [new TextRun({ text: "查看原始PDF", color: "0000FF", underline: { color: "0000FF" } } as any)],
              link: pdfLink.previewLink
            } as any));
            linkElements.push(new TextRun({ text: "   " } as any));
          }
        }

        // 截圖連結
        if (s.imagePaths && s.imagePaths.length > 0) {
          s.imagePaths.forEach((imgPath, idx) => {
            const fullUrl = DataManager.getImageUrl(imgPath);
            if (fullUrl) {
              linkElements.push(new ExternalHyperlink({
                children: [new TextRun({ text: `[會議截圖 ${idx + 1}]`, color: "0000FF", underline: { color: "0000FF" } } as any)],
                link: fullUrl
              } as any));
              linkElements.push(new TextRun({ text: "  " } as any));
            }
          });
        }
        children.push(new Paragraph({ children: linkElements, spacing: { before: 200, after: 400 } } as any));

        // --- 分割線 ---
        children.push(new Paragraph({ 
          border: { bottom: { color: "DDDDDD", space: 5, style: "single", size: 12 } } as any,
          spacing: { after: 400 }
        } as any));
      }

      const doc = new Document({ sections: [{ properties: {}, children: children }] } as any);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${year}_轉型正義論述報告.docx`);
    } catch (err) {
      console.error("[Export] ERROR:", err);
      alert(`Word 導出失敗: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsExporting(false);
    }
  };

  const getStageColor = (stage: string) => {
    if (stage.includes('一讀')) return 'bg-blue-600 text-white';
    if (stage.includes('二讀')) return 'bg-purple-600 text-white';
    if (stage.includes('三讀')) return 'bg-red-600 text-white';
    if (stage.includes('委員會')) return 'bg-amber-600 text-white';
    if (stage.includes('廣泛討論')) return 'bg-cyan-600 text-white';
    if (stage.includes('逐條討論')) return 'bg-teal-600 text-white';
    if (stage.includes('協商')) return 'bg-indigo-600 text-white';
    if (stage.includes('公聽會')) return 'bg-pink-600 text-white';
    return 'bg-gray-600 text-white';
  };

  const getStanceColor = (stance: string) => {
    const s = stance.trim();
    if (s.includes('支持') || s.includes('贊成') || s.includes('同意')) return 'bg-emerald-600 text-white border-emerald-700';
    if (s.includes('積極') || s.includes('推進') || s.includes('改革')) return 'bg-lime-600 text-white border-lime-700';
    if (s.includes('反對') || s.includes('反制')) return 'bg-red-700 text-white border-red-800';
    if (s.includes('保留') || s.includes('疑慮') || s.includes('警惕')) return 'bg-rose-600 text-white border-rose-700';
    if (s.includes('批判') || s.includes('質疑')) return 'bg-orange-600 text-white border-orange-700';
    if (s.includes('中立') || s.includes('平衡') || s.includes('協調')) return 'bg-slate-600 text-white border-slate-700';
    if (s.includes('程序') || s.includes('正當')) return 'bg-blue-600 text-white border-blue-700';
    if (s.includes('法制') || s.includes('法律')) return 'bg-cyan-600 text-white border-cyan-700';
    if (s.includes('保守') || s.includes('穩定')) return 'bg-purple-600 text-white border-purple-700';
    if (s.includes('分階段') || s.includes('階段') || s.includes('漸進')) return 'bg-indigo-600 text-white border-indigo-700';
    if (s.includes('務實') || s.includes('優化')) return 'bg-amber-600 text-white border-amber-700';
    return 'bg-gray-600 text-white border-gray-700';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
      <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] selection:bg-[#8C2F39] selection:text-white">
      <header className="border-b-[3px] border-[#1A1A1A] mx-4 md:mx-8 pt-8 md:pt-12 pb-8 relative z-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12 relative z-50">
          <button 
            onClick={() => navigate('/')} 
            className="text-[10px] font-black uppercase tracking-[0.5em] border-b-2 border-black pb-1 hover:text-[#8C2F39] hover:border-[#8C2F39] transition-all cursor-pointer relative z-50"
          >
            ← Archive Index
          </button>
          <div className="flex bg-black p-1 rounded-sm shadow-2xl relative z-50">
            <button onClick={() => setViewMode('guide')} className={cn("px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'guide' ? "bg-white text-black" : "text-gray-400 hover:text-white")}>Guide</button>
            <button onClick={() => setViewMode('archive')} className={cn("px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all", viewMode === 'archive' ? "bg-white text-black" : "text-gray-400 hover:text-white")}>Archive</button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-6">
          <div className="pointer-events-none">
            <h1 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.75] -ml-1 md:-ml-2 tracking-tighter">{year}</h1>
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.8em] text-gray-400 mt-2 md:mt-4">Transitional Justice / Legislative Map</p>
          </div>
          <div className="text-right pb-4 pointer-events-auto w-full md:w-auto">
             <button 
               onClick={exportToWord} 
               disabled={isExporting}
               className={cn(
                 "w-full md:w-auto text-[10px] font-black uppercase tracking-widest border-2 border-black px-6 py-3 transition-all",
                 isExporting 
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed" 
                  : "hover:bg-black hover:text-white"
               )}
             >
               {isExporting ? 'Exporting...' : 'Export Word'}
             </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
          {viewMode === 'guide' ? (
            <YearGuideRenderer year={year} intelligence={intelligence} session={session} data={data} groupedByLaw={groupedByLaw} setViewMode={setViewMode} summaryData={summaryData} />
          ) : (
            <>
              <div className="mb-8 md:mb-16 p-6 md:p-12 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Meeting Info</h3>
                    <p className="text-lg md:text-xl font-bold text-gray-800 leading-snug">{session?.meeting_type}</p>
                    {session?.analyzed_topics && session.analyzed_topics.length > 0 && (
                      <div className="mt-4 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Analyzed Topics</p>
                        <ul className="text-xs md:text-sm text-gray-700 space-y-1">
                          {session.analyzed_topics.slice(0, 5).map((topic, idx) => (
                            <li key={idx} className="border-l-2 border-[#8C2F39] pl-2">• {topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Archive Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">Total Speeches</span>
                        <span className="text-2xl font-black text-[#8C2F39]">{data.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600">Legislations Discussed</span>
                        <span className="text-2xl font-black text-[#8C2F39]">{Object.keys(groupedByLaw).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <aside className="w-full md:w-80 shrink-0 space-y-8 md:space-y-12">
                  <div className="md:sticky md:top-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] border-b-4 border-black pb-2 mb-4 md:mb-8">Table of Contents</h3>
                    <nav className="flex flex-wrap md:flex-col gap-2 md:gap-4">
                      {Object.keys(groupedByLaw).map(law => (
                        <a key={law} href={`#law-${law}`} className="block text-xs md:text-sm font-bold hover:text-[#8C2F39] transition-colors serif italic border-l-2 border-transparent hover:border-[#8C2F39] pl-2 md:pl-4 whitespace-nowrap">{law}</a>
                      ))}
                    </nav>
                    <div className="mt-8 md:mt-16 pt-8 border-t border-gray-200">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] border-b-2 border-gray-300 pb-2 mb-4">Filter by Identity</h4>
                      <div className="flex flex-wrap md:flex-col gap-2">
                        {identities.map(identity => (
                          <button key={identity} onClick={() => setFilter(identity)} className={cn("text-left text-xs font-bold uppercase tracking-widest px-3 py-2 border-l-3 transition-all", filter === identity ? "border-l-[#8C2F39] text-[#8C2F39] bg-gray-50" : "border-l-gray-200 text-gray-600 hover:border-l-gray-400 hover:text-gray-900")}>
                            {identity}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 md:mt-16 pt-8 border-t border-gray-200">
                      <div className="relative group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="SEARCH..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent border-b border-gray-300 pl-8 py-2 text-xs font-black uppercase focus:outline-none focus:border-black transition-all" />
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="flex-grow space-y-24 md:space-y-40">
                  {Object.entries(groupedByLaw).map(([lawName, stages]) => (
                    <section key={lawName} id={`law-${lawName}`} className="space-y-8 md:space-y-16">
                      <h2 className="text-4xl md:text-7xl font-black serif uppercase tracking-tighter border-b-[6px] md:border-b-[10px] border-black pb-2 md:pb-4 inline-block max-w-full break-words">{lawName}</h2>
                      {Object.entries(stages).map(([stageName, speeches]) => (
                        <div key={stageName} className="space-y-6 md:space-y-8">
                          <div className="flex items-center space-x-4 md:space-x-6">
                            <span className={cn("px-3 md:px-4 py-1 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap", getStageColor(stageName))}>{stageName}</span>
                            <div className="h-[2px] flex-grow bg-gray-200"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                            {speeches.map((speech) => (
                              <Link key={speech.id} to={`/${year}/${speech.id}`} className="group relative bg-white p-6 md:p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all">
                                <div className="flex justify-between items-start mb-6 md:mb-12">
                                  <div className="w-8 md:w-12 h-1 bg-black group-hover:w-16 md:group-hover:w-24 transition-all duration-500"></div>
                                  <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{speech.date}</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black serif group-hover:text-[#8C2F39] transition-colors mb-2 md:mb-4 line-clamp-2">{speech.speaker}</h3>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-400 mb-4 md:mb-8">
                                  {speech.identity.split('（')[0].split('(')[0].trim()}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4 md:mb-8">
                                  {speech.political_orientation.split('/').map((p, i) => (
                                    <span key={i} className={cn("px-2 py-1 text-[8px] font-black uppercase border", getStanceColor(p))}>{p}</span>
                                  ))}
                                </div>
                                <p className="text-base md:text-lg serif italic text-gray-600 line-clamp-3 md:line-clamp-none">「{speech.discourse_logic}」</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </section>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.main>
      </AnimatePresence>
      
      <footer className="mx-4 md:mx-8 border-t border-gray-800 py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-400">
        <span>Archives of Truth</span>
        <span>Found {data.length} Witnesses</span>
        <span>© 2026 Legislative Yuan</span>
      </footer>
    </div>
  );
};

export default YearOverview;