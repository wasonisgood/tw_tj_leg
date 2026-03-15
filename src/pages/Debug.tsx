import { useEffect, useState } from 'react';
import { DataManager } from '../DataManager';

const Debug = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('Starting diagnostics...');
      await DataManager.init();
      
      const result1987 = await DataManager.getProcessedYearData('1987');
      
      console.log('=== DIAGNOSTICS RESULT ===');
      console.log('Year 1987 speeches count:', result1987.speeches.length);
      console.log('First 5 speech IDs:', result1987.speeches.slice(0, 5).map(s => s.id));
      console.log('Looking for spk-1987-e08e01c5e6c563b2...');
      const found = result1987.speeches.find(s => s.id === 'spk-1987-e08e01c5e6c563b2');
      console.log('Found:', !!found);
      if (found) {
        console.log('Speech data:', found);
      }
      
      setData({
        speechesCount: result1987.speeches.length,
        firstFive: result1987.speeches.slice(0, 5).map(s => ({ id: s.id, speaker: s.speaker })),
        target: found ? { id: found.id, speaker: found.speaker } : null,
      });
    };
    
    runDiagnostics();
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Diagnostics</h1>
      <pre className="bg-gray-100 p-4 overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-8 text-gray-600">Check browser console for detailed logs</p>
    </div>
  );
};

export default Debug;
