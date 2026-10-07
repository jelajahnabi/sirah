import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jamaah } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import { Button, Field, Modal, cx } from '../ui';
import { AlertTriangle, Check, Printer, Truck } from 'lucide-react';

const EXPEDITIONS = ['JNE Express', 'J&T Cargo', 'SiCepat', 'Pos Indonesia', 'Kurir Internal MKB'] as const;
const ITEMS = [
  'Koper Bagasi 24 Inch (TSA Lock)',
  'Koper Kabin 20 Inch',
  'Kain Ihram / Mukena MKB',
  'Bahan Batik Seragam Resmi',
  'Buku Saku Doa & ID Card Kalung',
  'Tas Selempang Paspor',
  'Sabuk Ihram Tebal',
];

export const ShippingLabelPrintModal: React.FC = () => {
  const { shippingLabelJamaah } = useApp();
  if (!shippingLabelJamaah) return null;
  return <LabelEditor key={shippingLabelJamaah.id} jamaah={shippingLabelJamaah} />;
};

const LabelEditor: React.FC<{ jamaah: Jamaah }> = ({ jamaah }) => {
  const { setShippingLabelJamaah, packages } = useApp();
  const pkg = packages.find((p) => p.id === jamaah.packageId);
  const close = () => setShippingLabelJamaah(null);

  const [expedition, setExpedition] = useState<(typeof EXPEDITIONS)[number]>('JNE Express');
  const [service, setService] = useState('REG / Cargo Koper');
  const [items, setItems] = useState<string[]>(ITEMS.slice(0, 6));
  const [notes, setNotes] = useState('FRAGILE! PERLENGKAPAN UMROH - JANGAN DIBANTING / JANGAN DITINDIH BENDA BERAT');
  const [address, setAddress] = useState(
    jamaah.address || `Jl. Malioboro No. 45, RT 02 / RW 04, ${jamaah.city || 'Kota Yogyakarta'}, D.I. Yogyakarta 55271`
  );

  const toggle = (i: string) => setItems((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  return (
    <Modal
      open
      onClose={close}
      title="Label pengiriman koper"
      description="Alamat otomatis dari data KTP jamaah; bisa disesuaikan sebelum dicetak."
      icon={Truck}
      size="xl"
      footer={
        <>
          <span className="mr-auto text-xs text-muted">Tempel pada kardus / pelindung koper sebelum diserahkan ke kurir.</span>
          <Button variant="ghost" onClick={close}>
            Tutup
          </Button>
          <Button variant="primary" icon={Printer} onClick={() => window.print()}>
            Cetak Label
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Pengaturan */}
        <div className="space-y-4 rounded-2xl bg-subtle p-4 print:hidden">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Ekspedisi">
              <select className="input" value={expedition} onChange={(e) => setExpedition(e.target.value as typeof expedition)}>
                {EXPEDITIONS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Layanan">
              <input className="input" value={service} onChange={(e) => setService(e.target.value)} />
            </Field>
            <Field label="Instruksi kurir">
              <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
          </div>
          <Field label="Alamat tujuan (default: alamat KTP)">
            <textarea className="input" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <div>
            <span className="field-label">Isi kiriman</span>
            <div className="flex flex-wrap gap-2">
              {ITEMS.map((i) => {
                const on = items.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className={cx(
                      'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors',
                      on ? 'border-ink bg-ink text-canvas' : 'border-line bg-surface text-muted hover:text-ink'
                    )}
                  >
                    {on && <Check className="size-3" />}
                    {i}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Label cetak */}
        <div className="print-area space-y-4 rounded-xl border-2 border-black bg-white p-6 text-black">
          <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-3">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-10" withText={false} />
              <div>
                <h1 className="text-sm font-black uppercase">{COMPANY_INFO.legalName}</h1>
                <p className="text-[10px] text-gray-700">Divisi Logistik & Perlengkapan · {COMPANY_INFO.skIzin}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded bg-black px-3 py-1 font-mono text-xs font-bold text-white uppercase">{expedition}</span>
              <div className="mt-0.5 font-mono text-[10px] text-gray-700">Layanan: {service}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
            <div className="space-y-1 border-r border-gray-300 pr-3">
              <span className="block text-[10px] font-bold tracking-wider text-gray-600 uppercase">Pengirim</span>
              <div className="text-xs font-bold">{COMPANY_INFO.legalName}</div>
              <div className="text-[11px] leading-snug text-gray-800">{COMPANY_INFO.address}</div>
              <div className="pt-1 font-mono text-[11px] font-semibold">Telp/WA: {COMPANY_INFO.whatsappDisplay}</div>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold tracking-wider text-red-600 uppercase">Penerima (jamaah)</span>
              <div className="text-sm font-black">{jamaah.fullName.toUpperCase()}</div>
              <div className="font-mono text-[11px] font-bold">HP/WA: {jamaah.phoneWhatsapp}</div>
              <div className="text-[10px] text-gray-700">NIK: {jamaah.nik || '—'}</div>
              <div className="mt-1 rounded border border-amber-300 bg-amber-50 p-2 text-xs leading-snug font-semibold">
                <span className="block text-[10px] font-bold text-amber-900 uppercase">Alamat KTP</span>
                {address}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-b-2 border-black pb-3 text-xs">
            <div>
              <span className="block text-[10px] font-bold text-gray-600 uppercase">Program</span>
              <strong className="mt-0.5 block">{pkg?.name || 'Paket Umroh Reguler'}</strong>
              <span className="font-mono text-[11px] text-gray-700">Berangkat: {jamaah.departureDate || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-gray-600 uppercase">No. registrasi</span>
              <span className="mt-0.5 block font-mono font-bold">MKB-{jamaah.id.toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold text-gray-600 uppercase">Tanggal kirim</span>
              <span className="font-mono font-semibold">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase">
              <span>Isi kiriman</span>
              <span className="font-mono text-emerald-700">{items.length} item</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 rounded border border-gray-200 bg-gray-50 p-2.5 text-[11px]">
              {items.map((i) => (
                <div key={i} className="flex items-center gap-1.5 font-medium text-gray-800">
                  <span className="font-bold text-emerald-600">✓</span>
                  {i}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded border-2 border-red-600 bg-red-50 p-2.5 text-red-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 shrink-0" />
              <div>
                <strong className="block text-xs font-black tracking-wider uppercase">Perhatian kurir</strong>
                <span className="text-[11px] leading-tight font-semibold">{notes}</span>
              </div>
            </div>
            <div className="shrink-0 border-l border-red-300 pl-3 text-center">
              <div className="text-[9px] font-bold uppercase">Kode logistik</div>
              <div className="font-mono text-sm font-black">UMR-KPR-01</div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-300 pt-2 text-[10px] text-gray-600">
            <span>Dicetak via Backoffice MKB · Surat jalan ekspedisi koper</span>
            <span className="font-mono text-xs font-bold tracking-widest text-gray-800">||| | ||||| || |||||| | |||| ||| ||||</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
