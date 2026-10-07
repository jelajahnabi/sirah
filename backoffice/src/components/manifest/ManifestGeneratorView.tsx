import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatDateIndo, exportToXlsx } from '../../utils/formatters';
import { BrandLogo } from '../BrandLogo';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Plane,
  Building,
  Calendar,
} from 'lucide-react';

export const ManifestGeneratorView: React.FC = () => {
  const { departureGroups, jamaahList, packages, theme } = useApp();

  const isDark = theme === 'dark';
  const [selectedGroupId, setSelectedGroupId] = useState(
    departureGroups[0]?.id || ''
  );
  const [copiedText, setCopiedText] = useState(false);

  const currentGroup =
    departureGroups.find((g) => g.id === selectedGroupId) || departureGroups[0];

  const manifestJamaah = jamaahList.filter(
    (j) =>
      j.packageId === currentGroup?.packageId ||
      j.departureDate === currentGroup?.departureDate
  );

  const handleCopyManifest = () => {
    let text = `MANIFEST PENERBANGAN RESMI\nPT MUDAHKEBAITULLAH TRAVEL INDONESIA\nPPIU Kemenhaj RI No. 9120008391024\n`;
    text += `ROMBONGAN: ${currentGroup.code} (${currentGroup.name})\n`;
    text += `MASKAPAI: ${currentGroup.airline} (${currentGroup.flightNumber})\n`;
    text += `TANGGAL: ${currentGroup.departureDate} s/d ${currentGroup.returnDate}\n`;
    text += `RUTE: ${currentGroup.departureAirport} - ${currentGroup.arrivalAirport}\n\n`;
    text += `NO | NAMA LENGKAP | NO PASPOR | TGL LAHIR | EXP PASPOR | NO HP / WA\n`;

    manifestJamaah.forEach((j, idx) => {
      text += `${idx + 1}. | ${j.fullName} | ${j.passportNumber || '-'} | ${j.birthDate || '-'} | ${j.passportExpiryDate || '-'} | ${j.phoneWhatsapp}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleExportXlsx = () => {
    const headers = [
      'NO',
      'TITLE',
      'NAMA LENGKAP (SESUAI PASPOR)',
      'GENDER',
      'NOMOR PASPOR',
      'TEMPAT LAHIR',
      'TANGGAL LAHIR',
      'TANGGAL EXP PASPOR',
      'KANTOR IMIGRASI',
      'NOMOR WHATSAPP',
      'KOTA DOMISILI',
      'STATUS VISA',
      'PAKET UMROH',
    ];

    const rows = manifestJamaah.map((j, index) => [
      index + 1,
      j.title || 'Mr',
      j.fullName,
      j.gender || 'L',
      j.passportNumber || '-',
      j.birthPlace || 'Yogyakarta',
      j.birthDate || '-',
      j.passportExpiryDate || '-',
      j.passportIssuePlace || 'Imigrasi Yogyakarta',
      j.phoneWhatsapp,
      j.city || 'Yogyakarta',
      j.visaStatus,
      currentGroup.packageName,
    ]);

    exportToXlsx(`MANIFEST_${currentGroup.code}_${currentGroup.departureDate}`, headers, rows);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e8e5dc] text-[#23211e]'
        }`}
      >
        <div>
          <h2 className="text-base font-bold">
            Manivest Penerbangan &amp; Kloter
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Format resmi standar maskapai penerbangan dan Sistem Kemenhaj RI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Kloter selector */}
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border font-medium focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
              isDark
                ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
            }`}
          >
            {departureGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} - {g.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyManifest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#383633]'
                : 'bg-[#f7f6f2] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
            }`}
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Teks</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportXlsx}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Manifest Overview Box */}
      <div
        className={`rounded-xl border shadow-xs p-5 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e]'
            : 'bg-white border-[#e8e5dc]'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: isDark ? '#2d2c29' : '#eeece6' }}
        >
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8" showUploadPrompt={false} />
            <div>
              <div className="font-extrabold text-xs">
                {COMPANY_INFO.legalName}
              </div>
              <div
                className={`text-[10px] ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                PPIU Kemenhaj RI: {COMPANY_INFO.skIzin} · Yogyakarta
              </div>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#f27244]">
            {currentGroup.code}
          </span>
        </div>

        {/* Info Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border text-xs ${
            isDark
              ? 'bg-[#1a1918] border-[#2d2c29] text-[#d6d3cb]'
              : 'bg-[#faf9f6] border-[#eeece6] text-[#3d3a35]'
          }`}
        >
          <div>
            <span
              className={`text-[10px] font-semibold uppercase block ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Program
            </span>
            <span className="font-bold">{currentGroup.packageName}</span>
          </div>
          <div>
            <span
              className={`text-[10px] font-semibold uppercase block ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Penerbangan
            </span>
            <span className="font-bold">{currentGroup.airline} ({currentGroup.flightNumber})</span>
          </div>
          <div>
            <span
              className={`text-[10px] font-semibold uppercase block ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Jadwal
            </span>
            <span className="font-medium">{currentGroup.departureDate} s/d {currentGroup.returnDate}</span>
          </div>
          <div>
            <span
              className={`text-[10px] font-semibold uppercase block ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Tour Leader
            </span>
            <span className="font-medium">{currentGroup.tourLeader}</span>
          </div>
        </div>

        {/* Manifest Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead
              className={`border-b font-semibold ${
                isDark
                  ? 'bg-[#1e1d1b] border-[#2d2c29] text-[#9c988f]'
                  : 'bg-[#faf9f6] border-[#eeece6] text-[#737069]'
              }`}
            >
              <tr>
                <th className="py-2 px-3">No</th>
                <th className="py-2 px-4">Nama Lengkap (Sesuai Paspor)</th>
                <th className="py-2 px-3">No. Paspor</th>
                <th className="py-2 px-3">Tgl Lahir</th>
                <th className="py-2 px-3">Exp Paspor</th>
                <th className="py-2 px-3">Status Visa</th>
                <th className="py-2 px-3">Kontak WA</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark
                  ? 'divide-[#2d2c29] text-[#d6d3cb]'
                  : 'divide-[#f0ede6] text-[#33302b]'
              }`}
            >
              {manifestJamaah.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`py-8 text-center text-xs ${
                      isDark ? 'text-[#737069]' : 'text-[#9c988f]'
                    }`}
                  >
                    Belum ada jamaah yang dialokasikan ke kloter penerbangan ini.
                  </td>
                </tr>
              ) : (
                manifestJamaah.map((j, idx) => (
                  <tr
                    key={j.id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-[#282724]' : 'hover:bg-[#fbfaf7]'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono opacity-70">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-bold">
                      {j.fullName}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {j.passportNumber || <span className="opacity-50 italic">Belum ada</span>}
                    </td>
                    <td className="py-2.5 px-3 opacity-80">
                      {j.birthDate || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono opacity-80">
                      {j.passportExpiryDate || '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                          j.visaStatus === 'Issued'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : j.visaStatus === 'Proses Enjaz'
                            ? 'bg-blue-500/15 text-blue-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {j.visaStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#f27244]">
                      {j.phoneWhatsapp}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
