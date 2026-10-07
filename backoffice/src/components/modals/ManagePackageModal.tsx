import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatRupiah } from '../../utils/formatters';
import { X, Trash2, CheckCircle2, AlertOctagon, Lock, Unlock, Plus, Settings } from 'lucide-react';

export const ManagePackageModal: React.FC = () => {
  const {
    showManagePackageModal,
    setShowManagePackageModal,
    setShowAddPackageModal,
    packages,
    updatePackageStatus,
    deletePackage,
    jamaahList,
    theme,
  } = useApp();

  const isDark = theme === 'dark';

  if (!showManagePackageModal) return null;

  const handleDelete = (id: string, name: string) => {
    const hasJamaah = jamaahList.some((j) => j.packageId === id);
    const confirmMsg = hasJamaah
      ? `Paket "${name}" memiliki jamaah terdaftar di sistem. Anda yakin ingin menghapus paket ini?`
      : `Hapus paket "${name}" dari sistem?`;

    if (window.confirm(confirmMsg)) {
      deletePackage(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto font-sans">
      <div
        className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border my-6 space-y-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#dedbd2] text-[#23211e]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f27244]/15 text-[#f27244] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                Kelola Status &amp; Inventaris Paket Umroh
              </h2>
              <p
                className={`text-xs ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Atur status pendaftaran (Buka, Hampir Penuh, Sold Out, Tutup) dan hapus paket.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowManagePackageModal(false);
                setShowAddPackageModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat Paket Baru</span>
            </button>
            <button
              onClick={() => setShowManagePackageModal(false)}
              className={`p-1 rounded-md ${
                isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Package List */}
        <div className="space-y-3">
          {packages.length === 0 ? (
            <div className="text-center py-8 opacity-60 text-xs">
              Belum ada paket terdaftar.
            </div>
          ) : (
            packages.map((pkg) => {
              const kc = pkg.kanbanColors;
              const count = jamaahList.filter((j) => j.packageId === pkg.id).length;

              return (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e]'
                      : 'bg-[#faf9f6] border-[#dedbd2]'
                  }`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: kc.accent,
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: isDark ? kc.badgeBgDark : kc.badgeBgLight,
                          color: kc.accent,
                        }}
                      >
                        {pkg.code}
                      </span>
                      <h3 className="font-bold text-xs">{pkg.name}</h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                          pkg.status === 'Open'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : pkg.status === 'Fast Filling'
                            ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            : pkg.status === 'Sold Out'
                            ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                            : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                        }`}
                      >
                        {pkg.status === 'Open'
                          ? 'Buka'
                          : pkg.status === 'Fast Filling'
                          ? 'Sisa Sedikit'
                          : pkg.status === 'Sold Out'
                          ? 'Sold Out'
                          : 'Tutup'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] opacity-75">
                      <span>Harga: <strong className="font-price-myriad">{formatRupiah(pkg.price)}</strong></span>
                      <span>·</span>
                      <span>Kursi: <strong>{count} / {pkg.quota}</strong> Terisi</span>
                      <span>·</span>
                      <span>{pkg.durationDays} Hari ({pkg.departureMonth})</span>
                    </div>
                  </div>

                  {/* Status Toggle & Delete Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 p-1 rounded-lg border text-[11px]"
                      style={{
                        borderColor: isDark ? '#33312e' : '#e0ddd4',
                        backgroundColor: isDark ? '#22211f' : '#ffffff',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updatePackageStatus(pkg.id, 'Open')}
                        className={`px-2 py-1 rounded transition-colors ${
                          pkg.status === 'Open'
                            ? 'bg-emerald-500 text-white font-bold'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title="Buka Pendaftaran"
                      >
                        Buka
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePackageStatus(pkg.id, 'Fast Filling')}
                        className={`px-2 py-1 rounded transition-colors ${
                          pkg.status === 'Fast Filling'
                            ? 'bg-amber-500 text-white font-bold'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title="Tandai Hampir Penuh"
                      >
                        Sisa Dikit
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePackageStatus(pkg.id, 'Sold Out')}
                        className={`px-2 py-1 rounded transition-colors ${
                          pkg.status === 'Sold Out'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title="Tandai Sold Out / Habis"
                      >
                        Sold Out
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePackageStatus(pkg.id, 'Closed')}
                        className={`px-2 py-1 rounded transition-colors ${
                          pkg.status === 'Closed'
                            ? 'bg-zinc-600 text-white font-bold'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title="Tutup Pendaftaran"
                      >
                        Tutup
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
                      title="Hapus paket ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className={`pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-[#2d2c29] text-[#737069]' : 'border-[#eeece6] text-[#8c8982]'
          }`}
        >
          <span>Perubahan status langsung berpengaruh pada formulir pendaftaran jamaah.</span>
          <button
            onClick={() => setShowManagePackageModal(false)}
            className={`px-4 py-1.5 rounded-lg font-medium ${
              isDark ? 'text-[#f4f3ef] hover:bg-[#282725]' : 'text-[#23211e] hover:bg-[#eeebe3]'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
