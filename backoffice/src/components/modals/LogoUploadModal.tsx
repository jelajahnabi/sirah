import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  Sparkles,
  Info,
} from 'lucide-react';

export const LogoUploadModal: React.FC = () => {
  const {
    isLogoModalOpen,
    setIsLogoModalOpen,
    customLogo,
    setCustomLogo,
    theme,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isLogoModalOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file format gambar (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSaveLogo = () => {
    if (previewUrl) {
      setCustomLogo(previewUrl);
      setPreviewUrl(null);
      setIsLogoModalOpen(false);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo(null);
    setPreviewUrl(null);
  };

  const currentActiveLogo = previewUrl || customLogo;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#1e1d1b] border-[#383633] text-[#f4f3ef]'
            : 'bg-white border-[#e2dfd7] text-[#262523]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'border-[#2d2c29] bg-[#1a1918]' : 'border-[#eeece6] bg-[#faf9f6]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">
                Upload Logo Resmi Travel
              </h3>
              <p
                className={`text-[11px] ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                {COMPANY_INFO.legalName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPreviewUrl(null);
              setIsLogoModalOpen(false);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'hover:bg-[#282725] text-[#9c988f] hover:text-[#f4f3ef]'
                : 'hover:bg-[#eeebe3] text-[#737069] hover:text-[#262523]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Upload Dropzone */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#f27244] bg-[#f27244]/10'
                : isDark
                ? 'border-[#383633] hover:border-[#f27244]/60 bg-[#171615]'
                : 'border-[#d8d5cb] hover:border-[#f27244]/60 bg-[#faf9f6]'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#f27244]/15 text-[#f27244] flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold mb-1">
              Klik untuk pilih file atau seret file logo ke sini
            </div>
            <div
              className={`text-[11px] ${
                isDark ? 'text-[#8c8982]' : 'text-[#858178]'
              }`}
            >
              Mendukung format PNG transparan, JPG, SVG, atau WebP (Maks. 5 MB)
            </div>
          </div>

          {/* Live Preview Section */}
          {currentActiveLogo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#f27244]" />
                  <span>Pratinjau Tampilan Logo:</span>
                </span>
                {previewUrl && (
                  <span className="text-[10px] bg-[#f27244]/20 text-[#f27244] px-2 py-0.5 rounded font-mono">
                    Baru Dipilih
                  </span>
                )}
              </div>

              {/* Dual preview: Dark Mode & Light Mode preview boxes */}
              <div className="grid grid-cols-2 gap-3">
                {/* On Dark Surface */}
                <div className="bg-[#1a1918] p-4 rounded-xl border border-[#33312e] text-center">
                  <span className="text-[10px] text-[#8c8982] block mb-2 font-mono">
                    Tampilan Tema Gelap
                  </span>
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={currentActiveLogo}
                      alt="Logo Preview Dark"
                      className="max-h-14 max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* On Light Surface */}
                <div className="bg-white p-4 rounded-xl border border-[#e2dfd7] text-center shadow-xs">
                  <span className="text-[10px] text-[#858178] block mb-2 font-mono">
                    Tampilan Tema Terang
                  </span>
                  <div className="h-16 flex items-center justify-center">
                    <img
                      src={currentActiveLogo}
                      alt="Logo Preview Light"
                      className="max-h-14 max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tip Note */}
          <div
            className={`p-3 rounded-xl border text-[11px] flex items-start gap-2.5 ${
              isDark
                ? 'bg-[#181716] border-[#2e2d2a] text-[#a6a39b]'
                : 'bg-[#f8f7f4] border-[#ebe8e1] text-[#6b6760]'
            }`}
          >
            <Info className="w-4 h-4 text-[#f27244] shrink-0 mt-0.5" />
            <div>
              Logo ini otomatis diterapkan secara menyeluruh ke <strong>Sidebar</strong>, <strong>Kwitansi PDF Resmi</strong>, <strong>ID Card Lanyard</strong>, dan <strong>Manivest Penerbangan</strong>.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            isDark ? 'border-[#2d2c29] bg-[#1a1918]' : 'border-[#eeece6] bg-[#faf9f6]'
          }`}
        >
          <div>
            {customLogo && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Logo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setIsLogoModalOpen(false);
              }}
              className={`px-3.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                isDark
                  ? 'border-[#383633] text-[#d6d3cb] hover:bg-[#282725]'
                  : 'border-[#d8d5cb] text-[#66635d] hover:bg-[#eeebe3]'
              }`}
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={!previewUrl}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                previewUrl
                  ? 'bg-[#f27244] hover:bg-[#e06336] text-white cursor-pointer'
                  : 'bg-[#f27244]/40 text-white/60 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Logo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
