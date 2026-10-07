import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { formatRupiah, formatDateIndo, exportToXlsx, downloadReceiptPdf } from '../../utils/formatters';
import { Badge, Button, Card, CardHeader, EmptyState, Field, Modal, PageHeader, SearchInput, StatCard } from '../ui';
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Landmark,
  Plus,
  Receipt,
  Upload,
  UserCheck,
  Wallet,
  Hourglass,
} from 'lucide-react';

type Method = PaymentTransaction['paymentMethod'];
type PayType = PaymentTransaction['paymentType'];

export const FinanceInvoicingView: React.FC = () => {
  const {
    transactions,
    jamaahList,
    packages,
    addPaymentTransaction,
    setReceiptModalTx,
    customLogo,
    signatoryStaffName,
    setSignatoryStaffName,
    customFinanceFormat,
    setCustomFinanceFormat,
  } = useApp();

  const [query, setQuery] = useState('');
  const [showAddTx, setShowAddTx] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Staf penandatangan
  const [staffInput, setStaffInput] = useState(signatoryStaffName);
  const [editingStaff, setEditingStaff] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);

  // Form pembayaran
  const [jamaahId, setJamaahId] = useState('');
  const [amount, setAmount] = useState(5000000);
  const [method, setMethod] = useState<Method>('Transfer BSI');
  const [payType, setPayType] = useState<PayType>('DP Pendaftaran');
  const [notes, setNotes] = useState('');

  // Upload format khusus
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ no: string; jamaah: string; type: string; amount: number }[]>([]);
  const [uploadOk, setUploadOk] = useState(false);

  const totalRevenue = transactions.reduce((a, t) => a + t.amount, 0);
  const totalReceivables = jamaahList.reduce((a, j) => a + (j.totalCost - j.amountPaid), 0);
  const lunas = jamaahList.filter((j) => j.paymentStatus === 'Lunas').length;

  const s = query.toLowerCase();
  const rows = transactions.filter(
    (t) => t.jamaahName.toLowerCase().includes(s) || t.receiptNumber.toLowerCase().includes(s) || t.invoiceNumber.toLowerCase().includes(s)
  );

  const saveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffInput.trim()) return;
    setSignatoryStaffName(staffInput.trim());
    setEditingStaff(false);
    setStaffSaved(true);
    setTimeout(() => setStaffSaved(false), 3000);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const j = jamaahList.find((x) => x.id === jamaahId);
    if (!j) return;
    const tx = addPaymentTransaction({
      invoiceNumber: `INV-MKB-${Date.now().toString().slice(-6)}`,
      jamaahId: j.id,
      jamaahName: j.fullName,
      packageName: packages.find((p) => p.id === j.packageId)?.name || 'Paket Umroh MKB',
      amount: Number(amount),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      paymentType: payType,
      notes,
      verifiedBy: signatoryStaffName,
    });
    setShowAddTx(false);
    setNotes('');
    setJamaahId('');
    setReceiptModalTx(tx);
  };

  const downloadTemplate = () => {
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
    const sample = [
      ['KW-MKB-202611-001', '2026-11-01', 'Ahmad Subagyo, S.T.', '3471012903820001', 'Umroh Sebulan Penuh November (30 Hari)', 'DP Pendaftaran', 'Transfer BSI', 5000000, signatoryStaffName, 'DP awal pendaftaran via transfer BSI Rek 7192839102'],
      ['KW-MKB-202611-002', '2026-11-05', 'Hj. Siti Nurhaliza', '3471025510840003', 'Umroh Ramadan Iktikaf Lailatul Qadar (16 Hari)', 'Pelunasan Akhir', 'Transfer Mandiri', 38500000, signatoryStaffName, 'Pelunasan tuntas sebelum issued visa'],
    ];
    exportToXlsx('Format_Khusus_Keuangan_MKB_Travel_Template', headers, sample);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // Pratinjau simulasi (parsing file belum diimplementasikan)
    setPreview([
      { no: 'MUT-001', jamaah: 'Drs. Bambang Sudarmono', type: 'Cicilan Ke-1', amount: 15000000 },
      { no: 'MUT-002', jamaah: 'Fatimah Az-Zahra', type: 'Pelunasan Akhir', amount: 22000000 },
      { no: 'MUT-003', jamaah: 'Rahmat Hidayat', type: 'DP Pendaftaran', amount: 5000000 },
    ]);
  };

  const applyFormat = () => {
    if (!file) return;
    setCustomFinanceFormat({
      fileName: file.name,
      uploadDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      rowCount: preview.length,
    });
    setUploadOk(true);
    setTimeout(() => {
      setUploadOk(false);
      setShowUpload(false);
      setFile(null);
      setPreview([]);
    }, 1500);
  };

  const exportReport = () => {
    const headers = ['NOMOR KWITANSI', 'NOMOR INVOICE', 'NAMA JAMAAH', 'PROGRAM UMROH', 'JUMLAH BAYAR (IDR)', 'TANGGAL BAYAR', 'METODE PEMBAYARAN', 'JENIS PEMBAYARAN', 'PENANDATANGAN KASIR', 'CATATAN'];
    exportToXlsx(
      'Laporan_Keuangan_MKB_Travel',
      headers,
      rows.map((t) => [t.receiptNumber, t.invoiceNumber, t.jamaahName, t.packageName, t.amount, t.paymentDate, t.paymentMethod, t.paymentType, t.verifiedBy || signatoryStaffName, t.notes || '-'])
    );
  };

  const selected = jamaahList.find((j) => j.id === jamaahId);
  const bank = COMPANY_INFO.bankAccounts[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keuangan & kwitansi"
        description="Catat pembayaran jamaah, terbitkan kwitansi resmi, dan unduh laporan."
        actions={
          <>
            <Button icon={FileUp} onClick={() => setShowUpload(true)}>
              Format Khusus
            </Button>
            <Button icon={FileSpreadsheet} onClick={exportReport}>
              Export Excel
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setShowAddTx(true)}>
              Catat Pembayaran
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Kas diterima" value={formatRupiah(totalRevenue)} icon={Wallet} tone="success" hint={`${transactions.length} transaksi sah`} />
        <StatCard label="Sisa piutang" value={formatRupiah(totalReceivables)} icon={Hourglass} tone="warning" hint="Menunggu pelunasan" />
        <StatCard label="Jamaah lunas" value={`${lunas}/${jamaahList.length}`} icon={CheckCircle2} tone="accent" hint="Sudah melunasi paket" />
        <div className="flex flex-col rounded-[20px] bg-night p-5 text-night-ink">
          <div className="flex items-center justify-between text-[13px] text-night-muted">
            Rekening resmi <Landmark className="size-4" />
          </div>
          <div className="num mt-4 font-mono text-lg font-bold">{bank.accountNumber}</div>
          <div className="mt-1 text-xs text-night-muted">{bank.bank}</div>
          <div className="mt-auto truncate pt-3 text-[11px] text-night-muted">a.n. {bank.accountName}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card pad>
          <CardHeader
            icon={UserCheck}
            title="Staf penandatangan kwitansi"
            subtitle="Tercetak otomatis pada kwitansi PDF"
            actions={
              !editingStaff && (
                <Button size="sm" variant="ghost" onClick={() => setEditingStaff(true)}>
                  Ubah
                </Button>
              )
            }
          />
          {editingStaff ? (
            <form onSubmit={saveStaff} className="mt-4 flex gap-2">
              <input className="input" required value={staffInput} onChange={(e) => setStaffInput(e.target.value)} autoFocus />
              <Button type="submit" variant="primary" className="h-10">
                Simpan
              </Button>
              <Button
                variant="ghost"
                className="h-10"
                onClick={() => {
                  setStaffInput(signatoryStaffName);
                  setEditingStaff(false);
                }}
              >
                Batal
              </Button>
            </form>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-subtle px-4 py-3">
              <span className="text-sm font-semibold text-ink">{signatoryStaffName}</span>
              <Badge tone="success" dot>
                Aktif
              </Badge>
            </div>
          )}
          {staffSaved && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">Nama staf penandatangan diperbarui.</p>}
        </Card>

        <Card pad>
          <CardHeader
            icon={FileSpreadsheet}
            title="Format khusus laporan"
            subtitle="Rekap mutasi rekening & setoran kas tunai"
            actions={
              <Button size="sm" variant="ghost" icon={Download} onClick={downloadTemplate}>
                Template
              </Button>
            }
          />
          {customFinanceFormat ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-emerald-500/10 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-ink">{customFinanceFormat.fileName}</div>
                <div className="text-[11px] text-muted">
                  {customFinanceFormat.uploadDate} · {customFinanceFormat.rowCount} baris
                </div>
              </div>
              <Badge tone="success">Terhubung</Badge>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-line-strong px-4 py-3 text-xs text-muted">
              Belum ada format yang diunggah.
              <button className="font-semibold text-accent hover:underline" onClick={() => setShowUpload(true)}>
                Unggah
              </button>
            </div>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <CardHeader icon={Receipt} title="Riwayat kwitansi" subtitle={`${rows.length} kwitansi diterbitkan`} />
          <SearchInput value={query} onChange={setQuery} placeholder="Cari jamaah atau nomor kwitansi…" className="sm:w-72" />
        </div>
        <div className="overflow-x-auto border-t border-line">
          <table className="table min-w-[1040px]">
            <thead>
              <tr>
                <th>No. kwitansi</th>
                <th>Jamaah</th>
                <th>Jenis</th>
                <th>Metode</th>
                <th className="text-right">Jumlah</th>
                <th>Verifikator</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Receipt} title="Tidak ada kwitansi yang cocok" />
                  </td>
                </tr>
              )}
              {rows.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <div className="font-mono text-xs font-semibold whitespace-nowrap text-ink">{tx.receiptNumber}</div>
                    <div className="mt-0.5 text-[11px] text-muted">{formatDateIndo(tx.paymentDate)}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-ink">{tx.jamaahName}</div>
                    <div className="mt-0.5 text-[11px] text-muted">{tx.packageName}</div>
                  </td>
                  <td>
                    <Badge tone={tx.paymentType === 'Pelunasan Akhir' ? 'success' : 'neutral'}>{tx.paymentType}</Badge>
                  </td>
                  <td className="whitespace-nowrap text-muted">{tx.paymentMethod}</td>
                  <td className="num text-right font-bold whitespace-nowrap text-ink">{formatRupiah(tx.amount)}</td>
                  <td className="text-xs text-muted">{tx.verifiedBy || signatoryStaffName}</td>
                  <td className="text-right whitespace-nowrap">
                    <Button size="sm" onClick={() => setReceiptModalTx(tx)}>
                      Kwitansi
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Download}
                      onClick={() => downloadReceiptPdf(tx, COMPANY_INFO, customLogo, tx.verifiedBy || signatoryStaffName)}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: catat pembayaran */}
      <Modal
        open={showAddTx}
        onClose={() => setShowAddTx(false)}
        title="Catat pembayaran"
        description="Kwitansi resmi langsung terbit setelah disimpan."
        icon={Wallet}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddTx(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" form="add-tx-form">
              Terbitkan Kwitansi
            </Button>
          </>
        }
      >
        <form id="add-tx-form" onSubmit={submitPayment} className="space-y-4">
          <Field label="Jamaah">
            <select className="input" required value={jamaahId} onChange={(e) => setJamaahId(e.target.value)}>
              <option value="">Pilih jamaah terdaftar…</option>
              {jamaahList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.fullName} — sisa {formatRupiah(j.totalCost - j.amountPaid)}
                </option>
              ))}
            </select>
          </Field>
          {selected && (
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-subtle p-3 text-xs">
              <div>
                <div className="text-muted">Total</div>
                <div className="num font-semibold text-ink">{formatRupiah(selected.totalCost)}</div>
              </div>
              <div>
                <div className="text-muted">Terbayar</div>
                <div className="num font-semibold text-ink">{formatRupiah(selected.amountPaid)}</div>
              </div>
              <div>
                <div className="text-muted">Sisa</div>
                <div className="num font-semibold text-accent">{formatRupiah(selected.totalCost - selected.amountPaid)}</div>
              </div>
            </div>
          )}
          <Field label="Nominal (IDR)" hint={formatRupiah(amount || 0)}>
            <input
              className="input num font-semibold"
              type="number"
              required
              min={100000}
              step={50000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jenis pembayaran">
              <select className="input" value={payType} onChange={(e) => setPayType(e.target.value as PayType)}>
                <option value="DP Pendaftaran">DP Pendaftaran</option>
                <option value="Cicilan Ke-1">Cicilan Ke-1</option>
                <option value="Cicilan Ke-2">Cicilan Ke-2</option>
                <option value="Pelunasan Akhir">Pelunasan Akhir</option>
              </select>
            </Field>
            <Field label="Metode">
              <select className="input" value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                <option value="Transfer BSI">Transfer BSI</option>
                <option value="Transfer Mandiri">Transfer Mandiri</option>
                <option value="Tunai di Kantor">Tunai di kantor</option>
                <option value="BSI QRIS">QRIS</option>
              </select>
            </Field>
          </div>
          <Field label="Staf penandatangan">
            <input className="input" value={signatoryStaffName} onChange={(e) => setSignatoryStaffName(e.target.value)} />
          </Field>
          <Field label="Catatan">
            <textarea
              className="input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: bukti transfer diterima via WhatsApp CS"
            />
          </Field>
        </form>
      </Modal>

      {/* Modal: upload format khusus */}
      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload format khusus laporan"
        description="Satu file rekap transaksi (.xlsx / .csv) sesuai standar keuangan backoffice."
        icon={FileUp}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowUpload(false)}>
              Tutup
            </Button>
            <Button variant="primary" disabled={!file} onClick={applyFormat}>
              Terapkan Format
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-subtle px-4 py-3 text-xs text-muted">
            Belum punya template?
            <Button size="sm" icon={Download} onClick={downloadTemplate}>
              Unduh template
            </Button>
          </div>
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line-strong px-6 py-8 text-center transition-colors hover:border-accent">
            <input type="file" accept=".xlsx,.xls,.csv" onChange={onFile} className="hidden" />
            <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Upload className="size-5" />
            </span>
            <span className="text-sm font-semibold text-ink">{file ? file.name : 'Pilih file .xlsx / .csv'}</span>
            <span className="text-xs text-muted">Klik untuk mencari file di komputer</span>
          </label>
          {preview.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center justify-between bg-subtle px-4 py-2.5 text-xs">
                <span className="font-semibold text-ink">Pratinjau ({preview.length} baris)</span>
                <span className="text-emerald-600 dark:text-emerald-400">Struktur kolom sesuai ✓</span>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {preview.map((r) => (
                    <tr key={r.no} className="border-t border-line">
                      <td className="px-4 py-2 font-mono text-muted">{r.no}</td>
                      <td className="px-2 py-2 font-semibold text-ink">{r.jamaah}</td>
                      <td className="px-2 py-2 text-muted">{r.type}</td>
                      <td className="num px-4 py-2 text-right font-semibold text-ink">{formatRupiah(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {uploadOk && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4" /> Format keuangan khusus berhasil disimpan.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
