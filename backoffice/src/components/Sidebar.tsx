import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { NAV_GROUPS } from './nav';
import { cx } from './ui';
import { LogOut, PhoneCall, X } from 'lucide-react';

export const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { currentTab, setCurrentTab, jamaahList, packages, currentUser, logout, setIsLogoModalOpen } = useApp();

  const incomplete = jamaahList.filter((j) => !j.isDataComplete).length;
  const counts: Partial<Record<string, number>> = {
    packages: packages.length,
    jamaah: incomplete || undefined,
  };

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={cx('fixed inset-0 z-40 bg-black/30 lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-surface transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-[72px] items-center justify-between px-5">
          <BrandLogo className="h-9" onClick={() => setIsLogoModalOpen(true)} />
          <button className="icon-btn lg:hidden" onClick={onClose} aria-label="Tutup menu">
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-2 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="eyebrow px-3 pb-2">{group.label}</div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentTab === item.id;
                  const count = counts[item.id];
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setCurrentTab(item.id);
                          onClose();
                        }}
                        className={cx(
                          'group flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-colors',
                          active ? 'bg-ink text-canvas' : 'text-muted hover:bg-subtle hover:text-ink'
                        )}
                      >
                        <Icon className={cx('size-[18px]', active ? 'text-accent' : 'text-faint group-hover:text-ink')} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {count !== undefined && (
                          <span
                            className={cx(
                              'num min-w-5 rounded-md px-1.5 text-center text-[11px] leading-5 font-bold',
                              active ? 'bg-white/15 text-canvas' : item.id === 'jamaah' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'bg-subtle text-muted'
                            )}
                            title={item.id === 'jamaah' ? 'Jamaah dengan data belum lengkap' : undefined}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 p-3">
          {/* Kartu hotline (gaya kartu gelap) */}
          <div className="rounded-2xl bg-night p-4 text-night-ink">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-night-muted uppercase">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Hotline kantor
            </div>
            <div className="num mt-2 text-[15px] font-bold">{COMPANY_INFO.whatsappDisplay}</div>
            <div className="mt-0.5 truncate text-[11px] text-night-muted">Jl. Bener No.79, Tegalrejo, Yogyakarta</div>
            <a
              href={`https://wa.me/62${COMPANY_INFO.whatsapp.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-white/10 text-xs font-semibold transition-colors hover:bg-white/15"
            >
              <PhoneCall className="size-3.5" />
              Buka WhatsApp
            </a>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line p-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
              AD
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold text-ink">{currentUser?.name || 'Administrator MKB'}</div>
              <div className="truncate text-[11px] text-muted">{currentUser?.role || 'Super Admin'}</div>
            </div>
            <button
              className="icon-btn size-8 hover:text-rose-500"
              title="Keluar"
              aria-label="Keluar"
              onClick={() => window.confirm('Keluar dari sesi backoffice MKB?') && logout()}
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
