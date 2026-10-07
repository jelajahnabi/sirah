import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah, formatDateIndo, exportToXlsx } from '../../utils/formatters';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  KeyValue,
  PackageTag,
  PageHeader,
  Progress,
  StatCard,
  paymentTone,
  visaTone,
  cx,
} from '../ui';
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  FileSpreadsheet,
  Plane,
  Plus,
  SlidersHorizontal,
  Users,
  Wallet,
  Receipt,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

const juta = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1).replace('.', ',')} M`;
  if (n >= 1e6) return `${Math.round(n / 1e6)} jt`;
  return formatRupiah(n);
};

export const DashboardView: React.FC = () => {
  const {
    packages,
    jamaahList,
    transactions,
    departureGroups,
    currentUser,
    setCurrentTab,
    setShowAddPackageModal,
    setShowManagePackageModal,
    setSelectedJamaah,
    setSelectedPackageDetail,
  } = useApp();

  const totalRevenue = transactions.reduce((a, t) => a + t.amount, 0);
  const totalReceivables = jamaahList.reduce((a, j) => a + (j.totalCost - j.amountPaid), 0);
  const completeCount = jamaahList.filter((j) => j.isDataComplete).length;
  const incompleteCount = jamaahList.length - completeCount;

  const perPackage = useMemo(
    () =>
      packages.map((p) => {
        const list = jamaahList.filter((j) => j.packageId === p.id);
        return {
          pkg: p,
          paid: list.reduce((a, j) => a + j.amountPaid, 0),
          target: list.reduce((a, j) => a + j.totalCost, 0),
          count: list.length,
        };
      }),
    [packages, jamaahList]
  );
  const chartMax = Math.max(1, ...perPackage.map((r) => r.target));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextGroup =
    [...departureGroups]
      .filter((g) => new Date(g.departureDate) >= today)
      .sort((a, b) => a.departureDate.localeCompare(b.departureDate))[0] || departureGroups[0];
  const daysLeft = nextGroup
    ? Math.max(0, Math.ceil((new Date(nextGroup.departureDate).getTime() - today.getTime()) / 86400000))
    : 0;
  const nextGroupPax = nextGroup ? jamaahList.filter((j) => j.packageId === nextGroup.packageId).length : 0;

  const visaCounts = (['Issued', 'Proses Enjaz', 'Belum Proses', 'Reject'] as const).map((s) => ({
    status: s,
    count: jamaahList.filter((j) => j.visaStatus === s).length,
  }));
  const visaColor: Record<string, string> = {
    Issued: '#10b981',
    'Proses Enjaz': '#0ea5e9',
    'Belum Proses': 'var(--line-strong)',
    Reject: '#f43f5e',
  };
  const pct = (n: number) => (jamaahList.length ? Math.round((n / jamaahList.length) * 100) : 0);
  const docRows = [
    { label: 'Scan KTP', value: pct(jamaahList.filter((j) => j.documentStatus.ktpUploaded).length) },
    { label: 'Scan paspor', value: pct(jamaahList.filter((j) => j.documentStatus.passportUploaded).length) },
    { label: 'Data lengkap', value: pct(completeCount) },
  ];

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
    const rows = jamaahList.map((j) => [
      j.fullName,
      j.phoneWhatsapp,
      packages.find((p) => p.id === j.packageId)?.name || '-',
      j.departureDate || '-',
      j.isDataComplete ? 'Lengkap' : 'Belum Lengkap',
      j.documentStatus.ktpUploaded ? 'Sudah Upload' : 'Belum',
      j.documentStatus.passportUploaded ? 'Sudah Upload' : 'Belum',
      j.paymentStatus,
      j.totalCost,
      j.amountPaid,
      j.totalCost - j.amountPaid,
    ]);
    exportToXlsx('Data_Jamaah_MKB_Travel', headers, rows);
  };

  const firstName = (currentUser?.name || 'Admin').split(' ')[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Assalamu'alaikum, ${firstName}`}
        description="Ringkasan operasional hari ini: jamaah, pembayaran, dan keberangkatan terdekat."
        actions={
          <>
            <Button icon={FileSpreadsheet} onClick={handleExportXlsx}>
              Export Excel
            </Button>
            <Button icon={SlidersHorizontal} onClick={() => setShowManagePackageModal(true)}>
              Kelola Paket
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setShowAddPackageModal(true)}>
              Paket Baru
            </Button>
          </>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total jamaah"
          value={jamaahList.length}
          icon={Users}
          tone="accent"
          hint={`${completeCount} berkas lengkap`}
          footer={<Progress value={pct(completeCount)} />}
        />
        <StatCard
          label="Kas masuk"
          value={juta(totalRevenue)}
          icon={Wallet}
          tone="success"
          hint={`${transactions.length} transaksi tercatat`}
        />
        <StatCard
          label="Sisa piutang"
          value={juta(totalReceivables)}
          icon={Receipt}
          tone="violet"
          hint="Menunggu pelunasan jamaah"
        />
        <StatCard
          label="Perlu lengkapi data"
          value={incompleteCount}
          icon={AlertTriangle}
          tone="warning"
          hint="Baru nama & no. HP — perlu KTP/paspor"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Grafik penerimaan per paket */}
        <Card pad className="xl:col-span-8">
          <CardHeader
            icon={BarChart3}
            title="Penerimaan per paket"
            subtitle="Dana terbayar dibanding total tagihan jamaah di tiap paket"
            actions={
              <Button size="sm" variant="ghost" onClick={() => setCurrentTab('finance')}>
                Keuangan <ArrowUpRight className="size-3.5" />
              </Button>
            }
          />
          <div className="mt-6 flex h-[248px] items-end gap-4 border-b border-line sm:gap-8">
            {perPackage.map(({ pkg, paid, target }) => {
              const c = pkg.kanbanColors.accent;
              return (
                <div key={pkg.id} className="flex h-full flex-1 flex-col justify-end">
                  <div className="num mb-2 text-center text-[13px] font-bold text-ink">{juta(paid)}</div>
                  <div
                    className="relative w-full overflow-hidden rounded-t-2xl"
                    style={{
                      height: `${Math.max(6, (target / chartMax) * 200)}px`,
                      backgroundColor: `color-mix(in srgb, ${c} 14%, transparent)`,
                      backgroundImage: `repeating-linear-gradient(135deg, transparent 0 6px, color-mix(in srgb, ${c} 10%, transparent) 6px 12px)`,
                    }}
                    title={`Target ${formatRupiah(target)}`}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-2xl"
                      style={{ height: `${target ? (paid / target) * 100 : 0}%`, backgroundColor: c }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex gap-4 sm:gap-8">
            {perPackage.map(({ pkg, paid, target, count }) => (
              <div key={pkg.id} className="min-w-0 flex-1 text-center">
                <div className="truncate text-xs font-semibold text-ink">{pkg.name.replace(/^Umroh\s+/, '')}</div>
                <div className="mt-0.5 text-[11px] text-muted">
                  {count} pax · {target ? Math.round((paid / target) * 100) : 0}% terbayar
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Keberangkatan terdekat — kartu gelap */}
        {nextGroup && (
          <div className="flex flex-col rounded-[20px] bg-night p-6 text-night-ink xl:col-span-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-night-muted">
                <CalendarClock className="size-4 text-accent" /> Keberangkatan terdekat
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold">
                {nextGroup.code}
              </span>
            </div>
            <div className="mt-6 flex items-end gap-2">
              <span className="num text-6xl leading-none font-bold">{daysLeft}</span>
              <span className="mb-1.5 text-sm text-night-muted">hari lagi</span>
            </div>
            <div className="mt-2 text-sm font-semibold">{nextGroup.packageName}</div>
            <div className="text-xs text-night-muted">
              {formatDateIndo(nextGroup.departureDate)} – {formatDateIndo(nextGroup.returnDate)}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/5 p-3.5">
              <Plane className="size-4 shrink-0 text-accent" />
              <div className="min-w-0 text-xs">
                <div className="truncate font-semibold">
                  {nextGroup.airline} · {nextGroup.flightNumber}
                </div>
                <div className="truncate text-night-muted">
                  {nextGroup.departureAirport} → {nextGroup.arrivalAirport}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs">
              <div className="flex justify-between text-night-muted">
                <span>Jamaah terdaftar</span>
                <span className="num font-semibold text-night-ink">
                  {nextGroupPax} / {nextGroup.totalQuota}
                </span>
              </div>
              <Progress value={(nextGroupPax / nextGroup.totalQuota) * 100} className="mt-2" track="bg-white/10" />
              <div className="mt-3 truncate text-night-muted">TL: {nextGroup.tourLeader}</div>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => setCurrentTab('manifest')}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[13px] font-semibold text-white transition-colors hover:bg-accent-strong"
              >
                Buka manifest <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Paket & okupansi */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:col-span-8">
          {packages.map((pkg) => {
            const c = pkg.kanbanColors.accent;
            const fill = (pkg.bookedSeats / pkg.quota) * 100;
            return (
              <Card key={pkg.id} className="flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{ backgroundColor: `color-mix(in srgb, ${c} 12%, transparent)`, color: c }}
                  >
                    {pkg.durationDays} hari
                  </span>
                  <span className="text-[11px] font-medium text-muted">{pkg.departureMonth}</span>
                </div>
                <h3 className="mt-3 text-[15px] leading-snug font-bold text-ink">{pkg.name}</h3>
                <div className="num mt-1 text-lg font-bold text-ink">{formatRupiah(pkg.price)}</div>
                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
                  {[
                    ['Makkah', pkg.makkahHotel],
                    ['Madinah', pkg.madinahHotel],
                    ['Maskapai', pkg.airline],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="w-16 shrink-0 text-faint">{k}</dt>
                      <dd className="min-w-0 truncate font-medium text-ink" title={v}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto pt-5">
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted">Kursi terisi</span>
                    <span className="num font-semibold text-ink">
                      {pkg.bookedSeats}/{pkg.quota}
                    </span>
                  </div>
                  <Progress value={fill} color={c} />
                  <button
                    onClick={() => setSelectedPackageDetail(pkg)}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-accent"
                  >
                    Detail paket <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Status visa & berkas */}
        <Card pad className="xl:col-span-4">
          <CardHeader icon={ShieldCheck} title="Visa & berkas" subtitle={`${jamaahList.length} jamaah terdaftar`} />
          <div className="mt-5 flex h-3 gap-1 overflow-hidden rounded-full">
            {visaCounts
              .filter((v) => v.count)
              .map((v) => (
                <div
                  key={v.status}
                  style={{ flex: v.count, backgroundColor: visaColor[v.status] }}
                  title={`${v.status}: ${v.count}`}
                />
              ))}
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {visaCounts.map((v) => (
              <li key={v.status} className="flex items-center gap-2 text-xs">
                <span className="size-2 rounded-full" style={{ backgroundColor: visaColor[v.status] }} />
                <span className="flex-1 text-muted">{v.status}</span>
                <span className="num font-semibold text-ink">{v.count}</span>
              </li>
            ))}
          </ul>
          <div className="my-5 border-t border-line" />
          <div className="space-y-3.5">
            {docRows.map((d) => (
              <div key={d.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-muted">{d.label}</span>
                  <span className="num font-semibold text-ink">{d.value}%</span>
                </div>
                <Progress value={d.value} color="var(--ink)" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Jamaah terbaru */}
      <Card className="overflow-hidden">
        <div className="card-pad pb-4">
          <CardHeader
            icon={Users}
            title="Jamaah terbaru"
            subtitle="Klik baris untuk melengkapi data atau mengunggah KTP / paspor"
            actions={
              <Button size="sm" onClick={() => setCurrentTab('jamaah')}>
                Lihat semua ({jamaahList.length})
              </Button>
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="table min-w-[760px]">
            <thead>
              <tr>
                <th>Jamaah</th>
                <th>Paket</th>
                <th>Berkas</th>
                <th>Visa</th>
                <th className="text-right">Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {jamaahList.slice(0, 6).map((j) => {
                const pkg = packages.find((p) => p.id === j.packageId);
                const paidPct = j.totalCost ? Math.round((j.amountPaid / j.totalCost) * 100) : 0;
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
                    </td>
                    <td>
                      <Badge tone={visaTone(j.visaStatus)}>{j.visaStatus}</Badge>
                    </td>
                    <td className="text-right">
                      <div className="num font-semibold text-ink">{formatRupiah(j.amountPaid)}</div>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <Badge tone={paymentTone(j.paymentStatus)}>{j.paymentStatus}</Badge>
                        <span className={cx('num text-[11px] text-muted')}>{paidPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
