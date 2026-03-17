import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, ArrowRight, Database, X, FileText, Link2, Loader2 } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import { DataManager } from '../DataManager';
import { appendConfrontationalModeAppendix } from '../utils/partyWordExport';
import { getLawVersionDisplayYear } from '../components/year-overview/archiveUtils';

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

const getPhaseIndexByYear = (year: string): number => {
  const y = Number(year);
  if (!Number.isFinite(y)) return 0;
  if (y <= 1987) return 0;
  if (y <= 2000) return 1;
  if (y <= 2013) return 2;
  return 3;
};

const getBasePath = (): string => {
  const pathname = window.location.pathname;
  if (pathname.includes('/tw_tj_leg/')) {
    return '/tw_tj_leg/';
  }
  return '/';
};

const Landing = () => {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const [yearStats, setYearStats] = useState<Record<string, { count: number, summary: string }>>({});
  const [lawMilestoneYearMap, setLawMilestoneYearMap] = useState<Record<string, boolean>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [exportProgress, setExportProgress] = useState(0);

  useEffect(() => {
    const allYears = PHASES.flatMap(p => p.years);
    const basePath = getBasePath();

    DataManager.getAllLawHistory()
      .then((lawMap) => {
        const nextMap: Record<string, boolean> = {};
        Object.values(lawMap || {}).forEach((law) => {
          const filterNth = law.metadata?.filters_applied?.filter_nth;
          const versions = law.legislation_versions || [];
          if (filterNth != null && versions[filterNth - 1]) {
            const y = getLawVersionDisplayYear(versions[filterNth - 1]);
            if (/^\d{4}$/.test(y)) nextMap[y] = true;
            return;
          }
          if (law.metadata?.target_date) {
            const y = (law.metadata.target_date as string).slice(0, 4);
            if (/^\d{4}$/.test(y)) nextMap[y] = true;
            return;
          }
          versions.forEach((version) => {
            const y = getLawVersionDisplayYear(version);
            if (/^\d{4}$/.test(y)) {
              nextMap[y] = true;
            }
          });
        });
        setLawMilestoneYearMap(nextMap);
      })
      .catch(() => {
        setLawMilestoneYearMap({});
      });

    allYears.forEach(year => {
      fetch(`${basePath}data/${year}.json`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => {
          const count = data.speakers_analysis ? Object.keys(data.speakers_analysis).length : 0;
          fetch(`${basePath}data/summary/${year}.json`)
            .then(res => res.ok ? res.json() : null)
            .then(sData => {
              if (sData) {
                setYearStats(prev => ({
                  ...prev,
                  [year]: {
                    count,
                    summary: sData?.intelligence_layer?.summary_for_ai_voice || ""
                  }
                }));
              }
            }).catch(() => {});
        })
        .catch(() => {
          fetch(`${basePath}data/summary/${year}.json`)
            .then(res => res.ok ? res.json() : null)
            .then(sData => {
              if (sData) {
                setYearStats(prev => ({
                  ...prev,
                  [year]: {
                    count: 0,
                    summary: sData?.intelligence_layer?.summary_for_ai_voice || ""
                  }
                }));
              }
            }).catch(() => {});
        });
    });
  }, []);

  const coreYearSet = new Set(PHASES.flatMap((p) => p.years));
  const missingLawYears = Object.keys(lawMilestoneYearMap)
    .filter((year) => !coreYearSet.has(year))
    .sort((a, b) => a.localeCompare(b));

  const displayPhases = PHASES.map((phase, idx) => {
    const merged = new Set(phase.years);
    missingLawYears.forEach((year) => {
      if (getPhaseIndexByYear(year) === idx) {
        merged.add(year);
      }
    });

    return {
      ...phase,
      years: Array.from(merged).sort((a, b) => a.localeCompare(b))
    };
  });

  const handleExport = async (mode: 'report' | 'index') => {
    if (exportStatus === 'loading') return;
    setExportStatus('loading');
    setExportProgress(0);
    const allYears = PHASES.flatMap(p => p.years);
    const children: any[] = [];

    try {
      const lyHistoryData = await DataManager.getLYHistoryData();
      // 主標題
      children.push(new Paragraph({ 
        text: mode === 'report' ? "轉型正義立法論述：全年度彙整報告 (1987-2024)" : "轉型正義議事檔案：全年度連結索引 (1987-2024)", 
        heading: HeadingLevel.HEADING_1, 
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      } as any));
      children.push(new Paragraph({ 
        children: [new TextRun({ text: "DIGITAL ARCHIVE FULL REPORT / 數位論述考古總彙整", bold: true, color: "8C2F39", size: 20 } as any)],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      } as any));
      children.push(new Paragraph({
        children: [new TextRun({ text: '各年份附錄均加入政黨對抗模式說明，並同步列出不分程序與分程序兩種分類視角。', color: '555555' } as any)],
        alignment: AlignmentType.CENTER,
        spacing: { after: 360 }
      } as any));

      for (let i = 0; i < allYears.length; i++) {
        const year = allYears[i];
        setExportProgress(Math.round(((i + 1) / allYears.length) * 100));
        
        try {
          const res = await DataManager.getProcessedYearData(year);
          const summary = yearStats[year]?.summary || "";

          // 年度大標題
          children.push(new Paragraph({ 
            text: `【YEAR ${year}】`, 
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 800, after: 400 },
            border: { bottom: { color: "8C2F39", style: "single", size: 12 } } as any
          } as any));

          if (summary) {
            children.push(new Paragraph({ 
              children: [new TextRun({ text: "年度背景：", bold: true, color: "8C2F39" } as any), new TextRun({ text: ` 「${summary}」`, italics: true, color: "666666" } as any)],
              spacing: { after: 400 }
            } as any));
          }

          if (mode === 'report') {
            // --- 模式一：超詳細完整報告 (與各年份版本一致) ---
            for (const s of res.speeches) {
              // 1. 姓名與身分
              children.push(new Paragraph({ 
                children: [
                  new TextRun({ text: `【${s.speaker}】`, bold: true, size: 28, color: "8C2F39" } as any),
                  new TextRun({ text: `  ${s.identity}`, italics: true, size: 20, color: "555555" } as any)
                ],
                spacing: { before: 300, after: 150 }
              } as any));

              // 2. 元數據
              children.push(new Paragraph({ 
                children: [
                  new TextRun({ text: "日期：", bold: true } as any), new TextRun({ text: `${s.date}  |  ` } as any),
                  new TextRun({ text: "法案：", bold: true } as any), new TextRun({ text: `${s.lawName}  |  ` } as any),
                  new TextRun({ text: "階段：", bold: true } as any), new TextRun({ text: s.stage } as any),
                ],
                spacing: { after: 100 }
              } as any));

              // 3. 論述與取向
              children.push(new Paragraph({ 
                children: [
                  new TextRun({ text: "政治取向：", bold: true } as any),
                  new TextRun({ text: s.political_orientation, color: "2E7D32" } as any)
                ],
                spacing: { after: 50 }
              } as any));
              children.push(new Paragraph({ 
                children: [
                  new TextRun({ text: "核心論述：", bold: true } as any),
                  new TextRun({ text: `「${s.discourse_logic}」`, italics: true, bold: true, size: 24 } as any)
                ],
                spacing: { after: 150 }
              } as any));

              // 4. 具體立場細節
              if (s.stances && s.stances.length > 0) {
                s.stances.forEach(st => {
                  children.push(new Paragraph({ 
                    text: `· ${st.topic}: ${st.position}`,
                    indent: { left: 360 },
                    spacing: { after: 40 }
                  } as any));
                });
              }

              // 5. 檔案連結工具列
              const linkElements: any[] = [new TextRun({ text: "檔案檢索：", bold: true, size: 18 } as any)];
              const pdfLink = DataManager.getSpeechPDFLink(s);
              if (pdfLink) {
                linkElements.push(new ExternalHyperlink({
                  children: [new TextRun({ text: "[原始PDF預覽]", color: "0000FF", underline: {} } as any)],
                  link: pdfLink.previewLink
                } as any));
                linkElements.push(new TextRun({ text: "  " } as any));
              }
              if (s.imagePaths && s.imagePaths.length > 0) {
                s.imagePaths.forEach((imgPath, idx) => {
                  const fullUrl = DataManager.getImageUrl(imgPath);
                  if (fullUrl) {
                    linkElements.push(new ExternalHyperlink({
                      children: [new TextRun({ text: `[截圖 ${idx + 1}]`, color: "0000FF", underline: {} } as any)],
                      link: fullUrl
                    } as any));
                    linkElements.push(new TextRun({ text: " " } as any));
                  }
                });
              }
              children.push(new Paragraph({ children: linkElements, spacing: { before: 150, after: 300 } } as any));
              
              // 區隔細線
              children.push(new Paragraph({ 
                border: { bottom: { color: "EEEEEE", style: "single", size: 4 } } as any,
                spacing: { after: 200 }
              } as any));
            }

            appendConfrontationalModeAppendix(children, {
              year,
              speeches: res.speeches,
              lyHistoryData,
              compact: true
            });
          } else {
            // --- 模式二：檔案索引 (保持簡潔) ---
            const uniqueFileStems = Array.from(
              new Set(res.speeches.map((s) => DataManager.getSpeechFileStem(s)).filter(Boolean))
            );
            for (const stem of uniqueFileStems) {
              const pdfLink = DataManager.getPDFLink(stem!);
              if (pdfLink) {
                children.push(new Paragraph({ 
                  children: [
                    new TextRun({ text: `· ${stem} : `, size: 20 } as any),
                    new ExternalHyperlink({
                      children: [new TextRun({ text: "[原始PDF預覽連結]", color: "0000FF", underline: {} } as any)],
                      link: pdfLink.previewLink
                    } as any)
                  ],
                  indent: { left: 360 },
                  spacing: { before: 100 }
                } as any));
              }
            }

            appendConfrontationalModeAppendix(children, {
              year,
              speeches: res.speeches,
              lyHistoryData,
              compact: true
            });
          }
        } catch (yearErr) {
          console.warn(`Skip year ${year} due to error`, yearErr);
        }
      }

      const doc = new Document({ sections: [{ properties: {}, children: children }] } as any);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `TRUTH_MAPPING_1987_2024_${mode === 'report' ? '論述總報告' : '檔案索引'}.docx`);
      setExportStatus('complete');
      setTimeout(() => {
        setShowExportModal(false);
        setExportStatus('idle');
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("匯出失敗，請檢查網路連線。");
      setExportStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] py-20 px-6 md:px-16 relative overflow-x-hidden">
      {/* 匯出選擇彈窗 */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => exportStatus !== 'loading' && setShowExportModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl border-[10px] border-black p-8 md:p-12 shadow-2xl"
            >
              {!exportStatus.includes('loading') && (
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="absolute top-4 right-4 hover:rotate-90 transition-transform p-2"
                >
                  <X className="w-8 h-8" />
                </button>
              )}

              <div className="mb-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8C2F39] mb-4">Export Full Archive</h2>
                <h3 className="text-4xl md:text-5xl font-black serif uppercase leading-none">選擇匯出模式</h3>
                <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest italic">Select your digital archive structure</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button 
                  disabled={exportStatus === 'loading'}
                  onClick={() => handleExport('report')}
                  className="group relative border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all overflow-hidden disabled:opacity-50"
                >
                  <FileText className="w-10 h-10 mb-6 group-hover:text-[#8C2F39] transition-colors" />
                  <h4 className="text-xl font-black serif mb-2">年度完整論述報告</h4>
                  <p className="text-[10px] font-bold uppercase opacity-60 leading-relaxed">包含所有年度發言人、身分、政治取向與核心論述邏輯彙整。</p>
                  {exportStatus === 'loading' && <div className="absolute bottom-0 left-0 h-1 bg-[#8C2F39] transition-all duration-300" style={{ width: `${exportProgress}%` }} />}
                </button>

                <button 
                  disabled={exportStatus === 'loading'}
                  onClick={() => handleExport('index')}
                  className="group relative border-4 border-black p-8 text-left hover:bg-black hover:text-white transition-all overflow-hidden disabled:opacity-50"
                >
                  <Link2 className="w-10 h-10 mb-6 group-hover:text-[#8C2F39] transition-colors" />
                  <h4 className="text-xl font-black serif mb-2">檔案索引與連結</h4>
                  <p className="text-[10px] font-bold uppercase opacity-60 leading-relaxed">整理 1987-2024 所有原始 PDF 預覽連結與會議摘要清單。</p>
                  {exportStatus === 'loading' && <div className="absolute bottom-0 left-0 h-1 bg-[#8C2F39] transition-all duration-300" style={{ width: `${exportProgress}%` }} />}
                </button>
              </div>

              {exportStatus === 'loading' && (
                <div className="mt-12 p-6 bg-gray-50 border-2 border-black flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4">
                    <Loader2 className="w-6 h-6 animate-spin text-[#8C2F39]" />
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Archiving History... {exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 mt-2">
                    <motion.div 
                      className="bg-[#8C2F39] h-full" 
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {exportStatus === 'complete' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-12 p-6 bg-green-50 border-2 border-green-600 text-green-700 text-center font-black uppercase tracking-widest text-xs"
                >
                  Archive Generated Successfully
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 magazine-grid opacity-30 pointer-events-none"></div>

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
              <button 
                onClick={() => setShowExportModal(true)}
                className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#8C2F39] transition-all shadow-2xl flex items-center justify-center space-x-4"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Full Word Archive</span>
              </button>
            </div>
          </div>
        </header>

        <section className="mb-24 border border-black p-6 md:p-8 bg-gradient-to-r from-[#f6f1e8] via-[#f9f9f7] to-[#ebeef7]">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-[#8C2F39]">Independent Page</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-black serif leading-tight">時間軸檢視</h2>
         
          <div className="mt-5">
            <Link
              to="/timeline"
              className="inline-flex items-center gap-3 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#8C2F39] transition-colors"
            >
              <Database className="w-4 h-4" />
              開啟獨立時間軸頁面
            </Link>
          </div>
        </section>

        <div className="space-y-32">
          {displayPhases.map((phase, pIdx) => (
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
                    to={coreYearSet.has(year) ? `/${year}/guide` : `/guide/full-revision?year=${year}`}
                    onMouseEnter={() => setHoveredYear(year)}
                    onMouseLeave={() => setHoveredYear(null)}
                    className="group relative bg-white aspect-square flex flex-col items-center justify-center hover:bg-black transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-4 left-4 flex flex-col">
                      <span className="text-[10px] font-black serif group-hover:text-gray-600 transition-colors">#{year.slice(2)}</span>
                      <span className="text-[8px] font-black uppercase text-gray-300 mt-1">{yearStats[year]?.count || '--'} Records</span>
                    </div>

                    {lawMilestoneYearMap[year] && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-[0.18em] group-hover:bg-[#8C2F39] transition-colors">
                          {coreYearSet.has(year) ? '法規節點' : '缺席修法'}
                        </span>
                      </div>
                    )}

                    <span className="text-5xl font-black serif group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10">
                      {year}
                    </span>

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