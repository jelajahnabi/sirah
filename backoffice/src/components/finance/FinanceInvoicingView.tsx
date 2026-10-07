import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import {
  formatRupiah,
  formatDateIndo,
  exportToXlsx,
  downloadReceiptPdf,
} from '../../utils/formatters';
import {
  Receipt,
  Plus,
  FileSpreadsheet,
  Download,
  CreditCard,
  Building,
  Search,
  Upload,
  CheckCircle2,
  UserCheck,
  FileText,
  AlertCircle,
  FileUp,
  Settings,
} from 'lucide-react';

export const FinanceInvoicingView: React.FC = () => {
  const {
    transactions,
    jamaahList,
    addPaymentTransaction,
    setReceiptModalTx,
    customLogo,
    theme,
    signatoryStaffName,
    setSignatoryStaffName,
    customFinanceFormat,
    setCustomFinanceFormat,
  } = useApp();

  const isDark = theme === 'dark';
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showUploadFormatModal, setShowUploadFormatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Signatory Staff state
  const [staffNameInput, setStaffNameInput] = useState(signatoryStaffName || 'Umi Kalsum (Finance MKB)');
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [staffSavedAlert, setStaffSavedAlert] = useState(false);

  // Form states for new payment
  const [selectedJamaahId, setSelectedJamaahId] = useState('');
  const [amount, setAmount] = useState<number>(5000000);
  const [paymentMethod, setPaymentMethod] = useState<
    'Transfer BSI' | 'Transfer Mandiri' | 'Tunai di Kantor' | 'BSI QRIS'
  >('Transfer BSI');
  const [paymentType, setPaymentType] = useState<
    'DP Pendaftaran' | 'Cicilan Ke-1' | 'Cicilan Ke-2' | 'Pelunasan Akhir'
  >('DP Pendaftaran');
  const [notes, setNotes] = useState('');

  // Upload Format Keuangan state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedPreviewRows, setParsedPreviewRows] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalReceivables = jamaahList.reduce(
    (acc, j) => acc + (j.totalCost - j.amountPaid),
    0
  );

  const filteredTx = transactions.filter(
    (t) =>
      t.jamaahName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveStaffName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNameInput.trim()) return;
    setSignatoryStaffName(staffNameInput.trim());
    setIsEditingStaff(false);
    setStaffSavedAlert(true);
    setTimeout(() => setStaffSavedAlert(false), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const j = jamaahList.find((item) => item.id === selectedJamaahId);
    if (!j) return;

    const newTx = addPaymentTransaction({
      invoiceNumber: `INV-MKB-${Date.now().toString().slice(-6)}`,
      jamaahId: j.id,
      jamaahName: j.fullName,
      packageName: 'Paket Umroh MKB',
      amount: Number(amount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      paymentType,
      notes,
      verifiedBy: signatoryStaffName || staffNameInput || 'Umi Kalsum (Finance MKB)',
    });

    setShowAddTxModal(false);
    setReceiptModalTx(newTx);
  };

  const handleDownloadTemplateFormat = () => {
    const headers = [
      'NO_BUKTI_TRANSAKSI',
      'TANGGAL_BAYAR (YYYY-MM-DD)',
      'NAMA_LENGKAP_JAMAAH',
      'NOMOR_KTP_NIK',
      'PROGRAM_PAKET_UMROH',
      'JENIS_PEMBAYARAN (DP/Cicilan/Pelunasan)',
      'METODE_TRANSFER_KAS',
      'NOMINAL_MASUK (IDR)',
      'NAMA_STAF_VERIFIKATOR',
      'KETERANGAN_TAMBAHAN',
    ];

    const sampleRows = [
      [
        'KW-MKB-202611-001',
        '2026-11-01',
        'Ahmad Subagyo, S.T.',
        '3471012903820001',
        'Umroh Sebulan Penuh November (30 Hari)',
        'DP Pendaftaran',
        'Transfer BSI',
        5000000,
        signatoryStaffName || 'Umi Kalsum (Finance MKB)',
        'DP awal pendaftaran via transfer BSI Rek 7192839102',
      ],
      [
        'KW-MKB-202611-002',
        '2026-11-05',
        'Hj. Siti Nurhaliza',
        '3471025510840003',
        'Umroh Ramadan Iktikaf Lailatul Qadar (16 Hari)',
        'Pelunasan Akhir',
        'Transfer Mandiri',
        38500000,
        signatoryStaffName || 'Umi Kalsum (Finance MKB)',
        'Pelunasan tuntas sebelum issued visa',
      ],
    ];

    exportToXlsx('Format_Khusus_Keuangan_MKB_Travel_Template', headers, sampleRows);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    // Generate simulated preview rows based on selected file
    const simulatedRows = [
      {
        no: 'MUT-001',
        date: '2026-11-08',
        jamaah: 'Drs. Bambang Sudarmono',
        type: 'Cicilan Ke-1',
        method: 'Transfer BSI',
        amount: 15000000,
        verifiedBy: signatoryStaffName,
        status: 'Valid Format',
      },
      {
        no: 'MUT-002',
        date: '2026-11-08',
        jamaah: 'Fatimah Az-Zahra',
        type: 'Pelunasan Akhir',
        method: 'Transfer Mandiri',
        amount: 22000000,
        verifiedBy: signatoryStaffName,
        status: 'Valid Format',
      },
      {
        no: 'MUT-003',
        date: '2026-11-07',
        jamaah: 'Rahmat Hidayat',
        type: 'DP Pendaftaran',
        method: 'Tunai di Kantor',
        amount: 5000000,
        verifiedBy: signatoryStaffName,
        status: 'Valid Format',
      },
    ];

    setParsedPreviewRows(simulatedRows);
  };

  const handleApplyCustomFormat = () => {
    if (!uploadedFile) return;

    setCustomFinanceFormat({
      fileName: uploadedFile.name,
      uploadDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      rowCount: parsedPreviewRows.length,
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadFormatModal(false);
      setUploadedFile(null);
      setParsedPreviewRows([]);
    }, 1500);
  };

  const handleExportXlsx = () => {
    const headers = [
      'NOMOR KWITANSI',
      'NOMOR INVOICE',
      'NAMA JAMAAH',
      'PROGRAM UMROH',
      'JUMLAH BAYAR (IDR)',
      'TANGGAL BAYAR',
      'METODE PEMBAYARAN',
      'JENIS PEMBAYARAN',
      'PENANDATANGAN KASIR',
      'CATATAN',
    ];

    const rows = filteredTx.map((t) => [
      t.receiptNumber,
      t.invoiceNumber,
      t.jamaahName,
      t.packageName,
      t.amount,
      t.paymentDate,
      t.paymentMethod,
      t.paymentType,
      signatoryStaffName || t.verifiedBy,
      t.notes || '-',
    ]);

    exportToXlsx('Laporan_Keuangan_MKB_Travel', headers, rows);
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
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f27244]" />
            <h2 className="text-base font-bold">
              Keuangan, Kwitansi Digital &amp; Format Khusus
            </h2>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Penerimaan kas, verifikasi kwitansi resmi ber-tanda tangan staf, serta upload laporan format khusus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Button Upload Format Keuangan Khusus */}
          <button
            onClick={() => setShowUploadFormatModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#2a2926] hover:bg-[#343330] text-[#f27244] border-[#482c22]'
                : 'bg-[#fff5f1] hover:bg-[#ffece4] text-[#c8471b] border-[#fed7c8]'
            }`}
          >
            <FileUp className="w-4 h-4 text-[#f27244]" />
            <span>Upload Format Khusus</span>
          </button>

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
            onClick={() => setShowAddTxModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Pembayaran</span>
          </button>
        </div>
      </div>

      {/* Staff Signatory Configuration Bar & Custom Format Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Pengisian Nama Staf Penandatangan Dokumen & Kwitansi */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark ? 'bg-[#22211f] border-[#33312e]' : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block">
                  Staf Penandatangan Dokumen &amp; Kwitansi
                </span>
                <span
                  className={`text-[10px] ${
                    isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                  }`}
                >
                  Tercetak otomatis pada cap &amp; tanda tangan kwitansi PDF
                </span>
              </div>
            </div>

            {!isEditingStaff && (
              <button
                onClick={() => setIsEditingStaff(true)}
                className="text-xs font-semibold text-[#f27244] hover:underline cursor-pointer"
              >
                Ubah Nama &rarr;
              </button>
            )}
          </div>

          {isEditingStaff ? (
            <form onSubmit={handleSaveStaffName} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                required
                value={staffNameInput}
                onChange={(e) => setStaffNameInput(e.target.value)}
                placeholder="Contoh: Umi Kalsum (Finance MKB) / Muhammad Rizky"
                className={`flex-1 p-2 text-xs rounded-lg border font-semibold ${
                  isDark
                    ? 'bg-[#1a1918] border-[#383633] text-[#f4f3ef]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                }`}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => {
                  setStaffNameInput(signatoryStaffName);
                  setIsEditingStaff(false);
                }}
                className={`px-2.5 py-2 rounded-lg text-xs ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Batal
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/5 dark:bg-white/5 border border-dashed border-[#f27244]/40 mt-1">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#f27244]">
                  Nama Staf Aktif:
                </div>
                <div className="text-sm font-bold font-sans">
                  {signatoryStaffName || 'Umi Kalsum (Finance MKB)'}
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Aktif di Kwitansi
              </span>
            </div>
          )}

          {staffSavedAlert && (
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Nama staf penandatangan berhasil diperbarui!</span>
            </div>
          )}
        </div>

        {/* Card 2: Status Format Khusus Keuangan */}
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors flex flex-col justify-between ${
            isDark ? 'bg-[#22211f] border-[#33312e]' : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">
                  Format Khusus Laporan Keuangan
                </span>
              </div>
              <button
                onClick={handleDownloadTemplateFormat}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download Template (.xlsx)</span>
              </button>
            </div>

            {customFinanceFormat ? (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 truncate">
                    {customFinanceFormat.fileName}
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    Terhubung
                  </span>
                </div>
                <div
                  className={`text-[10px] ${
                    isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                  }`}
                >
                  Diunggah: {customFinanceFormat.uploadDate} ({customFinanceFormat.rowCount} baris transaksi)
                </div>
              </div>
            ) : (
              <div
                className={`p-2.5 rounded-lg border border-dashed text-xs mt-2 flex items-center justify-between ${
                  isDark
                    ? 'border-[#383633] text-[#9c988f]'
                    : 'border-[#dedbd2] text-[#737069]'
                }`}
              >
                <span>Format keuangan khusus belum diunggah.</span>
                <button
                  onClick={() => setShowUploadFormatModal(true)}
                  className="text-xs font-bold text-[#f27244] hover:underline cursor-pointer"
                >
                  Upload Sekarang &rarr;
                </button>
              </div>
            )}
          </div>

          <div
            className={`text-[10px] mt-2 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Format khusus memuat rekapitulasi mutasi rekening bank dan setoran kas tunai kantor.
          </div>
        </div>
      </div>

      {/* Summary Cards with Myriad Bold Prices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Total Kas Diterima (Myriad Bold)
          </div>
          <div
            className={`text-xl font-bold font-price-myriad ${
              isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'
            }`}
          >
            {formatRupiah(totalRevenue)}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            {transactions.length} transaksi tercatat sah
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-xs transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div
            className={`text-xs mb-1 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Sisa Piutang Berjalan (Myriad Bold)
          </div>
          <div className="text-xl font-bold text-amber-500 font-price-myriad">
            {formatRupiah(totalReceivables)}
          </div>
          <div
            className={`text-[11px] mt-1 ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Menunggu pelunasan bertahap jamaah
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between transition-colors ${
            isDark
              ? 'bg-[#1b1a19] border-[#33312e] text-[#f4f3ef]'
              : 'bg-[#faf9f6] border-[#e8e5dc] text-[#23211e]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#f27244] font-semibold">
            <span>REKENING RESMI PERUSAHAAN</span>
            <Building className="w-3.5 h-3.5" />
          </div>
          <div className="my-1 font-mono font-bold text-sm">
            {COMPANY_INFO.bankAccounts[0].bank}: {COMPANY_INFO.bankAccounts[0].accountNumber}
          </div>
          <div
            className={`text-[11px] ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            a.n. {COMPANY_INFO.bankAccounts[0].accountName}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div
        className={`rounded-xl border shadow-xs overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e]'
            : 'bg-white border-[#e8e5dc]'
        }`}
      >
        <div
          className={`p-3 border-b flex items-center justify-between ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#737069] absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jamaah atau nomor kuitansi..."
              className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef] placeholder-[#737069]'
                  : 'bg-[#fbfaf8] border-[#dedbd2] text-[#23211e] placeholder-[#8c8982]'
              }`}
            />
          </div>
          <span
            className={`text-xs ${
              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
            }`}
          >
            Total {filteredTx.length} kuitansi diterbitkan
          </span>
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
                <th className="py-2.5 px-4">Nomor Kuitansi</th>
                <th className="py-2.5 px-3">Nama Jamaah</th>
                <th className="py-2.5 px-3">Jenis Pembayaran</th>
                <th className="py-2.5 px-3">Metode Bayar</th>
                <th className="py-2.5 px-3">Jumlah Masuk (Myriad Bold)</th>
                <th className="py-2.5 px-3">Staf Verifikator</th>
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
              {filteredTx.map((tx) => (
                <tr
                  key={tx.id}
                  className={`transition-colors ${
                    isDark ? 'hover:bg-[#282724]' : 'hover:bg-[#fbfaf7]'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-semibold">
                    <span className={isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'}>
                      {tx.receiptNumber}
                    </span>
                    <div
                      className={`text-[10px] font-normal ${
                        isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                      }`}
                    >
                      {tx.paymentDate}
                    </div>
                  </td>
                  <td
                    className={`py-3 px-3 font-semibold ${
                      isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'
                    }`}
                  >
                    {tx.jamaahName}
                  </td>
                  <td className="py-3 px-3">
                    <span className={isDark ? 'text-[#f4f3ef]' : 'text-[#1e1d1b]'}>
                      {tx.paymentType}
                    </span>
                    <div
                      className={`text-[10px] ${
                        isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                      }`}
                    >
                      {tx.packageName}
                    </div>
                  </td>
                  <td
                    className={`py-3 px-3 ${
                      isDark ? 'text-[#a6a39b]' : 'text-[#6b6760]'
                    }`}
                  >
                    {tx.paymentMethod}
                  </td>
                  <td className="py-3 px-3 font-bold font-price-myriad text-[#f27244]">
                    {formatRupiah(tx.amount)}
                  </td>
                  <td className="py-3 px-3 text-[11px] font-medium opacity-85">
                    {tx.verifiedBy || signatoryStaffName}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setReceiptModalTx(tx)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? 'text-[#f27244] bg-[#2d1e18] hover:bg-[#3d281f] border-[#482c22]'
                          : 'text-[#e06336] bg-[#fff0eb] hover:bg-[#ffdacf] border-[#ffccba]'
                      }`}
                    >
                      Buka Kuitansi
                    </button>
                    <button
                      onClick={() =>
                        downloadReceiptPdf(
                          tx,
                          COMPANY_INFO,
                          customLogo,
                          signatoryStaffName || tx.verifiedBy
                        )
                      }
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1 cursor-pointer ${
                        isDark
                          ? 'text-[#d6d3cb] bg-[#2a2926] hover:bg-[#33312e] border-[#383633]'
                          : 'text-[#4a4740] bg-[#f7f6f2] hover:bg-[#eeebe3] border-[#dedbd2]'
                      }`}
                      title="Download PDF Langsung"
                    >
                      <Download className="w-3 h-3 text-emerald-500" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Upload Format Keuangan Khusus */}
      {showUploadFormatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border space-y-4 ${
              isDark
                ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                : 'bg-white border-[#dedbd2] text-[#23211e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#f27244]" />
                <h3 className="text-sm font-bold">
                  Upload Format Khusus Laporan Keuangan MKB
                </h3>
              </div>
              <button
                onClick={() => setShowUploadFormatModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p
              className={`text-xs ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Upload satu format khusus rekapan transaksi (.xlsx / .csv) sesuai standarisasi keuangan backoffice. Anda dapat mengunduh format resminya terlebih dahulu.
            </p>

            <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-dashed border-[#f27244]/40">
              <span className="text-xs">
                Belum punya template format khusus?
              </span>
              <button
                onClick={handleDownloadTemplateFormat}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Format Template</span>
              </button>
            </div>

            {/* Dropzone */}
            <div
              className={`p-6 border-2 border-dashed rounded-xl text-center space-y-2 cursor-pointer transition-colors ${
                isDark
                  ? 'border-[#3d3b37] hover:border-[#f27244] bg-[#1a1918]'
                  : 'border-[#dedbd2] hover:border-[#f27244] bg-[#faf9f6]'
              }`}
            >
              <input
                type="file"
                id="custom-finance-file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="custom-finance-file"
                className="cursor-pointer block space-y-2"
              >
                <Upload className="w-8 h-8 mx-auto text-[#f27244]" />
                <div className="text-xs font-semibold">
                  {uploadedFile
                    ? uploadedFile.name
                    : 'Pilih File Format Keuangan Khusus (.xlsx / .csv)'}
                </div>
                <div
                  className={`text-[10px] ${
                    isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                  }`}
                >
                  Klik untuk mencari file di komputer Anda
                </div>
              </label>
            </div>

            {/* Preview of Parsed Rows if file selected */}
            {parsedPreviewRows.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Pratinjau Data Format Khusus ({parsedPreviewRows.length} Baris):</span>
                  <span className="text-[10px] text-emerald-500 font-mono">
                    Struktur Kolom Sesuai &#10003;
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-lg text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-black/10 dark:bg-white/10 font-semibold">
                      <tr>
                        <th className="p-1.5">No</th>
                        <th className="p-1.5">Jamaah</th>
                        <th className="p-1.5">Jenis</th>
                        <th className="p-1.5 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      {parsedPreviewRows.map((r, i) => (
                        <tr key={i}>
                          <td className="p-1.5 font-mono">{r.no}</td>
                          <td className="p-1.5 font-semibold">{r.jamaah}</td>
                          <td className="p-1.5">{r.type}</td>
                          <td className="p-1.5 text-right font-mono text-[#f27244]">
                            {formatRupiah(r.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Format keuangan khusus berhasil diunggah dan disimpan di sistem!</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowUploadFormatModal(false)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#eeebe3]'
                }`}
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={!uploadedFile}
                onClick={handleApplyCustomFormat}
                className="px-4 py-1.5 bg-[#f27244] hover:bg-[#e06336] disabled:opacity-50 text-white font-semibold rounded-lg cursor-pointer"
              >
                Terapkan Format Khusus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Catat Pembayaran Baru */}
      {showAddTxModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
              isDark
                ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                : 'bg-white border-[#dedbd2] text-[#23211e]'
            }`}
          >
            <h3 className="text-sm font-bold">
              Input Pembayaran Jamaah Baru
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">
                  Pilih Nama Jamaah
                </label>
                <select
                  required
                  value={selectedJamaahId}
                  onChange={(e) => setSelectedJamaahId(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                >
                  <option value="">-- Pilih Jamaah Terdaftar --</option>
                  {jamaahList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.fullName} - {j.phoneWhatsapp} (Sisa: {formatRupiah(j.totalCost - j.amountPaid)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Nominal Pembayaran (IDR)
                </label>
                <input
                  type="number"
                  required
                  min="100000"
                  step="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border font-mono font-bold ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">
                    Jenis Pembayaran
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as any)}
                    className={`w-full p-2 rounded-lg border ${
                      isDark
                        ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  >
                    <option value="DP Pendaftaran">DP Pendaftaran</option>
                    <option value="Cicilan Ke-1">Cicilan Ke-1</option>
                    <option value="Cicilan Ke-2">Cicilan Ke-2</option>
                    <option value="Pelunasan Akhir">Pelunasan Akhir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className={`w-full p-2 rounded-lg border ${
                      isDark
                        ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  >
                    <option value="Transfer BSI">Transfer Bank BSI</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Tunai di Kantor">Tunai di Kantor MKB</option>
                    <option value="BSI QRIS">QRIS Kasir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Staf Penandatangan Kwitansi
                </label>
                <input
                  type="text"
                  value={signatoryStaffName}
                  onChange={(e) => setSignatoryStaffName(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Catatan / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Bukti transfer diterima via WhatsApp CS"
                  className={`w-full p-2 rounded-lg border ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#eeebe3]'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white font-semibold rounded-lg cursor-pointer"
                >
                  Terbitkan Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
