import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { Button, Field, Modal, cx, readFileAsDataUrl } from '../ui';
import { ChevronDown, FileCheck2, Upload, UserPlus } from 'lucide-react';

const EMPTY = { fullName: '', phoneWhatsapp: '', nik: '', passportNumber: '', city: 'Yogyakarta' };

export const AddJamaahModal: React.FC = () => {
  const { showAddJamaahModal, setShowAddJamaahModal, packages, addJamaah } = useApp();

  const [form, setForm] = useState(EMPTY);
  const [pkgId, setPkgId] = useState(packages[0]?.id || '');
  const [dp, setDp] = useState(5000000);
  const [more, setMore] = useState(false);
  const [ktp, setKtp] = useState<{ name: string; url: string } | null>(null);
  const [passport, setPassport] = useState<{ name: string; url: string } | null>(null);

  const close = () => setShowAddJamaahModal(false);
  const pkg = packages.find((p) => p.id === pkgId) || packages[0];

  const pick = async (e: React.ChangeEvent<HTMLInputElement>, set: (v: { name: string; url: string }) => void) => {
    const f = e.target.files?.[0];
    if (f) set({ name: f.name, url: await readFileAsDataUrl(f) });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phoneWhatsapp.trim()) return;
    addJamaah({
      fullName: form.fullName.trim(),
      phoneWhatsapp: form.phoneWhatsapp.trim(),
      packageId: pkg?.id,
      downPayment: Number(dp) || 0,
      nik: form.nik.trim() || undefined,
      passportNumber: form.passportNumber.trim() || undefined,
      city: form.city.trim() || 'Yogyakarta',
      ktpFileName: ktp?.name,
      ktpFileUrl: ktp?.url,
      passportFileName: passport?.name,
      passportFileUrl: passport?.url,
    });
    setForm(EMPTY);
    setKtp(null);
    setPassport(null);
    close();
  };

  return (
    <Modal
      open={showAddJamaahModal}
      onClose={close}
      title="Pendaftaran cepat"
      description="Hanya nama & no. HP yang wajib. Data lain bisa dilengkapi belakangan."
      icon={UserPlus}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Batal
          </Button>
          <Button variant="primary" type="submit" form="add-jamaah-form">
            Simpan Pendaftaran
          </Button>
        </>
      }
    >
      <form id="add-jamaah-form" onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={<>Nama lengkap <span className="text-accent">*</span></>}>
            <input
              className="input"
              required
              autoFocus
              placeholder="Muhammad Ridwan Ashari"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </Field>
          <Field label={<>No. WhatsApp <span className="text-accent">*</span></>}>
            <input
              className="input font-mono"
              required
              inputMode="tel"
              placeholder="0813xxxxxxxx"
              value={form.phoneWhatsapp}
              onChange={(e) => setForm({ ...form, phoneWhatsapp: e.target.value })}
            />
          </Field>
        </div>

        <div>
          <span className="field-label">Paket umroh</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {packages.map((p) => {
              const active = p.id === pkg?.id;
              const c = p.kanbanColors.accent;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPkgId(p.id)}
                  className={cx('rounded-2xl border p-3 text-left transition-all', active ? 'ring-2' : 'border-line hover:bg-subtle')}
                  style={active ? ({ borderColor: c, '--tw-ring-color': `color-mix(in srgb, ${c} 20%, transparent)` } as React.CSSProperties) : undefined}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: c }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: c }} />
                    {p.departureMonth}
                  </div>
                  <div className="mt-1 text-[13px] leading-snug font-semibold text-ink">{p.name.replace(/^Umroh\s+/, '')}</div>
                  <div className="num mt-1.5 text-xs font-bold text-muted">{formatRupiah(p.price)}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Field label="DP / booking seat (opsional)" hint={`Total biaya paket ${formatRupiah(pkg?.price || 0)}`}>
          <input className="input num font-semibold" type="number" min={0} step={500000} value={dp} onChange={(e) => setDp(Number(e.target.value))} />
        </Field>

        <div className="rounded-2xl border border-line">
          <button type="button" onClick={() => setMore(!more)} className="flex w-full items-center justify-between px-4 py-3 text-[13px] font-semibold text-ink">
            Data tambahan & upload KTP / paspor
            <ChevronDown className={cx('size-4 text-muted transition-transform', more && 'rotate-180')} />
          </button>
          {more && (
            <div className="space-y-4 border-t border-line p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="NIK (16 digit)">
                  <input className="input font-mono" maxLength={16} placeholder="347101…" value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} />
                </Field>
                <Field label="No. paspor">
                  <input
                    className="input font-mono uppercase"
                    placeholder="X1892041"
                    value={form.passportNumber}
                    onChange={(e) => setForm({ ...form, passportNumber: e.target.value })}
                  />
                </Field>
                <Field label="Kota">
                  <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <UploadTile label="Scan KTP" file={ktp?.name} onChange={(e) => pick(e, setKtp)} />
                <UploadTile label="Scan paspor" file={passport?.name} onChange={(e) => pick(e, setPassport)} />
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export const UploadTile: React.FC<{
  label: string;
  file?: string;
  preview?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, file, preview, onChange }) => (
  <label
    className={cx(
      'flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-3 transition-colors hover:border-accent',
      file ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-line-strong'
    )}
  >
    <input type="file" accept="image/*,.pdf" onChange={onChange} className="hidden" />
    {preview && preview.startsWith('data:image') ? (
      <img src={preview} alt={label} className="size-12 shrink-0 rounded-xl object-cover" />
    ) : (
      <span
        className={cx(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          file ? 'bg-emerald-500/10 text-emerald-600' : 'bg-subtle text-faint'
        )}
      >
        {file ? <FileCheck2 className="size-5" /> : <Upload className="size-5" />}
      </span>
    )}
    <span className="min-w-0">
      <span className="block text-[13px] font-semibold text-ink">{label}</span>
      <span className="block truncate text-[11px] text-muted">{file || 'Klik untuk unggah (gambar / PDF)'}</span>
    </span>
  </label>
);
