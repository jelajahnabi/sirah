import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jamaah, PaymentStatus } from '../../types';
import { formatRupiah, formatDateIndo, exportToXlsx, buildWaLink } from '../../utils/formatters';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  PackageTag,
  PageHeader,
  SearchInput,
  Segmented,
  paymentTone,
  visaTone,
  cx,
} from '../ui';
import { FileSpreadsheet, IdCard, Layers, List, MessageCircle, Truck, UserPlus, Users } from 'lucide-react';

type SortKey = 'package' | 'departureDate' | 'name' | 'balance' | 'completeness';

export const JamaahDatabaseView: React.FC = () => {
  const { jamaahList, packages, setShowAddJamaahModal, setSelectedJamaah, setIdCardJamaah, setShippingLabelJamaah } = useApp();

  const [query, setQuery] = useState('');
  const [completeness, setCompleteness] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [payment, setPayment] = useState<'all' | PaymentStatus>('all');
  const [pkgFilter, setPkgFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('package');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');

  const list = useMemo(() => {
    const s = query.toLowerCase();
    const pkgName = (id: string) => packages.find((p) => p.id === id)?.name || 'zzz';
    return jamaahList
      .filter(
        (j) =>
          (j.fullName.toLowerCase().includes(s) ||
            j.passportNumber?.toLowerCase().includes(s) ||
            j.nik?.includes(s) ||
            j.phoneWhatsapp.includes(s) ||
            j.city?.toLowerCase().includes(s)) &&
          (completeness === 'all' || (completeness === 'complete') === j.isDataComplete) &&
          (payment === 'all' || j.paymentStatus === payment) &&
          (pkgFilter === 'all' || j.packageId === pkgFilter)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'package':
            return pkgName(a.packageId).localeCompare(pkgName(b.packageId));
          case 'departureDate':
            return (a.departureDate || '').localeCompare(b.departureDate || '');
          case 'name':
            return a.fullName.localeCompare(b.fullName);
          case 'balance':
            return b.totalCost - b.amountPaid - (a.totalCost - a.amountPaid);
          case 'completeness':
            return Number(a.isDataComplete) - Number(b.isDataComplete);
        }
      });
  }, [jamaahList, packages, query, completeness, payment, pkgFilter, sortBy]);

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
    const rows = list.map((j) => [
      j.fullName,
      j.phoneWhatsapp,
      j.nik || '-',
      j.passportNumber || '-',
      j.birthDate || '-',
      j.birthPlace || '-',
      j.passportExpiryDate || '-',
      j.city || '-',
      packages.find((p) => p.id === j.packageId)?.name || '-',
      j.departureDate || '-',
      j.isDataComplete ? 'Lengkap' : 'Belum Lengkap (Nama & HP Saja)',
      j.documentStatus.ktpUploaded ? 'Sudah Diunggah' : 'Belum',
      j.documentStatus.passportUploaded ? 'Sudah Diunggah' : 'Belum',
      j.visaStatus,
      j.paymentStatus,
      j.totalCost,
      j.amountPaid,
      j.totalCost - j.amountPaid,
    ]);
    exportToXlsx('Database_Jamaah_MKB_Travel', headers, rows);
  };

  const handleSendWa = (j: Jamaah) => {
    const balance = j.totalCost - j.amountPaid;
    let msg = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${j.fullName}*,\n\nKami dari *PT MUDAHKEBAITULLAH TRAVEL INDONESIA (Yogyakarta)* menginformasikan update status pendaftaran umroh Anda:\n\n`;
    if (!j.isDataComplete) {
      msg += `Pendaftaran awal Anda telah kami catat. Mohon untuk melengkapi data & upload scan KTP serta Paspor asli untuk pengurusan visa Kemenhaj RI.\n\n`;
    }
    msg += `🔹 Status Pembayaran: *${j.paymentStatus}*\n🔹 Terbayar: *${formatRupiah(j.amountPaid)}*\n`;
    if (balance > 0) msg += `🔹 Sisa Pelunasan: *${formatRupiah(balance)}*\n`;
    msg += `\nAlamat Kantor: Jl. Bener No.79 Bener, Kec. Tegalrejo, Kota Yogyakarta.\nJazakumullah Khairan Katsiran.`;
    window.open(buildWaLink(j.phoneWhatsapp, msg), '_blank');
  };

  const table = (rows: Jamaah[]) => (
    <div className="overflow-x-auto">
      <table className="table min-w-[960px] table-fixed">
        <thead>
          <tr>
            <th className="w-[27%]">Jamaah</th>
            <th className="w-[17%]">Paket & jadwal</th>
            <th className="w-[15%]">Berkas</th>
            <th className="w-[11%]">Visa</th>
            <th className="w-[19%]">Pembayaran</th>
            <th className="w-[11%] text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((j) => {
            const pkg = packages.find((p) => p.id === j.packageId);
            const balance = j.totalCost - j.amountPaid;
            return (
              <tr key={j.id} className="row-link" onClick={() => setSelectedJamaah(j)}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={j.fullName} color={pkg?.kanbanColors.accent} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-ink">{j.fullName}</div>
                      <div className="font-mono text-[11px] text-muted">{j.phoneWhatsapp}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <PackageTag pkg={pkg} short />
                  <div className="mt-1 text-[11px] text-muted">{formatDateIndo(j.departureDate)}</div>
                </td>
                <td>
                  <Badge tone={j.isDataComplete ? 'success' : 'warning'} dot>
                    {j.isDataComplete ? 'Lengkap' : 'Belum lengkap'}
                  </Badge>
                  <div className="mt-1.5 flex gap-2 text-[11px]">
                    <DocFlag ok={j.documentStatus.ktpUploaded} label="KTP" />
                    <DocFlag ok={j.documentStatus.passportUploaded} label="Paspor" />
                  </div>
                </td>
                <td>
                  <Badge tone={visaTone(j.visaStatus)}>{j.visaStatus}</Badge>
                </td>
                <td>
                  <div className="num font-semibold text-ink">{formatRupiah(j.amountPaid)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={paymentTone(j.paymentStatus)}>{j.paymentStatus}</Badge>
                    {balance > 0 && <span className="num text-[11px] whitespace-nowrap text-muted">sisa {formatRupiah(balance)}</span>}
                  </div>
                </td>
                <td className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-0.5">
                    <IconButton icon={Truck} label="Label koper (alamat KTP)" onClick={() => setShippingLabelJamaah(j)} />
                    <IconButton icon={IdCard} label="Cetak ID card" onClick={() => setIdCardJamaah(j)} />
                    <IconButton icon={MessageCircle} label="Kirim WhatsApp" onClick={() => handleSendWa(j)} className="hover:text-emerald-600" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const shownPackages = packages.filter((p) => pkgFilter === 'all' || p.id === pkgFilter);
  const unassigned = list.filter((j) => !packages.some((p) => p.id === j.packageId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data jamaah"
        description={`${jamaahList.length} jamaah terdaftar. Cukup nama & no. HP untuk mendaftar; berkas bisa dilengkapi belakangan.`}
        actions={
          <>
            <Button icon={FileSpreadsheet} onClick={handleExportXlsx}>
              Export Excel
            </Button>
            <Button variant="primary" icon={UserPlus} onClick={() => setShowAddJamaahModal(true)}>
              Pendaftaran Cepat
            </Button>
          </>
        }
      />

      {/* Filter paket */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <FilterChip active={pkgFilter === 'all'} onClick={() => setPkgFilter('all')}>
          Semua paket <span className="num text-faint">{jamaahList.length}</span>
        </FilterChip>
        {packages.map((p) => (
          <FilterChip key={p.id} active={pkgFilter === p.id} onClick={() => setPkgFilter(pkgFilter === p.id ? 'all' : p.id)}>
            <span className="size-2 rounded-full" style={{ backgroundColor: p.kanbanColors.accent }} />
            {p.name}
            <span className="num text-faint">{jamaahList.filter((j) => j.packageId === p.id).length}</span>
          </FilterChip>
        ))}
      </div>

      {/* Toolbar */}
      <Card className="flex flex-col gap-3 p-3 2xl:flex-row 2xl:items-center">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama, WhatsApp, NIK, paspor, kota…" className="min-w-[240px] flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          <select className="input w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} aria-label="Urutkan">
            <option value="package">Urut: paket (A–Z)</option>
            <option value="departureDate">Urut: tanggal berangkat</option>
            <option value="name">Urut: nama (A–Z)</option>
            <option value="balance">Urut: sisa tagihan terbesar</option>
            <option value="completeness">Urut: berkas belum lengkap</option>
          </select>
          <select
            className="input w-auto"
            value={payment}
            onChange={(e) => setPayment(e.target.value as typeof payment)}
            aria-label="Status bayar"
          >
            <option value="all">Semua status bayar</option>
            <option value="Belum Bayar">Belum bayar</option>
            <option value="DP Terbayar">DP terbayar</option>
            <option value="Cicilan">Cicilan</option>
            <option value="Lunas">Lunas</option>
          </select>
          <Segmented
            value={completeness}
            onChange={setCompleteness}
            options={[
              { value: 'all', label: 'Semua' },
              { value: 'complete', label: 'Lengkap' },
              { value: 'incomplete', label: 'Belum' },
            ]}
          />
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'grouped', label: 'Per paket', icon: Layers },
              { value: 'flat', label: 'Tabel', icon: List },
            ]}
          />
        </div>
      </Card>

      {viewMode === 'flat' ? (
        <Card className="overflow-hidden">
          {list.length ? table(list) : <EmptyState icon={Users} title="Tidak ada jamaah yang cocok" />}
        </Card>
      ) : (
        <div className="space-y-5">
          {shownPackages.map((pkg) => {
            const rows = list.filter((j) => j.packageId === pkg.id);
            const c = pkg.kanbanColors.accent;
            return (
              <Card key={pkg.id} className="overflow-hidden">
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-1.5 rounded-full" style={{ backgroundColor: c }} />
                    <div>
                      <h2 className="text-[15px] font-bold text-ink">{pkg.name}</h2>
                      <p className="text-xs text-muted">
                        {pkg.durationDays} hari · {pkg.departureMonth} · {pkg.makkahHotel} & {pkg.madinahHotel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="num text-sm font-bold text-ink">{formatRupiah(pkg.price)}</div>
                      <div className="text-[11px] text-muted">
                        {rows.length} di filter · kuota {pkg.quota}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-line">
                  {rows.length ? (
                    table(rows)
                  ) : (
                    <div className="px-6 py-6 text-center text-xs text-muted">Tidak ada jamaah di paket ini untuk filter saat ini.</div>
                  )}
                </div>
              </Card>
            );
          })}
          {pkgFilter === 'all' && unassigned.length > 0 && (
            <Card className="overflow-hidden">
              <div className="p-5 text-[15px] font-bold text-ink">Belum memilih paket</div>
              <div className="border-t border-line">{table(unassigned)}</div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

const DocFlag: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <span className={ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-faint line-through'}>
    {ok ? '✓ ' : ''}
    {label}
  </span>
);

const FilterChip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cx(
      'inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors',
      active ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-muted hover:text-ink'
    )}
  >
    {children}
  </button>
);
