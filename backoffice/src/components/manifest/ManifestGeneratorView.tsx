import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatDateIndo, exportToXlsx } from '../../utils/formatters';
import { BrandLogo } from '../BrandLogo';
import { Badge, Button, Card, EmptyState, KeyValue, PageHeader, visaTone } from '../ui';
import { Check, Copy, FileSpreadsheet, Plane, PlaneLanding, PlaneTakeoff } from 'lucide-react';

export const ManifestGeneratorView: React.FC = () => {
  const { departureGroups, jamaahList } = useApp();
  const [groupId, setGroupId] = useState(departureGroups[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const group = departureGroups.find((g) => g.id === groupId) || departureGroups[0];
  if (!group) {
    return (
      <Card>
        <EmptyState icon={Plane} title="Belum ada kloter keberangkatan" />
      </Card>
    );
  }

  const pax = jamaahList.filter((j) => j.packageId === group.packageId || j.departureDate === group.departureDate);
  const issued = pax.filter((j) => j.visaStatus === 'Issued').length;
  const withPassport = pax.filter((j) => j.passportNumber).length;

  const handleCopy = () => {
    let text = `MANIFEST PENERBANGAN RESMI\n${COMPANY_INFO.legalName}\n${COMPANY_INFO.skIzin}\n`;
    text += `ROMBONGAN: ${group.code} (${group.name})\n`;
    text += `MASKAPAI: ${group.airline} (${group.flightNumber})\n`;
    text += `TANGGAL: ${group.departureDate} s/d ${group.returnDate}\n`;
    text += `RUTE: ${group.departureAirport} - ${group.arrivalAirport}\n\n`;
    text += `NO | NAMA LENGKAP | NO PASPOR | TGL LAHIR | EXP PASPOR | NO HP / WA\n`;
    pax.forEach((j, i) => {
      text += `${i + 1}. | ${j.fullName} | ${j.passportNumber || '-'} | ${j.birthDate || '-'} | ${j.passportExpiryDate || '-'} | ${j.phoneWhatsapp}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportXlsx = () => {
    const headers = [
      'NO',
      'TITLE',
      'NAMA LENGKAP (SESUAI PASPOR)',
      'GENDER',
      'NOMOR PASPOR',
      'TEMPAT LAHIR',
      'TANGGAL LAHIR',
      'TANGGAL EXP PASPOR',
      'KANTOR IMIGRASI',
      'NOMOR WHATSAPP',
      'KOTA DOMISILI',
      'STATUS VISA',
      'PAKET UMROH',
    ];
    const rows = pax.map((j, i) => [
      i + 1,
      j.title || 'Mr',
      j.fullName,
      j.gender || 'L',
      j.passportNumber || '-',
      j.birthPlace || 'Yogyakarta',
      j.birthDate || '-',
      j.passportExpiryDate || '-',
      j.passportIssuePlace || 'Imigrasi Yogyakarta',
      j.phoneWhatsapp,
      j.city || 'Yogyakarta',
      j.visaStatus,
      group.packageName,
    ]);
    exportToXlsx(`MANIFEST_${group.code}_${group.departureDate}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manifest penerbangan"
        description="Daftar penumpang per kloter dalam format standar maskapai & Kemenhaj RI."
        actions={
          <>
            <select className="input w-auto max-w-[280px]" value={group.id} onChange={(e) => setGroupId(e.target.value)} aria-label="Pilih kloter">
              {departureGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} — {g.name}
                </option>
              ))}
            </select>
            <Button icon={copied ? Check : Copy} onClick={handleCopy}>
              {copied ? 'Tersalin' : 'Salin teks'}
            </Button>
            <Button variant="primary" icon={FileSpreadsheet} onClick={handleExportXlsx}>
              Export Excel
            </Button>
          </>
        }
      />

      {/* Kartu penerbangan (boarding pass) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col rounded-[20px] bg-night p-6 text-night-ink xl:col-span-8">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold">{group.code}</span>
            <span className="text-xs text-night-muted">
              {group.airline} · <span className="font-mono">{group.flightNumber}</span>
            </span>
          </div>
          <div className="my-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div>
              <PlaneTakeoff className="size-5 text-accent" />
              <div className="mt-2 text-lg leading-tight font-bold">{group.departureAirport}</div>
              <div className="mt-1 text-xs text-night-muted">{formatDateIndo(group.departureDate)}</div>
            </div>
            <div className="flex items-center gap-2 text-night-muted">
              <span className="hidden h-px w-16 border-t border-dashed border-white/30 sm:block" />
              <Plane className="size-5 text-night-ink" />
              <span className="hidden h-px w-16 border-t border-dashed border-white/30 sm:block" />
            </div>
            <div className="text-right">
              <PlaneLanding className="ml-auto size-5 text-accent" />
              <div className="mt-2 text-lg leading-tight font-bold">{group.arrivalAirport}</div>
              <div className="mt-1 text-xs text-night-muted">Pulang {formatDateIndo(group.returnDate)}</div>
            </div>
          </div>
          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
            <div>
              <div className="text-[11px] text-night-muted uppercase">Program</div>
              <div className="mt-1 truncate text-[13px] font-semibold">{group.packageName}</div>
            </div>
            <div>
              <div className="text-[11px] text-night-muted uppercase">Tour leader</div>
              <div className="mt-1 truncate text-[13px] font-semibold">{group.tourLeader}</div>
            </div>
            <div>
              <div className="text-[11px] text-night-muted uppercase">Muthawif</div>
              <div className="mt-1 truncate text-[13px] font-semibold">{group.muthawif}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 xl:col-span-4 xl:grid-cols-1">
          {[
            { label: 'Penumpang', value: `${pax.length}/${group.totalQuota}` },
            { label: 'Visa issued', value: `${issued}/${pax.length}` },
            { label: 'Paspor terdata', value: `${withPassport}/${pax.length}` },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="text-[13px] text-muted">{s.label}</div>
              <div className="num mt-2 text-2xl font-bold text-ink">{s.value}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabel manifest */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-9" withText={false} />
            <div>
              <div className="text-[13px] font-bold text-ink">{COMPANY_INFO.legalName}</div>
              <div className="text-[11px] text-muted">{COMPANY_INFO.skIzin}</div>
            </div>
          </div>
          <div className="flex gap-6">
            <KeyValue label="Rombongan">{group.code}</KeyValue>
            <KeyValue label="Status">{group.status}</KeyValue>
          </div>
        </div>
        <div className="overflow-x-auto border-t border-line">
          <table className="table min-w-[860px]">
            <thead>
              <tr>
                <th className="w-12">No</th>
                <th>Nama (sesuai paspor)</th>
                <th>No. paspor</th>
                <th>Tgl lahir</th>
                <th>Exp paspor</th>
                <th>Visa</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {pax.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Plane} title="Belum ada jamaah di kloter ini" />
                  </td>
                </tr>
              ) : (
                pax.map((j, i) => (
                  <tr key={j.id}>
                    <td className="num text-muted">{i + 1}</td>
                    <td className="font-semibold text-ink">{j.fullName}</td>
                    <td className="font-mono text-xs">{j.passportNumber || <span className="text-faint italic">belum ada</span>}</td>
                    <td className="text-muted">{j.birthDate || '-'}</td>
                    <td className="font-mono text-xs text-muted">{j.passportExpiryDate || '-'}</td>
                    <td>
                      <Badge tone={visaTone(j.visaStatus)}>{j.visaStatus}</Badge>
                    </td>
                    <td className="font-mono text-xs text-muted">{j.phoneWhatsapp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
