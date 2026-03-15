import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import YearOverview from './pages/YearOverview';
import SpeechDetail from './pages/SpeechDetail';

function App() {
  return (
    <div className="relative min-h-screen">
      <div className="noise-bg"></div>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:year" element={<YearOverview />} />
          <Route path="/:year/:speakerId" element={<SpeechDetail />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
