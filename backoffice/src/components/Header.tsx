import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { NAV_ITEMS } from './nav';
import { Avatar, Button, IconButton, PackageTag, cx } from './ui';
import { Menu, Moon, Search, Sun, ImageUp, UserPlus, ChevronRight } from 'lucide-react';

export const Header: React.FC<{ onOpenNav: () => void }> = ({ onOpenNav }) => {
  const { currentTab, theme, toggleTheme, setIsLogoModalOpen, setShowAddJamaahModal, jamaahList, packages, setSelectedJamaah } =
    useApp();
  const page = NAV_ITEMS.find((n) => n.id === currentTab);

  // Pencarian cepat jamaah (⌘K / Ctrl+K)
  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return jamaahList
      .filter(
        (j) =>
          j.fullName.toLowerCase().includes(s) ||
          j.phoneWhatsapp.includes(s) ||
          j.passportNumber?.toLowerCase().includes(s) ||
          j.nik?.includes(s)
      )
      .slice(0, 6);
  }, [q, jamaahList]);

  const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date()
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <IconButton icon={Menu} label="Buka menu" className="lg:hidden" onClick={onOpenNav} />

        <div className="hidden min-w-0 md:block">
          <div className="flex items-center gap-1.5 text-xs text-faint">
            <span>Backoffice</span>
            <ChevronRight className="size-3" />
            <span className="text-muted">{page?.title}</span>
          </div>
          <div className="mt-0.5 text-[13px] font-semibold text-ink capitalize">{today}</div>
        </div>

        {/* Pencarian */}
        <div className="relative ml-auto w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Cari jamaah, no. HP, paspor…"
            className="input h-10 rounded-xl bg-surface pr-14 pl-9"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-md border border-line bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
            Ctrl K
          </kbd>
          {focused && q && (
            <div className="absolute inset-x-0 top-12 z-40 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted">Tidak ada jamaah yang cocok.</div>
              ) : (
                <ul className="py-1.5">
                  {results.map((j) => {
                    const pkg = packages.find((p) => p.id === j.packageId);
                    return (
                      <li key={j.id}>
                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedJamaah(j);
                            setQ('');
                            inputRef.current?.blur();
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-subtle"
                        >
                          <Avatar name={j.fullName} size="sm" color={pkg?.kanbanColors.accent} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13px] font-semibold text-ink">{j.fullName}</div>
                            <div className="font-mono text-[11px] text-muted">{j.phoneWhatsapp}</div>
                          </div>
                          <PackageTag pkg={pkg} short />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            icon={theme === 'dark' ? Sun : Moon}
            label={theme === 'dark' ? 'Tema terang' : 'Tema gelap'}
            onClick={toggleTheme}
          />
          <IconButton icon={ImageUp} label="Logo travel" onClick={() => setIsLogoModalOpen(true)} className="hidden sm:inline-flex" />
          <Button variant="accent" icon={UserPlus} onClick={() => setShowAddJamaahModal(true)} className={cx('ml-1')}>
            <span className="hidden sm:inline">Daftar Jamaah</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
