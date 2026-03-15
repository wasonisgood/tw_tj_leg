import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataManager, ProcessedSpeech, PDFLink } from '../DataManager';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Info, Tag, Quote, FileText, Download } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SpeechDetail = () => {
  const { year, speakerId } = useParams<{ year: string; speakerId: string }>();
  const [speech, setSpeech] = useState<ProcessedSpeech | null>(null);
  const [pdfLink, setPdfLink] = useState<PDFLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!year || !speakerId) return;

    const loadSpeech = async () => {
      try {
        console.log(`[SpeechDetail] Starting load: year=${year}, speakerId=${speakerId}`);
        setLoading(true);
        setError(null);

        await DataManager.init();
        console.log(`[SpeechDetail] DataManager initialized`);

        const res = await DataManager.getProcessedYearData(year);
        console.log(`[SpeechDetail] Data loaded:`, {
          speechesCount: res?.speeches?.length,
          hasSpeeches: !!res?.speeches,
        });

        if (!res || !Array.isArray(res.speeches)) {
          throw new Error('Invalid response: speeches is not an array');
        }

        console.log(`[SpeechDetail] Looking for speakerId: ${speakerId}`);
        console.log(`[SpeechDetail] Sample IDs:`, res.speeches.slice(0, 3).map(s => s.id));

        const found = res.speeches.find(s => s.id === speakerId);
        console.log(`[SpeechDetail] Search result: ${found ? 'FOUND' : 'NOT FOUND'}`);

        if (!found) {
          setError(`Speech with ID ${speakerId} not found in year ${year}`);
          setSpeech(null);
        } else {
          setSpeech(found);
          if (found.metadata?.file_stem) {
            console.log(`[SpeechDetail] Looking for PDF link with file_stem: ${found.metadata.file_stem}`);
            const link = DataManager.getPDFLink(found.metadata.file_stem);
            console.log(`[SpeechDetail] PDF link result:`, link);
            setPdfLink(link);
          } else {
            console.log(`[SpeechDetail] No file_stem found in metadata`);
          }
        }
      } catch (err) {
        console.error(`[SpeechDetail] Error:`, err);
        const message = err instanceof Error ? err.message : String(err);
        setError(`Failed to load data: ${message}`);
        setSpeech(null);
      } finally {
        setLoading(false);
      }
    };

    loadSpeech();
  }, [year, speakerId]);

  const renderStanceTags = (orientation: string) => {
    const parts = orientation.split('/').map(p => p.trim());
    return (
      <div className="flex flex-wrap gap-3">
        {parts.map((p, i) => (
          <span 
            key={i} 
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-[0.2em] border shadow-sm",
              p.includes('支持') || p.includes('積極') || p.includes('改革') ? 'bg-emerald-600 text-white border-emerald-700' :
              p.includes('反對') || p.includes('保留') || p.includes('批判') ? 'bg-rose-700 text-white border-rose-800' :
              p.includes('中立') || p.includes('程序') || p.includes('法制') ? 'bg-slate-700 text-white border-slate-800' :
              p.includes('保守') || p.includes('穩定') ? 'bg-[#8C2F39] text-white border-[#6D232B]' : 'bg-amber-600 text-white border-amber-700'
            )}
          >
            {p}
          </span>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center font-serif italic text-4xl text-gray-300">
      Reading Document...
    </div>
  );

  if (error || !speech) return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-3xl font-black serif mb-4">Error</h2>
        <p className="text-lg mb-4">{error || 'Speech Not Found'}</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F9F9F7] flex flex-col md:flex-row text-[#1A1A1A]"
    >
      {/* Analysis Column */}
      <div className="w-full md:w-5/12 p-8 md:p-16 overflow-y-auto h-screen border-r border-gray-200">
        <Link to={`/${year}`} className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-16 transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Archive
        </Link>

        <header className="mb-20">
          <div className="flex flex-col space-y-4 mb-10">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-[#8C2F39] text-white text-xs font-black uppercase tracking-widest">
                {speech.stage}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                {speech.date}
              </span>
            </div>
            <h2 className="text-2xl font-black serif text-gray-800 border-l-4 border-gray-800 pl-4 py-1">
              {speech.lawName}
            </h2>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black serif leading-[0.9] mb-8 uppercase break-words">
            {speech.speaker}
          </h1>

          <div className="flex flex-wrap gap-y-4 gap-x-8 py-6 border-y border-gray-200">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Identity</span>
              <span className="text-sm font-bold flex items-center"><Info className="w-3 h-3 mr-1.5 opacity-30" /> {speech.identity.split('（')[0].split('(')[0].trim()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Archive ID</span>
              <span className="text-sm font-bold flex items-center"><Tag className="w-3 h-3 mr-1.5 opacity-30" /> {speech.id}</span>
            </div>
            {pdfLink && (
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Original PDF</span>
                <div className="flex space-x-3">
                  <a 
                    href={pdfLink.previewLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold flex items-center text-[#8C2F39] hover:underline"
                  >
                    <FileText className="w-3 h-3 mr-1" /> Preview
                  </a>
                  <a 
                    href={pdfLink.downloadLink} 
                    className="text-xs font-bold flex items-center text-gray-600 hover:underline"
                  >
                    <Download className="w-3 h-3 mr-1" /> Download
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="space-y-16">
          <div className="relative">
            <Quote className="absolute -left-8 -top-4 w-12 h-12 text-gray-100 -z-10" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8C2F39] mb-6">Core Discourse Logic</h2>
            <p className="text-3xl serif italic leading-relaxed">
              「{speech.discourse_logic}」
            </p>
          </div>

          <div className="p-8 bg-white border border-gray-100 card-shadow">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">Detailed Stances</h2>
            <div className="space-y-8">
              {speech.stances.map((st, i) => (
                <div key={i} className="group">
                  <h3 className="text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center">
                    <div className="w-4 h-[1px] bg-gray-200 mr-2"></div> {st.topic}
                  </h3>
                  <p className="text-lg font-bold mb-3 leading-snug">{st.position}</p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 border-l-2 border-gray-200 italic">{st.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Political Orientation</h2>
            {renderStanceTags(speech.political_orientation)}
          </div>
        </section>
      </div>

      {/* Image Column */}
      <div className="w-full md:w-7/12 h-screen bg-[#E5E5E0] flex flex-col">
        <div className="p-6 bg-white/50 backdrop-blur-md border-b border-gray-200 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center">
            <Tag className="w-3 h-3 mr-2" /> Original Document Pages ({speech.imagePaths?.length || 0})
          </span>
          {speech.imagePaths && speech.imagePaths.length > 0 && (
            <div className="flex space-x-4">
              {speech.imagePaths.map((path, idx) => (
                <a 
                  key={idx}
                  href={DataManager.getImageUrl(path)} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest hover:underline flex items-center transition-colors"
                >
                  P{idx + 1} <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex-grow overflow-auto p-12 flex flex-col items-center space-y-12">
          {speech.imagePaths && speech.imagePaths.length > 0 ? (
            speech.imagePaths.map((path, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-4 shadow-2xl ring-1 ring-black/5 w-full max-w-4xl"
              >
                <div className="mb-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
                  Page {idx + 1}
                </div>
                <img 
                  src={DataManager.getImageUrl(path)} 
                  alt={`Source document page ${idx + 1}`} 
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                />
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center serif">
              <p className="italic text-xl">Image Placeholder</p>
              <p className="text-[10px] uppercase tracking-widest mt-2">ID: {speech.id}</p>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default SpeechDetail;
