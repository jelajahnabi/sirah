import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { COMPANY_INFO } from '../../data/mockData';
import {
  X,
  Plane,
  Building,
  Check,
  Calendar,
  Share2,
} from 'lucide-react';

export const PackageDetailModal: React.FC = () => {
  const { selectedPackageDetail, setSelectedPackageDetail, setShowAddJamaahModal, theme } = useApp();

  if (!selectedPackageDetail) return null;

  const isDark = theme === 'dark';
  const pkg = selectedPackageDetail;
  const kc = pkg.kanbanColors;

  const handleShareWhatsApp = () => {
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nBerikut Informasi Program Resmi dari *${COMPANY_INFO.legalName}*:\n\n*${pkg.name.toUpperCase()}*\n🔹 Harga: *${formatRupiah(pkg.price)}*\n🔹 Durasi: ${pkg.durationDays} Hari (${pkg.departureMonth})\n🔹 Maskapai: ${pkg.airline}\n🔹 Hotel Makkah: ${pkg.makkahHotel}\n🔹 Hotel Madinah: ${pkg.madinahHotel}\n\n*Fasilitas Unggulan:*\n${pkg.highlightFeatures.map((f) => `• ${f}`).join('\n')}\n\n📍 Kantor MKB Travel: ${COMPANY_INFO.address}\n📞 Hubungi Hotline WA: ${COMPANY_INFO.whatsappDisplay}\n🌐 Website: ${COMPANY_INFO.website}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border my-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#dedbd2] text-[#23211e]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between pb-3 border-b ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold">
              <span
                className="px-2 py-0.5 rounded font-bold"
                style={{
                  backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                  color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                }}
              >
                {pkg.code}
              </span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span style={{ color: kc.accent }}>{pkg.departureMonth}</span>
            </div>
            <h2 className="text-base font-bold mt-1">{pkg.name}</h2>
            <div
              className={`text-xs mt-0.5 ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Durasi: <strong>{pkg.durationDays} Hari Penuh</strong> · Keberangkatan: {pkg.departureDates.join(', ')}
            </div>
          </div>

          <button
            onClick={() => setSelectedPackageDetail(null)}
            className={`p-1 rounded-md transition-colors ${
              isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Highlight (Myriad Bold) */}
        <div
          className="p-4 rounded-xl border flex items-center justify-between"
          style={{
            backgroundColor: isDark ? kc.columnHeaderDark : kc.columnHeaderLight,
            borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
          }}
        >
          <div>
            <div
              className={`text-xs font-semibold ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Harga Paket All-In (Myriad Bold):
            </div>
            <div
              className="text-2xl font-bold font-price-myriad mt-0.5"
              style={{ color: isDark ? '#ffffff' : kc.badgeTextLight }}
            >
              {formatRupiah(pkg.price)}
            </div>
          </div>
          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            style={{
              borderColor: kc.accent,
              color: kc.accent,
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke WA</span>
          </button>
        </div>

        {/* Room Price Options (Myriad Bold) */}
        {pkg.roomPrices && (
          <div
            className={`p-3.5 rounded-xl border space-y-2 text-xs ${
              isDark ? 'bg-[#1a1918] border-[#2e2d2a]' : 'bg-[#faf9f6] border-[#eeece6]'
            }`}
          >
            <div className="font-semibold">Opsi Kamar &amp; Harga per Orang (Myriad Bold):</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div
                className={`p-2 rounded-lg border ${
                  isDark ? 'bg-[#22211f] border-[#33312e]' : 'bg-white border-[#dedbd2]'
                }`}
              >
                <span className="block text-[10px] opacity-70">Quad (4 Orang)</span>
                <span className="font-bold font-price-myriad text-sm">{formatRupiah(pkg.roomPrices.quad)}</span>
              </div>
              {pkg.roomPrices.triple && (
                <div
                  className={`p-2 rounded-lg border ${
                    isDark ? 'bg-[#22211f] border-[#33312e]' : 'bg-white border-[#dedbd2]'
                  }`}
                >
                  <span className="block text-[10px] opacity-70">Triple (3 Orang)</span>
                  <span className="font-bold font-price-myriad text-sm">{formatRupiah(pkg.roomPrices.triple)}</span>
                </div>
              )}
              {pkg.roomPrices.double && (
                <div
                  className={`p-2 rounded-lg border ${
                    isDark ? 'bg-[#22211f] border-[#33312e]' : 'bg-white border-[#dedbd2]'
                  }`}
                >
                  <span className="block text-[10px] opacity-70">Double (2 Orang)</span>
                  <span className="font-bold font-price-myriad text-sm">{formatRupiah(pkg.roomPrices.double)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div
          className={`text-xs leading-relaxed ${
            isDark ? 'text-[#a6a39b]' : 'text-[#66635d]'
          }`}
        >
          {pkg.description}
        </div>

        {/* Hotel & Airline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#faf9f6] border-[#eeece6]'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Building className="w-4 h-4" style={{ color: kc.accent }} />
              <span>Akomodasi Hotel</span>
            </div>
            <div className="opacity-80">Makkah: <strong>{pkg.makkahHotel}</strong></div>
            <div className="opacity-80">Madinah: <strong>{pkg.madinahHotel}</strong></div>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#faf9f6] border-[#eeece6]'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Plane className="w-4 h-4" style={{ color: kc.accent }} />
              <span>Penerbangan &amp; Maskapai</span>
            </div>
            <div className="opacity-80">Maskapai: <strong>{pkg.airline}</strong></div>
            <div className="opacity-80">Bagasi: <strong>2 x 23 Kg + 7 Kg Kabin</strong></div>
          </div>
        </div>

        {/* Highlight Features */}
        <div
          className={`p-3 rounded-xl border text-xs space-y-2 ${
            isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#faf9f6] border-[#eeece6]'
          }`}
        >
          <div className="font-bold">Fasilitas Termasuk:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {pkg.highlightFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-1.5 opacity-85">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`pt-3 border-t flex items-center justify-end gap-2 text-xs ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <button
            onClick={() => setSelectedPackageDetail(null)}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
              isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#f0ede6]'
            }`}
          >
            Tutup
          </button>
          <button
            onClick={() => {
              setSelectedPackageDetail(null);
              setShowAddJamaahModal(true);
            }}
            className="px-4 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg font-semibold shadow-xs transition-colors"
          >
            Daftarkan Jamaah
          </button>
        </div>
      </div>
    </div>
  );
};
