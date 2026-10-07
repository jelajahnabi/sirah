import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisaStatus } from '../../types';
import { formatRupiah, formatDateIndo, buildWaLink } from '../../utils/formatters';
import { COMPANY_INFO } from '../../data/mockData';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Save,
  QrCode,
} from 'lucide-react';

export const JamaahDetailModal: React.FC = () => {
  const {
    selectedJamaah,
    setSelectedJamaah,
    updateJamaah,
    packages,
    setIdCardJamaah,
    theme,
  } = useApp();

  if (!selectedJamaah) return null;

  const isDark = theme === 'dark';
  const pkg = packages.find((p) => p.id === selectedJamaah.packageId);
  const kc = pkg?.kanbanColors;
  const balance = selectedJamaah.totalCost - selectedJamaah.amountPaid;

  // Local form state for editing
  const [fullName, setFullName] = useState(selectedJamaah.fullName);
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(selectedJamaah.phoneWhatsapp);
  const [nik, setNik] = useState(selectedJamaah.nik || '');
  const [passportNumber, setPassportNumber] = useState(selectedJamaah.passportNumber || '');
  const [birthPlace, setBirthPlace] = useState(selectedJamaah.birthPlace || '');
  const [birthDate, setBirthDate] = useState(selectedJamaah.birthDate || '');
  const [passportExpiryDate, setPassportExpiryDate] = useState(selectedJamaah.passportExpiryDate || '');
  const [passportIssuePlace, setPassportIssuePlace] = useState(selectedJamaah.passportIssuePlace || '');
  const [address, setAddress] = useState(selectedJamaah.address || '');
  const [city, setCity] = useState(selectedJamaah.city || 'Yogyakarta');
  const [visaStatus, setVisaStatus] = useState<VisaStatus>(selectedJamaah.visaStatus);

  // File upload state
  const [ktpFileName, setKtpFileName] = useState(selectedJamaah.ktpFileName || '');
  const [ktpFileUrl, setKtpFileUrl] = useState(selectedJamaah.ktpFileUrl || '');
  const [passportFileName, setPassportFileName] = useState(selectedJamaah.passportFileName || '');
  const [passportFileUrl, setPassportFileUrl] = useState(selectedJamaah.passportFileUrl || '');

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

  const handleSave = () => {
    updateJamaah(selectedJamaah.id, {
      fullName: fullName.trim(),
      phoneWhatsapp: phoneWhatsapp.trim(),
      nik: nik.trim() || undefined,
      passportNumber: passportNumber.trim() || undefined,
      birthPlace: birthPlace.trim() || undefined,
      birthDate: birthDate || undefined,
      passportExpiryDate: passportExpiryDate || undefined,
      passportIssuePlace: passportIssuePlace.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      visaStatus,
      ktpFileName: ktpFileName || undefined,
      ktpFileUrl: ktpFileUrl || undefined,
      passportFileName: passportFileName || undefined,
      passportFileUrl: passportFileUrl || undefined,
      documentStatus: {
        ...selectedJamaah.documentStatus,
        ktpUploaded: Boolean(ktpFileName || ktpFileUrl),
        passportUploaded: Boolean(passportFileName || passportFileUrl),
      },
    });

    setSelectedJamaah(null);
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
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">
                {selectedJamaah.fullName}
              </h2>
              {selectedJamaah.isDataComplete ? (
                <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  Data Lengkap
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  Perlu Lengkapi Data
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {pkg && kc && (
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border"
                  style={{
                    backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                    color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                    borderColor: kc.accent,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: kc.dotColor }} />
                  <span>{pkg.name}</span>
                </span>
              )}
              <span
                className={`text-xs ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Berangkat: {selectedJamaah.departureDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIdCardJamaah(selectedJamaah);
                setSelectedJamaah(null);
              }}
              className="p-1.5 text-[#f27244] hover:bg-[#f27244]/10 rounded-lg text-xs font-semibold flex items-center gap-1 border border-[#f27244]/30 transition-colors"
              title="Cetak ID Card Lanyard"
            >
              <QrCode className="w-4 h-4" />
              <span>ID Card</span>
            </button>
            <button
              onClick={() => setSelectedJamaah(null)}
              className={`p-1 rounded-md transition-colors ${
                isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-3.5 text-xs">
          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">
                Nama Lengkap (Sesuai Paspor) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2 rounded-lg border font-semibold ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Nomor WhatsApp / HP *
              </label>
              <input
                type="text"
                required
                value={phoneWhatsapp}
                onChange={(e) => setPhoneWhatsapp(e.target.value)}
                className={`w-full p-2 rounded-lg border font-mono font-bold text-[#f27244] ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e]'
                    : 'bg-[#faf9f6] border-[#dedbd2]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
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
                className={`w-full p-2 rounded-lg border font-mono uppercase font-bold ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                className={`block font-medium mb-1 ${
                  isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                }`}
              >
                Tempat Lahir
              </label>
              <input
                type="text"
                placeholder="Yogyakarta"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className={`w-full p-2 rounded-lg border uppercase ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-medium mb-1 ${
                  isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                }`}
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`w-full p-2 rounded-lg border ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>

            <div>
              <label
                className={`block font-medium mb-1 ${
                  isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                }`}
              >
                Status Visa (Kemenhaj RI)
              </label>
              <select
                value={visaStatus}
                onChange={(e) => setVisaStatus(e.target.value as VisaStatus)}
                className={`w-full p-2 rounded-lg border ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              >
                <option value="Belum Proses">Belum Proses</option>
                <option value="Proses Enjaz">Proses Enjaz</option>
                <option value="Issued">Issued (Terbit)</option>
                <option value="Reject">Reject (Ditolak)</option>
              </select>
            </div>
          </div>

          {/* Upload Documents (KTP & Paspor) */}
          <div className="pt-2">
            <div className="font-bold mb-2">Upload Berkas Scan KTP &amp; Paspor:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Box KTP */}
              <div
                className={`p-3 rounded-xl border space-y-2 ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e]'
                    : 'bg-[#faf9f6] border-[#dedbd2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Scan / Foto KTP</span>
                  {ktpFileName ? (
                    <span className="text-[10px] text-emerald-500 font-semibold">✓ Terunggah</span>
                  ) : (
                    <span className="text-[10px] text-amber-500 font-medium">Belum Ada</span>
                  )}
                </div>

                {ktpFileUrl && (
                  <div className="w-full h-24 rounded border overflow-hidden flex items-center justify-center bg-black/10">
                    <img
                      src={ktpFileUrl}
                      alt="Scan KTP"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label
                    className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 border transition-colors ${
                      isDark
                        ? 'bg-[#282725] hover:bg-[#32302d] text-[#d6d3cb] border-[#383633]'
                        : 'bg-white hover:bg-[#f0ede6] text-[#4a4740] border-[#dedbd2]'
                    }`}
                  >
                    <Upload className="w-3 h-3 text-[#f27244]" />
                    <span>{ktpFileName ? 'Ganti File KTP' : 'Upload KTP'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleKtpUpload}
                      className="hidden"
                    />
                  </label>
                  {ktpFileName && (
                    <span
                      className={`text-[10px] truncate max-w-[120px] ${
                        isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                      }`}
                    >
                      {ktpFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Box Paspor */}
              <div
                className={`p-3 rounded-xl border space-y-2 ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e]'
                    : 'bg-[#faf9f6] border-[#dedbd2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Scan / Foto Paspor</span>
                  {passportFileName ? (
                    <span className="text-[10px] text-emerald-500 font-semibold">✓ Terunggah</span>
                  ) : (
                    <span className="text-[10px] text-amber-500 font-medium">Belum Ada</span>
                  )}
                </div>

                {passportFileUrl && (
                  <div className="w-full h-24 rounded border overflow-hidden flex items-center justify-center bg-black/10">
                    <img
                      src={passportFileUrl}
                      alt="Scan Paspor"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label
                    className={`cursor-pointer px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 border transition-colors ${
                      isDark
                        ? 'bg-[#282725] hover:bg-[#32302d] text-[#d6d3cb] border-[#383633]'
                        : 'bg-white hover:bg-[#f0ede6] text-[#4a4740] border-[#dedbd2]'
                    }`}
                  >
                    <Upload className="w-3 h-3 text-[#f27244]" />
                    <span>{passportFileName ? 'Ganti File Paspor' : 'Upload Paspor'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePassportUpload}
                      className="hidden"
                    />
                  </label>
                  {passportFileName && (
                    <span
                      className={`text-[10px] truncate max-w-[120px] ${
                        isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                      }`}
                    >
                      {passportFileName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment summary with Myriad Bold font */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isDark
                ? 'bg-[#1a1918] border-[#33312e]'
                : 'bg-[#faf9f6] border-[#dedbd2]'
            }`}
          >
            <div>
              <div className="font-semibold">Status Tagihan Paket (Myriad Bold):</div>
              <div
                className={`mt-0.5 ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Total: <span className="font-price-myriad font-bold">{formatRupiah(selectedJamaah.totalCost)}</span> · Terbayar:{' '}
                <span className="font-price-myriad font-bold text-emerald-500">{formatRupiah(selectedJamaah.amountPaid)}</span>
              </div>
            </div>
            <div className="text-right">
              {balance <= 0 ? (
                <span className="text-emerald-500 font-bold">LUNAS</span>
              ) : (
                <div className="text-amber-500 font-bold font-price-myriad text-sm">
                  Sisa: {formatRupiah(balance)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className={`pt-3 border-t flex items-center justify-end gap-2 text-xs ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <button
            onClick={() => setSelectedJamaah(null)}
            className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
              isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#f0ede6]'
            }`}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
