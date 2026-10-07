import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { UmrohPackage } from '../types';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

type Icon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

/* ---------------------------------------------------------------- Layout */

export const PageHeader: React.FC<{
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, description, actions }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { pad?: boolean }> = ({
  className,
  pad,
  ...rest
}) => <div className={cx('card', pad && 'card-pad', className)} {...rest} />;

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: Icon;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, icon: I, actions, className }) => (
  <div className={cx('flex items-start justify-between gap-3', className)}>
    <div className="flex min-w-0 items-start gap-3">
      {I && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-ink">
          <I className="size-4" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

/* ------------------------------------------------------------- Buttons */

type BtnVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: 'md' | 'sm';
    icon?: Icon;
  }
> = ({ variant = 'secondary', size = 'md', icon: I, className, children, type = 'button', ...rest }) => (
  <button
    type={type}
    className={cx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className)}
    {...rest}
  >
    {I && <I className={size === 'sm' ? 'size-3.5' : 'size-4'} />}
    {children}
  </button>
);

export const IconButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: Icon; label: string }
> = ({ icon: I, label, className, type = 'button', ...rest }) => (
  <button type={type} className={cx('icon-btn', className)} title={label} aria-label={label} {...rest}>
    <I className="size-4" />
  </button>
);

/* -------------------------------------------------------------- Badges */

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'violet';

const toneClass: Record<Tone, string> = {
  neutral: 'bg-subtle text-muted ring-line',
  success: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-400',
  danger: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-400',
  info: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-400',
  accent: 'bg-accent/10 text-accent-strong ring-accent/25 dark:text-accent',
  violet: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-400',
};

const toneDot: Record<Tone, string> = {
  neutral: 'bg-faint',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  accent: 'bg-accent',
  violet: 'bg-violet-500',
};

export const Badge: React.FC<{ tone?: Tone; dot?: boolean; className?: string; children: React.ReactNode }> = ({
  tone = 'neutral',
  dot,
  className,
  children,
}) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ring-1 ring-inset',
      toneClass[tone],
      className
    )}
  >
    {dot && <span className={cx('size-1.5 rounded-full', toneDot[tone])} />}
    {children}
  </span>
);

/** Badge berwarna sesuai warna aksen paket. */
export const PackageTag: React.FC<{ pkg?: UmrohPackage; short?: boolean; className?: string }> = ({
  pkg,
  short,
  className,
}) => {
  if (!pkg) return <span className="text-xs text-faint">Belum pilih paket</span>;
  const c = pkg.kanbanColors.accent;
  return (
    <span
      className={cx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: `color-mix(in srgb, ${c} 12%, transparent)`, color: c }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: c }} />
      <span className="truncate">{short ? pkg.name.replace(/^Umroh\s+/, '') : pkg.name}</span>
    </span>
  );
};

/* ---------------------------------------------------------- Data display */

export const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon: Icon;
  tone?: Tone;
  footer?: React.ReactNode;
}> = ({ label, value, hint, icon: I, tone = 'neutral', footer }) => (
  <Card className="flex flex-col p-5">
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span className={cx('flex size-9 items-center justify-center rounded-xl ring-1 ring-inset', toneClass[tone])}>
        <I className="size-4" />
      </span>
    </div>
    <div className="num mt-4 text-[26px] leading-none font-bold text-ink">{value}</div>
    {hint && <div className="mt-2 text-xs text-muted">{hint}</div>}
    {footer && <div className="mt-4">{footer}</div>}
  </Card>
);

export const Progress: React.FC<{ value: number; color?: string; className?: string; track?: string }> = ({
  value,
  color,
  className,
  track = 'bg-subtle',
}) => (
  <div className={cx('h-2 overflow-hidden rounded-full', track, className)}>
    <div
      className={cx('h-full rounded-full transition-[width] duration-500', !color && 'bg-accent')}
      style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
    />
  </div>
);

export const Avatar: React.FC<{ name: string; color?: string; size?: 'sm' | 'md' }> = ({ name, color, size = 'md' }) => {
  const initials = name
    .replace(/^(H\.|Hj\.|Drs\.|Dr\.|Ust\.)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full font-bold',
        size === 'sm' ? 'size-7 text-[10px]' : 'size-9 text-xs',
        !color && 'bg-subtle text-ink'
      )}
      style={color ? { backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color } : undefined}
    >
      {initials}
    </span>
  );
};

export const EmptyState: React.FC<{ icon?: Icon; title: string; children?: React.ReactNode }> = ({
  icon: I,
  title,
  children,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    {I && (
      <span className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-subtle text-faint">
        <I className="size-5" />
      </span>
    )}
    <p className="text-sm font-semibold text-ink">{title}</p>
    {children && <div className="mt-1 max-w-sm text-xs text-muted">{children}</div>}
  </div>
);

export const KeyValue: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className,
}) => (
  <div className={cx('min-w-0', className)}>
    <div className="eyebrow">{label}</div>
    <div className="mt-1 truncate text-[13px] font-semibold text-ink">{children}</div>
  </div>
);

/* --------------------------------------------------------------- Inputs */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: NoInfer<T>) => void;
  options: { value: NoInfer<T>; label: React.ReactNode; icon?: Icon }[];
  className?: string;
}) {
  return (
    <div className={cx('inline-flex items-center gap-1 rounded-xl border border-line bg-subtle p-1', className)}>
      {options.map((o) => {
        const active = o.value === value;
        const I = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cx(
              'inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-all',
              active ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink'
            )}
          >
            {I && <I className="size-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export const SearchInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className }) => (
  <div className={cx('relative', className)}>
    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input pl-9"
    />
  </div>
);

export const Field: React.FC<{ label: React.ReactNode; hint?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  label,
  hint,
  className,
  children,
}) => (
  <label className={cx('block', className)}>
    <span className="field-label">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-faint">{hint}</span>}
  </label>
);

/* ---------------------------------------------------------------- Modal */

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: Icon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}> = ({ open, onClose, title, description, icon: I, size = 'md', headerActions, footer, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-3xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] sm:items-center print:static print:bg-transparent print:p-0">
      <div className="fixed inset-0 print:hidden" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'relative my-6 w-full rounded-3xl border border-line bg-surface shadow-2xl print:my-0 print:border-0 print:shadow-none',
          width
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 print:hidden">
          <div className="flex min-w-0 items-start gap-3">
            {I && (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <I className="size-5" />
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-bold text-ink">{title}</h2>
              {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {headerActions}
            <IconButton icon={X} label="Tutup" onClick={onClose} />
          </div>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 rounded-b-3xl border-t border-line bg-subtle px-6 py-4 print:hidden">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- Helpers */

export const visaTone = (s: string): Tone =>
  s === 'Issued' ? 'success' : s === 'Proses Enjaz' ? 'info' : s === 'Reject' ? 'danger' : 'neutral';

export const paymentTone = (s: string): Tone =>
  s === 'Lunas' ? 'success' : s === 'Belum Bayar' ? 'danger' : 'warning';

export const equipmentTone = (s: string): Tone =>
  s === 'Diambil di Kantor' ? 'success' : s === 'Dikirim Ekspedisi' ? 'info' : 'warning';

export const packageStatusMeta: Record<UmrohPackage['status'], { label: string; tone: Tone }> = {
  Open: { label: 'Dibuka', tone: 'success' },
  'Fast Filling': { label: 'Hampir penuh', tone: 'warning' },
  'Sold Out': { label: 'Sold out', tone: 'danger' },
  Closed: { label: 'Ditutup', tone: 'neutral' },
};

/** Baca file sebagai data URL (untuk upload KTP / paspor / logo). */
export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
