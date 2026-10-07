import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo, exportToXlsx } from '../../utils/formatters';
import {
  Users,
  Receipt,
  FileText,
  UserPlus,
  ArrowRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Phone,
  FileSpreadsheet,
  Clock,
  Sparkles,
  Kanban,
  Plus,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    packages,
    jamaahList,
    transactions,
    setCurrentTab,
    setShowAddJamaahModal,
    setShowAddPackageModal,
    setShowManagePackageModal,
    setSelectedJamaah,
    setSelectedPackageDetail,
    theme,
  } = useApp();

  const isDark = theme === 'dark';
  const totalJamaah = jamaahList.length;
  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalReceivables = jamaahList.reduce(
    (acc, j) => acc + (j.totalCost - j.amountPaid),
    0
  );
  const incompleteCount = jamaahList.filter((j) => !j.isDataComplete).length;

  const handleExportXlsx = () => {
    const headers = [
      'NAMA LENGKAP',
      'NO WHATSAPP / HP',
      'PAKET UMROH',
      'TANGGAL BERANGKAT',
      'STATUS BERKAS',
      'UPLOAD KTP',
      'UPLOAD PASPOR',
      'STATUS BAYAR',
      'TOTAL BIAYA',
      'TERBAYAR',
      'SISA TAGIHAN',
    ];

    const rows = jamaahList.map((j) => {
      const pkg = packages.find((p) => p.id === j.packageId);
      return [
        j.fullName,
        j.phoneWhatsapp,
        pkg ? pkg.name : '-',
        j.departureDate || '-',
        j.isDataComplete ? 'Lengkap' : 'Belum Lengkap',
        j.documentStatus.ktpUploaded ? 'Sudah Upload' : 'Belum',
        j.documentStatus.passportUploaded ? 'Sudah Upload' : 'Belum',
        j.paymentStatus,
        j.totalCost,
        j.amountPaid,
        j.totalCost - j.amountPaid,
      ];
    });

    exportToXlsx('Data_Jamaah_MKB_Travel', headers, rows);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Sunsama Quick Actions Bar */}
      <div
        className={`p-4 rounded-xl border shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isDark
            ? 'bg-[#22211f] border-[#383633]'
            : 'bg-white border-[#dedbd2]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider">
              Aksi Cepat Backoffice
            </h2>
            <p
              className={`text-[11px] ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Pendaftaran instan, tambah program umroh baru, dan kelola status kuota.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Action 1: Pendaftaran Cepat */}
          <button
            onClick={() => setShowAddJamaahModal(true)}
            className="px-3.5 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Pendaftaran Cepat</span>
          </button>

          {/* Quick Action 2: Penambahan Paket Baru */}
          <button
            onClick={() => setShowAddPackageModal(true)}
            className={`px-3.5 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#f4f3ef] border-[#3d3b37]'
                : 'bg-[#faf9f6] hover:bg-[#eeebe3] text-[#23211e] border-[#dedbd2]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tambah Paket Baru</span>
          </button>

          {/* Quick Action 3: Kelola Paket (Hapus, Tutup, Sold Out) */}
          <button
            onClick={() => setShowManagePackageModal(true)}
            className={`px-3.5 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#3d3b37]'
                : 'bg-[#faf9f6] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Kelola Paket (Hapus, Tutup, Sold Out)</span>
          </button>
        </div>
      </div>

      {/* Sunsama 4 Top Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`flex items-center justify-between mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            <span className="text-xs font-medium">Total Jamaah</span>
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          </div>
          <div
            className={`text-2xl font-bold tracking-tight font-price-myriad ${
              isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
            }`}
          >
            {totalJamaah}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Jamaah aktif di sistem
          </div>
        </div>

        {/* KPI 2: Kas Pembayaran */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`flex items-center justify-between mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            <span className="text-xs font-medium">Kas Pembayaran Masuk</span>
            <span className="w-2 h-2 rounded-full bg-[#f27244]" />
          </div>
          <div
            className={`text-2xl font-bold tracking-tight font-price-myriad ${
              isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
            }`}
          >
            {formatRupiah(totalRevenue)}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            {transactions.length} transaksi pembayaran sah
          </div>
        </div>

        {/* KPI 3 */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`flex items-center justify-between mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            <span className="text-xs font-medium">Perlu Lengkapi Data</span>
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-[#f59e0b] tracking-tight font-price-myriad">
            {incompleteCount}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Baru Nama &amp; No HP (perlu KTP/Paspor)
          </div>
        </div>

        {/* KPI 4: Sisa Piutang */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`flex items-center justify-between mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            <span className="text-xs font-medium">Sisa Piutang Berjalan</span>
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          </div>
          <div
            className={`text-2xl font-bold tracking-tight font-price-myriad ${
              isDark ? 'text-[#d6d3cb]' : 'text-[#4a4740]'
            }`}
          >
            {formatRupiah(totalReceivables)}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Tagihan pelunasan bertahap
          </div>
        </div>
      </div>

      {/* 3 Simple Package Cards (With Distinct Kanban Colors & Myriad Bold) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f27244]" />
            <h2
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
              }`}
            >
              3 Program Paket Umroh Resmi (Warna Kanban)
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('packages')}
            className="text-xs text-[#f27244] hover:text-[#ff8559] font-medium flex items-center gap-1 transition-colors"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Buka Papan Kanban &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const kc = pkg.kanbanColors;

            return (
              <div
                key={pkg.id}
                className="rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between group"
                style={{
                  borderColor: isDark ? kc.columnBorderDark : kc.columnBorderLight,
                  backgroundColor: isDark ? '#22211f' : '#ffffff',
                }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold font-mono"
                      style={{
                        backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                        color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kc.dotColor }} />
                      <span>{pkg.durationDays} Hari</span>
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
                    className={`text-base font-bold leading-snug group-hover:text-[#f27244] transition-colors ${
                      isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                    }`}
                  >
                    {pkg.name}
                  </h3>

                  <div className="mt-3">
                    <div
                      className={`text-[10px] uppercase font-semibold tracking-wider ${
                        isDark ? 'text-[#8c8982]' : 'text-[#858178]'
                      }`}
                    >
                      Harga All-In (Myriad Bold)
                    </div>
                    <div
                      className="text-xl font-bold font-price-myriad mt-0.5"
                      style={{ color: isDark ? '#ffffff' : kc.badgeTextLight }}
                    >
                      {formatRupiah(pkg.price)}
                    </div>
                  </div>

                  <div
                    className="mt-3 text-xs space-y-1 pt-2 border-t"
                    style={{
                      borderColor: isDark ? '#2d2c29' : '#f0ede6',
                      color: isDark ? '#a6a39b' : '#6b6760',
                    }}
                  >
                    <div className="truncate">Hotel Makkah: {pkg.makkahHotel}</div>
                    <div className="truncate">Hotel Madinah: {pkg.madinahHotel}</div>
                    <div className="truncate">Maskapai: {pkg.airline}</div>
                  </div>
                </div>

                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: isDark ? '#2d2c29' : '#f0ede6' }}
                >
                  <span className="font-mono text-[11px] opacity-75">
                    {pkg.bookedSeats} / {pkg.quota} Kursi Terisi
                  </span>
                  <button
                    onClick={() => setSelectedPackageDetail(pkg)}
                    className="font-semibold transition-colors"
                    style={{ color: kc.accent }}
                  >
                    Detail Paket &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fast Intake Banner */}
      <div
        className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs transition-colors ${
          isDark
            ? 'bg-[#25221d] border-[#3d2e24]'
            : 'bg-[#fffbf7] border-[#fed7c8]'
        }`}
      >
        <div>
          <div
            className={`text-xs font-bold flex items-center gap-2 ${
              isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#f27244]" />
            <span>Formulir Pendaftaran Cepat (Wajib Nama &amp; No HP Saja)</span>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#a6a39b]' : 'text-[#737069]'
            }`}
          >
            Sistem ramah agen: daftarkan calon jamaah seketika. Berkas paspor dan scan KTP dapat dilengkapi belakangan kapan saja.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddJamaahModal(true)}
            className="px-4 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Input Nama &amp; HP</span>
          </button>
          <button
            onClick={handleExportXlsx}
            className={`px-3.5 py-2 border rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#383633]'
                : 'bg-white hover:bg-[#f7f6f2] text-[#4a4740] border-[#dedbd2]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Recent Jamaah Table */}
      <div
        className={`rounded-xl border shadow-xs overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e]'
            : 'bg-white border-[#e8e5dc]'
        }`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
              }`}
            >
              Daftar Jamaah Terdaftar
            </h3>
            <p
              className={`text-[11px] mt-0.5 ${
                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
              }`}
            >
              Klik baris jamaah untuk melengkapi data atau mengunggah scan KTP / Paspor.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('jamaah')}
            className="text-xs font-semibold text-[#f27244] hover:underline"
          >
            Lihat Semua ({jamaahList.length})
          </button>
        </div>

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
                <th className="py-2.5 px-3">Paket Umroh (Kanban)</th>
                <th className="py-2.5 px-3">Kelengkapan Data</th>
                <th className="py-2.5 px-3">Scan KTP &amp; Paspor</th>
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
              {jamaahList.slice(0, 6).map((j) => {
                const pkg = packages.find((p) => p.id === j.packageId);
                const kc = pkg?.kanbanColors;

                return (
                  <tr
                    key={j.id}
                    className={`transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#282724]' : 'hover:bg-[#fbfaf7]'
                    }`}
                    onClick={() => setSelectedJamaah(j)}
                  >
                    <td className="py-3 px-4">
                      <div
                        className={`font-semibold ${
                          isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'
                        }`}
                      >
                        {j.fullName}
                      </div>
                      <div className="text-[11px] text-[#f27244] font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{j.phoneWhatsapp}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {pkg && kc ? (
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border"
                          style={{
                            backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                            color: isDark ? kc.badgeTextDark : kc.badgeTextLight,
                            borderColor: kc.accent,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: kc.dotColor }}
                          />
                          <span>{pkg.name}</span>
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                      <div
                        className={`text-[10px] mt-0.5 font-mono ${
                          isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                        }`}
                      >
                        {j.departureDate}
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

                    <td className="py-3 px-3">
                      <div className="text-[11px] space-y-0.5 opacity-85">
                        <div>
                          KTP:{' '}
                          {j.documentStatus.ktpUploaded ? (
                            <strong className="text-emerald-500">Sudah Ada</strong>
                          ) : (
                            <span className="text-rose-400">Belum</span>
                          )}
                        </div>
                        <div>
                          Paspor:{' '}
                          {j.documentStatus.passportUploaded ? (
                            <strong className="text-emerald-500">Sudah Ada</strong>
                          ) : (
                            <span className="text-rose-400">Belum</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div
                        className={`font-bold font-price-myriad ${
                          isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'
                        }`}
                      >
                        {formatRupiah(j.amountPaid)}
                      </div>
                      <div
                        className={`text-[10px] ${
                          isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                        }`}
                      >
                        {j.paymentStatus}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJamaah(j);
                        }}
                        className="text-xs font-semibold text-[#f27244] hover:underline"
                      >
                        Lengkapi &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
