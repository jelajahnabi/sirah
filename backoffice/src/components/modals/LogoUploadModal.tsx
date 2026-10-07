import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Modal, cx, readFileAsDataUrl } from '../ui';
import { ImageUp, Info, Trash2, Upload } from 'lucide-react';

export const LogoUploadModal: React.FC = () => {
  const { isLogoModalOpen, setIsLogoModalOpen, customLogo, setCustomLogo } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const close = () => {
    setPreview(null);
    setIsLogoModalOpen(false);
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon unggah file gambar (PNG, JPG, SVG, WebP).');
      return;
    }
    setPreview(await readFileAsDataUrl(file));
  };

  const active = preview || customLogo;

  return (
    <Modal
      open={isLogoModalOpen}
      onClose={close}
      title="Logo travel"
      description="Dipakai di sidebar, kwitansi PDF, ID card, manifest, dan label koper."
      icon={ImageUp}
      footer={
        <>
          {customLogo && (
            <Button
              variant="danger"
              icon={Trash2}
              className="mr-auto"
              onClick={() => {
                setCustomLogo(null);
                setPreview(null);
              }}
            >
              Hapus logo
            </Button>
          )}
          <Button variant="ghost" onClick={close}>
            Batal
          </Button>
          <Button
            variant="primary"
            disabled={!preview}
            onClick={() => {
              if (preview) setCustomLogo(preview);
              close();
            }}
          >
            Simpan Logo
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => input.current?.click()}
          className={cx(
            'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
            drag ? 'border-accent bg-accent/5' : 'border-line-strong hover:border-accent'
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Upload className="size-5" />
          </span>
          <span className="text-sm font-semibold text-ink">Klik atau seret file logo ke sini</span>
          <span className="text-xs text-muted">PNG transparan, JPG, SVG, atau WebP · maks. 5 MB</span>
        </div>

        {active && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#e4e6e0] bg-white p-4 text-center">
              <div className="mb-2 text-[11px] text-[#9a9fa5]">Latar terang</div>
              <img src={active} alt="Pratinjau logo" className="mx-auto h-14 max-w-full object-contain" />
            </div>
            <div className="rounded-2xl bg-[#15171a] p-4 text-center">
              <div className="mb-2 text-[11px] text-white/50">Latar gelap</div>
              <img src={active} alt="Pratinjau logo" className="mx-auto h-14 max-w-full object-contain" />
            </div>
          </div>
        )}

        <div className="flex items-start gap-2.5 rounded-2xl bg-subtle p-3.5 text-xs text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" />
          Logo tersimpan di browser ini dan langsung dipakai di seluruh dokumen yang dicetak.
        </div>
      </div>
    </Modal>
  );
};
