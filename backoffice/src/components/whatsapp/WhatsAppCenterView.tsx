import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatRupiah, buildWaLink } from '../../utils/formatters';
import { Avatar, Badge, Button, Card, CardHeader, PageHeader, cx } from '../ui';
import { Check, Copy, MessageCircle, PhoneCall, Send } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: 'Pendaftaran' | 'Manasik' | 'Pembayaran' | 'Koper';
  generate: (name: string, pkgName: string) => string;
}

export const WhatsAppCenterView: React.FC = () => {
  const { jamaahList, packages } = useApp();
  const [jamaahId, setJamaahId] = useState(jamaahList[0]?.id || '');
  const [templateId, setTemplateId] = useState('tpl-manasik');
  const [addon, setAddon] = useState('');
  const [copied, setCopied] = useState(false);

  const jamaah = jamaahList.find((j) => j.id === jamaahId) || jamaahList[0];
  const pkg = packages.find((p) => p.id === jamaah?.packageId);
  const bank = COMPANY_INFO.bankAccounts[0];

  const templates: Template[] = [
    {
      id: 'tpl-reg',
      title: 'Konfirmasi booking seat & DP',
      category: 'Pendaftaran',
      generate: (name, pkgName) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nTerima kasih atas kepercayaannya mendaftar umroh bersama *${COMPANY_INFO.legalName}*.\n\n*DATA PENDAFTARAN RESMI:*\n• Nama Jamaah: ${name}\n• Paket Umroh: ${pkgName}\n• Tanggal Berangkat: ${jamaah?.departureDate || '-'}\n• Status Booking: Terverifikasi di Sistem MKB Travel\n\nRekening Resmi Pembayaran:\n*${bank.bank}*: ${bank.accountNumber} a.n. *${bank.accountName}*\n\nJika ada pertanyaan dapat menghubungi CS kami di ${COMPANY_INFO.whatsappDisplay} atau kantor kami di Jl. Bener No.79 Yogyakarta.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`,
    },
    {
      id: 'tpl-manasik',
      title: 'Undangan manasik umroh',
      category: 'Manasik',
      generate: (name, pkgName) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}* yang dirahmati Allah,\n\nMenjelang keberangkatan ibadah umroh *${pkgName}*, kami mengundang Bapak/Ibu untuk menghadiri *Bimbingan Manasik Umroh Teori & Praktek*:\n\n📅 Hari/Tanggal: Ahad, 25 Oktober 2026\n⏰ Waktu: Pukul 08.00 WIB s/d Selesai\n📍 Lokasi: Kantor MKB Travel, Jl. Bener No.79 Bener, Kec. Tegalrejo, Kota Yogyakarta\n👔 Pakaian: Pria (Kain Ihram latihan), Wanita (Gamis syar'i)\n\nAgenda: Simulasi thawaf, sa'i, dzikir, serta pengarahan bagasi & handling bandara. Kehadiran Bapak/Ibu sangat diharapkan demi kesempurnaan ibadah mabrur.\n\nKonfirmasi: Reply pesan ini atau WA ${COMPANY_INFO.whatsappDisplay}.`,
    },
    {
      id: 'tpl-payment',
      title: 'Pengingat pelunasan',
      category: 'Pembayaran',
      generate: (name, pkgName) => {
        const balance = jamaah ? jamaah.totalCost - jamaah.amountPaid : 0;
        return `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nSemoga senantiasa dalam lindungan Allah SWT.\n\nKami dari Divisi Keuangan *${COMPANY_INFO.legalName}* menginformasikan status pelunasan paket *${pkgName}*:\n\n*Rincian Pembayaran:*\n• Total Biaya: ${formatRupiah(jamaah?.totalCost || 0)}\n• Terbayar: ${formatRupiah(jamaah?.amountPaid || 0)}\n• *Sisa Tagihan: ${formatRupiah(balance)}*\n\nTransfer melalui rekening resmi:\n*${bank.bank}*: ${bank.accountNumber} a.n. *${bank.accountName}*\n\nMohon mengirimkan bukti transfer via chat ini. Jazakumullah Khairan Katsiran.`;
      },
    },
    {
      id: 'tpl-koper',
      title: 'Pengambilan koper & perlengkapan',
      category: 'Koper',
      generate: (name) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nKabar gembira! Paket perlengkapan umroh eksklusif MKB Travel untuk Anda telah siap:\n\n🎒 *Perlengkapan yang Disiapkan:*\n1. Koper Bagasi 24 Inch & Koper Kabin 20 Inch\n2. Kain Ihram / Mukena & Seragam Batik MKB\n3. Buku Saku Doa & ID Card Jamaah\n\n📍 *Lokasi Pengambilan:*\nKantor MKB Travel, Jl. Bener No.79 Bener, Tegalrejo, Kota Yogyakarta (08.30 - 16.30 WIB)\n\nBagi jamaah luar kota DIY yang menghendaki pengiriman ekspedisi, mohon konfirmasi alamat pengiriman. Terima kasih.`,
    },
  ];
  const tpl = templates.find((t) => t.id === templateId) || templates[0];
  const message =
    tpl.generate(jamaah?.fullName || 'Bpk/Ibu Jamaah', pkg?.name || 'Paket Umroh MKB') +
    (addon ? `\n\n*Catatan Tambahan:*\n${addon}` : '');

  const copy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp center"
        description="Template pesan siap kirim: konfirmasi pendaftaran, manasik, pelunasan, dan koper."
        actions={
          <a href={`https://wa.me/62${COMPANY_INFO.whatsapp.slice(1)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <PhoneCall className="size-4" /> {COMPANY_INFO.whatsappDisplay}
          </a>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <Card pad>
            <CardHeader title="1. Penerima" subtitle="Pilih jamaah tujuan" />
            <select className="input mt-4" value={jamaah?.id} onChange={(e) => setJamaahId(e.target.value)}>
              {jamaahList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.fullName} ({j.phoneWhatsapp})
                </option>
              ))}
            </select>
          </Card>

          <Card pad>
            <CardHeader title="2. Template" subtitle="Isi pesan menyesuaikan data jamaah" />
            <div className="mt-4 space-y-2">
              {templates.map((t) => {
                const active = t.id === templateId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={cx(
                      'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors',
                      active ? 'border-ink bg-ink text-canvas' : 'border-line hover:bg-subtle'
                    )}
                  >
                    <span className="text-[13px] font-semibold">{t.title}</span>
                    <span className={cx('text-[11px]', active ? 'text-canvas/70' : 'text-muted')}>{t.category}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card pad>
            <CardHeader title="3. Catatan tambahan" subtitle="Opsional, ditempel di akhir pesan" />
            <textarea
              className="input mt-4"
              rows={3}
              value={addon}
              onChange={(e) => setAddon(e.target.value)}
              placeholder="Contoh: titipan obat pribadi mohon disiapkan."
            />
          </Card>
        </div>

        {/* Pratinjau ala aplikasi chat */}
        <Card className="flex flex-col overflow-hidden lg:col-span-7">
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            {jamaah && <Avatar name={jamaah.fullName} color={pkg?.kanbanColors.accent} />}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold text-ink">{jamaah?.fullName}</div>
              <div className="font-mono text-[11px] text-muted">{jamaah?.phoneWhatsapp}</div>
            </div>
            <Badge tone="success" dot>
              {tpl.category}
            </Badge>
          </div>
          <div
            className="flex-1 bg-subtle p-5 sm:p-6"
            style={{ backgroundImage: 'radial-gradient(color-mix(in srgb, var(--muted) 14%, transparent) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          >
            <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-emerald-50 px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line text-[#16231c] shadow-card dark:bg-emerald-950 dark:text-emerald-50">
              {message}
              <div className="mt-2 text-right text-[10px] text-emerald-700/70 dark:text-emerald-300/60">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-line px-5 py-4">
            <Button icon={copied ? Check : Copy} onClick={copy}>
              {copied ? 'Tersalin' : 'Salin teks'}
            </Button>
            <Button
              variant="accent"
              icon={Send}
              onClick={() => jamaah && window.open(buildWaLink(jamaah.phoneWhatsapp, message), '_blank')}
            >
              Kirim via WhatsApp
            </Button>
          </div>
        </Card>
      </div>

      <p className="flex items-center gap-2 text-xs text-faint">
        <MessageCircle className="size-3.5" /> Tombol kirim membuka WhatsApp Web/aplikasi dengan pesan yang sudah terisi.
      </p>
    </div>
  );
};
