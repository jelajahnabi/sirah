import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import {
  formatRupiah,
  formatDateIndo,
  terbilangRupiah,
  buildWaLink,
  downloadReceiptPdf,
} from '../../utils/formatters';
import { X, Download, PhoneCall, Check, FileText } from 'lucide-react';

export const OfficialReceiptModal: React.FC = () => {
  const {
    receiptModalTx,
    setReceiptModalTx,
    jamaahList,
    customLogo,
    theme,
    signatoryStaffName,
    setSignatoryStaffName,
  } = useApp();
  const [downloaded, setDownloaded] = useState(false);
  const [signerName, setSignerName] = useState(signatoryStaffName || 'Umi Kalsum (Finance MKB)');
  const [isEditingSigner, setIsEditingSigner] = useState(false);

  if (!receiptModalTx) return null;

  const isDark = theme === 'dark';
  const jamaah = jamaahList.find((j) => j.id === receiptModalTx.jamaahId);

  const handleDownloadPdf = () => {
    downloadReceiptPdf(receiptModalTx, COMPANY_INFO, customLogo, signerName);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleSendWa = () => {
    if (!jamaah) return;
    const msg = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${receiptModalTx.jamaahName}*,\n\nBerikut bukti tanda terima pembayaran resmi dari *${COMPANY_INFO.legalName}*:\n\n*KWITANSI PEMBAYARAN RESMI*\n• No. Kwitansi: *${receiptModalTx.receiptNumber}*\n• Tanggal: ${formatDateIndo(receiptModalTx.paymentDate)}\n• Diterima Sejumlah: *${formatRupiah(receiptModalTx.amount)}*\n• Terbilang: _${terbilangRupiah(receiptModalTx.amount)}_\n• Untuk Pembayaran: ${receiptModalTx.paymentType} (${receiptModalTx.packageName})\n• Metode: ${receiptModalTx.paymentMethod}\n• Status: *TERVERIFIKASI SAH*\n\nTerima kasih atas kepercayaan Bapak/Ibu. Hubungi WhatsApp: ${COMPANY_INFO.whatsappDisplay}.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;

    window.open(buildWaLink(jamaah.phoneWhatsapp, msg), '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border my-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e2dfd7] text-[#23211e]'
        }`}
      >
        {/* Top Controls */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div>
            <h2 className="text-sm font-bold">
              Kuitansi Pembayaran Digital
            </h2>
            <p
              className={`text-xs ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              Nomor: <strong className="font-mono text-[#f27244]">{receiptModalTx.receiptNumber}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendWa}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark
                  ? 'bg-[#2a2926] hover:bg-[#343330] text-[#d6d3cb] border-[#383633]'
                  : 'bg-[#f7f6f2] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#f27244]" />
              <span>Kirim WA</span>
            </button>

            {/* Direct PDF Export */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>PDF Terunduh</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setReceiptModalTx(null)}
              className={`p-1.5 rounded-md transition-colors ${
                isDark
                  ? 'text-[#737069] hover:text-[#f4f3ef]'
                  : 'text-[#9c988f] hover:text-[#23211e]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Receipt Preview Card */}
        <div
          className={`border rounded-xl p-5 space-y-4 text-xs transition-colors ${
            isDark
              ? 'border-[#33312e] bg-[#1a1918]'
              : 'border-[#e8e5dc] bg-[#faf9f6]'
          }`}
        >
          {/* Header with Brand Logo */}
          <div
            className={`border-b pb-3 flex items-center justify-between ${
              isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <BrandLogo className="h-8" showUploadPrompt={false} />
              <div>
                <div className="font-extrabold text-xs tracking-wide">
                  {COMPANY_INFO.legalName}
                </div>
                <div
                  className={`text-[10px] mt-0.5 ${
                    isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                  }`}
                >
                  PPIU Kemenhaj RI: {COMPANY_INFO.skIzin} · Yogyakarta
                </div>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-[#2d1e18] text-[#f27244] border-[#482c22]'
                    : 'bg-[#fff0eb] text-[#e06336] border-[#ffd6c7]'
                }`}
              >
                KWITANSI RESMI
              </span>
            </div>
          </div>

          {/* Details */}
          <div
            className={`space-y-2.5 ${
              isDark ? 'text-[#d6d3cb]' : 'text-[#3d3a35]'
            }`}
          >
            <div className="flex">
              <span
                className={`w-32 font-medium shrink-0 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                Telah Terima Dari:
              </span>
              <span className="font-bold uppercase">: {receiptModalTx.jamaahName}</span>
            </div>
            <div className="flex">
              <span
                className={`w-32 font-medium shrink-0 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                Untuk Pembayaran:
              </span>
              <span className="font-medium">: {receiptModalTx.paymentType} - {receiptModalTx.packageName}</span>
            </div>
            <div className="flex">
              <span
                className={`w-32 font-medium shrink-0 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                Metode Bayar:
              </span>
              <span className="font-mono">: {receiptModalTx.paymentMethod}</span>
            </div>

            {/* Terbilang Box */}
            <div
              className={`p-3 rounded-lg border italic font-serif mt-2 ${
                isDark
                  ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                  : 'bg-white border-[#e0ddd4] text-[#1e1d1b]'
              }`}
            >
              Terbilang: <strong>{terbilangRupiah(receiptModalTx.amount)}</strong>
            </div>
          </div>

          {/* Bottom Bar: Amount in Myriad Bold & Verification */}
          <div
            className={`pt-3 border-t flex items-center justify-between ${
              isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
            }`}
          >
            <div>
              <span
                className={`text-[9px] uppercase font-semibold block ${
                  isDark ? 'text-[#8c8982]' : 'text-[#737069]'
                }`}
              >
                Nominal Pembayaran (Myriad Bold)
              </span>
              <div className="text-xl font-bold font-price-myriad text-[#f27244]">
                {formatRupiah(receiptModalTx.amount)}
              </div>
            </div>

            <div
              className={`text-right text-[11px] ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              <div>Yogyakarta, {formatDateIndo(receiptModalTx.paymentDate)}</div>
              <div className="mt-0.5">
                {isEditingSigner ? (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className={`p-1 text-[11px] rounded border font-semibold ${
                        isDark ? 'bg-[#22211f] border-[#383633] text-[#f4f3ef]' : 'bg-white border-[#dedbd2] text-[#23211e]'
                      }`}
                      placeholder="Nama staf penandatangan"
                    />
                    <button
                      onClick={() => {
                        setIsEditingSigner(false);
                        setSignatoryStaffName(signerName);
                      }}
                      className="px-2 py-1 bg-[#f27244] text-white rounded text-[10px] font-bold"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1.5">
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                      }`}
                    >
                      Tanda Tangan: <strong>{signerName}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingSigner(true)}
                      className="text-[10px] text-[#f27244] hover:underline"
                    >
                      (Ganti)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div
          className={`flex items-center justify-between text-[11px] pt-1 ${
            isDark ? 'text-[#737069]' : 'text-[#8c8982]'
          }`}
        >
          <span>Kuitansi diekspor langsung ke format PDF resmi sesuai standar Kemenhaj.</span>
          <button
            onClick={() => setReceiptModalTx(null)}
            className={`text-xs font-medium transition-colors ${
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
