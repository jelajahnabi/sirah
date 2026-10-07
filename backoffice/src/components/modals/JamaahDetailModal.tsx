import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jamaah, VisaStatus } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { Badge, Button, Field, Modal, PackageTag, Progress, readFileAsDataUrl } from '../ui';
import { UploadTile } from './AddJamaahModal';
import { IdCard, Save, UserRound } from 'lucide-react';

export const JamaahDetailModal: React.FC = () => {
  const { selectedJamaah } = useApp();
  if (!selectedJamaah) return null;
  // key: reset state form setiap kali jamaah yang dibuka berganti
  return <JamaahDetailForm key={selectedJamaah.id} jamaah={selectedJamaah} />;
};

const JamaahDetailForm: React.FC<{ jamaah: Jamaah }> = ({ jamaah }) => {
  const { setSelectedJamaah, updateJamaah, packages, setIdCardJamaah } = useApp();
  const pkg = packages.find((p) => p.id === jamaah.packageId);
  const balance = jamaah.totalCost - jamaah.amountPaid;
  const close = () => setSelectedJamaah(null);

  const [f, setF] = useState({
    fullName: jamaah.fullName,
    phoneWhatsapp: jamaah.phoneWhatsapp,
    nik: jamaah.nik || '',
    passportNumber: jamaah.passportNumber || '',
    birthPlace: jamaah.birthPlace || '',
    birthDate: jamaah.birthDate || '',
    passportExpiryDate: jamaah.passportExpiryDate || '',
    passportIssuePlace: jamaah.passportIssuePlace || '',
    address: jamaah.address || '',
    city: jamaah.city || 'Yogyakarta',
    visaStatus: jamaah.visaStatus as VisaStatus,
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const [ktp, setKtp] = useState({ name: jamaah.ktpFileName || '', url: jamaah.ktpFileUrl || '' });
  const [passport, setPassport] = useState({ name: jamaah.passportFileName || '', url: jamaah.passportFileUrl || '' });
  const pick = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: { name: string; url: string }) => void) => {
    const file = e.target.files?.[0];
    if (file) setter({ name: file.name, url: await readFileAsDataUrl(file) });
  };

  const save = () => {
    const opt = (v: string) => v.trim() || undefined;
    updateJamaah(jamaah.id, {
      fullName: f.fullName.trim(),
      phoneWhatsapp: f.phoneWhatsapp.trim(),
      nik: opt(f.nik),
      passportNumber: opt(f.passportNumber),
      birthPlace: opt(f.birthPlace),
      birthDate: f.birthDate || undefined,
      passportExpiryDate: f.passportExpiryDate || undefined,
      passportIssuePlace: opt(f.passportIssuePlace),
      address: opt(f.address),
      city: opt(f.city),
      visaStatus: f.visaStatus,
      ktpFileName: ktp.name || undefined,
      ktpFileUrl: ktp.url || undefined,
      passportFileName: passport.name || undefined,
      passportFileUrl: passport.url || undefined,
      documentStatus: {
        ...jamaah.documentStatus,
        ktpUploaded: Boolean(ktp.name || ktp.url),
        passportUploaded: Boolean(passport.name || passport.url),
      },
    });
    close();
  };

  return (
    <Modal
      open
      onClose={close}
      title={jamaah.fullName}
      description={
        <span className="inline-flex flex-wrap items-center gap-2">
          <PackageTag pkg={pkg} />
          <span>Berangkat {formatDateIndo(jamaah.departureDate)}</span>
        </span>
      }
      icon={UserRound}
      size="xl"
      headerActions={
        <Button
          size="sm"
          icon={IdCard}
          onClick={() => {
            setIdCardJamaah(jamaah);
            close();
          }}
        >
          ID Card
        </Button>
      }
      footer={
        <>
          <Badge tone={jamaah.isDataComplete ? 'success' : 'warning'} dot className="mr-auto">
            {jamaah.isDataComplete ? 'Data lengkap' : 'Perlu dilengkapi: NIK, paspor, scan KTP & paspor'}
          </Badge>
          <Button variant="ghost" onClick={close}>
            Batal
          </Button>
          <Button variant="primary" icon={Save} onClick={save}>
            Simpan
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Ringkasan pembayaran */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl bg-subtle p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
              <span>
                Total <strong className="num text-ink">{formatRupiah(jamaah.totalCost)}</strong>
              </span>
              <span>
                Terbayar <strong className="num text-emerald-600 dark:text-emerald-400">{formatRupiah(jamaah.amountPaid)}</strong>
              </span>
            </div>
            <Progress value={jamaah.totalCost ? (jamaah.amountPaid / jamaah.totalCost) * 100 : 0} color="#10b981" className="mt-3 bg-surface" track="bg-surface" />
          </div>
          <div className="sm:text-right">
            {balance <= 0 ? (
              <Badge tone="success">LUNAS</Badge>
            ) : (
              <>
                <div className="text-[11px] text-muted">Sisa tagihan</div>
                <div className="num text-lg font-bold text-accent">{formatRupiah(balance)}</div>
              </>
            )}
          </div>
        </div>

        <section>
          <h3 className="eyebrow mb-3">Identitas</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nama lengkap (sesuai paspor) *" className="lg:col-span-2">
              <input className="input font-semibold" required value={f.fullName} onChange={set('fullName')} />
            </Field>
            <Field label="No. WhatsApp *">
              <input className="input font-mono" required value={f.phoneWhatsapp} onChange={set('phoneWhatsapp')} />
            </Field>
            <Field label="NIK (16 digit)">
              <input className="input font-mono" maxLength={16} placeholder="347101…" value={f.nik} onChange={set('nik')} />
            </Field>
            <Field label="Tempat lahir">
              <input className="input" placeholder="Yogyakarta" value={f.birthPlace} onChange={set('birthPlace')} />
            </Field>
            <Field label="Tanggal lahir">
              <input className="input" type="date" value={f.birthDate} onChange={set('birthDate')} />
            </Field>
            <Field label="Alamat (sesuai KTP)" className="sm:col-span-2">
              <input className="input" placeholder="Jalan, RT/RW, kelurahan, kecamatan" value={f.address} onChange={set('address')} />
            </Field>
            <Field label="Kota">
              <input className="input" value={f.city} onChange={set('city')} />
            </Field>
          </div>
        </section>

        <section>
          <h3 className="eyebrow mb-3">Paspor & visa</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="No. paspor">
              <input className="input font-mono uppercase" placeholder="X1892041" value={f.passportNumber} onChange={set('passportNumber')} />
            </Field>
            <Field label="Masa berlaku">
              <input className="input" type="date" value={f.passportExpiryDate} onChange={set('passportExpiryDate')} />
            </Field>
            <Field label="Kantor imigrasi">
              <input className="input" placeholder="Imigrasi Yogyakarta" value={f.passportIssuePlace} onChange={set('passportIssuePlace')} />
            </Field>
            <Field label="Status visa">
              <select className="input" value={f.visaStatus} onChange={set('visaStatus')}>
                <option value="Belum Proses">Belum proses</option>
                <option value="Proses Enjaz">Proses Enjaz</option>
                <option value="Issued">Issued (terbit)</option>
                <option value="Reject">Reject (ditolak)</option>
              </select>
            </Field>
          </div>
        </section>

        <section>
          <h3 className="eyebrow mb-3">Dokumen</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UploadTile label="Scan / foto KTP" file={ktp.name} preview={ktp.url} onChange={(e) => pick(e, setKtp)} />
            <UploadTile label="Scan / foto paspor" file={passport.name} preview={passport.url} onChange={(e) => pick(e, setPassport)} />
          </div>
        </section>
      </div>
    </Modal>
  );
};
