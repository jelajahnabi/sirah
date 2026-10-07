import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UmrohPackage, Jamaah } from '../../types';
import { formatRupiah, buildWaLink } from '../../utils/formatters';
import { COMPANY_INFO } from '../../data/mockData';
import {
  Calendar,
  Building,
  Plane,
  Check,
  Share2,
  Eye,
  UserPlus,
  Kanban,
  LayoutGrid,
  PhoneCall,
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const PackageCatalogView: React.FC = () => {
  const {
    packages,
    jamaahList,
    setSelectedPackageDetail,
    setShowAddJamaahModal,
    setSelectedJamaah,
    theme,
  } = useApp();

  const [activeViewMode, setActiveViewMode] = useState<'kanban' | 'grid'>('kanban');
  const isDark = theme === 'dark';

  const handleShareWhatsApp = (pkg: UmrohPackage) => {
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBerikut Informasi Program Resmi dari *${COMPANY_INFO.legalName}*:\n\n*${pkg.name.toUpperCase()}*\n🔹 Harga: *${formatRupiah(pkg.price)}*\n🔹 Durasi: ${pkg.durationDays} Hari (${pkg.departureMonth})\n🔹 Maskapai: ${pkg.airline}\n🔹 Hotel Makkah: ${pkg.makkahHotel}\n🔹 Hotel Madinah: ${pkg.madinahHotel}\n\n*Fasilitas Unggulan:*\n${pkg.highlightFeatures.map((f) => `• ${f}`).join('\n')}\n\n📍 Kantor MKB Travel: ${COMPANY_INFO.address}\n📞 Hubungi Hotline WA: ${COMPANY_INFO.whatsappDisplay}\n🌐 Website: ${COMPANY_INFO.website}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & View Mode Switcher */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e8e5dc] text-[#23211e]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">
              3 Program Paket Umroh Resmi MKB
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                isDark ? 'bg-[#332a22] text-[#f27244]' : 'bg-[#fff0eb] text-[#e06336]'
              }`}
            >
              PPIU Kemenhaj RI
            </span>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Variasi warna kanban eksklusif per paket · Tipografi harga Myriad Bold · Kuota &amp; pendaftaran langsung
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Toggle Kanban vs Grid Cards */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg border text-xs ${
              isDark
                ? 'bg-[#1a1918] border-[#33312e]'
                : 'bg-[#f7f6f2] border-[#dedbd2]'
            }`}
          >
            <button
              onClick={() => setActiveViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeViewMode === 'kanban'
                  ? isDark
                    ? 'bg-[#2e2c29] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#23211e] shadow-xs font-semibold'
                  : isDark
                  ? 'text-[#9c988f] hover:text-white'
                  : 'text-[#737069] hover:text-[#23211e]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-[#f27244]" />
              <span>Papan Kanban</span>
            </button>
            <button
              onClick={() => setActiveViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                activeViewMode === 'grid'
                  ? isDark
                    ? 'bg-[#2e2c29] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#23211e] shadow-xs font-semibold'
                  : isDark
                  ? 'text-[#9c988f] hover:text-white'
                  : 'text-[#737069] hover:text-[#23211e]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#f27244]" />
              <span>Kartu Katalog</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddJamaahModal(true)}
            className="px-3.5 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Daftar Jamaah</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SUNSAMA MULTI-COLUMN KANBAN BOARD */}
      {activeViewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {packages.map((pkg) => {
            const kc = pkg.kanbanColors;
            const packageJamaah = jamaahList.filter((j) => j.packageId === pkg.id);
            const totalRevenue = packageJamaah.reduce((acc, j) => acc + j.amountPaid, 0);

            return (
              <div
                key={pkg.id}
                className="rounded-2xl border transition-all flex flex-col overflow-hidden shadow-xs"
                style={{
                  borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                  backgroundColor: isDark ? '#1d1c1a' : '#ffffff',
                }}
              >
                {/* Kanban Column Header (Distinct package color variation) */}
                <div
                  className="p-4 border-b space-y-3"
                  style={{
                    backgroundColor: isDark ? kc.columnHeaderDark : kc.columnHeaderLight,
                    borderBottomColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                      style={{
                        backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                        color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                        borderColor: kc.accent,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                        style={{ backgroundColor: kc.dotColor }}
                      />
                      <span>{pkg.code}</span>
                    </span>

                    <span
                      className="text-[11px] font-semibold font-mono"
                      style={{ color: kc.accent }}
                    >
                      {pkg.departureMonth}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-bold leading-tight ${
                        isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] opacity-75">
                      <span>{pkg.durationDays} Hari</span>
                      <span>·</span>
                      <span>{pkg.airline}</span>
                    </div>
                  </div>

                  {/* Price in Myriad Bold */}
                  <div
                    className="p-2.5 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                      borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider opacity-70 block">
                        Harga Myriad Bold
                      </span>
                      <div
                        className="text-lg font-bold font-price-myriad leading-tight"
                        style={{ color: isDark ? '#ffffff' : kc.badgeTextLight }}
                      >
                        {formatRupiah(pkg.price)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPackageDetail(pkg)}
                      className="p-1.5 rounded-lg border text-xs transition-colors hover:scale-105"
                      style={{
                        color: kc.accent,
                        borderColor: kc.accent,
                      }}
                      title="Lihat detail & brosur paket"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Seat Occupancy Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono opacity-80">
                      <span>Kursi: {pkg.bookedSeats} / {pkg.quota} Terisi</span>
                      <span>{Math.round((pkg.bookedSeats / pkg.quota) * 100)}%</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: isDark ? '#2d2c29' : '#e8e5dc' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (pkg.bookedSeats / pkg.quota) * 100)}%`,
                          backgroundColor: kc.accent,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Kanban Column Body (List of Jamaah Cards) */}
                <div
                  className={`p-3 space-y-2.5 max-h-[580px] overflow-y-auto ${
                    isDark ? 'bg-[#181716]/60' : 'bg-[#faf9f6]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] px-1 opacity-75">
                    <span>Jamaah Terdaftar ({packageJamaah.length}):</span>
                    <span className="font-mono font-semibold">
                      Omset: {formatRupiah(totalRevenue)}
                    </span>
                  </div>

                  {packageJamaah.length === 0 ? (
                    <div
                      className={`p-6 text-center rounded-xl border border-dashed text-xs ${
                        isDark
                          ? 'border-[#33312e] text-[#8c8982]'
                          : 'border-[#dedbd2] text-[#858178]'
                      }`}
                    >
                      Belum ada jamaah di paket ini.
                    </div>
                  ) : (
                    packageJamaah.map((j) => (
                      <div
                        key={j.id}
                        onClick={() => setSelectedJamaah(j)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer group shadow-2xs hover:shadow-xs ${
                          isDark
                            ? 'bg-[#22211f] hover:bg-[#282725] border-[#33312e] text-[#f4f3ef]'
                            : 'bg-white hover:bg-[#ffffff] border-[#e2dfd7] text-[#23211e]'
                        }`}
                        style={{
                          borderLeftWidth: '3px',
                          borderLeftColor: kc.accent,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold group-hover:text-[#f27244] transition-colors">
                              {j.fullName}
                            </div>
                            <div className="text-[11px] font-mono opacity-70 mt-0.5">
                              {j.phoneWhatsapp}
                            </div>
                          </div>

                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              j.paymentStatus === 'Lunas'
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-amber-500/15 text-amber-500'
                            }`}
                          >
                            {j.paymentStatus}
                          </span>
                        </div>

                        <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] opacity-80"
                          style={{ borderColor: isDark ? '#2e2c29' : '#f0ede6' }}
                        >
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                              j.isDataComplete
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {j.isDataComplete ? '✓ Berkas Lengkap' : '• Perlu Pelengkapan'}
                          </span>

                          <div className="text-right">
                            <span className="font-price-myriad font-bold text-[11px] text-[#f27244]">
                              {formatRupiah(j.amountPaid)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Jamaah directly to this package */}
                  <button
                    onClick={() => setShowAddJamaahModal(true)}
                    className={`w-full py-2 px-3 rounded-xl border border-dashed text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isDark
                        ? 'border-[#383633] text-[#a6a39b] hover:text-white hover:border-[#f27244]/60 hover:bg-[#22211f]'
                        : 'border-[#d8d5cb] text-[#66635d] hover:text-[#23211e] hover:border-[#f27244]/60 hover:bg-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#f27244]" />
                    <span>+ Tambah ke {pkg.name.replace('Umroh ', '')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: HIGH-CONTRAST 3-PACKAGE CATALOG CARDS */}
      {activeViewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const kc = pkg.kanbanColors;

            return (
              <div
                key={pkg.id}
                className="rounded-2xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between"
                style={{
                  borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                  backgroundColor: isDark ? '#22211f' : '#ffffff',
                }}
              >
                <div>
                  {/* Package Card Header */}
                  <div
                    className="p-5 border-b"
                    style={{
                      backgroundColor: isDark ? kc.columnHeaderDark : kc.columnHeaderLight,
                      borderBottomColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                    }}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className="font-mono flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold"
                        style={{
                          backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                          color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kc.dotColor }} />
                        <span>{pkg.code}</span>
                      </span>

                      <span
                        className="font-bold text-[11px] font-mono px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                          color: kc.accent,
                        }}
                      >
                        {pkg.departureMonth}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold leading-snug ${
                        isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                      }`}
                    >
                      {pkg.name}
                    </h3>

                    {/* Price in Myriad Bold */}
                    <div className="mt-3">
                      <div
                        className={`text-[10px] uppercase font-semibold tracking-wider ${
                          isDark ? 'text-[#8c8982]' : 'text-[#858178]'
                        }`}
                      >
                        Harga Paket (Myriad Bold)
                      </div>
                      <div
                        className="text-2xl font-bold font-price-myriad mt-0.5"
                        style={{ color: isDark ? '#ffffff' : kc.badgeTextLight }}
                      >
                        {formatRupiah(pkg.price)}
                      </div>
                    </div>
                  </div>

                  {/* Specs & Highlights */}
                  <div className="p-5 space-y-4 text-xs">
                    <div
                      className={`space-y-2 ${
                        isDark ? 'text-[#d6d3cb]' : 'text-[#4a4740]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: kc.accent }} />
                        <span>Durasi: <strong>{pkg.durationDays} Hari Penuh</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Plane className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: kc.accent }} />
                        <span>Maskapai: <strong>{pkg.airline}</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: kc.accent }} />
                        <span>Hotel Makkah: {pkg.makkahHotel}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: kc.accent }} />
                        <span>Hotel Madinah: {pkg.madinahHotel}</span>
                      </div>
                    </div>

                    {/* Room Tiers */}
                    {pkg.roomPrices && (
                      <div
                        className="p-3 rounded-xl border text-[11px] space-y-1.5"
                        style={{
                          backgroundColor: isDark ? '#1a1918' : '#faf9f6',
                          borderColor: isDark ? '#2e2d2a' : '#eeece6',
                        }}
                      >
                        <div className="font-semibold text-xs opacity-90">Pilihan Tipe Kamar:</div>
                        <div className="grid grid-cols-3 gap-1 text-center font-price-myriad">
                          <div className="p-1 rounded bg-black/10">
                            <span className="block text-[9px] opacity-70 font-sans">Quad</span>
                            <span className="font-bold text-[10px]">{formatRupiah(pkg.roomPrices.quad)}</span>
                          </div>
                          {pkg.roomPrices.triple && (
                            <div className="p-1 rounded bg-black/10">
                              <span className="block text-[9px] opacity-70 font-sans">Triple</span>
                              <span className="font-bold text-[10px]">{formatRupiah(pkg.roomPrices.triple)}</span>
                            </div>
                          )}
                          {pkg.roomPrices.double && (
                            <div className="p-1 rounded bg-black/10">
                              <span className="block text-[9px] opacity-70 font-sans">Double</span>
                              <span className="font-bold text-[10px]">{formatRupiah(pkg.roomPrices.double)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feature Highlights */}
                    <div
                      className="p-3 rounded-xl border space-y-1.5 text-[11px]"
                      style={{
                        backgroundColor: isDark ? '#1a1918' : '#faf9f6',
                        borderColor: isDark ? '#2e2d2a' : '#eeece6',
                      }}
                    >
                      <div className="font-semibold text-xs opacity-90">
                        Fasilitas Termasuk:
                      </div>
                      {pkg.highlightFeatures.map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 opacity-85">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] flex items-center justify-between opacity-80 font-mono">
                      <span>Kapasitas Seat:</span>
                      <span className="font-bold">
                        {pkg.bookedSeats} / {pkg.quota} Terisi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  className="p-4 border-t flex items-center gap-2"
                  style={{
                    backgroundColor: isDark ? '#1a1918' : '#faf9f6',
                    borderColor: isDark ? '#2e2c29' : '#eeece6',
                  }}
                >
                  <button
                    onClick={() => setSelectedPackageDetail(pkg)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border"
                    style={{
                      backgroundColor: isDark ? '#282725' : '#ffffff',
                      borderColor: isDark ? '#383633' : '#d8d5cb',
                      color: isDark ? '#f4f3ef' : '#23211e',
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" style={{ color: kc.accent }} />
                    <span>Lihat Detail</span>
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(pkg)}
                    className="p-2 rounded-xl border transition-colors hover:scale-105"
                    style={{
                      borderColor: kc.accent,
                      color: kc.accent,
                    }}
                    title="Bagikan ke WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
