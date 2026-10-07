import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatRupiah, sharePackageToWhatsApp } from '../../utils/formatters';
import {
  Badge,
  Button,
  Card,
  IconButton,
  PageHeader,
  Progress,
  Segmented,
  packageStatusMeta,
  paymentTone,
} from '../ui';
import { Building2, CalendarDays, Check, Columns3, Eye, LayoutGrid, Plane, Plus, Share2, SlidersHorizontal, UserPlus } from 'lucide-react';

export const PackageCatalogView: React.FC = () => {
  const {
    packages,
    jamaahList,
    setSelectedPackageDetail,
    setShowAddJamaahModal,
    setShowManagePackageModal,
    setShowAddPackageModal,
    setSelectedJamaah,
  } = useApp();
  const [mode, setMode] = useState<'kanban' | 'grid'>('kanban');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket umroh"
        description="Pantau kuota tiap program dan jamaah yang sudah terdaftar di dalamnya."
        actions={
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { value: 'kanban', label: 'Papan', icon: Columns3 },
                { value: 'grid', label: 'Katalog', icon: LayoutGrid },
              ]}
            />
            <Button icon={SlidersHorizontal} onClick={() => setShowManagePackageModal(true)}>
              Kelola
            </Button>
            <Button variant="primary" icon={Plus} onClick={() => setShowAddPackageModal(true)}>
              Paket Baru
            </Button>
          </>
        }
      />

      {mode === 'kanban' ? (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {packages.map((pkg) => {
            const c = pkg.kanbanColors.accent;
            const list = jamaahList.filter((j) => j.packageId === pkg.id);
            const omzet = list.reduce((a, j) => a + j.amountPaid, 0);
            const fill = Math.round((pkg.bookedSeats / pkg.quota) * 100);
            const status = packageStatusMeta[pkg.status];
            return (
              <Card key={pkg.id} className="overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: c }} />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-muted">{pkg.code}</span>
                    <Badge tone={status.tone} dot>
                      {status.label}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-lg leading-snug font-bold text-ink">{pkg.name}</h3>
                  <div className="mt-1 text-xs text-muted">
                    {pkg.durationDays} hari · {pkg.departureMonth} · {pkg.airline}
                  </div>

                  <div className="mt-4 flex items-end justify-between rounded-2xl bg-subtle p-3.5">
                    <div>
                      <div className="eyebrow">Mulai dari</div>
                      <div className="num mt-1 text-xl font-bold text-ink">{formatRupiah(pkg.price)}</div>
                    </div>
                    <IconButton icon={Eye} label="Detail paket" onClick={() => setSelectedPackageDetail(pkg)} className="bg-surface" />
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-muted">
                        Kursi {pkg.bookedSeats}/{pkg.quota}
                      </span>
                      <span className="num font-semibold text-ink">{fill}%</span>
                    </div>
                    <Progress value={fill} color={c} />
                  </div>
                </div>

                <div className="border-t border-line bg-subtle/60 p-3">
                  <div className="flex items-center justify-between px-2 pb-2.5 text-[11px]">
                    <span className="font-semibold text-muted">Jamaah ({list.length})</span>
                    <span className="num font-semibold text-ink">Terbayar {formatRupiah(omzet)}</span>
                  </div>
                  <div className="max-h-[420px] space-y-2 overflow-y-auto">
                    {list.length === 0 && (
                      <div className="rounded-xl border border-dashed border-line-strong py-6 text-center text-xs text-muted">
                        Belum ada jamaah di paket ini.
                      </div>
                    )}
                    {list.map((j) => (
                      <button
                        key={j.id}
                        onClick={() => setSelectedJamaah(j)}
                        className="block w-full rounded-xl border border-line bg-surface p-3 text-left transition-shadow hover:shadow-card"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-ink">{j.fullName}</div>
                            <div className="font-mono text-[11px] text-muted">{j.phoneWhatsapp}</div>
                          </div>
                          <Badge tone={paymentTone(j.paymentStatus)}>{j.paymentStatus}</Badge>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <span className={j.isDataComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                            {j.isDataComplete ? '✓ Berkas lengkap' : '• Perlu dilengkapi'}
                          </span>
                          <span className="num font-semibold text-ink">{formatRupiah(j.amountPaid)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAddJamaahModal(true)}
                    className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    <UserPlus className="size-3.5" /> Tambah jamaah
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {packages.map((pkg) => {
            const c = pkg.kanbanColors.accent;
            return (
              <Card key={pkg.id} className="flex flex-col overflow-hidden">
                <div className="relative overflow-hidden bg-night p-6 text-night-ink">
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-40 blur-2xl"
                    style={{ backgroundColor: c }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-mono text-[11px] text-night-muted">{pkg.code}</span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold">{pkg.departureMonth}</span>
                  </div>
                  <h3 className="relative mt-3 text-xl leading-snug font-bold">{pkg.name}</h3>
                  <div className="num relative mt-3 text-[28px] font-bold">{formatRupiah(pkg.price)}</div>
                  <div className="relative text-xs text-night-muted">per jamaah · kamar quad</div>
                </div>

                <div className="flex-1 space-y-4 p-5 text-[13px]">
                  <ul className="space-y-2.5 text-muted">
                    <li className="flex gap-2.5">
                      <CalendarDays className="mt-0.5 size-4 shrink-0" style={{ color: c }} />
                      <span>
                        <strong className="text-ink">{pkg.durationDays} hari</strong> di Tanah Suci
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <Plane className="mt-0.5 size-4 shrink-0" style={{ color: c }} />
                      <span>{pkg.airline}</span>
                    </li>
                    <li className="flex gap-2.5">
                      <Building2 className="mt-0.5 size-4 shrink-0" style={{ color: c }} />
                      <span>
                        {pkg.makkahHotel} · {pkg.madinahHotel}
                      </span>
                    </li>
                  </ul>

                  {pkg.roomPrices && (
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ['Quad', pkg.roomPrices.quad],
                          ['Triple', pkg.roomPrices.triple],
                          ['Double', pkg.roomPrices.double],
                        ] as const
                      )
                        .filter(([, v]) => v)
                        .map(([label, v]) => (
                          <div key={label} className="rounded-xl bg-subtle p-2.5">
                            <div className="text-[11px] text-muted">{label}</div>
                            <div className="num mt-0.5 text-xs font-bold text-ink">{formatRupiah(v!)}</div>
                          </div>
                        ))}
                    </div>
                  )}

                  <ul className="space-y-1.5">
                    {pkg.highlightFeatures.map((f) => (
                      <li key={f} className="flex gap-2 text-xs text-muted">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 border-t border-line p-4">
                  <Button className="flex-1" icon={Eye} onClick={() => setSelectedPackageDetail(pkg)}>
                    Lihat detail
                  </Button>
                  <IconButton
                    icon={Share2}
                    label="Bagikan ke WhatsApp"
                    className="border border-line"
                    onClick={() => sharePackageToWhatsApp(pkg, COMPANY_INFO)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
