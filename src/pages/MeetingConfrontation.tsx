import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftRight, Landmark } from 'lucide-react';
import { DataManager, LYHistoryData } from '../DataManager';
import {
  buildLandingTimelineBundle,
  getLawCumulativeByDate,
  getSeatContextByDate,
  MeetingMenuItem
} from '../utils/timelineEngine';

function parseClashIndex(meetingId: string): number {
  const match = (meetingId || '').match(/clash-(\d+)/);
  if (!match) return 0;
  return Number(match[1]) || 0;
}

function getExecutivePartyByDate(date: string): string {
  const year = Number((date || '').slice(0, 4));
  if (!Number.isFinite(year)) return '民主進步黨';
  if (year < 2000) return '中國國民黨';
  if (year < 2008) return '民主進步黨';
  if (year < 2016) return '中國國民黨';
  return '民主進步黨';
}

function isGovernmentSpeech(identity: string): boolean {
  return /(行政院|部長|次長|政務官|官員|處長|主委|院長|秘書長)/.test(identity || '');
}

export default function MeetingConfrontation() {
  const { year = '', meetingId = '' } = useParams<{ year: string; meetingId: string }>();
  const [meeting, setMeeting] = useState<MeetingMenuItem | null>(null);
  const [lyData, setLyData] = useState<LYHistoryData>({});
  const [lawPoints, setLawPoints] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'logic' | 'keyword'>('logic');

  useEffect(() => {
    let mounted = true;

    Promise.all([buildLandingTimelineBundle(), DataManager.getLYHistoryData()]).then(([bundle, ly]) => {
      if (!mounted) return;
      setLyData(ly || {});
      setLawPoints(bundle.lawCumulativePoints || []);

      const target = bundle.meetingItems.find((item) => item.year === year && item.href.endsWith(`/${meetingId}`));
      if (target) {
        setMeeting(target);
        return;
      }

      const clashIndex = parseClashIndex(meetingId);
      const fallback = bundle.meetingItems.find((item) => item.year === year && item.clashIndex === clashIndex)
        || bundle.meetingItems.find((item) => item.year === year)
        || null;
      setMeeting(fallback);
    });

    return () => {
      mounted = false;
    };
  }, [meetingId, year]);

  const seatContext = useMemo(() => {
    if (!meeting?.date) return null;
    return getSeatContextByDate(lyData, meeting.date);
  }, [lyData, meeting?.date]);

  const lawState = useMemo(() => {
    if (!meeting?.date) return { totalEnactments: 0, totalRevisions: 0, totalActions: 0 };
    return getLawCumulativeByDate(lawPoints, meeting.date);
  }, [lawPoints, meeting?.date]);

  const executiveParty = useMemo(() => getExecutivePartyByDate(meeting?.date || ''), [meeting?.date]);
  const executiveSeats = useMemo(
    () => seatContext?.parties.find((party) => party.party === executiveParty)?.seats || 0,
    [seatContext, executiveParty]
  );
  const oppositionSeats = Math.max(0, (seatContext?.totalSeats || 0) - executiveSeats);
  const politicalLabel = executiveSeats < oppositionSeats ? '朝小野大' : executiveSeats > oppositionSeats ? '朝大野小' : '朝野均勢';

  const governmentSpeeches = useMemo(
    () => (meeting?.speeches || []).filter((speech) => isGovernmentSpeech(speech.identity || '')),
    [meeting?.speeches]
  );
  const oppositionSpeeches = useMemo(
    () => (meeting?.speeches || []).filter((speech) => !isGovernmentSpeech(speech.identity || '')),
    [meeting?.speeches]
  );

  if (!meeting) {
    return (
      <div className="min-h-screen px-6 py-12 md:px-12">
        <Link to="/" className="text-sm font-black uppercase tracking-[0.2em] border border-black px-3 py-2 inline-block">Back Home</Link>
        <p className="mt-10 text-xl font-black serif">找不到對應的會議資料。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 md:px-12 bg-[#ece3d4] text-[#221914]">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b-4 border-black pb-6">
          <div>
            <Link to="/timeline" className="text-[10px] font-black uppercase tracking-[0.24em] border border-black px-3 py-2 inline-block hover:bg-[#8C2F39]/10 hover:text-[#8C2F39] transition-colors">
              返回首頁
            </Link>
            <h1 className="mt-5 text-4xl md:text-6xl font-black serif leading-tight">{meeting.title}</h1>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-[#6c5d54]">{meeting.year} / {meeting.meetingType} / {meeting.stageName}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c5d54]">會議檢視</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setViewMode('logic')}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] border ${viewMode === 'logic' ? 'border-[#8C2F39] bg-[#8C2F39]/10 text-[#8C2F39]' : 'border-[#cdbfae] bg-[#e9decd] text-[#5f5149]'}`}
              >
                真實發言
              </button>
              <button
                onClick={() => setViewMode('keyword')}
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] border ${viewMode === 'keyword' ? 'border-[#8C2F39] bg-[#8C2F39]/10 text-[#8C2F39]' : 'border-[#cdbfae] bg-[#e9decd] text-[#5f5149]'}`}
              >
                對抗摘要
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <section className="border-2 border-black bg-[#f4efe7] p-5 md:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8C2F39]">會議摘要</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#c9b9a8] bg-[#e9decd] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39]">政府方</p>
                  <p className="mt-2 text-xl font-black serif">{meeting.governmentLabel}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f5149]">{viewMode === 'logic' ? meeting.governmentLogic : meeting.keywordFocus || meeting.governmentLogic}</p>
                </div>
                <div className="border border-[#c9b9a8] bg-[#e9decd] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8C2F39]">在野方</p>
                  <p className="mt-2 text-xl font-black serif">{meeting.oppositionLabel}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5f5149]">{viewMode === 'logic' ? meeting.oppositionLogic : meeting.keywordFocus || meeting.oppositionLogic}</p>
                </div>
              </div>
            </section>

            <section className="border-2 border-black bg-[#f4efe7] p-5 md:p-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#8C2F39]">
                <ArrowLeftRight className="w-4 h-4" />
                真實發言資料
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f5149]">政府 / 官員發言</p>
                  {governmentSpeeches.length === 0 && <p className="text-sm text-[#6c5d54]">此筆未辨識到官員發言。</p>}
                  {governmentSpeeches.map((speech) => (
                    <article key={speech.id} className="border border-[#c9b9a8] bg-[#e9decd] p-4">
                      <p className="text-lg font-black serif">{speech.speaker}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#6c5d54]">{speech.identity}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#5f5149]">{speech.discourse_logic}</p>
                    </article>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5f5149]">委員 / 在野發言</p>
                  {oppositionSpeeches.length === 0 && <p className="text-sm text-[#6c5d54]">此筆未辨識到委員發言。</p>}
                  {oppositionSpeeches.map((speech) => (
                    <article key={speech.id} className="border border-[#c9b9a8] bg-[#e9decd] p-4">
                      <p className="text-lg font-black serif">{speech.speaker}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#6c5d54]">{speech.identity}</p>
                      <p className="mt-3 text-sm leading-relaxed text-[#5f5149]">{speech.discourse_logic}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <aside className="border-2 border-black bg-[#ded1bf] p-5 space-y-5 text-[#221914]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8C2F39]">國會席次 / 執政顯示</p>
              <p className="mt-2 text-xl font-black serif">{seatContext?.term || '未知屆別'}</p>
              <p className="text-xs text-[#6c5d54]">{seatContext?.termRange || '-'}</p>
              <p className="mt-2 text-sm font-bold">執政黨：{executiveParty}</p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 border border-[#8C2F39]/40 bg-[#8C2F39]/5">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8C2F39]">{politicalLabel}</span>
                <span className="text-[10px] font-bold text-[#5f5149]">{executiveSeats}:{oppositionSeats}</span>
              </div>
              {seatContext?.isSupplementaryOnly && (
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#8C2F39]">第一屆增額席次模式</p>
              )}
            </div>

            <div className="space-y-2">
              {(seatContext?.parties || []).slice(0, 5).map((party) => (
                <div key={party.party}>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{party.party}</span>
                    <span>{party.seats}</span>
                  </div>
                  <div className="h-2 bg-[#e9decd] border border-black/10">
                    <div className="h-full bg-[#8C2F39]" style={{ width: `${Math.max(2, party.ratio * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/20 pt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6c5d54]">法規累加</p>
              <div className="mt-2 space-y-1 text-sm font-bold text-[#5f5149]">
                <p>制定：{lawState.totalEnactments}</p>
                <p>修正：{lawState.totalRevisions}</p>
                <p className="text-[#8C2F39]">累計：{lawState.totalActions}</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="border border-black/20 bg-[#ded1bf] p-5 md:p-8 relative overflow-hidden">
          <Landmark className="absolute -right-6 -bottom-6 w-28 h-28 opacity-10 text-[#8C2F39]" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#8C2F39]">會議結構</p>
            <p className="mt-3 text-lg md:text-2xl font-black serif leading-relaxed">{meeting.lawName}</p>
            <div className="my-5 flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-black text-[#6c5d54]">
              <ArrowLeftRight className="w-4 h-4" />
              {meeting.stageName}
            </div>
            <p className="text-base md:text-lg leading-relaxed text-[#5f5149]">本頁直接使用這一筆會議分組出的真實發言資料，並用左側同步呈現當時席次與朝野結構。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
