import React from 'react';
import { useApp } from '../context/AppContext';
import { cx } from './ui';

/** Logo travel: memakai logo unggahan bila ada, selain itu lockup tipografi. */
export const BrandLogo: React.FC<{
  className?: string;
  /** Tampilkan teks nama di samping ikon (lockup default). */
  withText?: boolean;
  /** Paksa warna terang (untuk header gelap pada dokumen cetak). */
  inverted?: boolean;
  onClick?: () => void;
}> = ({ className = 'h-9', withText = true, inverted, onClick }) => {
  const { customLogo } = useApp();

  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt="Logo PT Mudahkebaitullah Travel Indonesia"
        onClick={onClick}
        className={cx(className, 'w-auto max-w-[180px] object-contain', onClick && 'cursor-pointer')}
      />
    );
  }

  return (
    <div className={cx('flex items-center gap-2.5 select-none', onClick && 'cursor-pointer')} onClick={onClick}>
      <BrandMark className={className} />
      {withText && (
        <div className="leading-none">
          <div className={cx('text-[13px] font-extrabold tracking-tight', inverted ? 'text-white' : 'text-ink')}>
            MudahKeBaitullah
          </div>
          <div className={cx('mt-1 text-[10px] font-semibold tracking-[0.14em] uppercase', inverted ? 'text-white/60' : 'text-faint')}>
            Travel Indonesia
          </div>
        </div>
      )}
    </div>
  );
};

/** Ikon ka'bah sederhana dalam kotak membulat. */
export const BrandMark: React.FC<{ className?: string }> = ({ className = 'h-9' }) => (
  <span className={cx('flex aspect-square shrink-0 items-center justify-center rounded-xl bg-accent text-white', className)}>
    <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" aria-hidden="true">
      <path d="M4 8.5 12 5l8 3.5v9L12 21l-8-3.5v-9Z" fill="currentColor" opacity=".25" />
      <path d="M4 8.5 12 12l8-3.5M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 8.5 12 5l8 3.5v9L12 21l-8-3.5v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 11.2 12 14.7l8-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  </span>
);
