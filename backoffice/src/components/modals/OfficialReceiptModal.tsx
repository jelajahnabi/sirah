import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import { formatRupiah, formatDateIndo, terbilangRupiah, buildWaLink, downloadReceiptPdf } from '../../utils/formatters';
import { Button, Modal } from '../ui';
import { Check, Download, MessageCircle, Pencil, Receipt } from 'lucide-react';

export const OfficialReceiptModal: React.FC = () => {
  const { receiptModalTx } = useApp();
  if (!receiptModalTx) return null;
  return <ReceiptView key={receiptModalTx.id} tx={receiptModalTx} />;
};

const ReceiptView: React.FC<{ tx: PaymentTransaction }> = ({ tx }) => {
  const { setReceiptModalTx, jamaahList, customLogo, signatoryStaffName, setSignatoryStaffName } = useApp();
  const [downloaded, setDownloaded] = useState(false);
  const [signer, setSigner] = useState(signatoryStaffName);
  const [editing, setEditing] = useState(false);
  const jamaah = jamaahList.find((j) => j.id === tx.jamaahId);
  const close = () => setReceiptModalTx(null);

  const pdf = () => {
    downloadReceiptPdf(tx, COMPANY_INFO, customLogo, signer);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const sendWa = () => {
    if (!jamaah) return;
    const msg = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${tx.jamaahName}*,\n\nBerikut bukti tanda terima pembayaran resmi dari *${COMPANY_INFO.legalName}*:\n\n*KWITANSI PEMBAYARAN RESMI*\n• No. Kwitansi: *${tx.receiptNumber}*\n• Tanggal: ${formatDateIndo(tx.paymentDate)}\n• Diterima Sejumlah: *${formatRupiah(tx.amount)}*\n• Terbilang: _${terbilangRupiah(tx.amount)}_\n• Untuk Pembayaran: ${tx.paymentType} (${tx.packageName})\n• Metode: ${tx.paymentMethod}\n• Status: *TERVERIFIKASI SAH*\n\nTerima kasih atas kepercayaan Bapak/Ibu. Hubungi WhatsApp: ${COMPANY_INFO.whatsappDisplay}.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;
    window.open(buildWaLink(jamaah.phoneWhatsapp, msg), '_blank');
  };

  const rows: [string, React.ReactNode][] = [
    ['Telah terima dari', <strong className="uppercase">{tx.jamaahName}</strong>],
    ['Untuk pembayaran', `${tx.paymentType} — ${tx.packageName}`],
    ['Metode', tx.paymentMethod],
    ['No. invoice', <span className="font-mono">{tx.invoiceNumber}</span>],
  ];

  return (
    <Modal
      open
      onClose={close}
      title="Kwitansi pembayaran"
      description={<span className="font-mono">{tx.receiptNumber}</span>}
      icon={Receipt}
      size="lg"
      footer={
        <>
          <span className="mr-auto text-xs text-muted">PDF mengikuti format kwitansi resmi.</span>
          <Button icon={MessageCircle} onClick={sendWa} disabled={!jamaah}>
            Kirim WA
          </Button>
          <Button variant="primary" icon={downloaded ? Check : Download} onClick={pdf}>
            {downloaded ? 'PDF terunduh' : 'Export PDF'}
          </Button>
        </>
      }
    >
      {/* Pratinjau kwitansi (selalu terang, seperti kertas) */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white text-[#15171a]">
        <div className="flex items-center justify-between gap-4 border-b border-[#e4e6e0] p-5">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-10" withText={false} />
            <div>
              <div className="text-[13px] font-extrabold">{COMPANY_INFO.legalName}</div>
              <div className="text-[11px] text-[#676c72]">{COMPANY_INFO.skIzin} · Yogyakarta</div>
            </div>
          </div>
          <span className="rounded-full bg-[#15171a] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">Kwitansi</span>
        </div>

        <dl className="space-y-2.5 p-5 text-[13px]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-3">
              <dt className="text-[#676c72]">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div className="mt-3 rounded-xl bg-[#f6f7f3] p-3 font-serif text-[13px] italic">
            Terbilang: <strong>{terbilangRupiah(tx.amount)}</strong>
          </div>
        </dl>

        <div className="flex flex-col gap-4 border-t border-[#e4e6e0] p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] tracking-wider text-[#9a9fa5] uppercase">Jumlah</div>
            <div className="num text-[28px] leading-tight font-bold text-[#dc5726]">{formatRupiah(tx.amount)}</div>
          </div>
          <div className="text-right text-xs">
            <div className="text-[#676c72]">Yogyakarta, {formatDateIndo(tx.paymentDate)}</div>
            {editing ? (
              <div className="mt-2 flex items-center justify-end gap-1.5">
                <input
                  className="h-8 rounded-lg border border-[#d3d6ce] px-2 text-xs font-semibold"
                  value={signer}
                  onChange={(e) => setSigner(e.target.value)}
                  autoFocus
                />
                <button
                  className="h-8 rounded-lg bg-[#15171a] px-3 text-[11px] font-bold text-white"
                  onClick={() => {
                    setEditing(false);
                    setSignatoryStaffName(signer);
                  }}
                >
                  Simpan
                </button>
              </div>
            ) : (
              <div className="mt-8 flex items-center justify-end gap-1.5">
                <span className="border-t border-[#15171a] pt-1 font-semibold">{signer}</span>
                <button className="text-[#9a9fa5] hover:text-[#15171a]" title="Ganti penandatangan" onClick={() => setEditing(true)}>
                  <Pencil className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
