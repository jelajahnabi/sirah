import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Jamaah } from '../../types';
import { formatRupiah, formatDateIndo, exportToXlsx, buildWaLink } from '../../utils/formatters';
import {
  Users,
  Search,
  UserPlus,
  FileSpreadsheet,
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  ArrowUpDown,
  Layers,
  List,
  Compass,
  Calendar,
} from 'lucide-react';

export const JamaahDatabaseView: React.FC = () => {
  const {
    jamaahList,
    packages,
    setShowAddJamaahModal,
    setSelectedJamaah,
    setIdCardJamaah,
    setShippingLabelJamaah,
    theme,
  } = useApp();

  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompleteness, setFilterCompleteness] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  const [sortBy, setSortBy] = useState<'package' | 'departureDate' | 'name' | 'balance' | 'completeness'>('package');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');

  // Filter and sort
  const sortedAndFilteredList = useMemo(() => {
    const list = jamaahList.filter((j) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        j.fullName.toLowerCase().includes(query) ||
        (j.passportNumber && j.passportNumber.toLowerCase().includes(query)) ||
        (j.nik && j.nik.includes(query)) ||
        j.phoneWhatsapp.includes(query) ||
        (j.city && j.city.toLowerCase().includes(query));

      const matchCompleteness =
        filterCompleteness === 'all' ||
        (filterCompleteness === 'complete' && j.isDataComplete) ||
        (filterCompleteness === 'incomplete' && !j.isDataComplete);

      const matchPayment = filterPayment === 'all' || j.paymentStatus === filterPayment;
      const matchPackage = filterPackage === 'all' || j.packageId === filterPackage;

      return matchSearch && matchCompleteness && matchPayment && matchPackage;
    });

    return list.sort((a, b) => {
      if (sortBy === 'package') {
        const pkgA = packages.find((p) => p.id === a.packageId)?.name || 'zzz';
        const pkgB = packages.find((p) => p.id === b.packageId)?.name || 'zzz';
        return pkgA.localeCompare(pkgB);
      }
      if (sortBy === 'departureDate') {
        return (a.departureDate || '').localeCompare(b.departureDate || '');
      }
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'balance') {
        const balA = a.totalCost - a.amountPaid;
        const balB = b.totalCost - b.amountPaid;
        return balB - balA;
      }
      if (sortBy === 'completeness') {
        return (a.isDataComplete ? 0 : 1) - (b.isDataComplete ? 0 : 1);
      }
      return 0;
    });
  }, [jamaahList, packages, searchQuery, filterCompleteness, filterPayment, filterPackage, sortBy]);

  // Grouped by package for Grouped View
  const groupedPackages = useMemo(() => {
    const groups: { [key: string]: Jamaah[] } = {};

    packages.forEach((pkg) => {
      groups[pkg.id] = [];
    });
    groups['unassigned'] = [];

    sortedAndFilteredList.forEach((j) => {
      if (j.packageId && groups[j.packageId]) {
        groups[j.packageId].push(j);
      } else {
        groups['unassigned'].push(j);
      }
    });

    return groups;
  }, [sortedAndFilteredList, packages]);

  const handleExportXlsx = () => {
    const headers = [
      'NAMA LENGKAP (PASPOR)',
      'NO WHATSAPP / HP',
      'NIK (KTP)',
      'NO PASPOR',
      'TGL LAHIR',
      'TEMPAT LAHIR',
      'EXP PASPOR',
      'KOTA ASAL',
      'PAKET UMROH',
      'TANGGAL BERANGKAT',
      'STATUS DATA',
      'UPLOAD KTP',
      'UPLOAD PASPOR',
      'STATUS VISA',
      'STATUS BAYAR',
      'TOTAL BIAYA',
      'TERBAYAR',
      'SISA TAGIHAN',
    ];

    const rows = sortedAndFilteredList.map((j) => {
      const pkg = packages.find((p) => p.id === j.packageId);
      return [
        j.fullName,
        j.phoneWhatsapp,
        j.nik || '-',
        j.passportNumber || '-',
        j.birthDate || '-',
        j.birthPlace || '-',
        j.passportExpiryDate || '-',
        j.city || '-',
        pkg ? pkg.name : '-',
        j.departureDate || '-',
        j.isDataComplete ? 'Lengkap' : 'Belum Lengkap (Nama & HP Saja)',
        j.documentStatus.ktpUploaded ? 'Sudah Diunggah' : 'Belum',
        j.documentStatus.passportUploaded ? 'Sudah Diunggah' : 'Belum',
        j.visaStatus,
        j.paymentStatus,
        j.totalCost,
        j.amountPaid,
        j.totalCost - j.amountPaid,
      ];
    });

    exportToXlsx('Database_Jamaah_MKB_Travel', headers, rows);
  };

  const handleSendWa = (j: Jamaah) => {
    const balance = j.totalCost - j.amountPaid;
    let message = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${j.fullName}*,\n\nKami dari *PT MUDAHKEBAITULLAH TRAVEL INDONESIA (Yogyakarta)* menginformasikan update status pendaftaran umroh Anda:\n\n`;

    if (!j.isDataComplete) {
      message += `Pendaftaran awal Anda telah kami catat. Mohon untuk melengkapi data & upload scan KTP serta Paspor asli untuk pengurusan visa Kemenhaj RI.\n\n`;
    }

    message += `🔹 Status Pembayaran: *${j.paymentStatus}*\n🔹 Terbayar: *${formatRupiah(j.amountPaid)}*\n`;
    if (balance > 0) {
      message += `🔹 Sisa Pelunasan: *${formatRupiah(balance)}*\n`;
    }
    message += `\nAlamat Kantor: Jl. Bener No.79 Bener, Kec. Tegalrejo, Kota Yogyakarta.\nJazakumullah Khairan Katsiran.`;

    window.open(buildWaLink(j.phoneWhatsapp, message), '_blank');
  };

  const renderJamaahRow = (j: Jamaah) => {
    const pkg = packages.find((p) => p.id === j.packageId);
    const kc = pkg?.kanbanColors;
    const balance = j.totalCost - j.amountPaid;

    return (
      <tr
        key={j.id}
        onClick={() => setSelectedJamaah(j)}
        className={`transition-colors cursor-pointer ${
          isDark ? 'hover:bg-[#282724]' : 'hover:bg-[#fbfaf7]'
        }`}
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isDark ? 'bg-[#2d2b28] text-[#f27244]' : 'bg-[#fff0eb] text-[#f27244]'
              }`}
            >
              {j.fullName.slice(0, 1)}
            </div>
            <div>
              <div className={`font-semibold ${isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'}`}>
                {j.fullName}
              </div>
              <div className="text-[11px] text-[#f27244] font-mono flex items-center gap-1 mt-0.5">
                <PhoneCall className="w-3 h-3" />
                <span>{j.phoneWhatsapp}</span>
              </div>
            </div>
          </div>
        </td>

        <td className="py-3 px-3">
          {pkg && kc ? (
            <span
              className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border"
              style={{
                backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                borderColor: kc.accent,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: kc.dotColor }} />
              <span>{pkg.name}</span>
            </span>
          ) : (
            <span className="text-[11px] opacity-60">Belum Memilih Paket</span>
          )}
          <div
            className={`text-[10px] mt-0.5 font-mono ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            {j.departureDate || '-'}
          </div>
        </td>

        <td className="py-3 px-3">
          {j.isDataComplete ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>Lengkap</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
              <AlertCircle className="w-3 h-3" />
              <span>Belum Lengkap</span>
            </span>
          )}
        </td>

        <td className="py-3 px-3 text-[11px]">
          <div className="space-y-0.5">
            <div>
              KTP:{' '}
              {j.documentStatus.ktpUploaded ? (
                <span className="text-emerald-500 font-semibold">Ada &#10003;</span>
              ) : (
                <span className="text-rose-400">Belum</span>
              )}
            </div>
            <div>
              Paspor:{' '}
              {j.documentStatus.passportUploaded ? (
                <span className="text-emerald-500 font-semibold">Ada &#10003;</span>
              ) : (
                <span className="text-rose-400">Belum</span>
              )}
            </div>
          </div>
        </td>

        <td className="py-3 px-3">
          <div className={`font-bold font-price-myriad ${isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'}`}>
            {formatRupiah(j.amountPaid)}
          </div>
          <div className={`text-[10px] ${isDark ? 'text-[#737069]' : 'text-[#8c8982]'}`}>
            {j.paymentStatus} {balance > 0 && `(Sisa: ${formatRupiah(balance)})`}
          </div>
        </td>

        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShippingLabelJamaah(j)}
            className="px-2 py-1 rounded text-[11px] font-medium border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
            title="Cetak Label Pengiriman Koper Alamat KTP"
          >
            Resi Koper
          </button>
          <button
            onClick={() => setIdCardJamaah(j)}
            className={`p-1.5 rounded transition-colors inline-flex cursor-pointer ${
              isDark
                ? 'text-[#9c988f] hover:text-[#f4f3ef] hover:bg-[#282725]'
                : 'text-[#737069] hover:text-[#23211e] hover:bg-[#f0ede6]'
            }`}
            title="Cetak ID Card Kalung"
          >
            <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
          <button
            onClick={() => handleSendWa(j)}
            className={`p-1.5 rounded transition-colors inline-flex cursor-pointer ${
              isDark
                ? 'text-[#9c988f] hover:text-[#f27244] hover:bg-[#282725]'
                : 'text-[#737069] hover:text-[#f27244] hover:bg-[#f0ede6]'
            }`}
            title="Kirim Pesan WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSelectedJamaah(j)}
            className="px-2.5 py-1 text-xs font-semibold text-[#f27244] hover:underline cursor-pointer"
          >
            Lengkapi &rarr;
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header bar */}
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
              Database &amp; Pengelompokan Jamaah
            </h2>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                isDark ? 'bg-[#2e2c29] text-[#f27244]' : 'bg-[#fff0eb] text-[#e06336]'
              }`}
            >
              {jamaahList.length} Jamaah
            </span>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Daftar jamaah dapat disortir dan dikelompokkan berdasarkan grup paket keberangkatan resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Grup Paket vs Tabel Biasa */}
          <div
            className={`flex items-center p-1 rounded-lg border text-xs ${
              isDark ? 'bg-[#1a1918] border-[#33312e]' : 'bg-[#faf9f6] border-[#dedbd2]'
            }`}
          >
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'grouped'
                  ? isDark
                    ? 'bg-[#2d2b28] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#23211e] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#f27244]" />
              <span>Grup Paket</span>
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'flat'
                  ? isDark
                    ? 'bg-[#2d2b28] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#23211e] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel Penuh</span>
            </button>
          </div>

          <button
            onClick={handleExportXlsx}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#383633]'
                : 'bg-[#f7f6f2] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setShowAddJamaahModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Pendaftaran Cepat</span>
          </button>
        </div>
      </div>

      {/* Package Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span
          className={`font-semibold shrink-0 ${
            isDark ? 'text-[#8c8982]' : 'text-[#737069]'
          }`}
        >
          Grup Paket:
        </span>
        <button
          onClick={() => setFilterPackage('all')}
          className={`px-3 py-1 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
            filterPackage === 'all'
              ? isDark
                ? 'bg-[#2d2b28] text-[#f4f3ef] border-[#f27244]'
                : 'bg-white text-[#23211e] border-[#f27244] shadow-xs'
              : isDark
              ? 'bg-[#1e1d1b] border-[#33312e] text-[#8c8982]'
              : 'bg-[#faf9f6] border-[#e8e5dc] text-[#737069]'
          }`}
        >
          Semua Paket ({jamaahList.length})
        </button>

        {packages.map((pkg) => {
          const count = jamaahList.filter((j) => j.packageId === pkg.id).length;
          const isSelected = filterPackage === pkg.id;
          const kc = pkg.kanbanColors;

          return (
            <button
              key={pkg.id}
              onClick={() => setFilterPackage(isSelected ? 'all' : pkg.id)}
              className="px-3 py-1 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              style={{
                backgroundColor: isSelected
                  ? isDark
                    ? kc.badgeBgDark
                    : kc.badgeBgLight
                  : isDark
                  ? '#1e1d1b'
                  : '#faf9f6',
                borderColor: isSelected ? kc.accent : isDark ? '#33312e' : '#e8e5dc',
                color: isSelected
                  ? isDark
                    ? kc.badgeTextDark
                    : kc.badgeTextLight
                  : isDark
                  ? '#d6d3cb'
                  : '#4a4740',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kc.dotColor }} />
              <span className="font-semibold">{pkg.name}</span>
              <span className="text-[10px] font-mono opacity-80">({count} pax)</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sorting Toolbar */}
      <div
        className={`flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border shadow-xs transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e]'
            : 'bg-white border-[#e8e5dc]'
        }`}
      >
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#737069] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, WhatsApp, NIK, paspor, kota..."
            className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
              isDark
                ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef] placeholder-[#737069]'
                : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e] placeholder-[#8c8982]'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#f27244]" />
            <span className={isDark ? 'text-[#8c8982]' : 'text-[#737069]'}>Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                  : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
              }`}
            >
              <option value="package">Grup Paket Keberangkatan (A-Z)</option>
              <option value="departureDate">Tanggal Keberangkatan (Terdekat)</option>
              <option value="name">Nama Jamaah (A-Z)</option>
              <option value="balance">Sisa Tagihan (Tertinggi)</option>
              <option value="completeness">Status Kelengkapan Berkas</option>
            </select>
          </div>

          {/* Filter completeness */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg border text-xs ${
              isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#f7f6f2] border-[#dedbd2]'
            }`}
          >
            <button
              onClick={() => setFilterCompleteness('all')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                filterCompleteness === 'all'
                  ? isDark
                    ? 'bg-[#2d2b28] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#23211e] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterCompleteness('complete')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                filterCompleteness === 'complete'
                  ? 'bg-emerald-500/20 text-emerald-500 font-semibold'
                  : 'text-[#8c8982]'
              }`}
            >
              Lengkap
            </button>
            <button
              onClick={() => setFilterCompleteness('incomplete')}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                filterCompleteness === 'incomplete'
                  ? 'bg-amber-500/20 text-amber-500 font-semibold'
                  : 'text-[#8c8982]'
              }`}
            >
              Belum
            </button>
          </div>
        </div>
      </div>

      {/* DISPLAY MODE 1: GROUPED BY PACKAGE */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          {packages
            .filter((pkg) => filterPackage === 'all' || filterPackage === pkg.id)
            .map((pkg) => {
              const listInGroup = groupedPackages[pkg.id] || [];
              const kc = pkg.kanbanColors;

              return (
                <div
                  key={pkg.id}
                  className="rounded-xl border shadow-xs overflow-hidden transition-colors"
                  style={{
                    borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                    backgroundColor: isDark ? '#22211f' : '#ffffff',
                  }}
                >
                  {/* Group Header */}
                  <div
                    className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{
                      backgroundColor: isDark ? kc.columnHeaderDark : kc.columnHeaderLight,
                      borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: kc.dotColor }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-sm font-bold tracking-tight"
                            style={{ color: isDark ? '#ffffff' : kc.badgeTextLight }}
                          >
                            {pkg.name}
                          </h3>
                          <span
                            className="text-[11px] font-mono font-bold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                              color: kc.accent,
                            }}
                          >
                            {pkg.durationDays} Hari · {pkg.departureMonth}
                          </span>
                        </div>
                        <div
                          className={`text-xs mt-0.5 flex items-center gap-3 ${
                            isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                          }`}
                        >
                          <span>Hotel: {pkg.makkahHotel} &amp; {pkg.madinahHotel}</span>
                          <span>·</span>
                          <span>Maskapai: {pkg.airline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-xs font-bold font-price-myriad text-[#f27244]">
                          {formatRupiah(pkg.price)}
                        </div>
                        <div className="text-[10px] opacity-70">
                          {listInGroup.length} / {pkg.quota} Kuota Terisi
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border"
                        style={{
                          backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                          borderColor: kc.accent,
                          color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                        }}
                      >
                        {listInGroup.length} Jamaah
                      </span>
                    </div>
                  </div>

                  {/* Table of pilgrims in this group */}
                  {listInGroup.length === 0 ? (
                    <div className="p-6 text-center text-xs opacity-60">
                      Tidak ada jamaah terdaftar dalam filter ini untuk grup {pkg.name}.
                    </div>
                  ) : (
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
                            <th className="py-2.5 px-4">Nama Jamaah &amp; WhatsApp</th>
                            <th className="py-2.5 px-3">Grup Paket &amp; Jadwal</th>
                            <th className="py-2.5 px-3">Status Data</th>
                            <th className="py-2.5 px-3">Berkas KTP &amp; Paspor</th>
                            <th className="py-2.5 px-3">Pembayaran (Myriad Bold)</th>
                            <th className="py-2.5 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${
                            isDark
                              ? 'divide-[#2d2c29] text-[#d6d3cb]'
                              : 'divide-[#f0ede6] text-[#33302b]'
                          }`}
                        >
                          {listInGroup.map((j) => renderJamaahRow(j))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* DISPLAY MODE 2: FLAT SORTED TABLE */}
      {viewMode === 'flat' && (
        <div
          className={`rounded-xl border shadow-xs overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
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
                  <th className="py-2.5 px-4">Nama Jamaah &amp; WhatsApp</th>
                  <th className="py-2.5 px-3">Grup Paket &amp; Jadwal</th>
                  <th className="py-2.5 px-3">Status Data</th>
                  <th className="py-2.5 px-3">Berkas KTP &amp; Paspor</th>
                  <th className="py-2.5 px-3">Pembayaran (Myriad Bold)</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark
                    ? 'divide-[#2d2c29] text-[#d6d3cb]'
                    : 'divide-[#f0ede6] text-[#33302b]'
                }`}
              >
                {sortedAndFilteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs opacity-60">
                      Tidak ada jamaah yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  sortedAndFilteredList.map((j) => renderJamaahRow(j))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
