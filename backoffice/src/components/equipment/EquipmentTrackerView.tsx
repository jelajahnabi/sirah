import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentItem, EquipmentStatus, Jamaah } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { buildWaLink } from '../../utils/formatters';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Field,
  IconButton,
  Modal,
  PageHeader,
  SearchInput,
  Segmented,
  StatCard,
  equipmentTone,
} from '../ui';
import { Building2, CheckCircle2, Clock, Layers, Luggage, MapPin, MessageCircle, Plus, Printer, Trash2, Truck, XCircle } from 'lucide-react';

type Category = EquipmentItem['category'];

export const EquipmentTrackerView: React.FC = () => {
  const { jamaahList, packages, updateJamaahEquipment, equipmentCatalog, addEquipmentItem, deleteEquipmentItem, setShippingLabelJamaah } =
    useApp();
  const [tab, setTab] = useState<'distribution' | 'catalog'>('distribution');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EquipmentStatus>('all');
  const [editing, setEditing] = useState<Jamaah | null>(null);
  const [status, setStatus] = useState<EquipmentStatus>('Diambil di Kantor');
  const [resi, setResi] = useState('');

  const [showAddItem, setShowAddItem] = useState(false);
  const [item, setItem] = useState({
    name: '',
    category: 'Koper & Tas' as Category,
    isIncluded: true,
    stockQuantity: 100,
    unit: 'Unit',
    description: '',
  });

  const s = query.toLowerCase();
  const rows = jamaahList.filter(
    (j) =>
      (j.fullName.toLowerCase().includes(s) ||
        j.passportNumber?.toLowerCase().includes(s) ||
        j.city?.toLowerCase().includes(s) ||
        j.address?.toLowerCase().includes(s)) &&
      (statusFilter === 'all' || j.equipmentStatus === statusFilter)
  );
  const count = (st: EquipmentStatus) => jamaahList.filter((j) => j.equipmentStatus === st).length;

  const notifyWa = (j: Jamaah) => {
    let msg = `Assalamu'alaikum Warahmatullahi Wabarakatuh Bpk/Ibu *${j.fullName}*,\n\nKami dari Gudang Perlengkapan *${COMPANY_INFO.legalName}* mengabarkan update logistik koper umroh Anda:\n\n`;
    if (j.equipmentStatus === 'Dikirim Ekspedisi') {
      msg += `📦 Perlengkapan Umroh (Koper 24", Koper 20", Batik MKB, Ihram/Mukena & Buku Doa) telah dikirim via ekspedisi.\nNomor Resi: *${j.equipmentResi || 'Sedang diproses'}*\nAlamat Kirim (KTP): ${j.address || j.city || 'Sesuai data'}\n\nMohon dicek saat paket tiba.`;
    } else if (j.equipmentStatus === 'Diambil di Kantor') {
      msg += `✅ Perlengkapan Umroh telah dicatat telah diambil di Kantor Pusat MKB Travel Yogyakarta. Selamat mempersiapkan keberangkatan.`;
    } else {
      msg += `🔔 Perlengkapan Umroh Anda sudah siap diambil di Kantor MKB Travel, Jl. Bener No.79 Bener, Kec. Tegalrejo, Kota Yogyakarta. Silakan datang pada jam operasional kerja (08.30 - 16.30 WIB).`;
    }
    msg += `\n\nHotline Logistik: ${COMPANY_INFO.whatsappDisplay}`;
    window.open(buildWaLink(j.phoneWhatsapp, msg), '_blank');
  };

  const saveStatus = () => {
    if (!editing) return;
    updateJamaahEquipment(editing.id, status, status === 'Dikirim Ekspedisi' ? resi : undefined);
    setEditing(null);
  };

  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.name.trim()) return;
    addEquipmentItem({
      ...item,
      name: item.name.trim(),
      unit: item.unit.trim() || 'Unit',
      description: item.description.trim(),
      stockQuantity: Number(item.stockQuantity) || 0,
    });
    setItem({ ...item, name: '', description: '' });
    setShowAddItem(false);
  };

  const included = equipmentCatalog.filter((i) => i.isIncluded);
  const excluded = equipmentCatalog.filter((i) => !i.isIncluded);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logistik koper"
        description="Distribusi perlengkapan, cetak label alamat KTP, dan katalog item paket."
        actions={
          <>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'distribution', label: 'Distribusi', icon: Truck },
                { value: 'catalog', label: 'Katalog', icon: Layers },
              ]}
            />
            {tab === 'catalog' && (
              <Button variant="primary" icon={Plus} onClick={() => setShowAddItem(true)}>
                Tambah Item
              </Button>
            )}
          </>
        }
      />

      {tab === 'distribution' ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Belum diambil" value={count('Belum Diambil')} icon={Clock} tone="warning" hint="Siap di gudang Yogyakarta" />
            <StatCard label="Diambil di kantor" value={count('Diambil di Kantor')} icon={Building2} tone="success" hint="Jl. Bener No.79" />
            <StatCard label="Dikirim ekspedisi" value={count('Dikirim Ekspedisi')} icon={Truck} tone="info" hint="Dengan nomor resi" />
          </div>

          <Card className="overflow-hidden">
            <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
              <SearchInput value={query} onChange={setQuery} placeholder="Cari nama, kota, alamat KTP…" className="flex-1" />
              <Segmented
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'all', label: 'Semua' },
                  { value: 'Belum Diambil', label: 'Belum' },
                  { value: 'Diambil di Kantor', label: 'Kantor' },
                  { value: 'Dikirim Ekspedisi', label: 'Ekspedisi' },
                ]}
              />
            </div>
            <div className="overflow-x-auto border-t border-line">
              <table className="table min-w-[880px]">
                <thead>
                  <tr>
                    <th>Jamaah</th>
                    <th>Alamat KTP (tujuan kirim)</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <EmptyState icon={Luggage} title="Tidak ada jamaah yang cocok" />
                      </td>
                    </tr>
                  )}
                  {rows.map((j) => {
                    const pkg = packages.find((p) => p.id === j.packageId);
                    return (
                      <tr key={j.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar name={j.fullName} color={pkg?.kanbanColors.accent} />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-ink">{j.fullName}</div>
                              <div className="font-mono text-[11px] text-muted">{j.phoneWhatsapp}</div>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-xs">
                          <div className="flex gap-1.5 text-xs text-ink">
                            <MapPin className="mt-0.5 size-3.5 shrink-0 text-faint" />
                            <span className="line-clamp-2">{j.address || `KTP: ${j.city || 'Yogyakarta'}`}</span>
                          </div>
                          <div className="mt-0.5 pl-5 font-mono text-[11px] text-muted">NIK {j.nik || '—'}</div>
                        </td>
                        <td>
                          <Badge tone={equipmentTone(j.equipmentStatus)} dot>
                            {j.equipmentStatus}
                          </Badge>
                          {j.equipmentResi && <div className="mt-1 font-mono text-[11px] text-muted">Resi {j.equipmentResi}</div>}
                        </td>
                        <td className="text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <Button size="sm" variant="primary" icon={Printer} onClick={() => setShippingLabelJamaah(j)}>
                              Label
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setEditing(j);
                                setStatus(j.equipmentStatus);
                                setResi(j.equipmentResi || '');
                              }}
                            >
                              Status
                            </Button>
                            <IconButton icon={MessageCircle} label="Kabari via WhatsApp" onClick={() => notifyWa(j)} className="hover:text-emerald-600" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CatalogColumn
            title="Termasuk paket"
            subtitle="Wajib disediakan untuk setiap jamaah"
            icon={CheckCircle2}
            tone="success"
            items={included}
            onDelete={deleteEquipmentItem}
          />
          <CatalogColumn
            title="Tidak termasuk (opsional)"
            subtitle="Layanan / biaya ekstra di luar paket"
            icon={XCircle}
            tone="danger"
            items={excluded}
            onDelete={deleteEquipmentItem}
          />
        </div>
      )}

      {/* Modal ubah status */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Status koper & perlengkapan"
        description={editing?.fullName}
        icon={Luggage}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button variant="primary" onClick={saveStatus}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Status">
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus)}>
              <option value="Belum Diambil">Belum diambil</option>
              <option value="Diambil di Kantor">Diambil di kantor (Jl. Bener)</option>
              <option value="Dikirim Ekspedisi">Dikirim ekspedisi</option>
            </select>
          </Field>
          {status === 'Dikirim Ekspedisi' && (
            <Field label="Nomor resi">
              <input className="input font-mono" placeholder="Contoh: JNE-09218491024" value={resi} onChange={(e) => setResi(e.target.value)} />
            </Field>
          )}
        </div>
      </Modal>

      {/* Modal tambah item */}
      <Modal
        open={showAddItem}
        onClose={() => setShowAddItem(false)}
        title="Tambah item perlengkapan"
        icon={Plus}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAddItem(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" form="add-item-form">
              Simpan Item
            </Button>
          </>
        }
      >
        <form id="add-item-form" onSubmit={saveItem} className="space-y-4">
          <Field label="Nama perlengkapan">
            <input
              className="input"
              required
              placeholder="Contoh: Koper Kabin 20 Inch Fiber"
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <select className="input" value={item.category} onChange={(e) => setItem({ ...item, category: e.target.value as Category })}>
                <option value="Koper & Tas">Koper & Tas</option>
                <option value="Pakaian Ibadah">Pakaian Ibadah</option>
                <option value="Buku & Identitas">Buku & Identitas</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </Field>
            <Field label="Status di paket">
              <select
                className="input"
                value={item.isIncluded ? 'in' : 'out'}
                onChange={(e) => setItem({ ...item, isIncluded: e.target.value === 'in' })}
              >
                <option value="in">Termasuk</option>
                <option value="out">Tidak termasuk (opsional)</option>
              </select>
            </Field>
            <Field label="Stok awal">
              <input
                className="input num"
                type="number"
                min={0}
                value={item.stockQuantity}
                onChange={(e) => setItem({ ...item, stockQuantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Satuan">
              <input className="input" placeholder="Unit, Pcs, Set" value={item.unit} onChange={(e) => setItem({ ...item, unit: e.target.value })} />
            </Field>
          </div>
          <Field label="Keterangan">
            <input
              className="input"
              placeholder="Kapasitas, bahan, warna, ukuran…"
              value={item.description}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
};

const CatalogColumn: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'success' | 'danger';
  items: EquipmentItem[];
  onDelete: (id: string) => void;
}> = ({ title, subtitle, icon, tone, items, onDelete }) => (
  <Card pad>
    <CardHeader icon={icon} title={title} subtitle={subtitle} actions={<Badge tone={tone}>{items.length} item</Badge>} />
    <ul className="mt-5 space-y-2">
      {items.length === 0 && <li className="rounded-2xl border border-dashed border-line-strong py-6 text-center text-xs text-muted">Belum ada item.</li>}
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-ink">{i.name}</span>
              <Badge>{i.category}</Badge>
            </div>
            {i.description && <p className="mt-1 text-xs text-muted">{i.description}</p>}
          </div>
          <div className="text-right">
            <div className="num text-sm font-bold text-ink">{i.stockQuantity}</div>
            <div className="text-[11px] text-muted">{i.unit}</div>
          </div>
          <IconButton icon={Trash2} label="Hapus item" className="size-8 hover:text-rose-500" onClick={() => onDelete(i.id)} />
        </li>
      ))}
    </ul>
  </Card>
);
