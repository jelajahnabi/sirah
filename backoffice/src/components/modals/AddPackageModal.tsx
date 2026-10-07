import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanColorConfig } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Button, Field, Modal, cx } from '../ui';
import { Check, Plus } from 'lucide-react';

export const COLOR_PALETTES: { name: string; colors: KanbanColorConfig }[] = [
  {
    name: 'Autumn Terracotta / Amber',
    colors: {
      accent: '#f27244',
      dotColor: '#f27244',
      badgeBgDark: '#361e15',
      badgeBgLight: '#ffede6',
      badgeTextDark: '#ff8f6b',
      badgeTextLight: '#c8471b',
      columnBorderDark: '#4d291c',
      columnBorderLight: '#fed7c8',
      columnHeaderDark: '#281711',
      columnHeaderLight: '#fff5f1',
      cardBgDark: '#231814',
      cardBgLight: '#fffaf8',
    },
  },
  {
    name: 'Spiritual Sage / Emerald Green',
    colors: {
      accent: '#10b981',
      dotColor: '#10b981',
      badgeBgDark: '#0e2f24',
      badgeBgLight: '#ecfdf5',
      badgeTextDark: '#6ee7b7',
      badgeTextLight: '#047857',
      columnBorderDark: '#134e3a',
      columnBorderLight: '#a7f3d0',
      columnHeaderDark: '#0c261d',
      columnHeaderLight: '#f0fdf4',
      cardBgDark: '#11221b',
      cardBgLight: '#f6fdf9',
    },
  },
  {
    name: 'Royal Twilight / Indigo Violet',
    colors: {
      accent: '#8b5cf6',
      dotColor: '#8b5cf6',
      badgeBgDark: '#27173e',
      badgeBgLight: '#f3e8ff',
      badgeTextDark: '#c084fc',
      badgeTextLight: '#7e22ce',
      columnBorderDark: '#3f2563',
      columnBorderLight: '#e9d5ff',
      columnHeaderDark: '#1e1131',
      columnHeaderLight: '#faf5ff',
      cardBgDark: '#1d142b',
      cardBgLight: '#faf8ff',
    },
  },
  {
    name: 'Golden Ochre / Warm Gold',
    colors: {
      accent: '#f59e0b',
      dotColor: '#f59e0b',
      badgeBgDark: '#33240f',
      badgeBgLight: '#fef3c7',
      badgeTextDark: '#fbbf24',
      badgeTextLight: '#b45309',
      columnBorderDark: '#4d3715',
      columnBorderLight: '#fde68a',
      columnHeaderDark: '#251b0c',
      columnHeaderLight: '#fffbeb',
      cardBgDark: '#22190b',
      cardBgLight: '#fefdfa',
    },
  },
  {
    name: 'Sky Blue / Aegean Ocean',
    colors: {
      accent: '#0284c7',
      dotColor: '#0284c7',
      badgeBgDark: '#0c2236',
      badgeBgLight: '#e0f2fe',
      badgeTextDark: '#38bdf8',
      badgeTextLight: '#0369a1',
      columnBorderDark: '#133552',
      columnBorderLight: '#bae6fd',
      columnHeaderDark: '#081726',
      columnHeaderLight: '#f0f9ff',
      cardBgDark: '#0a1d2e',
      cardBgLight: '#f8fcff',
    },
  },
];

const INITIAL = {
  name: '',
  code: '',
  durationDays: 12,
  departureMonth: 'Januari 2027',
  price: 31500000,
  triplePrice: 34000000,
  doublePrice: 36500000,
  makkahHotel: 'Emaar Grand Makkah',
  madinahHotel: 'Rove Madinah',
  airline: 'Saudia Airlines (Direct)',
  quota: 45,
  description: 'Paket umroh istimewa dengan pembimbing berpengalaman.',
};

export const AddPackageModal: React.FC = () => {
  const { showAddPackageModal, setShowAddPackageModal, addPackage } = useApp();
  const [f, setF] = useState(INITIAL);
  const [palette, setPalette] = useState(0);
  const set = <K extends keyof typeof INITIAL>(k: K, v: (typeof INITIAL)[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const close = () => setShowAddPackageModal(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    addPackage({
      name: f.name.trim(),
      code: f.code.trim().toUpperCase() || `MKB-${f.name.slice(0, 3).toUpperCase()}-${f.durationDays}D`,
      durationDays: Number(f.durationDays),
      departureMonth: f.departureMonth.trim(),
      price: Number(f.price),
      roomPrices: {
        quad: Number(f.price),
        triple: Number(f.triplePrice || f.price + 2500000),
        double: Number(f.doublePrice || f.price + 5000000),
      },
      makkahHotel: f.makkahHotel.trim(),
      madinahHotel: f.madinahHotel.trim(),
      airline: f.airline.trim(),
      departureDates: ['2027-01-15'],
      description: f.description.trim(),
      highlightFeatures: [
        `Durasi ${f.durationDays} Hari di Tanah Suci`,
        `Penerbangan ${f.airline}`,
        `Hotel Makkah: ${f.makkahHotel}`,
        `Hotel Madinah: ${f.madinahHotel}`,
        'Handling & Muthawif Resmi MKB',
      ],
      quota: Number(f.quota),
      status: 'Open',
      kanbanColors: COLOR_PALETTES[palette].colors,
    });
    setF(INITIAL);
    close();
  };

  return (
    <Modal
      open={showAddPackageModal}
      onClose={close}
      title="Paket umroh baru"
      description="Atur harga per tipe kamar, akomodasi, kuota, dan warna penanda paket."
      icon={Plus}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Batal
          </Button>
          <Button variant="primary" type="submit" form="add-package-form">
            Terbitkan Paket
          </Button>
        </>
      }
    >
      <form id="add-package-form" onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Nama paket *" className="sm:col-span-2">
            <input className="input" required placeholder="Umroh Liburan Syawal" value={f.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Kode (opsional)">
            <input className="input font-mono uppercase" placeholder="MKB-SYW-12D" value={f.code} onChange={(e) => set('code', e.target.value)} />
          </Field>
          <Field label="Durasi (hari)">
            <input className="input num" type="number" min={9} max={45} required value={f.durationDays} onChange={(e) => set('durationDays', Number(e.target.value))} />
          </Field>
          <Field label="Bulan berangkat">
            <input className="input" required value={f.departureMonth} onChange={(e) => set('departureMonth', e.target.value)} />
          </Field>
          <Field label="Kuota kursi">
            <input className="input num" type="number" min={10} max={100} required value={f.quota} onChange={(e) => set('quota', Number(e.target.value))} />
          </Field>
        </div>

        <div className="rounded-2xl bg-subtle p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink">Harga per jamaah</span>
            <span className="num text-sm font-bold text-accent">{formatRupiah(f.price)}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Quad / harga dasar">
              <input className="input num" type="number" step={500000} required value={f.price} onChange={(e) => set('price', Number(e.target.value))} />
            </Field>
            <Field label="Triple">
              <input className="input num" type="number" step={500000} value={f.triplePrice} onChange={(e) => set('triplePrice', Number(e.target.value))} />
            </Field>
            <Field label="Double">
              <input className="input num" type="number" step={500000} value={f.doublePrice} onChange={(e) => set('doublePrice', Number(e.target.value))} />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Hotel Makkah">
            <input className="input" value={f.makkahHotel} onChange={(e) => set('makkahHotel', e.target.value)} />
          </Field>
          <Field label="Hotel Madinah">
            <input className="input" value={f.madinahHotel} onChange={(e) => set('madinahHotel', e.target.value)} />
          </Field>
          <Field label="Maskapai">
            <input className="input" value={f.airline} onChange={(e) => set('airline', e.target.value)} />
          </Field>
        </div>

        <div>
          <span className="field-label">Warna penanda paket</span>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTES.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setPalette(i)}
                className={cx(
                  'inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors',
                  palette === i ? 'border-ink text-ink' : 'border-line text-muted hover:bg-subtle'
                )}
              >
                <span className="flex size-4 items-center justify-center rounded-full text-white" style={{ backgroundColor: p.colors.accent }}>
                  {palette === i && <Check className="size-3" />}
                </span>
                {p.name.split(' / ')[0]}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
