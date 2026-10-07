import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import { X, Printer, QrCode } from 'lucide-react';

export const IdCardPrintModal: React.FC = () => {
  const { idCardJamaah, setIdCardJamaah, packages } = useApp();

  if (!idCardJamaah) return null;

  const pkg = packages.find((p) => p.id === idCardJamaah.packageId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div className="bg-[#22211f] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#33312e] print:shadow-none print:border-none print:p-0 my-6 text-[#f4f3ef]">
        {/* Controls */}
        <div className="print:hidden flex items-center justify-between pb-3 border-b border-[#2d2c29] mb-4">
          <div className="text-xs font-bold text-[#f4f3ef]">
            Pratinjau ID Card Jamaah (Lanyard)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={() => setIdCardJamaah(null)}
              className="p-1 text-[#737069] hover:text-[#f4f3ef]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable ID Card Body (Vertical Badge 8.5 x 12.5 cm style) */}
        <div className="w-72 mx-auto bg-white rounded-2xl border-2 border-[#1c1917] shadow-lg overflow-hidden text-center text-slate-900 font-sans print:shadow-none">
          {/* Top Bar with Brand */}
          <div className="bg-[#1c1917] text-white p-3.5 pb-3">
            <div className="flex justify-center mb-1">
              <BrandLogo className="h-7" showUploadPrompt={false} />
            </div>
            <p className="text-[8px] text-[#f27244] font-medium tracking-wide">
              PPIU Kemenhaj RI No. 9120008391024 · Yogyakarta
            </p>
          </div>

          {/* Photo & Identity Section */}
          <div className="p-4 pt-3 bg-white space-y-2">
            {/* Avatar Photo Frame */}
            <div className="w-20 h-24 mx-auto rounded-lg bg-slate-100 border-2 border-[#1c1917] flex flex-col items-center justify-center text-slate-400 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">FOTO</span>
              <span className="text-[8px] text-slate-400">JAMAAH</span>
            </div>

            <div>
              <div className="text-[10px] text-[#f27244] font-semibold uppercase">
                JAMAAH UMROH RESMI
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase leading-snug px-2">
                {idCardJamaah.fullName}
              </h2>
            </div>

            {/* Passport & Phone */}
            <div className="py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono">
              Paspor: <strong className="text-slate-900">{idCardJamaah.passportNumber || '-'}</strong>
            </div>

            {/* Program & Hotels */}
            <div className="text-left text-[10px] space-y-1 p-2.5 rounded-lg bg-orange-50/60 border border-orange-100 text-slate-800">
              <div>
                Program: <strong>{pkg ? pkg.name : 'Umroh MKB'}</strong>
              </div>
              <div>
                Hotel Makkah: <strong>{pkg ? pkg.makkahHotel : 'Emaar Grand'}</strong>
              </div>
              <div>
                Hotel Madinah: <strong>{pkg ? pkg.madinahHotel : 'Rove Madinah'}</strong>
              </div>
            </div>

            {/* QR Code */}
            <div className="pt-1 flex flex-col items-center">
              <div className="w-14 h-14 bg-slate-50 border border-slate-300 p-1 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <span className="text-[8px] font-mono text-slate-500 mt-1">
                DOKUMEN KEMENHAJ RI
              </span>
            </div>

            {/* Emergency Hotline Footer */}
            <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-600">
              <div>Kontak TL: <strong>{COMPANY_INFO.whatsappDisplay}</strong></div>
              <div>Jl. Bener No.79, Tegalrejo, Kota Yogyakarta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
