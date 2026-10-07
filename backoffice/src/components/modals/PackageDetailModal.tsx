import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatRupiah, formatDateIndo, sharePackageToWhatsApp } from '../../utils/formatters';
import { Badge, Button, Modal, Progress, packageStatusMeta } from '../ui';
import { Building2, Check, Compass, Plane, Share2, UserPlus } from 'lucide-react';

export const PackageDetailModal: React.FC = () => {
  const { selectedPackageDetail: pkg, setSelectedPackageDetail, setShowAddJamaahModal } = useApp();
  const close = () => setSelectedPackageDetail(null);
  if (!pkg) return null;
  const c = pkg.kanbanColors.accent;
  const status = packageStatusMeta[pkg.status];

  return (
    <Modal
      open
      onClose={close}
      title={pkg.name}
      description={`${pkg.code} · ${pkg.durationDays} hari · ${pkg.departureMonth}`}
      icon={Compass}
      size="lg"
      footer={
        <>
          <Button icon={Share2} onClick={() => sharePackageToWhatsApp(pkg, COMPANY_INFO)} className="mr-auto">
            Bagikan ke WA
          </Button>
          <Button variant="ghost" onClick={close}>
            Tutup
          </Button>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => {
              close();
              setShowAddJamaahModal(true);
            }}
          >
            Daftarkan Jamaah
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-2xl bg-night p-5 text-night-ink">
          <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-40 blur-2xl" style={{ backgroundColor: c }} />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-night-muted">Harga all-in mulai</div>
              <div className="num mt-1 text-3xl font-bold">{formatRupiah(pkg.price)}</div>
            </div>
            <Badge tone={status.tone} dot className="bg-white/10 text-night-ink ring-white/10">
              {status.label}
            </Badge>
          </div>
          <div className="relative mt-4">
            <div className="mb-2 flex justify-between text-xs text-night-muted">
              <span>Kursi terisi</span>
              <span className="num font-semibold text-night-ink">
                {pkg.bookedSeats}/{pkg.quota}
              </span>
            </div>
            <Progress value={(pkg.bookedSeats / pkg.quota) * 100} color={c} track="bg-white/10" />
          </div>
        </div>

        {pkg.roomPrices && (
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ['Quad · 4 orang', pkg.roomPrices.quad],
                ['Triple · 3 orang', pkg.roomPrices.triple],
                ['Double · 2 orang', pkg.roomPrices.double],
              ] as const
            )
              .filter(([, v]) => v)
              .map(([l, v]) => (
                <div key={l} className="rounded-2xl border border-line p-3.5">
                  <div className="text-[11px] text-muted">{l}</div>
                  <div className="num mt-1 text-sm font-bold text-ink">{formatRupiah(v!)}</div>
                </div>
              ))}
          </div>
        )}

        <p className="text-[13px] leading-relaxed text-muted">{pkg.description}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-subtle p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Building2 className="size-4" style={{ color: c }} /> Akomodasi
            </div>
            <div className="mt-2 space-y-1 text-xs text-muted">
              <div>Makkah: {pkg.makkahHotel}</div>
              <div>Madinah: {pkg.madinahHotel}</div>
            </div>
          </div>
          <div className="rounded-2xl bg-subtle p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <Plane className="size-4" style={{ color: c }} /> Penerbangan
            </div>
            <div className="mt-2 space-y-1 text-xs text-muted">
              <div>{pkg.airline}</div>
              <div>Berangkat: {pkg.departureDates.map((d) => formatDateIndo(d)).join(', ')}</div>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {pkg.highlightFeatures.map((f) => (
            <li key={f} className="flex gap-2 text-[13px] text-ink">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
