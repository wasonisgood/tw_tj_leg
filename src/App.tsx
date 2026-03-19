import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import YearOverview from './pages/YearOverview';
import SpeechDetail from './pages/SpeechDetail';
import Debug from './pages/Debug';
import LawDetail from './pages/LawDetail';
import YearRedirect from './pages/YearRedirect';
import FullRevisionGuide from './pages/FullRevisionGuide';
import MeetingConfrontation from './pages/MeetingConfrontation';
import TimelineNavigator from './pages/TimelineNavigator';
import BillDetail from './pages/BillDetail';

function App() {
  return (
    <div className="relative min-h-screen">
      <div className="noise-bg"></div>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/guide/full-revision" element={<FullRevisionGuide />} />
          <Route path="/timeline" element={<TimelineNavigator />} />
          <Route path="/laws/:lawSlug" element={<LawDetail />} />
          <Route path="/bills/:billId" element={<BillDetail />} />
          <Route path="/:year" element={<YearRedirect />} />
          <Route path="/:year/guide" element={<YearOverview />} />
          <Route path="/:year/archive" element={<YearOverview />} />
          <Route path="/:year/party" element={<YearOverview />} />
          <Route path="/:year/archive/speech/:speakerId" element={<SpeechDetail />} />
          <Route path="/:year/:speakerId" element={<SpeechDetail />} />
          <Route path="/meetings/:year/:meetingId" element={<MeetingConfrontation />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
