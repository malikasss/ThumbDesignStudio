import React, { useRef } from 'react';
import { Icon } from './Icon';

interface ToolbarProps {
  onAddText: (text: string) => void;
  onAddImage: (src: string, width?: number, height?: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAddText, onAddImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const src = event.target.result as string;
          const img = new Image();
          img.onload = () => {
             onAddImage(src, img.naturalWidth, img.naturalHeight);
          };
          img.src = src;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-20 bg-panel border-r border-gray-700 flex flex-col items-center py-4 gap-6 z-20 shrink-0">
      <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => onAddText("Double Click to Edit")}>
        <div className="p-3 rounded-xl bg-gray-800 hover:bg-brand-600 transition-colors">
          <Icon name="Type" className="text-white" />
        </div>
        <span className="text-[10px] text-gray-400 font-medium group-hover:text-white">Text</span>
      </div>

      <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <div className="p-3 rounded-xl bg-gray-800 hover:bg-brand-600 transition-colors">
          <Icon name="Image" className="text-white" />
        </div>
        <span className="text-[10px] text-gray-400 font-medium group-hover:text-white">Upload</span>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};