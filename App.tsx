import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingOverlay } from './components/LoadingOverlay';
import { BarcodeScanner } from './components/BarcodeScanner'; // Import the scanner
import { generateImage } from './services/huggingFaceService';

const App: React.FC = () => {
  const [inputNumber, setInputNumber] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setScannerOpen] = useState<boolean>(false); // State for scanner modal

  const handleGenerateClick = useCallback(async () => {
    if (!inputNumber || !prompt) {
      setError('Please enter a number and a description.');
      return;
    }
    
    const num = parseInt(inputNumber, 10);
    if (isNaN(num) || !Number.isFinite(num)) {
        setError('Please enter a valid number.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      // Generate some stats from the number, inspired by Barcode Battler.
      const s = inputNumber.padStart(9, '0');
      const hp = parseInt(s.slice(0, 3), 10) * (10 + (num % 5));
      const attack = parseInt(s.slice(3, 6), 10) * (1 + (num % 3));
      const defense = parseInt(s.slice(6, 9), 10) * (1 + (num % 4));

      const finalPrompt = `Generate a fantasy character based on the following:\nDescription: "${prompt}".\nThis character is a powerful being derived from a unique numerical signature.\nBase stats:\n- HP: ${hp}\n- Attack: ${attack}\n- Defense: ${defense}\nThe visual design should reflect these stats. A high HP character might be large and sturdy, while a high attack character could have prominent weapons or energy auras. The art style should be detailed digital painting, suitable for a fantasy game.`;

      const newImageBase64 = await generateImage(finalPrompt);
      setGeneratedImageUrl(newImageBase64);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputNumber, prompt]);

  // Handler for when the scanner gets a result
  const handleScan = (result: string) => {
    setInputNumber(result);
    setScannerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header />
      {isLoading && <LoadingOverlay />}
      {isScannerOpen && <BarcodeScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700 flex flex-col gap-6 h-fit">
            <h2 className="text-2xl font-bold text-cyan-400">1. Enter Number</h2>
            <div className="relative w-full">
              <input
                  type="text"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g., 8005123456789"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 text-slate-100 placeholder-slate-400 text-lg tracking-wider"
                  maxLength={13}
              />
              <button 
                onClick={() => setScannerOpen(true)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white py-1 px-3 rounded-full transition-colors"
              >
                Scan
              </button>
            </div>

            <h2 className="text-2xl font-bold text-cyan-400 mt-4">2. Describe Character</h2>
            <PromptInput prompt={prompt} setPrompt={setPrompt} />
            
            <button
              onClick={handleGenerateClick}
              disabled={!inputNumber || !prompt || isLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-600/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate
            </button>
          </div>

          {/* Result Column */}
          <div className="bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">3. View Character</h2>
            <ResultDisplay generatedImageUrl={generatedImageUrl} error={error} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        Powered by Hugging Face
      </footer>
    </div>
  );
};

export default App;