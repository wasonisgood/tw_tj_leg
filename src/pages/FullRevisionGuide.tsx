import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { DataManager, LawHistoryData, LawLegislationVersion } from '../DataManager';
import { toLawSlug } from '../components/year-overview/archiveUtils';

type FullRevisionEntry = {
  year: string;
  lawName: string;
  version: LawLegislationVersion;
  actionType: string;
};

const CORE_YEARS = new Set([
  '1987',
  '1992', '1993', '1994', '1995', '1997', '1998', '1999', '2000',
  '2001', '2002', '2003', '2006', '2009', '2013',
  '2016', '2017', '2019', '2022', '2023', '2024'
]);

function getActionType(version: LawLegislationVersion): string {
  const label = version.label || '';
  if (label.includes('制定')) return '制定';
  if (label.includes('全文修正')) return '全文修正';
  if (label.includes('增訂')) return '增訂';
  if (label.includes('修正')) return '修正';
  return '修法';
}

export default function FullRevisionGuide() {
  const location = useLocation();
  const [lawHistoryMap, setLawHistoryMap] = useState<Record<string, LawHistoryData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    DataManager.getAllLawHistory()
      .then((map) => {
        if (!mounted) return;
        setLawHistoryMap(map || {});
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const groupedByYear = useMemo(() => {
    const entries: FullRevisionEntry[] = [];

    Object.values(lawHistoryMap).forEach((law) => {
      if (law.metadata?.filters_applied) return;
      const lawName = law.metadata?.law_name || '';
      (law.legislation_versions || []).forEach((version) => {
        const year = (version.version_date || '').slice(0, 4);
        if (!/^\d{4}$/.test(year)) return;
        if (CORE_YEARS.has(year)) return;
        const actionType = getActionType(version);
        if (!actionType) return;

        entries.push({ year, lawName, version, actionType });
      });
    });

    const unique = new Map<string, FullRevisionEntry>();
    entries.forEach((item) => {
      const key = `${item.year}-${item.lawName}-${item.version.version_date}-${item.actionType}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });

    const byYear: Record<string, FullRevisionEntry[]> = {};
    Array.from(unique.values())
      .sort((a, b) => a.version.version_date.localeCompare(b.version.version_date) || a.lawName.localeCompare(b.lawName, 'zh-Hant') || a.actionType.localeCompare(b.actionType, 'zh-Hant'))
      .forEach((item) => {
        if (!byYear[item.year]) byYear[item.year] = [];
        byYear[item.year].push(item);
      });

    return Object.entries(byYear)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, items]) => ({ year, items }));
  }, [lawHistoryMap]);

  const selectedYear = useMemo(() => {
    const queryYear = new URLSearchParams(location.search).get('year') || '';
    return /^\d{4}$/.test(queryYear) ? queryYear : '';
  }, [location.search]);

  const visibleGroups = useMemo(() => {
    if (!selectedYear) return groupedByYear;
    return groupedByYear.filter((group) => group.year === selectedYear);
  }, [groupedByYear, selectedYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <header className="border-b-[3px] border-black pb-8 mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-1 hover:text-[#8C2F39] hover:border-[#8C2F39] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Index
          </Link>

          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#8C2F39]">Special Guide</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-black serif">缺席年度法規變動索引</h1>
          <p className="mt-4 text-sm text-gray-600">
            顯示「不在既有年度清單中，但法規存在制定/修正/全文修正/增訂」的年份。這些年份可能沒有發言分析資料，
            但法律文本仍有重要變化。
          </p>
        </header>

        {!groupedByYear.length && (
          <div className="border border-gray-200 bg-white p-8 text-sm text-gray-600">
            目前未偵測到缺席年度的法規變動節點。
          </div>
        )}

        {!!selectedYear && !visibleGroups.length && (
          <div className="border border-gray-200 bg-white p-8 text-sm text-gray-600">
            目前未偵測到 {selectedYear} 年的缺席年度法規變動節點。
          </div>
        )}

        {!!selectedYear && visibleGroups.length > 0 && (
          <div className="mb-8 inline-flex items-center gap-2 border border-[#8C2F39] bg-[#8C2F39]/5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39]">
            Focus Year: {selectedYear}
          </div>
        )}

        <div className="space-y-12">
          {visibleGroups.map((group) => (
            <section key={group.year} id={`year-${group.year}`} className="space-y-5">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-5xl font-black serif border-b-4 border-black pb-1">{group.year}</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  {group.items.length} 個法規變動節點
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.items.map((entry) => {
                  const lawName = entry.lawName;
                  return (
                    <Link
                      key={`${group.year}-${entry.lawName}-${entry.version.version_date}`}
                      to={`/laws/${toLawSlug(lawName)}?date=${entry.version.version_date}&fromYear=${group.year}&fromSource=missing-year`}
                      className="block border border-gray-200 bg-white p-5 hover:border-black hover:shadow-sm transition-all"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">法規歷程節點</p>
                      <p className="mt-2 text-lg font-black serif">{entry.version.version_date} {entry.actionType}</p>
                      <p className="mt-2 text-sm text-gray-700">{lawName}</p>
                      <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39]">
                        <Scale className="w-3 h-3" />
                        前往法律詳細頁
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
