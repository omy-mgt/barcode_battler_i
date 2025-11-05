
import React from 'react';

const loadingMessages = [
  "Warming up the pixels...",
  "Consulting the digital muses...",
  "Painting with light and logic...",
  "This might take a moment...",
  "Unleashing creative algorithms...",
  "Generating your visual masterpiece...",
];

export const LoadingOverlay: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-400 border-slate-600 rounded-full animate-spin"></div>
      <p className="mt-6 text-xl text-slate-200 font-medium">{message}</p>
    </div>
  );
};
