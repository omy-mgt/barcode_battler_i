
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imageUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-colors duration-300"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      {imageUrl ? (
        <img src={imageUrl} alt="Uploaded preview" className="max-w-full max-h-full object-contain rounded-md" />
      ) : (
        <div className="text-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5l5 5v7a4 4 0 01-4 4H7z" />
          </svg>
          <p className="mt-2">Click to upload or drag & drop an image</p>
        </div>
      )}
    </div>
  );
};
