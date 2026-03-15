import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, ArrowRight, BarChart3, Database, Globe } from 'lucide-react';

const PHASES = [
  {
    title: "The Breaking Point / 威權鬆動期",
    years: ['1987'],
    desc: "戒嚴體制的法理轉型與對抗元年"
  },
  {
    title: "Legalization / 補償制度建立期",
    years: ['1992', '1993', '1994', '1995', '1997', '1998', '1999', '2000'],
    desc: "二二八與白色恐怖補償框架的初步構築"
  },
  {
    title: "Institutional Expansion / 制度擴張與微調期",
    years: ['2001', '2002', '2003', '2006', '2009', '2013'],
    desc: "補償範圍、地理限制與申請期限的多次攻防"
  },
  {
    title: "Systemic Change / 促轉轉型與恢復期",
    years: ['2016', '2017', '2019', '2022', '2023', '2024'],
    desc: "從物質補償轉向不法行為認定與權利全面回復"
  }
];

const Landing = () => {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const [yearStats, setYearStats] = useState<Record<string, { count: number, summary: string }>>({});

  useEffect(() => {
    // 批量讀取所有年份數據以生成首頁統計
    const allYears = PHASES.flatMap(p => p.years);
    allYears.forEach(year => {
      fetch(`/${year}.json`)
        .then(res => res.json())
        .then(data => {
          const count = data.speakers_analysis ? Object.keys(data.speakers_analysis).length : 0;
          fetch(`/summary/${year}.json`)
            .then(res => res.json())
            .then(sData => {
              setYearStats(prev => ({
                ...prev,
                [year]: {
                  count,
                  summary: sData?.intelligence_layer?.summary_for_ai_voice || ""
                }
              }));
            });
        }).catch(() => {});
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-20 px-6 md:px-16 relative overflow-x-hidden">
      {/* 原始網格背景 */}
      <div className="absolute inset-0 magazine-grid opacity-30 pointer-events-none"></div>

      {/* 懸停巨型背景年份 */}
      <AnimatePresence>
        {hoveredYear && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.04, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <span className="text-[45vw] font-black serif leading-none">{hoveredYear}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - 恢復大氣佈局 */}
        <header className="mb-32 border-b-[6px] border-black pb-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">Phase I - IV</span>
                <div className="h-[1px] w-24 bg-gray-300"></div>
              </div>
              <h1 className="text-8xl md:text-[11rem] font-black serif leading-[0.8] uppercase tracking-tighter">
                Truth<br/>
                <span className="text-[#8C2F39]">Mapping</span>
              </h1>
            </div>
            
            <div className="max-w-md space-y-8">
              <div className="flex gap-12 border-t border-gray-200 pt-8">
                <div>
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-2">Total Records</span>
                  <span className="text-4xl font-black serif">1,420+</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-2">Time Span</span>
                  <span className="text-4xl font-black serif">37 Yrs</span>
                </div>
              </div>
              <p className="text-sm font-bold leading-relaxed text-gray-500 uppercase tracking-widest italic">
                「透過數位工具，將散落的議事錄轉化為可視化的歷史論述地圖。」
              </p>
              <button className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#8C2F39] transition-all shadow-2xl">
                Export Full Word Archive
              </button>
            </div>
          </div>
        </header>

        {/* 分期導覽網格 */}
        <div className="space-y-32">
          {PHASES.map((phase, pIdx) => (
            <section key={pIdx} className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between border-l-[12px] border-black pl-8">
                <div className="space-y-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8C2F39]">Phase 0{pIdx + 1}</h2>
                  <h3 className="text-5xl font-black serif uppercase tracking-tighter">{phase.title}</h3>
                </div>
                <p className="text-sm font-bold text-gray-400 mt-4 md:mt-0 uppercase tracking-widest">{phase.desc}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-gray-200 border border-gray-200 shadow-2xl">
                {phase.years.map((year) => (
                  <Link
                    key={year}
                    to={`/${year}`}
                    onMouseEnter={() => setHoveredYear(year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="group relative bg-white aspect-square flex flex-col items-center justify-center hover:bg-black transition-all duration-500 overflow-hidden"
                  >
                    {/* 背景數據 - 保持常駐可見 */}
                    <div className="absolute top-4 left-4 flex flex-col">
                      <span className="text-[10px] font-black serif group-hover:text-gray-600 transition-colors">#{year.slice(2)}</span>
                      <span className="text-[8px] font-black uppercase text-gray-300 mt-1">{yearStats[year]?.count || '--'} Records</span>
                    </div>

                    <span className="text-5xl font-black serif group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10">
                      {year}
                    </span>

                    {/* 懸停覆蓋層 - 精緻摘要 */}
                    <AnimatePresence>
                      {hoveredYear === year && yearStats[year]?.summary && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute inset-0 z-20 p-6 bg-[#8C2F39] text-white flex flex-col justify-center text-left"
                        >
                          <Database className="w-4 h-4 mb-4 opacity-50" />
                          <p className="text-[11px] font-bold leading-relaxed serif italic">
                            「{yearStats[year].summary}」
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                             <span className="text-[8px] font-black uppercase tracking-widest">Explore Index</span>
                             <ArrowRight className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* 底部裝飾線 */}
                    <div className="absolute bottom-4 flex space-x-1 opacity-20 group-hover:opacity-100 transition-all">
                       <div className="w-1 h-1 bg-gray-400 group-hover:bg-[#8C2F39] rounded-full"></div>
                       <div className="w-1 h-1 bg-gray-400 group-hover:bg-white rounded-full"></div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <footer className="mt-40 border-t-2 border-black pt-12 pb-20 flex flex-col md:flex-row justify-between items-start px-8 gap-12">
        <div className="flex gap-16">
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Project</span>
            <span className="text-xl font-black serif">Archives of Justice</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Data Source</span>
            <span className="text-xl font-black serif">Legislative Yuan</span>
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.8em] text-gray-300">
          Justice / Truth / Memory / 1987-2024
        </div>
      </footer>
    </div>
  );
};

export default Landing;
