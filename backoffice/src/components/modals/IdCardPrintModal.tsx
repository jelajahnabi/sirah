import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import { Button, Modal } from '../ui';
import { IdCard, Printer, QrCode } from 'lucide-react';

export const IdCardPrintModal: React.FC = () => {
  const { idCardJamaah: j, setIdCardJamaah, packages } = useApp();
  if (!j) return null;
  const pkg = packages.find((p) => p.id === j.packageId);
  const c = pkg?.kanbanColors.accent || '#f26b3a';
  const close = () => setIdCardJamaah(null);

  return (
    <Modal
      open
      onClose={close}
      title="ID card jamaah"
      description="Kartu lanyard ukuran ±8,5 × 12,5 cm"
      icon={IdCard}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Tutup
          </Button>
          <Button variant="primary" icon={Printer} onClick={() => window.print()}>
            Cetak
          </Button>
        </>
      }
    >
      <div className="print-area mx-auto w-72 overflow-hidden rounded-3xl border border-[#d3d6ce] bg-white text-center text-[#15171a] shadow-xl">
        <div className="relative overflow-hidden bg-[#15171a] px-4 pt-5 pb-10 text-white">
          <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-50 blur-2xl" style={{ backgroundColor: c }} />
          <div className="relative flex justify-center">
            <BrandLogo className="h-8" inverted />
          </div>
          <p className="relative mt-2 text-[9px] tracking-wide text-white/60">{COMPANY_INFO.skIzin}</p>
        </div>

        <div className="-mt-8 space-y-3 px-5 pb-5">
          <div className="mx-auto flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-4 border-white bg-[#f1f2ee] text-[#9a9fa5] shadow">
            <span className="text-[10px] font-bold">FOTO</span>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: c }}>
              Jamaah umroh
            </div>
            <h2 className="mt-1 text-[15px] leading-snug font-extrabold uppercase">{j.fullName}</h2>
          </div>
          <div className="rounded-xl bg-[#f6f7f3] py-1.5 font-mono text-[11px]">
            Paspor <strong>{j.passportNumber || '—'}</strong>
          </div>
          <div className="space-y-1 rounded-xl border border-[#e4e6e0] p-3 text-left text-[10px]">
            <div>
              <span className="text-[#676c72]">Program</span> <strong className="block">{pkg?.name || 'Umroh MKB'}</strong>
            </div>
            <div>
              <span className="text-[#676c72]">Makkah</span> <strong>{pkg?.makkahHotel || '-'}</strong>
            </div>
            <div>
              <span className="text-[#676c72]">Madinah</span> <strong>{pkg?.madinahHotel || '-'}</strong>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-[#e4e6e0] pt-3 text-left text-[9px] text-[#676c72]">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[#d3d6ce]">
              <QrCode className="size-9 text-[#15171a]" />
            </span>
            <div>
              <div>
                Kontak TL: <strong className="text-[#15171a]">{COMPANY_INFO.whatsappDisplay}</strong>
              </div>
              <div>Jl. Bener No.79, Tegalrejo, Yogyakarta</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
