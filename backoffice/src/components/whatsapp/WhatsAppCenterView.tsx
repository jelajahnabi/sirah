import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { formatRupiah, formatDateIndo, buildWaLink } from '../../utils/formatters';
import {
  MessageSquareQuote,
  Send,
  Users,
  Copy,
  Check,
  PhoneCall,
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: 'Pendaftaran' | 'Manasik' | 'Pembayaran' | 'Koper' | 'Penerbangan';
  generate: (jamaahName: string, packageName: string, details?: any) => string;
}

export const WhatsAppCenterView: React.FC = () => {
  const { jamaahList, packages, theme } = useApp();

  const isDark = theme === 'dark';
  const [selectedJamaahId, setSelectedJamaahId] = useState<string>(
    jamaahList[0]?.id || ''
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-manasik');
  const [customAddon, setCustomAddon] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedJamaah =
    jamaahList.find((j) => j.id === selectedJamaahId) || jamaahList[0];
  const selectedPackage = packages.find((p) => p.id === selectedJamaah?.packageId);

  const templates: Template[] = [
    {
      id: 'tpl-reg',
      title: '1. Konfirmasi Booking Seat & DP',
      category: 'Pendaftaran',
      generate: (name, pkgName) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nTerima kasih atas kepercayaannya mendaftar umroh bersama *${COMPANY_INFO.legalName}*.\n\n*DATA PENDAFTARAN RESMI:*\n• Nama Jamaah: ${name}\n• Paket Umroh: ${pkgName}\n• Tanggal Berangkat: ${selectedJamaah?.departureDate || '-'}\n• Status Booking: Terverifikasi di Sistem MKB Travel\n\nRekening Resmi Pembayaran:\n*Bank Syariah Indonesia (BSI)*: ${COMPANY_INFO.bankAccounts[0].accountNumber} a.n. *${COMPANY_INFO.bankAccounts[0].accountName}*\n\nJika ada pertanyaan dapat menghubungi CS kami di ${COMPANY_INFO.whatsappDisplay} atau kantor kami di Jl. Bener No.79 Yogyakarta.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`,
    },
    {
      id: 'tpl-manasik',
      title: '2. Undangan Manasik Umroh Yogyakarta',
      category: 'Manasik',
      generate: (name, pkgName) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}* yang dirahmati Allah,\n\nMenjelang keberangkatan ibadah umroh *${pkgName}*, kami mengundang Bapak/Ibu untuk menghadiri *Bimbingan Manasik Umroh Teori & Praktek*:\n\n📅 Hari/Tanggal: Ahad, 25 Oktober 2026\n⏰ Waktu: Pukul 08.00 WIB s/d Selesai\n📍 Lokasi: Kantor MKB Travel, Jl. Bener No.79 Bener, Kec. Tegalrejo, Kota Yogyakarta\n👔 Pakaian: Pria (Kain Ihram latihan), Wanita (Gamis syar'i)\n\nAgenda: Simulasi thawaf, sa'i, dzikir, serta pengarahan bagasi & handling bandara. Kehadiran Bapak/Ibu sangat diharapkan demi kesempurnaan ibadah mabrur.\n\nKonfirmasi: Reply pesan ini atau WA ${COMPANY_INFO.whatsappDisplay}.`,
    },
    {
      id: 'tpl-payment',
      title: '3. Pengingat Pelunasan Tagihan Umroh',
      category: 'Pembayaran',
      generate: (name, pkgName) => {
        const balance = selectedJamaah
          ? selectedJamaah.totalCost - selectedJamaah.amountPaid
          : 0;
        return `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nSemoga senantiasa dalam lindungan Allah SWT.\n\nKami dari Divisi Keuangan *${COMPANY_INFO.legalName}* menginformasikan status pelunasan paket *${pkgName}*:\n\n*Rincian Pembayaran:*\n• Total Biaya: ${formatRupiah(selectedJamaah?.totalCost || 0)}\n• Terbayar: ${formatRupiah(selectedJamaah?.amountPaid || 0)}\n• *Sisa Tagihan: ${formatRupiah(balance)}*\n\nTransfer melalui rekening resmi:\n*Bank Syariah Indonesia (BSI)*: ${COMPANY_INFO.bankAccounts[0].accountNumber} a.n. *${COMPANY_INFO.bankAccounts[0].accountName}*\n\nMohon mengirimkan bukti transfer via chat ini. Jazakumullah Khairan Katsiran.`;
      },
    },
    {
      id: 'tpl-koper',
      title: '4. Pengambilan Koper & Perlengkapan',
      category: 'Koper',
      generate: (name, pkgName) =>
        `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${name}*,\n\nKabar gembira! Paket perlengkapan umroh eksklusif MKB Travel untuk Anda telah siap:\n\n🎒 *Perlengkapan yang Disiapkan:*\n1. Koper Bagasi 24 Inch & Koper Kabin 20 Inch\n2. Kain Ihram / Mukena & Seragam Batik MKB\n3. Buku Saku Doa & ID Card Jamaah\n\n📍 *Lokasi Pengambilan:*\nKantor MKB Travel, Jl. Bener No.79 Bener, Tegalrejo, Kota Yogyakarta (08.30 - 16.30 WIB)\n\nBagi jamaah luar kota DIY yang menghendaki pengiriman ekspedisi, mohon konfirmasi alamat pengiriman. Terima kasih.`,
    },
  ];

  const currentTpl =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const generatedMessage =
    currentTpl.generate(
      selectedJamaah?.fullName || 'Bpk/Ibu Jamaah',
      selectedPackage?.name || 'Paket Umroh MKB'
    ) + (customAddon ? `\n\n*Catatan Tambahan:*\n${customAddon}` : '');

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDirect = () => {
    if (!selectedJamaah) return;
    const link = buildWaLink(selectedJamaah.phoneWhatsapp, generatedMessage);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e8e5dc] text-[#23211e]'
        }`}
      >
        <div>
          <h2 className="text-base font-bold">
            Pusat Pesan &amp; WhatsApp Follow-Up
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Template pesan otomatis konfirmasi pendaftaran, manasik, dan pelunasan koper.
          </p>
        </div>

        <a
          href="https://wa.me/6281328313731"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244]/10 text-[#f27244] border border-[#f27244]/30 rounded-lg text-xs font-semibold hover:bg-[#f27244]/20 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Hotline: 081328313731</span>
        </a>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selection & Recipient */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recipient Picker */}
          <div
            className={`p-4 rounded-xl border space-y-2 transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <label className="block text-xs font-bold">
              Pilih Jamaah Tujuan:
            </label>
            <select
              value={selectedJamaahId}
              onChange={(e) => setSelectedJamaahId(e.target.value)}
              className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                  : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
              }`}
            >
              {jamaahList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.fullName} ({j.phoneWhatsapp})
                </option>
              ))}
            </select>
          </div>

          {/* Templates list */}
          <div
            className={`p-4 rounded-xl border space-y-2 transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <div className="text-xs font-bold mb-2">
              Pilih Format Template:
            </div>
            <div className="space-y-1.5">
              {templates.map((tpl) => {
                const isActive = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between border ${
                      isActive
                        ? isDark
                          ? 'bg-[#2d1e18] text-[#f27244] font-semibold border-[#482c22]'
                          : 'bg-[#fff0eb] text-[#e06336] font-semibold border-[#ffccba]'
                        : isDark
                        ? 'bg-[#1a1918] text-[#a6a39b] hover:text-[#f4f3ef] border-[#2d2c29]'
                        : 'bg-[#faf9f6] text-[#6b6760] hover:text-[#23211e] border-[#eeece6]'
                    }`}
                  >
                    <span>{tpl.title}</span>
                    <span className="text-[10px] opacity-70">
                      {tpl.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom text */}
          <div
            className={`p-4 rounded-xl border space-y-2 transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <label className="block text-xs font-bold">
              Catatan Tambahan (Opsional):
            </label>
            <textarea
              rows={2}
              value={customAddon}
              onChange={(e) => setCustomAddon(e.target.value)}
              placeholder="Contoh: Titipan obat pribadi mohon disiapkan."
              className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                isDark
                  ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                  : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
              }`}
            />
          </div>
        </div>

        {/* Right Column: Live Message Preview */}
        <div
          className={`lg:col-span-7 p-6 rounded-xl border flex flex-col justify-between transition-colors ${
            isDark
              ? 'bg-[#22211f] border-[#33312e]'
              : 'bg-white border-[#e8e5dc]'
          }`}
        >
          <div>
            <div
              className={`flex items-center justify-between pb-3 border-b mb-4 ${
                isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-[#f27244]" />
                <h3 className="text-sm font-bold">
                  Pratinjau Format WhatsApp
                </h3>
              </div>
              <span className="text-xs text-[#f27244] font-mono font-bold">
                {selectedJamaah?.phoneWhatsapp}
              </span>
            </div>

            {/* Bubble simulation */}
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? 'bg-[#181716] border-[#2d2c29]'
                  : 'bg-[#f7f6f2] border-[#e8e5dc]'
              }`}
            >
              <div
                className={`p-4 rounded-lg text-xs font-sans whitespace-pre-line leading-relaxed border-l-4 border-[#f27244] ${
                  isDark
                    ? 'bg-[#22211f] text-[#f4f3ef]'
                    : 'bg-white text-[#23211e] shadow-2xs'
                }`}
              >
                {generatedMessage}
              </div>
            </div>
          </div>

          {/* Action Send / Copy Buttons */}
          <div
            className={`mt-6 pt-4 border-t flex items-center justify-between ${
              isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
            }`}
          >
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                isDark
                  ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#383633]'
                  : 'bg-[#f7f6f2] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendDirect}
              className="flex items-center gap-2 px-5 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Buka WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
