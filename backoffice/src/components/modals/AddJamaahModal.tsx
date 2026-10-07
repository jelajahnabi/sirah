import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, UserPlus, Upload, FileText } from 'lucide-react';

export const AddJamaahModal: React.FC = () => {
  const { showAddJamaahModal, setShowAddJamaahModal, packages, addJamaah, theme } = useApp();

  const isDark = theme === 'dark';

  // Wajib
  const [fullName, setFullName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');

  // Opsional
  const [selectedPkgId, setSelectedPkgId] = useState(packages[0]?.id || '');
  const [downPayment, setDownPayment] = useState<number>(5000000);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Opsional details
  const [nik, setNik] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [city, setCity] = useState('Yogyakarta');
  const [ktpFileName, setKtpFileName] = useState('');
  const [ktpFileUrl, setKtpFileUrl] = useState('');
  const [passportFileName, setPassportFileName] = useState('');
  const [passportFileUrl, setPassportFileUrl] = useState('');

  if (!showAddJamaahModal) return null;

  const currentPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const kc = currentPkg?.kanbanColors;

  const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setKtpFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPassportFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneWhatsapp.trim()) return;

    addJamaah({
      fullName: fullName.trim(),
      phoneWhatsapp: phoneWhatsapp.trim(),
      packageId: selectedPkgId,
      downPayment: Number(downPayment) || 0,
      nik: nik.trim() || undefined,
      passportNumber: passportNumber.trim() || undefined,
      city: city.trim() || 'Yogyakarta',
      ktpFileName: ktpFileName || undefined,
      ktpFileUrl: ktpFileUrl || undefined,
      passportFileName: passportFileName || undefined,
      passportFileUrl: passportFileUrl || undefined,
    });

    // Reset & close
    setFullName('');
    setPhoneWhatsapp('');
    setNik('');
    setPassportNumber('');
    setKtpFileName('');
    setKtpFileUrl('');
    setPassportFileName('');
    setPassportFileUrl('');
    setShowAddJamaahModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border my-6 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#dedbd2] text-[#23211e]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div>
            <h2 className="text-base font-bold">
              Pendaftaran Cepat Jamaah Umroh
            </h2>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Hanya <strong className="text-[#f27244]">Nama</strong> &amp; <strong className="text-[#f27244]">No. HP</strong> yang wajib. Data lain bisa dilengkapi belakangan.
            </p>
          </div>
          <button
            onClick={() => setShowAddJamaahModal(false)}
            className={`p-1 rounded-md transition-colors ${
              isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* WAJIB: Nama & No HP */}
          <div
            className={`p-3.5 rounded-xl border space-y-3 ${
              isDark
                ? 'bg-[#1a1918] border-[#3d2e24]'
                : 'bg-[#fffbf7] border-[#fed7c8]'
            }`}
          >
            <div>
              <label className="block font-bold mb-1">
                Nama Lengkap Jamaah <span className="text-[#f27244]">* Wajib</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Muhammad Ridwan Ashari"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-semibold focus:outline-none focus:ring-1 focus:ring-[#f27244] text-sm ${
                  isDark
                    ? 'bg-[#252422] border-[#383633] text-white'
                    : 'bg-white border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>

            <div>
              <label className="block font-bold mb-1">
                Nomor WhatsApp / HP <span className="text-[#f27244]">* Wajib</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 081328313731"
                value={phoneWhatsapp}
                onChange={(e) => setPhoneWhatsapp(e.target.value)}
                className={`w-full p-2.5 rounded-lg border font-mono font-bold text-[#f27244] focus:outline-none focus:ring-1 focus:ring-[#f27244] text-sm ${
                  isDark
                    ? 'bg-[#252422] border-[#383633]'
                    : 'bg-white border-[#dedbd2]'
                }`}
              />
            </div>
          </div>

          {/* Program Paket Umroh (3 Choices with Kanban Color indicators) */}
          <div>
            <label
              className={`block font-medium mb-1 ${
                isDark ? 'text-[#d6d3cb]' : 'text-[#5c5953]'
              }`}
            >
              Pilih Paket Umroh
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {packages.map((p) => {
                const isSelected = selectedPkgId === p.id;
                const pkgKc = p.kanbanColors;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPkgId(p.id)}
                    className="p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between"
                    style={{
                      borderColor: isSelected
                        ? pkgKc.accent
                        : isDark ? '#33312e' : '#e0ddd4',
                      backgroundColor: isSelected
                        ? isDark ? pkgKc.badgeBgDark : pkgKc.badgeBgLight
                        : isDark ? '#1a1918' : '#faf9f6',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pkgKc.dotColor }} />
                        <span
                          className="text-[10px] font-mono font-bold"
                          style={{ color: isSelected ? pkgKc.accent : undefined }}
                        >
                          {p.departureMonth}
                        </span>
                      </div>
                      <div className="font-bold text-xs leading-tight line-clamp-1">
                        {p.name.replace('Umroh ', '')}
                      </div>
                    </div>
                    <div
                      className="font-price-myriad font-bold text-xs mt-2"
                      style={{ color: pkgKc.accent }}
                    >
                      {formatRupiah(p.price)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DP Pendaftaran (Booking Seat) */}
          <div>
            <label
              className={`block font-medium mb-1 ${
                isDark ? 'text-[#d6d3cb]' : 'text-[#5c5953]'
              }`}
            >
              DP / Booking Seat (IDR) - Opsional (Myriad Bold)
            </label>
            <input
              type="number"
              min="0"
              step="500000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className={`w-full p-2 rounded-lg border font-bold font-price-myriad text-[#f27244] ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e]'
                  : 'bg-[#faf9f6] border-[#dedbd2]'
              }`}
            />
            <div
              className={`text-[10px] mt-1 ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Total biaya paket: <span className="font-price-myriad font-bold">{formatRupiah(currentPkg?.price || 0)}</span>
            </div>
          </div>

          {/* Optional Expandable Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="text-xs text-[#f27244] hover:text-[#ff8559] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>{showOptionalFields ? '− Sembunyikan Upload & Data Tambahan' : '+ Upload KTP / Paspor & Data Tambahan (Opsional)'}</span>
            </button>
          </div>

          {/* Expandable Optional Fields */}
          {showOptionalFields && (
            <div
              className={`p-3.5 rounded-xl border space-y-3 pt-3 transition-colors ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e]'
                  : 'bg-[#faf9f6] border-[#e2dfd7]'
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block font-medium mb-1 ${
                      isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                    }`}
                  >
                    NIK KTP (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="347101..."
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-mono ${
                      isDark
                        ? 'bg-[#252422] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-white border-[#dedbd2] text-[#23211e]'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block font-medium mb-1 ${
                      isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                    }`}
                  >
                    Nomor Paspor
                  </label>
                  <input
                    type="text"
                    placeholder="X1892041"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-mono uppercase ${
                      isDark
                        ? 'bg-[#252422] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-white border-[#dedbd2] text-[#23211e]'
                    }`}
                  />
                </div>
              </div>

              {/* Upload Scan KTP & Paspor */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Upload KTP */}
                <div
                  className={`p-2.5 rounded-lg border ${
                    isDark ? 'bg-[#252422] border-[#33312e]' : 'bg-white border-[#dedbd2]'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#f27244]" />
                    <span>Upload KTP</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleKtpUpload}
                    className="text-[10px] w-full"
                  />
                  {ktpFileName && (
                    <div className="text-[10px] text-emerald-500 font-medium truncate mt-1">
                      ✓ {ktpFileName}
                    </div>
                  )}
                </div>

                {/* Upload Paspor */}
                <div
                  className={`p-2.5 rounded-lg border ${
                    isDark ? 'bg-[#252422] border-[#33312e]' : 'bg-white border-[#dedbd2]'
                  }`}
                >
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-[#f27244]" />
                    <span>Upload Paspor</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePassportUpload}
                    className="text-[10px] w-full"
                  />
                  {passportFileName && (
                    <div className="text-[10px] text-emerald-500 font-medium truncate mt-1">
                      ✓ {passportFileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div
            className={`pt-3 border-t flex items-center justify-end gap-2 ${
              isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowAddJamaahModal(false)}
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
              Simpan Pendaftaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
