import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, BookText } from 'lucide-react';
import { DataManager, LYHistoryData } from '../DataManager';
import { buildLandingTimelineBundle, getLawCumulativeByDate, getSeatContextByDate, TimelineEventItem } from '../utils/timelineEngine';

const PARTY_COLORS: Record<string, string> = {
  '民主進步黨': '#2f855a',
  '中國國民黨': '#2457a6',
  '台灣民眾黨': '#0e9f9a',
  '時代力量': '#c28c00',
  '無黨籍': '#6b7280',
  '無': '#6b7280',
  '未知': '#9ca3af'
};

function getExecutivePartyByDate(date: string): string {
  const year = Number((date || '').slice(0, 4));
  if (!Number.isFinite(year)) return '民主進步黨';
  if (year < 2000) return '中國國民黨';
  if (year < 2008) return '民主進步黨';
  if (year < 2016) return '中國國民黨';
  return '民主進步黨';
}

function getPoliticalPattern(
  date: string,
  seatContext: ReturnType<typeof getSeatContextByDate>
): { executiveParty: string; executiveSeats: number; oppositionSeats: number; label: string } {
  const executiveParty = getExecutivePartyByDate(date);
  const parties = seatContext?.parties || [];
  const totalSeats = seatContext?.totalSeats || 0;
  const executiveSeats = parties.find((party) => party.party === executiveParty)?.seats || 0;
  const oppositionSeats = Math.max(0, totalSeats - executiveSeats);

  let label = '朝野均勢';
  if (executiveSeats < oppositionSeats) label = '朝小野大';
  if (executiveSeats > oppositionSeats) label = '朝大野小';

  return { executiveParty, executiveSeats, oppositionSeats, label };
}

function buildSeatPalette(parties: Array<{ party: string; ratio: number }>): string[] {
  const colors: string[] = [];
  const totalDots = 90;

  parties.forEach((party) => {
    const count = Math.max(0, Math.round((party.ratio || 0) * totalDots));
    const color = PARTY_COLORS[party.party] || PARTY_COLORS['未知'];
    for (let i = 0; i < count; i += 1) colors.push(color);
  });

  while (colors.length < totalDots) {
    colors.push('#d1d5db');
  }

  return colors.slice(0, totalDots);
}

export default function TimelineNavigator() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEventItem[]>([]);
  const [activeTimelineDate, setActiveTimelineDate] = useState('1987-01-01');
  const [lawCumulativePoints, setLawCumulativePoints] = useState<any[]>([]);
  const [lyHistoryData, setLyHistoryData] = useState<LYHistoryData>({});

  useEffect(() => {
    let mounted = true;

    Promise.all([buildLandingTimelineBundle(), DataManager.getLYHistoryData()])
      .then(([bundle, lyData]) => {
        if (!mounted) return;

        setLawCumulativePoints(bundle.lawCumulativePoints || []);
        setLyHistoryData(lyData || {});
        setEvents(bundle.unifiedEvents || []);
      })
      .catch(() => {
        if (!mounted) return;
        setEvents([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const seatContext = useMemo(() => getSeatContextByDate(lyHistoryData, activeTimelineDate), [lyHistoryData, activeTimelineDate]);
  const lawCumulative = useMemo(() => getLawCumulativeByDate(lawCumulativePoints, activeTimelineDate), [lawCumulativePoints, activeTimelineDate]);
  const politicalPattern = useMemo(() => getPoliticalPattern(activeTimelineDate, seatContext), [activeTimelineDate, seatContext]);
  const seatPalette = useMemo(() => buildSeatPalette(seatContext?.parties || []), [seatContext?.parties]);

  const onSelectItem = (item: { href: string; date: string }) => {
    setActiveTimelineDate(item.date);
    navigate(item.href);
  };

  const onFocusItem = (item: { date: string }) => {
    setActiveTimelineDate(item.date);
  };

  const isActiveEvent = (date: string) => date === activeTimelineDate;

  const groupedEvents = useMemo(() => {
    const map: Record<string, TimelineEventItem[]> = {};
    events.forEach((event) => {
      const year = event.date.slice(0, 4) || '未知';
      if (!map[year]) map[year] = [];
      map[year].push(event);
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, items]) => ({ year, items }));
  }, [events]);

  const activeEvent = useMemo(
    () => events.find((event) => event.date === activeTimelineDate) || null,
    [events, activeTimelineDate]
  );

  return (
    <div className="min-h-screen px-6 py-8 md:px-12 md:py-10 bg-[#ece3d4] text-[#221914]">
      <div className="max-w-7xl mx-auto">
        <header className="min-h-[62vh] border-b-4 border-black pb-10 flex flex-col justify-end relative overflow-hidden">
          <p className="absolute -top-6 right-0 text-[20vw] leading-none font-black serif opacity-[0.05] select-none pointer-events-none">Archive</p>
          <Link to="/" className="mb-8 inline-flex w-fit px-3 py-2 border border-black text-[10px] font-black uppercase tracking-[0.24em] hover:bg-[#8C2F39]/10 hover:text-[#8C2F39] transition-colors">
            返回首頁
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C2F39]">Independent Navigator</p>
          <h1 className="mt-4 text-5xl md:text-8xl font-black serif leading-[0.85] tracking-tight">Editorial Timeline</h1>
          <p className="mt-4 text-sm md:text-base font-bold text-[#5c4c42] uppercase tracking-[0.13em]">
            舊到新單一時間軸，逐筆會議與法規事件整併呈現
          </p>
          <p className="mt-3 text-sm text-[#6c5d54] leading-relaxed max-w-3xl">
            每一筆都可直接點入原事件。你在時間軸上停留的位置，會同步更新左側席次圖與朝野判讀。
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#6c5d54] border-b border-[#cdbfae] pb-1 w-fit">
            <ArrowDown className="w-4 h-4" />
            向下滑動開始
          </div>
        </header>

        <div className="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-6">
          <aside className="xl:col-span-4 border-2 border-black bg-[#ded1bf] p-5 md:p-6 h-fit xl:sticky xl:top-6 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)] text-[#221914]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8C2F39]">背景時間軸狀態</p>
              <p className="mt-2 text-2xl font-black serif">{seatContext?.term || '資料準備中'}</p>
              <p className="text-xs text-[#6c5d54]">{seatContext?.termRange || '-'}</p>
              <p className="mt-2 text-sm font-bold">執政黨：{politicalPattern.executiveParty}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 border border-[#8C2F39]/40 bg-[#8C2F39]/5">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8C2F39]">{politicalPattern.label}</span>
                <span className="text-[10px] font-bold text-[#5f5149]">{politicalPattern.executiveSeats}:{politicalPattern.oppositionSeats}</span>
              </div>
              <p className="mt-2 text-[11px] text-[#5f5149] leading-relaxed">
                以行政權所屬政黨對照國會席次，呈現 {politicalPattern.label} 的歷史結構。
              </p>
              {seatContext?.isSupplementaryOnly && (
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39]">第一屆僅顯示增額席次</p>
              )}
            </div>

            <div className="border-t border-black/20 pt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">目前焦點事件</p>
              <p className="mt-2 text-lg font-black serif leading-tight">{activeEvent?.title || '請在右側時間軸停留任一事件'}</p>
              <p className="mt-1 text-xs text-[#6c5d54]">{activeEvent ? `${activeEvent.date} / ${activeEvent.badge}` : '-'}</p>
            </div>

            <div className="border-t border-black/20 pt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#8C2F39]">席次圖</p>
              <div className="mt-3 relative h-[220px] rounded-none border border-black/10 bg-[#e9decd] overflow-hidden">
                <div className="absolute inset-0">
                  {seatPalette.map((color, index) => {
                    const dotsPerRing = 30;
                    const ring = Math.floor(index / dotsPerRing);
                    const pos = index % dotsPerRing;
                    const angle = Math.PI - (pos / (dotsPerRing - 1)) * Math.PI;
                    const radius = 58 + ring * 24;
                    const centerX = 160;
                    const centerY = 190;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY - Math.sin(angle) * radius;

                    return (
                      <motion.span
                        key={`sidebar-seat-${index}-${color}`}
                        className="absolute h-[8px] w-[8px] rounded-full"
                        style={{ left: `${x}px`, top: `${y}px`, backgroundColor: color }}
                        initial={{ opacity: 0.2, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.18, delay: (index % 10) * 0.008 }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-black/20 pt-4">
              {(seatContext?.parties || []).slice(0, 4).map((party) => (
                <div key={party.party}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{party.party}</span>
                    <span>{party.seats}</span>
                  </div>
                  <div className="h-2 bg-[#e9decd] border border-black/10">
                    <motion.div
                      className="h-full bg-[#8C2F39]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(2, party.ratio * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-black/20">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">法規制定/修正累加</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div className="border border-black/20 bg-[#e9decd] py-2">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#6c5d54]">制定</p>
                  <p className="text-lg font-black serif">{lawCumulative.totalEnactments}</p>
                </div>
                <div className="border border-black/20 bg-[#e9decd] py-2">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#6c5d54]">修正</p>
                  <p className="text-lg font-black serif">{lawCumulative.totalRevisions}</p>
                </div>
                <div className="border border-[#8C2F39]/40 bg-[#8C2F39]/5 py-2">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#8C2F39]">累積</p>
                  <p className="text-lg font-black serif text-[#8C2F39]">{lawCumulative.totalActions}</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="xl:col-span-8 space-y-6">
            <section className="space-y-4 min-h-[55vh]">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C2F39]">Unified Vertical Timeline</h2>
              <p className="text-3xl md:text-5xl font-black serif">逐筆會議與法規事件</p>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#6c5d54]">Old to New / 單軸垂直下拉</p>
              <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#6c5d54]">
                <span className="px-2 py-1 border border-[#cdbfae] bg-[#e9decd]">會議</span>
                <span className="px-2 py-1 border border-[#cdbfae] bg-[#e9decd]">法規</span>
                <span className="px-2 py-1 border border-[#8C2F39]/40 text-[#8C2F39]">可點擊進入原頁</span>
                <span className="px-2 py-1 border border-black/20">共 {events.length} 筆</span>
              </div>

              <div className="relative ml-3 space-y-0 pt-2 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-black via-[#8C2F39] to-black" />
                {events.length === 0 && (
                  <div className="ml-7 border border-black/15 bg-[#ded1bf] p-6 text-sm text-[#5f5149]">
                    尚無可顯示的事件資料。
                  </div>
                )}

                {groupedEvents.map(({ year, items }) => (
                  <div key={year} className="relative">
                    <div className="ml-7 mt-6 mb-2 flex items-end justify-between border-b border-black/20 pb-2">
                      <p className="text-2xl md:text-4xl font-black serif leading-none">{year}</p>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c5d54]">{items.length} 筆</span>
                    </div>

                    {items.map((event, index) => (
                      <button
                        key={event.id}
                        onMouseEnter={() => onFocusItem({ date: event.date })}
                        onFocus={() => onFocusItem({ date: event.date })}
                        onClick={() => onSelectItem(event)}
                        className={`group relative ml-7 block w-[calc(100%-2rem)] border-b py-5 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#8C2F39]/40 ${
                          isActiveEvent(event.date)
                            ? 'border-[#8C2F39]/45 bg-[#f4efe7]/70'
                            : 'border-black/15 hover:bg-[#e9decd]/45'
                        }`}
                      >
                        <span className={`absolute -left-[2.02rem] top-7 h-3 w-3 rounded-full ${isActiveEvent(event.date) ? 'bg-[#8C2F39]' : 'bg-black group-hover:bg-[#8C2F39]'}`} />
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6c5d54]">
                            <span>{event.date}</span>
                            <span className="px-2 py-1 border border-[#cdbfae] bg-[#e9decd]">{event.eventType === 'meeting' ? '會議' : '法規'}</span>
                            <span className="px-2 py-1 border border-[#8C2F39]/40 text-[#8C2F39]">{event.badge}</span>
                          </div>
                          <span className="text-5xl font-black serif leading-none text-black/10 group-hover:text-[#8C2F39]/30 transition-colors">{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                          <p className="md:col-span-8 text-xl md:text-2xl font-black serif leading-tight">{event.title}</p>
                          <div className="md:col-span-4 text-right hidden md:block">
                            <BookText className="ml-auto w-4 h-4 text-black/35 group-hover:text-[#8C2F39]" />
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-[#5f5149] leading-relaxed max-w-3xl">{event.subtitle}</p>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
