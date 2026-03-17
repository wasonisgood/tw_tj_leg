import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DataManager, LawHistoryData, LYHistoryData, ProcessedSpeech, SessionInfo } from '../DataManager';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';
import YearGuideRenderer from '../components/year-overview/YearGuideRenderer';
import ArchiveView from '../components/year-overview/ArchiveView';
import PartyView from '../components/year-overview/PartyView';
import { normalizeIdentity } from '../components/year-overview/archiveUtils';
import { appendConfrontationalModeAppendix } from '../utils/partyWordExport';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const YearOverview = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<ProcessedSpeech[]>([]);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [lawHistoryMap, setLawHistoryMap] = useState<Record<string, LawHistoryData>>({});
  const [lyHistoryData, setLyHistoryData] = useState<LYHistoryData>({});
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const viewMode: 'archive' | 'guide' | 'party' = location.pathname.includes('/archive')
    ? 'archive'
    : location.pathname.includes('/party')
      ? 'party'
      : 'guide';

  useEffect(() => {
    if (!year) return;

    let mounted = true;
    setLoading(true);

    const getBasePath = (): string => {
      const pathname = window.location.pathname;
      if (pathname.includes('/tw_tj_leg/')) {
        return '/tw_tj_leg/';
      }
      return '/';
    };

    const basePath = getBasePath();

    DataManager.getAllLawHistory()
      .then((lawHistory) => {
        if (!mounted) return;
        setLawHistoryMap(lawHistory || {});
      })
      .catch((err) => {
        console.warn('[YearOverview] load law history failed:', err);
        if (!mounted) return;
        setLawHistoryMap({});
      });

    Promise.all([
      DataManager.init(),
      fetch(`${basePath}summary/${year}.json`).then((res) => (res.ok ? res.json() : null)).catch(() => null),
      DataManager.getLYHistoryData()
    ]).then(async ([_, summary, lyHistory]) => {
      const res = await DataManager.getProcessedYearData(year);
      if (!mounted) return;
      setData(res.speeches);
      setSession(res.sessionInfo || null);
      setIntelligence(summary?.intelligence_layer || res.intelligence || null);
      setSummaryData(summary);
      setLyHistoryData(lyHistory || {});
      setLoading(false);
    }).catch((err) => {
      console.error('[YearOverview] primary load failed:', err);
      if (!mounted) return;
      setData([]);
      setSession(null);
      setIntelligence(null);
      setSummaryData(null);
      setLyHistoryData({});
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [year]);

  const identities = useMemo(
    () => ['All', ...Array.from(new Set(data.map((speech) => normalizeIdentity(speech.identity))))],
    [data]
  );

  const filteredData = useMemo(
    () =>
      data.filter((speech) => {
        const normalized = normalizeIdentity(speech.identity);
        const matchesFilter = filter === 'All' || normalized === filter;
        const matchesSearch =
          speech.speaker.includes(search) ||
          speech.political_orientation.includes(search) ||
          speech.lawName.includes(search);
        return matchesFilter && matchesSearch;
      }),
    [data, filter, search]
  );

  const groupedByLaw = useMemo(
    () =>
      filteredData.reduce((acc, speech) => {
        const law = speech.lawName || '其他';
        if (!acc[law]) acc[law] = {};
        const stage = speech.stage || '一般會議';
        if (!acc[law][stage]) acc[law][stage] = [];
        acc[law][stage].push(speech);
        return acc;
      }, {} as Record<string, Record<string, ProcessedSpeech[]>>),
    [filteredData]
  );

  const yearHasLawMilestone = useMemo(() => {
    if (!year) return false;
    return Object.values(lawHistoryMap || {}).some((law) =>
      !law.metadata?.filters_applied &&
      (law.legislation_versions || []).some((version) => (version.version_date || '').startsWith(year))
    );
  }, [lawHistoryMap, year]);

  const exportToWord = async () => {
    if (!year || isExporting) return;
    setIsExporting(true);
    try {
      const exportLyHistoryData = Object.keys(lyHistoryData).length ? lyHistoryData : await DataManager.getLYHistoryData();
      const children: any[] = [
        new Paragraph({
          text: `${year} 年度轉型正義立法論述檔案`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 200 }
        } as any),
        new Paragraph({
          children: [new TextRun({ text: 'DIGITAL ARCHIVE REPORT', bold: true, color: '8C2F39', size: 18 } as any)],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        } as any),
        new Paragraph({
          children: [new TextRun({ text: '本報告附錄包含政黨對抗模式說明，並同時提供不分程序與分程序兩種視角。', color: '555555' } as any)],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        } as any)
      ];

      for (const speech of filteredData) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `【${speech.speaker}】`, bold: true, size: 32, color: '8C2F39' } as any),
              new TextRun({ text: `  ${speech.identity}`, italics: true, size: 22, color: '555555' } as any)
            ],
            spacing: { before: 400, after: 200 }
          } as any)
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: '日期：', bold: true } as any),
              new TextRun({ text: `${speech.date}  |  ` } as any),
              new TextRun({ text: '法案：', bold: true } as any),
              new TextRun({ text: `${speech.lawName}  |  ` } as any),
              new TextRun({ text: '階段：', bold: true } as any),
              new TextRun({ text: speech.stage } as any)
            ],
            spacing: { after: 150 }
          } as any)
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: '政治取向：', bold: true } as any),
              new TextRun({ text: speech.political_orientation, color: '2E7D32' } as any)
            ],
            spacing: { after: 100 }
          } as any)
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: '核心論述：', bold: true } as any),
              new TextRun({ text: `「${speech.discourse_logic}」`, italics: true, bold: true, size: 26, color: '1A1A1A' } as any)
            ],
            spacing: { after: 200, before: 100 }
          } as any)
        );

        if (speech.stances && speech.stances.length > 0) {
          children.push(
            new Paragraph({ children: [new TextRun({ text: '具體立場：', bold: true } as any)], spacing: { after: 100 } } as any)
          );
          speech.stances.forEach((stance) => {
            children.push(
              new Paragraph({
                text: `· ${stance.topic}: ${stance.position}`,
                indent: { left: 360 },
                spacing: { after: 50 }
              } as any)
            );
          });
        }

        const linkElements: any[] = [new TextRun({ text: '檔案連結：', bold: true } as any)];
        if (speech.metadata?.file_stem) {
          const pdfLink = DataManager.getPDFLink(speech.metadata.file_stem);
          if (pdfLink) {
            linkElements.push(
              new ExternalHyperlink({
                children: [new TextRun({ text: '查看原始PDF', color: '0000FF', underline: { color: '0000FF' } } as any)],
                link: pdfLink.previewLink
              } as any)
            );
            linkElements.push(new TextRun({ text: '   ' } as any));
          }
        }

        if (speech.imagePaths && speech.imagePaths.length > 0) {
          speech.imagePaths.forEach((imgPath, idx) => {
            const fullUrl = DataManager.getImageUrl(imgPath);
            if (fullUrl) {
              linkElements.push(
                new ExternalHyperlink({
                  children: [new TextRun({ text: `[會議截圖 ${idx + 1}]`, color: '0000FF', underline: { color: '0000FF' } } as any)],
                  link: fullUrl
                } as any)
              );
              linkElements.push(new TextRun({ text: '  ' } as any));
            }
          });
        }

        children.push(new Paragraph({ children: linkElements, spacing: { before: 200, after: 400 } } as any));
        children.push(
          new Paragraph({
            border: { bottom: { color: 'DDDDDD', space: 5, style: 'single', size: 12 } } as any,
            spacing: { after: 400 }
          } as any)
        );
      }

      appendConfrontationalModeAppendix(children, {
        year,
        speeches: filteredData,
        lyHistoryData: exportLyHistoryData,
        compact: false
      });

      const doc = new Document({ sections: [{ properties: {}, children }] } as any);
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${year}_轉型正義論述報告.docx`);
    } catch (err) {
      console.error('[Export] ERROR:', err);
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
    const normalized = stance.trim();
    if (normalized.includes('支持') || normalized.includes('贊成') || normalized.includes('同意')) return 'bg-emerald-600 text-white border-emerald-700';
    if (normalized.includes('積極') || normalized.includes('推進') || normalized.includes('改革')) return 'bg-lime-600 text-white border-lime-700';
    if (normalized.includes('反對') || normalized.includes('反制')) return 'bg-red-700 text-white border-red-800';
    if (normalized.includes('保留') || normalized.includes('疑慮') || normalized.includes('警惕')) return 'bg-rose-600 text-white border-rose-700';
    if (normalized.includes('批判') || normalized.includes('質疑')) return 'bg-orange-600 text-white border-orange-700';
    if (normalized.includes('中立') || normalized.includes('平衡') || normalized.includes('協調')) return 'bg-slate-600 text-white border-slate-700';
    if (normalized.includes('程序') || normalized.includes('正當')) return 'bg-blue-600 text-white border-blue-700';
    if (normalized.includes('法制') || normalized.includes('法律')) return 'bg-cyan-600 text-white border-cyan-700';
    if (normalized.includes('保守') || normalized.includes('穩定')) return 'bg-purple-600 text-white border-purple-700';
    if (normalized.includes('分階段') || normalized.includes('階段') || normalized.includes('漸進')) return 'bg-indigo-600 text-white border-indigo-700';
    if (normalized.includes('務實') || normalized.includes('優化')) return 'bg-amber-600 text-white border-amber-700';
    return 'bg-gray-600 text-white border-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

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
            <button
              onClick={() => year && navigate(`/${year}/guide`)}
              className={cn('px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all', viewMode === 'guide' ? 'bg-white text-black' : 'text-gray-400 hover:text-white')}
            >
              Guide
            </button>
            <button
              onClick={() => year && navigate(`/${year}/archive`)}
              className={cn('px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all', viewMode === 'archive' ? 'bg-white text-black' : 'text-gray-400 hover:text-white')}
            >
              Archive
            </button>
            <button
              onClick={() => year && navigate(`/${year}/party`)}
              className={cn('px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all', viewMode === 'party' ? 'bg-white text-black' : 'text-gray-400 hover:text-white')}
            >
              Party
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-6">
          <div className="pointer-events-none">
            <h1 className="text-[20vw] md:text-[15vw] font-black serif uppercase leading-[0.75] -ml-1 md:-ml-2 tracking-tighter">{year}</h1>
            <div className="mt-3 md:mt-4 flex items-center gap-2 pointer-events-auto">
              <span className={cn(
                'px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border',
                yearHasLawMilestone
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              )}>
                {yearHasLawMilestone ? '含法規制定/修正節點' : '無法規制定/修正節點'}
              </span>
            </div>
            <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.8em] text-gray-400 mt-2 md:mt-4">Transitional Justice / Legislative Map</p>
          </div>
          <div className="text-right pb-4 pointer-events-auto w-full md:w-auto">
            <button
              onClick={exportToWord}
              disabled={isExporting}
              className={cn(
                'w-full md:w-auto text-[10px] font-black uppercase tracking-widest border-2 border-black px-6 py-3 transition-all',
                isExporting ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:bg-black hover:text-white'
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
            <YearGuideRenderer
              year={year}
              intelligence={intelligence}
              session={session}
              data={data}
              groupedByLaw={groupedByLaw}
              summaryData={summaryData}
              onEnterArchive={() => year && navigate(`/${year}/archive`)}
            />
          ) : viewMode === 'archive' ? (
            <ArchiveView
              year={year || ''}
              data={data}
              groupedByLaw={groupedByLaw}
              identities={identities}
              filter={filter}
              search={search}
              session={session}
              setFilter={setFilter}
              setSearch={setSearch}
              getStageColor={getStageColor}
              getStanceColor={getStanceColor}
              lawHistoryMap={lawHistoryMap}
            />
          ) : (
            <PartyView
              year={year || ''}
              data={data}
              groupedByLaw={groupedByLaw}
              getStageColor={getStageColor}
              lyHistoryData={lyHistoryData}
              lawHistoryMap={lawHistoryMap}
            />
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
