import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import {
  Printer,
  X,
  Truck,
  MapPin,
  Phone,
  User,
  Package,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileText,
} from 'lucide-react';

export const ShippingLabelPrintModal: React.FC = () => {
  const { shippingLabelJamaah, setShippingLabelJamaah, packages, theme } = useApp();
  const isDark = theme === 'dark';

  const [expedition, setExpedition] = useState<'JNE Express' | 'J&T Cargo' | 'SiCepat' | 'Pos Indonesia' | 'Kurir Internal MKB'>('JNE Express');
  const [shippingService, setShippingService] = useState('REG / Cargo Koper');
  const [luggageItems, setLuggageItems] = useState<string[]>([
    'Koper Bagasi 24 Inch (TSA Lock)',
    'Koper Kabin 20 Inch',
    'Kain Ihram / Mukena MKB',
    'Bahan Batik Seragam Resmi',
    'Buku Saku Doa & ID Card Kalung',
    'Tas Selempang Paspor',
  ]);
  const [courierNotes, setCourierNotes] = useState('FRAGILE! PERLENGKAPAN UMROH - JANGAN DIBANTING / JANGAN DITINDIH BENDA BERAT');
  const [customAddress, setCustomAddress] = useState<string>('');

  if (!shippingLabelJamaah) return null;

  const jamaah = shippingLabelJamaah;
  const pkg = packages.find((p) => p.id === jamaah.packageId);

  // Address derived from KTP
  const ktpAddress = customAddress || jamaah.address || `Jl. Malioboro No. 45, RT 02 / RW 04, ${jamaah.city || 'Kota Yogyakarta'}, D.I. Yogyakarta 55271`;

  const handlePrint = () => {
    window.print();
  };

  const toggleLuggageItem = (item: string) => {
    if (luggageItems.includes(item)) {
      setLuggageItems(luggageItems.filter((i) => i !== item));
    } else {
      setLuggageItems([...luggageItems, item]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-3xl w-full p-6 shadow-2xl border my-6 space-y-5 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#dedbd2] text-[#23211e]'
        }`}
      >
        {/* Modal Top Header (Hidden on print) */}
        <div
          className={`flex items-center justify-between pb-3 border-b print:hidden ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f27244]/15 text-[#f27244] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Cetak Label Alamat Pengiriman Koper &amp; Perlengkapan
              </h2>
              <p
                className={`text-xs ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Alamat otomatis diambil dari data KTP jamaah yang terdaftar di sistem.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Label (Print)</span>
            </button>
            <button
              onClick={() => setShippingLabelJamaah(null)}
              className={`p-1.5 rounded-md ${
                isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration settings (Hidden on print) */}
        <div
          className={`p-4 rounded-xl border text-xs space-y-3 print:hidden ${
            isDark ? 'bg-[#1b1a19] border-[#2e2d2a]' : 'bg-[#faf9f6] border-[#e8e5dc]'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium mb-1 opacity-80">Jasa Ekspedisi / Kurir</label>
              <select
                value={expedition}
                onChange={(e) => setExpedition(e.target.value as any)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isDark ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]' : 'bg-white border-[#dedbd2] text-[#23211e]'
                }`}
              >
                <option value="JNE Express">JNE Express (JTR Cargo)</option>
                <option value="J&T Cargo">J&amp;T Cargo</option>
                <option value="SiCepat">SiCepat Cargo / Gokil</option>
                <option value="Pos Indonesia">Pos Indonesia Jumbo</option>
                <option value="Kurir Internal MKB">Kurir Antar Internal MKB</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1 opacity-80">Layanan Paket</label>
              <input
                type="text"
                value={shippingService}
                onChange={(e) => setShippingService(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isDark ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]' : 'bg-white border-[#dedbd2] text-[#23211e]'
                }`}
                placeholder="Contoh: Cargo Koper / REG"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 opacity-80">Instruksi Khusus Kurir</label>
              <input
                type="text"
                value={courierNotes}
                onChange={(e) => setCourierNotes(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isDark ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]' : 'bg-white border-[#dedbd2] text-[#23211e]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 opacity-80">
              Alamat Pengiriman (Default: Alamat KTP - dapat disesuaikan):
            </label>
            <textarea
              rows={2}
              value={ktpAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className={`w-full p-2 rounded-lg border text-xs ${
                isDark ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]' : 'bg-white border-[#dedbd2] text-[#23211e]'
              }`}
              placeholder="Alamat lengkap tujuan pengiriman koper..."
            />
          </div>

          <div>
            <span className="block font-medium mb-1.5 opacity-80">
              Checklist Perlengkapan yang Dikirim dalam Paket Koper:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Koper Bagasi 24 Inch (TSA Lock)',
                'Koper Kabin 20 Inch',
                'Kain Ihram / Mukena MKB',
                'Bahan Batik Seragam Resmi',
                'Buku Saku Doa & ID Card Kalung',
                'Tas Selempang Paspor',
                'Sabuk Ihram Tebal',
              ].map((item) => {
                const selected = luggageItems.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleLuggageItem(item)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                      selected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : isDark
                        ? 'bg-[#242321] border-[#33312e] text-[#737069]'
                        : 'bg-white border-[#dedbd2] text-[#8c8982]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3 h-3 ${selected ? 'text-emerald-500' : 'opacity-30'}`} />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PRINTABLE SHIPPING LABEL (Styled for clean box/luggage sticker) */}
        <div
          id="shipping-label-card"
          className="border-2 border-black bg-white text-black p-6 rounded-lg shadow-sm space-y-4 print:p-0 print:border-2 print:border-black print:shadow-none print:m-0"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-9" showUploadPrompt={false} />
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase leading-tight">
                  {COMPANY_INFO.legalName}
                </h1>
                <p className="text-[10px] text-gray-700">
                  DIVISI LOGISTIK &amp; PERLENGKAPAN UMROH · PPIU {COMPANY_INFO.skIzin}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-black text-white font-mono font-bold text-xs uppercase tracking-wider rounded">
                {expedition}
              </span>
              <div className="text-[10px] font-mono text-gray-700 mt-0.5">
                Layanan: {shippingService}
              </div>
            </div>
          </div>

          {/* Sender & Receiver 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4">
            {/* Sender */}
            <div className="space-y-1 pr-3 border-r border-gray-300">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                PENGIRIM (SENDER):
              </span>
              <div className="font-bold text-xs">{COMPANY_INFO.legalName}</div>
              <div className="text-[11px] leading-snug text-gray-800">
                {COMPANY_INFO.address}
              </div>
              <div className="text-[11px] font-mono font-semibold pt-1">
                Telp / WA: {COMPANY_INFO.whatsappDisplay}
              </div>
            </div>

            {/* Receiver (Jamaah with KTP Address) */}
            <div className="space-y-1 pl-1">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                PENERIMA (CONSIGNEE / JAMAAH):
              </span>
              <div className="font-black text-sm text-black">
                {jamaah.fullName.toUpperCase()}
              </div>
              <div className="text-[11px] font-mono font-bold text-blue-800">
                HP / WhatsApp: {jamaah.phoneWhatsapp}
              </div>
              <div className="text-[10px] text-gray-700">
                NIK KTP: {jamaah.nik || '3471012903820001'}
              </div>
              <div className="text-xs font-semibold leading-snug bg-amber-50 p-2 rounded border border-amber-200 mt-1">
                <span className="font-bold block text-[10px] text-amber-900 uppercase">
                  Alamat KTP Lengkap:
                </span>
                {ktpAddress}
              </div>
            </div>
          </div>

          {/* Package Details & Content Checklist */}
          <div className="grid grid-cols-3 gap-3 border-b-2 border-black pb-3 text-xs">
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block">
                Program Paket Umroh:
              </span>
              <strong className="text-xs text-black block mt-0.5">
                {pkg ? pkg.name : 'Paket Umroh Reguler'}
              </strong>
              <span className="text-[11px] font-mono text-gray-700">
                Tgl Berangkat: {jamaah.departureDate || 'November 2026'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block">
                No. Manifest / Registrasi:
              </span>
              <span className="font-mono font-bold text-xs text-black block mt-0.5">
                MKB-{jamaah.id.toUpperCase()}
              </span>
              <span className="text-[10px] text-gray-700">
                Status: Verified Pax
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-600 uppercase font-bold block">
                Tanggal Pengiriman:
              </span>
              <span className="font-mono font-semibold text-xs text-black">
                {new Date().toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Included Luggage Items */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase mb-1">
              <span>Isi Paket Kiriman Perlengkapan:</span>
              <span className="text-emerald-700 font-mono">
                {luggageItems.length} Item Terverifikasi Lengkap
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px]">
              {luggageItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-medium text-gray-800">
                  <span className="text-emerald-600 font-bold">&#10003;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fragile & Courier Warning Banner */}
          <div className="border-2 border-red-600 bg-red-50 p-2.5 rounded flex items-center justify-between text-red-700">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <div>
                <strong className="text-xs font-black uppercase tracking-wider block">
                  PERHATIAN KURIR:
                </strong>
                <span className="text-[11px] font-semibold leading-tight">
                  {courierNotes}
                </span>
              </div>
            </div>

            <div className="text-center pl-3 border-l border-red-300 shrink-0">
              <div className="text-[9px] uppercase font-bold">KODE LOGISTIK</div>
              <div className="font-mono font-black text-sm">UMR-KPR-01</div>
            </div>
          </div>

          {/* Bottom Bar with Barcode simulation */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-300 text-[10px] text-gray-600">
            <div>
              <span>Dicetak via Backoffice MKB Travel · Surat Jalan Ekspedisi Koper</span>
            </div>
            <div className="font-mono tracking-widest font-bold text-gray-800 text-xs">
              ||| | ||||| || |||||| | |||| ||| ||||
            </div>
          </div>
        </div>

        {/* Footer info (hidden on print) */}
        <div
          className={`flex items-center justify-between text-xs pt-1 print:hidden ${
            isDark ? 'text-[#737069]' : 'text-[#8c8982]'
          }`}
        >
          <span>
            Tempelkan lembar ini pada kardus koper atau tas pelindung koper sebelum diserahkan ke kurir.
          </span>
          <button
            onClick={() => setShippingLabelJamaah(null)}
            className={`font-semibold cursor-pointer ${
              isDark ? 'text-[#a6a39b] hover:text-[#f4f3ef]' : 'text-[#737069] hover:text-[#23211e]'
            }`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
