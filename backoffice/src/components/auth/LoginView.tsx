import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANY_INFO } from '../../data/mockData';
import { BrandLogo } from '../BrandLogo';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  KeyRound,
  AlertCircle,
  Building,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminmkb');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = login(username.trim(), password.trim());
      if (!success) {
        setError('Username atau password salah. Silakan periksa kembali (Gunakan: admin / adminmkb)');
      }
      setLoading(false);
    }, 300);
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('adminmkb');
    setError(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 font-sans transition-colors duration-200 select-none ${
        isDark ? 'bg-[#181716] text-[#f4f3ef]' : 'bg-[#f7f6f2] text-[#23211e]'
      }`}
    >
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <BrandLogo className="h-8" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#242321] hover:bg-[#2c2b28] border-[#383633] text-amber-400'
                : 'bg-white hover:bg-[#f4f3ee] border-[#dedbd2] text-indigo-600 shadow-2xs'
            }`}
            title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-2">
        <div
          className={`w-full max-w-md rounded-2xl border p-7 sm:p-8 shadow-2xl transition-all ${
            isDark
              ? 'bg-[#22211f] border-[#383633] shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
              : 'bg-white border-[#e5e2da] shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* Card Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#f27244]/15 text-[#f27244] flex items-center justify-center shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-lg font-bold tracking-tight">
              Sistem Operasional Backoffice
            </h1>
            <p
              className={`text-xs ${
                isDark ? 'text-[#9c988f]' : 'text-[#737069]'
              }`}
            >
              {COMPANY_INFO.legalName}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                className={`block font-semibold mb-1.5 ${
                  isDark ? 'text-[#d6d3cb]' : 'text-[#4a4740]'
                }`}
              >
                Username
              </label>
              <div className="relative">
                <User
                  className={`w-4 h-4 absolute left-3 top-3 ${
                    isDark ? 'text-[#737069]' : 'text-[#9c988f]'
                  }`}
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                    isDark
                      ? 'bg-[#1a1918] border-[#383633] text-white placeholder-[#737069]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e] placeholder-[#a6a39b]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block font-semibold mb-1.5 ${
                  isDark ? 'text-[#d6d3cb]' : 'text-[#4a4740]'
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`w-4 h-4 absolute left-3 top-3 ${
                    isDark ? 'text-[#737069]' : 'text-[#9c988f]'
                  }`}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="adminmkb"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                    isDark
                      ? 'bg-[#1a1918] border-[#383633] text-white placeholder-[#737069]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e] placeholder-[#a6a39b]'
                  }`}
                />
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div
              className={`p-3 rounded-xl border text-[11px] flex items-center justify-between ${
                isDark
                  ? 'bg-[#1a1918] border-[#2e2d2a] text-[#a6a39b]'
                  : 'bg-[#faf9f6] border-[#eae7df] text-[#6b6760]'
              }`}
            >
              <div>
                <span className="font-semibold block text-[#f27244]">Kredensial Login Template:</span>
                <span>User: <strong>admin</strong> | Pass: <strong>adminmkb</strong></span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-2 py-1 text-[10px] font-semibold text-[#f27244] bg-[#f27244]/10 hover:bg-[#f27244]/20 rounded-md transition-colors"
              >
                Isi Otomatis
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Backoffice</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div
            className={`mt-6 pt-4 border-t text-center text-[10px] flex items-center justify-center gap-1.5 ${
              isDark ? 'border-[#2d2c29] text-[#737069]' : 'border-[#eeece6] text-[#8c8982]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sistem Terenkripsi &amp; Terlindungi PPIU Kemenhaj RI</span>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer
        className={`max-w-6xl w-full mx-auto text-center text-xs py-3 ${
          isDark ? 'text-[#737069]' : 'text-[#9c988f]'
        }`}
      >
        &copy; {new Date().getFullYear()} {COMPANY_INFO.legalName} · Yogyakarta, Indonesia
      </footer>
    </div>
  );
};
