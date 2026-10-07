import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UmrohPackage, KanbanColorConfig } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { X, Plus, Calendar, Building, Plane, Sparkles } from 'lucide-react';

const COLOR_PALETTES: { name: string; colors: KanbanColorConfig }[] = [
  {
    name: 'Autumn Terracotta / Amber',
    colors: {
      accent: '#f27244',
      dotColor: '#f27244',
      badgeBgDark: '#361e15',
      badgeBgLight: '#ffede6',
      badgeTextDark: '#ff8f6b',
      badgeTextLight: '#c8471b',
      columnBorderDark: '#4d291c',
      columnBorderLight: '#fed7c8',
      columnHeaderDark: '#281711',
      columnHeaderLight: '#fff5f1',
      cardBgDark: '#231814',
      cardBgLight: '#fffaf8',
    },
  },
  {
    name: 'Spiritual Sage / Emerald Green',
    colors: {
      accent: '#10b981',
      dotColor: '#10b981',
      badgeBgDark: '#0e2f24',
      badgeBgLight: '#ecfdf5',
      badgeTextDark: '#6ee7b7',
      badgeTextLight: '#047857',
      columnBorderDark: '#134e3a',
      columnBorderLight: '#a7f3d0',
      columnHeaderDark: '#0c261d',
      columnHeaderLight: '#f0fdf4',
      cardBgDark: '#11221b',
      cardBgLight: '#f6fdf9',
    },
  },
  {
    name: 'Royal Twilight / Indigo Violet',
    colors: {
      accent: '#8b5cf6',
      dotColor: '#8b5cf6',
      badgeBgDark: '#27173e',
      badgeBgLight: '#f3e8ff',
      badgeTextDark: '#c084fc',
      badgeTextLight: '#7e22ce',
      columnBorderDark: '#3f2563',
      columnBorderLight: '#e9d5ff',
      columnHeaderDark: '#1e1131',
      columnHeaderLight: '#faf5ff',
      cardBgDark: '#1d142b',
      cardBgLight: '#faf8ff',
    },
  },
  {
    name: 'Golden Ochre / Warm Gold',
    colors: {
      accent: '#f59e0b',
      dotColor: '#f59e0b',
      badgeBgDark: '#33240f',
      badgeBgLight: '#fef3c7',
      badgeTextDark: '#fbbf24',
      badgeTextLight: '#b45309',
      columnBorderDark: '#4d3715',
      columnBorderLight: '#fde68a',
      columnHeaderDark: '#251b0c',
      columnHeaderLight: '#fffbeb',
      cardBgDark: '#22190b',
      cardBgLight: '#fefdfa',
    },
  },
  {
    name: 'Sky Blue / Aegean Ocean',
    colors: {
      accent: '#0284c7',
      dotColor: '#0284c7',
      badgeBgDark: '#0c2236',
      badgeBgLight: '#e0f2fe',
      badgeTextDark: '#38bdf8',
      badgeTextLight: '#0369a1',
      columnBorderDark: '#133552',
      columnBorderLight: '#bae6fd',
      columnHeaderDark: '#081726',
      columnHeaderLight: '#f0f9ff',
      cardBgDark: '#0a1d2e',
      cardBgLight: '#f8fcff',
    },
  },
];

export const AddPackageModal: React.FC = () => {
  const { showAddPackageModal, setShowAddPackageModal, addPackage, theme } = useApp();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [durationDays, setDurationDays] = useState(12);
  const [departureMonth, setDepartureMonth] = useState('Januari 2027');
  const [price, setPrice] = useState(31500000);
  const [quadPrice, setQuadPrice] = useState(31500000);
  const [triplePrice, setTriplePrice] = useState(34000000);
  const [doublePrice, setDoublePrice] = useState(36500000);
  const [makkahHotel, setMakkahHotel] = useState('Emaar Grand Makkah');
  const [madinahHotel, setMadinahHotel] = useState('Rove Madinah');
  const [airline, setAirline] = useState('Saudia Airlines (Direct)');
  const [quota, setQuota] = useState(45);
  const [description, setDescription] = useState('Paket umroh istimewa dengan pembimbing berpengalaman.');
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0);

  if (!showAddPackageModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code.trim() || `MKB-${name.slice(0, 3).toUpperCase()}-${durationDays}D`;

    addPackage({
      name: name.trim(),
      code: generatedCode,
      durationDays: Number(durationDays),
      departureMonth: departureMonth.trim(),
      price: Number(price),
      roomPrices: {
        quad: Number(quadPrice || price),
        triple: Number(triplePrice || price + 2500000),
        double: Number(doublePrice || price + 5000000),
      },
      makkahHotel: makkahHotel.trim(),
      madinahHotel: madinahHotel.trim(),
      airline: airline.trim(),
      departureDates: ['2027-01-15'],
      description: description.trim(),
      highlightFeatures: [
        `Durasi ${durationDays} Hari di Tanah Suci`,
        `Penerbangan ${airline}`,
        `Hotel Makkah: ${makkahHotel}`,
        `Hotel Madinah: ${madinahHotel}`,
        'Handling & Muthawif Resmi MKB',
      ],
      quota: Number(quota),
      status: 'Open',
      kanbanColors: COLOR_PALETTES[selectedPaletteIdx].colors,
    });

    setShowAddPackageModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border my-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#dedbd2] text-[#23211e]'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Tambah Paket Umroh Baru
              </h2>
              <p
                className={`text-xs ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Buat program keberangkatan dengan variasi warna kanban &amp; harga Myriad Bold.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddPackageModal(false)}
            className={`p-1 rounded-md ${
              isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Nama Paket *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Umroh Liburan Syawal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-semibold ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-white'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Kode Paket (Opsional)</label>
              <input
                type="text"
                placeholder="MKB-SYW-12D"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-mono uppercase ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-white'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1">Durasi (Hari)</label>
              <input
                type="number"
                min="9"
                max="45"
                required
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className={`w-full p-2 rounded-lg border font-mono ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-white'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Bulan Keberangkatan</label>
              <input
                type="text"
                required
                placeholder="Januari 2027"
                value={departureMonth}
                onChange={(e) => setDepartureMonth(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-white'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Kuota Kursi</label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className={`w-full p-2 rounded-lg border font-mono ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-white'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
          </div>

          {/* Pricing in Myriad Bold */}
          <div
            className={`p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-[#1a1918] border-[#33312e]' : 'bg-[#faf9f6] border-[#dedbd2]'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Penetapan Harga Paket (Myriad Bold):</span>
              <span className="font-price-myriad text-sm text-[#f27244]">
                {formatRupiah(price)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] mb-1 opacity-80">Harga Dasar / Quad (IDR)</label>
                <input
                  type="number"
                  step="500000"
                  required
                  value={price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPrice(val);
                    setQuadPrice(val);
                  }}
                  className={`w-full p-2 rounded-lg border font-bold font-price-myriad text-[#f27244] ${
                    isDark ? 'bg-[#22211f] border-[#383633]' : 'bg-white border-[#dedbd2]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1 opacity-80">Harga Kamar Triple (IDR)</label>
                <input
                  type="number"
                  step="500000"
                  value={triplePrice}
                  onChange={(e) => setTriplePrice(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-bold font-price-myriad ${
                    isDark ? 'bg-[#22211f] border-[#383633] text-white' : 'bg-white border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] mb-1 opacity-80">Harga Kamar Double (IDR)</label>
                <input
                  type="number"
                  step="500000"
                  value={doublePrice}
                  onChange={(e) => setDoublePrice(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-bold font-price-myriad ${
                    isDark ? 'bg-[#22211f] border-[#383633] text-white' : 'bg-white border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Hotel & Airline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1">Hotel Makkah</label>
              <input
                type="text"
                value={makkahHotel}
                onChange={(e) => setMakkahHotel(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-[#1a1918] border-[#383633] text-white' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Hotel Madinah</label>
              <input
                type="text"
                value={madinahHotel}
                onChange={(e) => setMadinahHotel(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-[#1a1918] border-[#383633] text-white' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Maskapai</label>
              <input
                type="text"
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDark ? 'bg-[#1a1918] border-[#383633] text-white' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
          </div>

          {/* Kanban Color Theme Selector */}
          <div>
            <label className="block font-semibold mb-1.5">
              Pilihan Variasi Warna Kanban:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_PALETTES.map((pal, idx) => {
                const isSelected = selectedPaletteIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPaletteIdx(idx)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-[#f27244] shadow-xs'
                        : isDark
                        ? 'border-[#33312e] bg-[#1a1918]'
                        : 'border-[#e0ddd4] bg-[#faf9f6]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: pal.colors.accent }}
                    />
                    <span className="text-[11px] font-medium truncate">
                      {pal.name.split(' / ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t flex items-center justify-end gap-2"
            style={{ borderColor: isDark ? '#2d2c29' : '#eeece6' }}
          >
            <button
              type="button"
              onClick={() => setShowAddPackageModal(false)}
              className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
                isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#f0ede6]'
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              Terbitkan Paket Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
