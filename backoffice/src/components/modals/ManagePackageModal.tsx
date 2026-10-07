import React from 'react';
import { useApp } from '../../context/AppContext';
import { UmrohPackage } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { Button, IconButton, Modal, Segmented, packageStatusMeta } from '../ui';
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react';

export const ManagePackageModal: React.FC = () => {
  const { showManagePackageModal, setShowManagePackageModal, setShowAddPackageModal, packages, updatePackageStatus, deletePackage, jamaahList } =
    useApp();
  const close = () => setShowManagePackageModal(false);

  const handleDelete = (id: string, name: string) => {
    const has = jamaahList.some((j) => j.packageId === id);
    const msg = has
      ? `Paket "${name}" masih memiliki jamaah terdaftar. Tetap hapus paket ini?`
      : `Hapus paket "${name}"?`;
    if (window.confirm(msg)) deletePackage(id);
  };

  return (
    <Modal
      open={showManagePackageModal}
      onClose={close}
      title="Kelola paket"
      description="Atur status pendaftaran tiap paket atau hapus paket yang tidak dipakai."
      icon={SlidersHorizontal}
      size="xl"
      headerActions={
        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => {
            close();
            setShowAddPackageModal(true);
          }}
        >
          Paket baru
        </Button>
      }
      footer={
        <>
          <span className="mr-auto text-xs text-muted">Perubahan status langsung berlaku di formulir pendaftaran.</span>
          <Button variant="primary" onClick={close}>
            Selesai
          </Button>
        </>
      }
    >
      {packages.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">Belum ada paket terdaftar.</p>
      ) : (
        <ul className="space-y-3">
          {packages.map((pkg) => {
            const count = jamaahList.filter((j) => j.packageId === pkg.id).length;
            return (
              <li key={pkg.id} className="flex flex-col gap-3 rounded-2xl border border-line p-4 lg:flex-row lg:items-center">
                <span className="hidden h-10 w-1.5 shrink-0 rounded-full lg:block" style={{ backgroundColor: pkg.kanbanColors.accent }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted">{pkg.code}</span>
                  </div>
                  <div className="text-[14px] font-bold text-ink">{pkg.name}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    <span className="num font-semibold text-ink">{formatRupiah(pkg.price)}</span> · {count}/{pkg.quota} kursi · {pkg.durationDays} hari (
                    {pkg.departureMonth})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Segmented<UmrohPackage['status']>
                    value={pkg.status}
                    onChange={(v) => updatePackageStatus(pkg.id, v)}
                    options={(Object.keys(packageStatusMeta) as UmrohPackage['status'][]).map((k) => ({
                      value: k,
                      label: packageStatusMeta[k].label,
                    }))}
                  />
                  <IconButton icon={Trash2} label="Hapus paket" className="hover:bg-rose-500/10 hover:text-rose-500" onClick={() => handleDelete(pkg.id, pkg.name)} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
};
