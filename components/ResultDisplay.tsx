
import React from 'react';

interface ResultDisplayProps {
  generatedImageUrl: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImageUrl, error }) => {
  if (error) {
    return (
      <div className="w-full h-full min-h-[30rem] flex items-center justify-center bg-red-900/20 border border-red-500/50 rounded-lg p-4">
        <div className="text-center text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 font-semibold">An error occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (generatedImageUrl) {
    return (
      <div className="w-full flex flex-col items-center gap-4">
        <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
          <img src={generatedImageUrl} alt="Generated result" className="w-full h-auto object-contain" />
        </div>
        <a
          href={generatedImageUrl}
          download="edited-image.png"
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </a>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[30rem] flex items-center justify-center bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <div className="text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 15l4-4 3 3 5-5 5 5" />
        </svg>
        <p className="mt-4 text-lg">Your edited image will appear here</p>
      </div>
    </div>
  );
};
