import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo, BrandMark } from '../BrandLogo';
import { Button, IconButton } from '../ui';
import { AlertCircle, ArrowRight, Lock, Moon, ShieldCheck, Sun, User } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme, packages, jamaahList } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminmkb');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      if (!login(username.trim(), password.trim())) {
        setError('Username atau password salah. Akun demo: admin / adminmkb.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[1.05fr_1fr]">
      {/* Panel kiri — identitas */}
      <aside className="relative hidden overflow-hidden bg-night p-10 text-night-ink lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
        />
        <div className="relative flex items-center gap-3">
          <BrandMark className="h-10" />
          <div>
            <div className="text-sm font-extrabold">MudahKeBaitullah</div>
            <div className="text-[11px] tracking-[0.14em] text-night-muted uppercase">Travel Indonesia</div>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">Backoffice operasional</p>
          <h1 className="mt-3 text-4xl leading-tight font-bold tracking-tight">
            Semua urusan jamaah, dari daftar sampai pulang, di satu tempat.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-night-muted">
            Paket & kuota, berkas jamaah, manifest, rooming list, kwitansi, sampai pengiriman koper.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { v: packages.length, l: 'Paket aktif' },
              { v: jamaahList.length, l: 'Jamaah' },
              { v: 'PPIU', l: 'Kemenhaj RI' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="num text-2xl font-bold">{s.v}</div>
                <div className="mt-1 text-[11px] text-night-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-night-muted">
          © {new Date().getFullYear()} {COMPANY_INFO.legalName} · Yogyakarta
        </div>
      </aside>

      {/* Panel kanan — form */}
      <main className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <div className="lg:invisible">
            <BrandLogo className="h-9" />
          </div>
          <IconButton icon={theme === 'dark' ? Sun : Moon} label="Ganti tema" onClick={toggleTheme} />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold tracking-tight text-ink">Masuk ke backoffice</h2>
            <p className="mt-1.5 text-sm text-muted">Gunakan akun staf yang terdaftar.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-medium text-rose-700 dark:text-rose-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              )}

              <label className="block">
                <span className="field-label">Username</span>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                  <input className="input h-11 pl-9" required value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </label>

              <label className="block">
                <span className="field-label">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                  <input
                    className="input h-11 pl-9"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              <Button type="submit" variant="primary" disabled={loading} className="h-11 w-full">
                {loading ? 'Memproses…' : 'Masuk'}
                {!loading && <ArrowRight className="size-4" />}
              </Button>

              <div className="flex items-center justify-between rounded-xl border border-dashed border-line-strong px-3.5 py-3 text-xs">
                <span className="text-muted">
                  Akun demo: <strong className="text-ink">admin</strong> / <strong className="text-ink">adminmkb</strong>
                </span>
                <button
                  type="button"
                  className="font-semibold text-accent hover:underline"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('adminmkb');
                    setError(null);
                  }}
                >
                  Isi otomatis
                </button>
              </div>
            </form>

            <div className="mt-10 flex items-center gap-2 text-xs text-faint">
              <ShieldCheck className="size-4 text-emerald-500" />
              Terdaftar resmi sebagai PPIU Kemenhaj RI
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
