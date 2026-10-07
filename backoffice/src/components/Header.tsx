import React from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, PhoneCall, Calendar, Sun, Moon, Upload } from 'lucide-react';
import { formatDateIndo } from '../utils/formatters';

export const Header: React.FC = () => {
  const {
    setShowAddJamaahModal,
    currentTab,
    theme,
    toggleTheme,
    setIsLogoModalOpen,
    customLogo,
  } = useApp();

  const isDark = theme === 'dark';
  const todayStr = formatDateIndo(new Date().toISOString().split('T')[0]);

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Ringkasan & Operasional Hari Ini';
      case 'packages':
        return '3 Paket Umroh & Papan Kanban';
      case 'jamaah':
        return 'Database & Dokumen Jamaah';
      case 'manifest':
        return 'Manivest Penerbangan';
      case 'rooming':
        return 'Alokasi Rooming List';
      case 'finance':
        return 'Keuangan & Kwitansi Digital';
      case 'whatsapp':
        return 'Pusat Koordinasi WhatsApp';
      case 'equipment':
        return 'Logistik Perlengkapan Koper';
      case 'company':
        return 'Profil Legalitas Kemenhaj RI';
      default:
        return 'Backoffice MKB';
    }
  };

  return (
    <header
      className={`h-14 px-6 flex items-center justify-between sticky top-0 z-30 font-sans transition-colors border-b ${
        isDark
          ? 'bg-[#1e1d1b] border-[#33312e] text-[#f4f3ef]'
          : 'bg-[#ffffff] border-[#e8e5dc] text-[#23211e]'
      }`}
    >
      {/* Title & Sunsama Date indicator */}
      <div className="flex items-center gap-3 min-w-0">
        <h1
          className={`text-xs font-bold tracking-wide truncate ${
            isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
          }`}
        >
          {getTitle()}
        </h1>
        <span className={isDark ? 'text-[#3d3b37]' : 'text-[#d6d3cb]'}>/</span>
        <div
          className={`hidden sm:flex items-center gap-1.5 text-[11px] ${
            isDark ? 'text-[#9c988f]' : 'text-[#737069]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#f27244]" />
          <span>{todayStr}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Logo Upload / Status Shortcut */}
        <button
          type="button"
          onClick={() => setIsLogoModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
            isDark
              ? 'text-[#d6d3cb] hover:text-[#f27244] bg-[#282725] hover:bg-[#302f2c] border-[#383633]'
              : 'text-[#5c5953] hover:text-[#f27244] bg-[#f8f7f4] hover:bg-[#eeebe3] border-[#e2dfd7]'
          }`}
          title="Unggah atau kelola logo resmi travel"
        >
          <Upload className="w-3.5 h-3.5 text-[#f27244]" />
          <span className="font-medium text-[11px] hidden md:inline">
            {customLogo ? 'Logo Aktif' : 'Upload Logo'}
          </span>
        </button>

        {/* Sunsama Dark / Light Mode Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#282725] hover:bg-[#32302d] border-[#383633] text-[#d6d3cb]'
              : 'bg-[#f8f7f4] hover:bg-[#eeebe3] border-[#e2dfd7] text-[#5c5953]'
          }`}
          title={isDark ? 'Beralih ke Tema Terang (Light Mode)' : 'Beralih ke Tema Gelap (Dark Mode)'}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-medium hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-medium hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* WhatsApp Hotline */}
        <a
          href="https://wa.me/6281328313731"
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            isDark
              ? 'text-[#d6d3cb] hover:text-[#f27244] bg-[#282725] hover:bg-[#302f2c] border-[#383633]'
              : 'text-[#5c5953] hover:text-[#f27244] bg-[#f8f7f4] hover:bg-[#eeebe3] border-[#e2dfd7]'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#f27244]" />
          <span className="font-medium text-[11px]">081328313731</span>
        </a>

        {/* Primary CTA (Sunsama Coral Orange) */}
        <button
          onClick={() => setShowAddJamaahModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Daftar Cepat</span>
        </button>
      </div>
    </header>
  );
};
