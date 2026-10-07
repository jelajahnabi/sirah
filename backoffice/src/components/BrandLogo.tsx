import React from 'react';
import { useApp } from '../context/AppContext';
import { Upload } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  showUploadPrompt?: boolean;
  compact?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-9',
  showUploadPrompt = true,
  compact = false,
}) => {
  const { customLogo, setIsLogoModalOpen, theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2.5">
      {customLogo ? (
        <div
          onClick={() => setIsLogoModalOpen(true)}
          className="group relative cursor-pointer flex items-center transition-transform hover:opacity-95"
          title="Klik untuk mengubah atau menghapus logo resmi"
        >
          <img
            src={customLogo}
            alt="Logo PT MUDAHKEBAITULLAH TRAVEL INDONESIA"
            className={`${className} w-auto object-contain max-w-[200px] rounded-xs`}
          />
          {showUploadPrompt && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xs transition-opacity">
              <span className="text-[9px] text-white font-medium bg-black/70 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Upload className="w-2.5 h-2.5" /> Ganti
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Typographic Corporate Lockup (Clean, Minimalist, Elegant) */
        <div
          onClick={() => setIsLogoModalOpen(true)}
          className="group cursor-pointer flex items-center gap-2 select-none"
          title="Klik untuk mengunggah logo resmi (PNG/JPG)"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black tracking-tight text-xs uppercase leading-none font-sans ${
                  isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                }`}
              >
                MUDAHKEBAITULLAH
              </span>
            </div>
            {!compact && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] tracking-wider font-bold text-[#f27244] uppercase font-mono">
                  TRAVEL INDONESIA
                </span>
                <span
                  className={`text-[8px] font-mono px-1 py-0.2 rounded border ${
                    isDark
                      ? 'border-[#383633] text-[#8c8982] bg-[#22211f]'
                      : 'border-[#dedbd2] text-[#858178] bg-[#f5f4f0]'
                  }`}
                >
                  YOGYA
                </span>
              </div>
            )}
          </div>

          {showUploadPrompt && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoModalOpen(true);
              }}
              className={`p-1 rounded-md text-[10px] border transition-all flex items-center gap-1 opacity-70 group-hover:opacity-100 ${
                isDark
                  ? 'border-[#383633] text-[#9c988f] hover:text-[#f27244] hover:border-[#f27244]/40 bg-[#252422]'
                  : 'border-[#d8d5cb] text-[#737069] hover:text-[#f27244] hover:border-[#f27244]/40 bg-white'
              }`}
              title="Unggah logo resmi perusahaan"
            >
              <Upload className="w-3 h-3 text-[#f27244]" />
              <span className="hidden sm:inline text-[9px] font-semibold">+Logo</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
