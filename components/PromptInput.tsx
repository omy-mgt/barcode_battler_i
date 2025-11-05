import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const samplePrompts = [
    "A futuristic robot warrior",
    "A mystical forest creature",
    "A cyberpunk detective with glowing eyes",
    "An elegant sorceress wielding fire",
    "A cute, fluffy alien pet"
];

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A futuristic robot warrior with red armor"
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 min-h-[100px] text-slate-100 placeholder-slate-400"
        rows={4}
      />
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 py-1 px-3 rounded-full transition-colors"
            >
              {p}
            </button>
        ))}
      </div>
    </div>
  );
};