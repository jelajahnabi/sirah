import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { COMPANY_INFO } from '../data/mockData';
import {
  LayoutDashboard,
  Compass,
  Users,
  FileSpreadsheet,
  BedDouble,
  Receipt,
  MessageSquareQuote,
  Briefcase,
  Upload,
  Sun,
  Moon,
  LogOut,
  User,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  channelColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    jamaahList,
    packages,
    theme,
    toggleTheme,
    setIsLogoModalOpen,
    currentUser,
    logout,
  } = useApp();

  const isDark = theme === 'dark';
  const incompleteCount = jamaahList.filter((j) => !j.isDataComplete).length;

  const mainViews: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Ringkasan Hari Ini',
      icon: LayoutDashboard,
      channelColor: '#f27244',
    },
    {
      id: 'packages',
      label: '3 Paket & Kanban',
      icon: Compass,
      badgeCount: packages.length,
      channelColor: '#f59e0b',
    },
    {
      id: 'jamaah',
      label: 'Data & Berkas Jamaah',
      icon: Users,
      badgeCount: incompleteCount > 0 ? incompleteCount : jamaahList.length,
      channelColor: '#10b981',
    },
    {
      id: 'manifest',
      label: 'Manivest & Penerbangan',
      icon: FileSpreadsheet,
      channelColor: '#38bdf8',
    },
  ];

  const secondaryViews: NavItem[] = [
    {
      id: 'rooming',
      label: 'Rooming List Hotel',
      icon: BedDouble,
    },
    {
      id: 'finance',
      label: 'Keuangan & Kwitansi',
      icon: Receipt,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Center',
      icon: MessageSquareQuote,
    },
    {
      id: 'equipment',
      label: 'Logistik & Koper',
      icon: Briefcase,
    },
  ];

  return (
    <aside
      className={`w-64 flex flex-col justify-between shrink-0 min-h-screen select-none font-sans border-r transition-colors ${
        isDark
          ? 'bg-[#1e1d1b] text-[#f4f3ef] border-[#33312e]'
          : 'bg-[#faf9f6] text-[#23211e] border-[#e8e5dc]'
      }`}
    >
      <div>
        {/* Brand Header with Uploadable Logo */}
        <div
          className={`p-4 pb-3 border-b transition-colors ${
            isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#f4f3ee] border-[#eeece6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="max-w-[190px]">
              <BrandLogo className="h-8" />
            </div>
            <div
              className="w-2 h-2 rounded-full bg-[#f27244] shadow-[0_0_8px_#f27244] shrink-0"
              title="Sistem Backoffice Aktif"
            />
          </div>

          <div
            className={`mt-2 flex items-center justify-between text-[10px] ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            <span className="truncate">PPIU Kemenhaj RI</span>
            <span className="font-mono text-[#f27244] font-semibold">YOGYAKARTA</span>
          </div>
        </div>

        {/* Primary Views (Sunsama Daily Channels) */}
        <div className="p-3 space-y-1">
          <div
            className={`px-2 pt-2 pb-1 text-[10px] font-semibold tracking-wider uppercase ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Workspace Utama
          </div>

          <nav className="space-y-0.5">
            {mainViews.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#2d2b28] text-white shadow-xs border border-[#3d3b37]'
                        : 'bg-white text-[#23211e] shadow-xs border border-[#dedbd2]'
                      : isDark
                      ? 'text-[#a6a39b] hover:text-[#f4f3ef] hover:bg-[#262523]'
                      : 'text-[#6b6760] hover:text-[#23211e] hover:bg-[#edebe4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Sunsama colored indicator dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.channelColor }}
                    />
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive
                          ? 'text-[#f27244]'
                          : isDark
                          ? 'text-[#737069]'
                          : 'text-[#9c988f]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeCount !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive
                          ? 'bg-[#f27244]/20 text-[#f27244] font-semibold'
                          : isDark
                          ? 'bg-[#282725] text-[#8c8982]'
                          : 'bg-[#eeebe3] text-[#737069]'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operational Modules (Channels) */}
        <div className="px-3 pt-1 space-y-1">
          <div
            className={`px-2 pt-1 pb-1 text-[10px] font-semibold tracking-wider uppercase ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Operasional &amp; Keuangan
          </div>

          <nav className="space-y-0.5">
            {secondaryViews.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-[#2d2b28] text-white shadow-xs border border-[#3d3b37]'
                        : 'bg-white text-[#23211e] shadow-xs border border-[#dedbd2]'
                      : isDark
                      ? 'text-[#a6a39b] hover:text-[#f4f3ef] hover:bg-[#262523]'
                      : 'text-[#6b6760] hover:text-[#23211e] hover:bg-[#edebe4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive
                          ? 'text-[#f27244]'
                          : isDark
                          ? 'text-[#66635d]'
                          : 'text-[#9c988f]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sunsama Minimalist Footer Card */}
      <div className="p-3 m-3 space-y-2">
        {/* User Account & Logout */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
            isDark
              ? 'bg-[#1b1a19] border-[#33312e] text-[#f4f3ef]'
              : 'bg-white border-[#e8e5dc] text-[#23211e] shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-[11px] truncate leading-tight">
                {currentUser?.name || 'Administrator MKB'}
              </div>
              <div
                className={`text-[9px] font-mono truncate ${
                  isDark ? 'text-[#8c8982]' : 'text-[#737069]'
                }`}
              >
                @{currentUser?.username || 'admin'} · Super Admin
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Keluar dari sesi backoffice MKB Travel?')) {
                logout();
              }
            }}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
            title="Keluar / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Logo & Theme Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLogoModalOpen(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#242321] hover:bg-[#2c2b28] border-[#383633] text-[#d6d3cb]'
                : 'bg-white hover:bg-[#f4f3ee] border-[#dedbd2] text-[#5c5953]'
            }`}
          >
            <Upload className="w-3 h-3 text-[#f27244]" />
            <span>Upload Logo</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#242321] hover:bg-[#2c2b28] border-[#383633] text-amber-400'
                : 'bg-white hover:bg-[#f4f3ee] border-[#dedbd2] text-indigo-600'
            }`}
            title={isDark ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Office Contact Info */}
        <div
          className={`p-2.5 rounded-xl border text-[11px] space-y-1 transition-colors ${
            isDark
              ? 'bg-[#171615] border-[#2d2c29] text-[#9c988f]'
              : 'bg-white border-[#e8e5dc] text-[#737069] shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-xs ${
                isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
              }`}
            >
              Hotline Kantor
            </span>
            <span className="text-[9px] font-mono text-[#f27244] bg-[#f27244]/15 px-1.5 py-0.5 rounded font-bold">
              AKTIF
            </span>
          </div>
          <div
            className={`font-mono text-xs font-semibold ${
              isDark ? 'text-[#e2dfd7]' : 'text-[#2e2c29]'
            }`}
          >
            {COMPANY_INFO.whatsappDisplay}
          </div>
          <div className="text-[10px] truncate opacity-80">
            Jl. Bener No.79, Tegalrejo, Yogya
          </div>
        </div>
      </div>
    </aside>
  );
};
