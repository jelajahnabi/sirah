import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EquipmentStatus, Jamaah, EquipmentItem } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { buildWaLink } from '../../utils/formatters';
import {
  Briefcase,
  Truck,
  Building,
  Clock,
  PhoneCall,
  Search,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Package,
  Layers,
  MapPin,
} from 'lucide-react';

export const EquipmentTrackerView: React.FC = () => {
  const {
    jamaahList,
    updateJamaahEquipment,
    equipmentCatalog,
    addEquipmentItem,
    deleteEquipmentItem,
    setShippingLabelJamaah,
    theme,
  } = useApp();

  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'distribution' | 'catalog'>('distribution');

  // Distribution states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingJamaahId, setEditingJamaahId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>('Diambil di Kantor');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Catalog Add Form states
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<
    'Koper & Tas' | 'Pakaian Ibadah' | 'Buku & Identitas' | 'Aksesoris'
  >('Koper & Tas');
  const [newItemIsIncluded, setNewItemIsIncluded] = useState<boolean>(true);
  const [newItemStock, setNewItemStock] = useState<number>(100);
  const [newItemUnit, setNewItemUnit] = useState('Unit');
  const [newItemDesc, setNewItemDesc] = useState('');

  const filteredJamaah = jamaahList.filter((j) => {
    const matchSearch =
      j.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.passportNumber && j.passportNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (j.city && j.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (j.address && j.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus =
      statusFilter === 'all' || j.equipmentStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  const countBelum = jamaahList.filter((j) => j.equipmentStatus === 'Belum Diambil').length;
  const countKantor = jamaahList.filter((j) => j.equipmentStatus === 'Diambil di Kantor').length;
  const countEkspedisi = jamaahList.filter((j) => j.equipmentStatus === 'Dikirim Ekspedisi').length;

  const handleSaveEquipment = (id: string) => {
    updateJamaahEquipment(id, selectedStatus, trackingNumber);
    setEditingJamaahId(null);
    setTrackingNumber('');
  };

  const handleSendWaNotification = (j: Jamaah) => {
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

  const handleCreateEquipmentItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addEquipmentItem({
      name: newItemName.trim(),
      category: newItemCategory,
      isIncluded: newItemIsIncluded,
      stockQuantity: Number(newItemStock) || 0,
      unit: newItemUnit.trim() || 'Unit',
      description: newItemDesc.trim(),
    });

    setNewItemName('');
    setNewItemDesc('');
    setShowAddItemModal(false);
  };

  const includedItems = equipmentCatalog.filter((i) => i.isIncluded);
  const excludedItems = equipmentCatalog.filter((i) => !i.isIncluded);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Sub-Tab Switch */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e8e5dc] text-[#23211e]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f27244]" />
            <h2 className="text-base font-bold">
              Logistik Koper, Print Resi Alamat KTP &amp; Katalog Perlengkapan
            </h2>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Manajemen pengiriman koper dengan print alamat KTP otomatis &amp; list perlengkapan termasuk/tidak termasuk.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs font-medium self-start md:self-auto ${
            isDark ? 'bg-[#1a1918] border-[#33312e]' : 'bg-[#faf9f6] border-[#dedbd2]'
          }`}
        >
          <button
            onClick={() => setActiveSubTab('distribution')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'distribution'
                ? isDark
                  ? 'bg-[#2d2b28] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#23211e] shadow-2xs font-semibold'
                : 'text-[#8c8982] hover:text-[#23211e] dark:hover:text-[#f4f3ef]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-[#f27244]" />
            <span>Distribusi &amp; Print Alamat KTP</span>
          </button>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'catalog'
                ? isDark
                  ? 'bg-[#2d2b28] text-white shadow-xs font-semibold'
                  : 'bg-white text-[#23211e] shadow-2xs font-semibold'
                : 'text-[#8c8982] hover:text-[#23211e] dark:hover:text-[#f4f3ef]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Katalog Stok (Termasuk / Tidak)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DISTRIBUSI & PRINT LABEL KOPER */}
      {activeSubTab === 'distribution' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border shadow-xs transition-colors ${
                isDark
                  ? 'bg-[#22211f] border-[#33312e]'
                  : 'bg-white border-[#e8e5dc]'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1 ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                <span className="text-xs font-medium">Belum Diambil / Dikirim</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-500">{countBelum} Pax</div>
              <div
                className={`text-[11px] mt-1 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                Siap di gudang Yogyakarta
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border shadow-xs transition-colors ${
                isDark
                  ? 'bg-[#22211f] border-[#33312e]'
                  : 'bg-white border-[#e8e5dc]'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1 ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                <span className="text-xs font-medium">Diambil di Kantor</span>
                <Building className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-500">{countKantor} Pax</div>
              <div
                className={`text-[11px] mt-1 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                Jl. Bener No.79 Yogyakarta
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border shadow-xs transition-colors ${
                isDark
                  ? 'bg-[#22211f] border-[#33312e]'
                  : 'bg-white border-[#e8e5dc]'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1 ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                <span className="text-xs font-medium">Dikirim Ekspedisi</span>
                <Truck className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl font-bold text-sky-500">{countEkspedisi} Pax</div>
              <div
                className={`text-[11px] mt-1 ${
                  isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                }`}
              >
                JNE / Cargo dengan resi
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-xl border shadow-xs transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#737069] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, kota, alamat KTP..."
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#f27244] ${
                  isDark
                    ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef] placeholder-[#737069]'
                    : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e] placeholder-[#8c8982]'
                }`}
              />
            </div>

            {/* Filter */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border text-xs ${
                isDark ? 'bg-[#1a1918] border-[#2d2c29]' : 'bg-[#f7f6f2] border-[#dedbd2]'
              }`}
            >
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? isDark
                      ? 'bg-[#2d2b28] text-white font-semibold shadow-xs'
                      : 'bg-white text-[#23211e] font-semibold shadow-2xs'
                    : 'text-[#8c8982]'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('Belum Diambil')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Belum Diambil'
                    ? 'bg-amber-500/20 text-amber-500 font-semibold'
                    : 'text-[#8c8982]'
                }`}
              >
                Belum Diambil
              </button>
              <button
                onClick={() => setStatusFilter('Diambil di Kantor')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Diambil di Kantor'
                    ? 'bg-emerald-500/20 text-emerald-500 font-semibold'
                    : 'text-[#8c8982]'
                }`}
              >
                Diambil di Kantor
              </button>
              <button
                onClick={() => setStatusFilter('Dikirim Ekspedisi')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'Dikirim Ekspedisi'
                    ? 'bg-sky-500/20 text-sky-500 font-semibold'
                    : 'text-[#8c8982]'
                }`}
              >
                Ekspedisi
              </button>
            </div>
          </div>

          {/* Table */}
          <div
            className={`rounded-xl border shadow-xs overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead
                  className={`border-b font-semibold ${
                    isDark
                      ? 'bg-[#1e1d1b] border-[#2d2c29] text-[#9c988f]'
                      : 'bg-[#faf9f6] border-[#eeece6] text-[#737069]'
                  }`}
                >
                  <tr>
                    <th className="py-2.5 px-4">Nama Jamaah</th>
                    <th className="py-2.5 px-3">Alamat KTP (Tujuan Pengiriman)</th>
                    <th className="py-2.5 px-3">Status Distribusi</th>
                    <th className="py-2.5 px-3">Isi Paket Perlengkapan</th>
                    <th className="py-2.5 px-4 text-right">Aksi &amp; Cetak Resi</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark
                      ? 'divide-[#2d2c29] text-[#d6d3cb]'
                      : 'divide-[#f0ede6] text-[#33302b]'
                  }`}
                >
                  {filteredJamaah.map((j) => {
                    const addressDisplay = j.address || `KTP: ${j.city || 'Yogyakarta'}`;

                    return (
                      <tr
                        key={j.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-[#282724]' : 'hover:bg-[#fbfaf7]'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold">
                          <div className={isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'}>
                            {j.fullName}
                          </div>
                          <div className="text-[#f27244] font-mono text-[11px] mt-0.5">
                            {j.phoneWhatsapp}
                          </div>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <div className="flex items-start gap-1 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-[#f27244] shrink-0 mt-0.5" />
                            <span className="leading-snug line-clamp-2">
                              {addressDisplay}
                            </span>
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 pl-4 font-mono ${
                              isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                            }`}
                          >
                            NIK: {j.nik || '347101xxxxxx'}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border inline-block ${
                              j.equipmentStatus === 'Diambil di Kantor'
                                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                                : j.equipmentStatus === 'Dikirim Ekspedisi'
                                ? 'bg-sky-500/15 text-sky-500 border-sky-500/30'
                                : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                            }`}
                          >
                            {j.equipmentStatus}
                          </span>
                          {j.equipmentResi && (
                            <div
                              className={`text-[10px] font-mono mt-1 ${
                                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                              }`}
                            >
                              Resi: {j.equipmentResi}
                            </div>
                          )}
                        </td>

                        <td
                          className={`py-3 px-3 text-[11px] ${
                            isDark ? 'text-[#9c988f]' : 'text-[#6b6760]'
                          }`}
                        >
                          <span>&bull; Koper 24" &amp; 20" &bull; Batik &bull; Ihram/Mukena &bull; Buku Doa</span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Print Label Koper Alamat KTP Button */}
                          <button
                            onClick={() => setShippingLabelJamaah(j)}
                            className="px-2.5 py-1 text-white bg-[#f27244] hover:bg-[#e06336] rounded-lg text-xs font-semibold shadow-2xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Print Label Pengiriman Koper Alamat KTP"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print Alamat KTP</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingJamaahId(j.id);
                              setSelectedStatus(j.equipmentStatus);
                              setTrackingNumber(j.equipmentResi || '');
                            }}
                            className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                              isDark
                                ? 'bg-[#2a2926] hover:bg-[#33312e] text-[#d6d3cb] border-[#383633]'
                                : 'bg-[#f7f6f2] hover:bg-[#eeebe3] text-[#4a4740] border-[#dedbd2]'
                            }`}
                          >
                            Status
                          </button>

                          <button
                            onClick={() => handleSendWaNotification(j)}
                            className={`p-1.5 rounded transition-colors inline-flex cursor-pointer ${
                              isDark
                                ? 'text-[#9c988f] hover:text-[#f27244] hover:bg-[#282725]'
                                : 'text-[#737069] hover:text-[#f27244] hover:bg-[#f0ede6]'
                            }`}
                            title="Kirim Notifikasi WA Koper"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KATALOG PERLENGKAPAN & STOK (TERMASUK / TIDAK TERMASUK) */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          {/* Action bar for adding item to catalog */}
          <div
            className={`p-4 rounded-xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
              isDark
                ? 'bg-[#22211f] border-[#33312e]'
                : 'bg-white border-[#e8e5dc]'
            }`}
          >
            <div>
              <h3 className="text-sm font-bold">
                Katalog Inventaris &amp; Penentuan Status Perlengkapan Paket
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                }`}
              >
                Dari awal sudah ditentukan item apa saja yang <strong>Termasuk (Included)</strong> dalam paket bawaan dan yang <strong>Tidak Termasuk (Opsional)</strong>.
              </p>
            </div>

            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Item Katalog Perlengkapan</span>
            </button>
          </div>

          {/* 2-Column Overview: Included vs Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INCLUDED ITEMS */}
            <div
              className={`p-4 rounded-xl border shadow-xs space-y-3 transition-colors ${
                isDark
                  ? 'bg-[#1b2520] border-[#1d4432]'
                  : 'bg-[#f4fdf8] border-[#bbf7d0]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TERMASUK DALAM PAKET (INCLUDED - {includedItems.length} ITEM)</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Wajib Disediakan
                </span>
              </div>

              <div className="space-y-2">
                {includedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                      isDark
                        ? 'bg-[#1e1d1b] border-[#2e2d2a]'
                        : 'bg-white border-[#dedbd2]'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="truncate">{item.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-normal opacity-70 border">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p
                          className={`text-[11px] mt-0.5 ${
                            isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {item.stockQuantity} {item.unit}
                        </div>
                        <div className="text-[10px] opacity-70">Stok Gudang</div>
                      </div>
                      <button
                        onClick={() => deleteEquipmentItem(item.id)}
                        className="text-gray-400 hover:text-rose-500 p-1 rounded"
                        title="Hapus Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXCLUDED ITEMS */}
            <div
              className={`p-4 rounded-xl border shadow-xs space-y-3 transition-colors ${
                isDark
                  ? 'bg-[#261f1c] border-[#442c22]'
                  : 'bg-[#fffaf8] border-[#fecdd3]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4" />
                  <span>TIDAK TERMASUK (EXCLUDED / OPSIONAL - {excludedItems.length} ITEM)</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  Biaya / Layanan Ekstra
                </span>
              </div>

              <div className="space-y-2">
                {excludedItems.length === 0 ? (
                  <div className="text-center py-6 text-xs opacity-60">
                    Belum ada item yang dikategorikan tidak termasuk.
                  </div>
                ) : (
                  excludedItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                        isDark
                          ? 'bg-[#1e1d1b] border-[#2e2d2a]'
                          : 'bg-white border-[#dedbd2]'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold flex items-center gap-1.5">
                          <span className="truncate">{item.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-normal opacity-70 border">
                            {item.category}
                          </span>
                        </div>
                        {item.description && (
                          <p
                            className={`text-[11px] mt-0.5 ${
                              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
                            }`}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-bold font-mono text-rose-600 dark:text-rose-400">
                            {item.stockQuantity} {item.unit}
                          </div>
                          <div className="text-[10px] opacity-70">Stok Tersedia</div>
                        </div>
                        <button
                          onClick={() => deleteEquipmentItem(item.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 rounded"
                          title="Hapus Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editingJamaahId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border space-y-4 ${
              isDark
                ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                : 'bg-white border-[#dedbd2] text-[#23211e]'
            }`}
          >
            <h3 className="text-sm font-bold">
              Update Status Koper &amp; Perlengkapan
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">
                  Pilih Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as EquipmentStatus)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                >
                  <option value="Belum Diambil">Belum Diambil</option>
                  <option value="Diambil di Kantor">Diambil di Kantor Jl. Bener</option>
                  <option value="Dikirim Ekspedisi">Dikirim Ekspedisi</option>
                </select>
              </div>

              {selectedStatus === 'Dikirim Ekspedisi' && (
                <div>
                  <label className="block font-medium mb-1">
                    Nomor Resi Ekspedisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: JNE-09218491024"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${
                      isDark
                        ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingJamaahId(null)}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#eeebe3]'
                }`}
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveEquipment(editingJamaahId)}
                className="px-4 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white font-semibold rounded-lg cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item to Catalog Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
              isDark
                ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                : 'bg-white border-[#dedbd2] text-[#23211e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold">
                Tambah Item Perlengkapan ke Katalog
              </h3>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateEquipmentItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Nama Perlengkapan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Koper Kabin 20 Inch Fiber"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Kategori</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  >
                    <option value="Koper & Tas">Koper &amp; Tas</option>
                    <option value="Pakaian Ibadah">Pakaian Ibadah</option>
                    <option value="Buku & Identitas">Buku &amp; Identitas</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Status di Paket</label>
                  <select
                    value={newItemIsIncluded ? 'included' : 'excluded'}
                    onChange={(e) => setNewItemIsIncluded(e.target.value === 'included')}
                    className={`w-full p-2 rounded-lg border font-semibold ${
                      newItemIsIncluded ? 'text-emerald-600' : 'text-rose-600'
                    } ${
                      isDark ? 'bg-[#1a1918] border-[#33312e]' : 'bg-[#faf9f6] border-[#dedbd2]'
                    }`}
                  >
                    <option value="included">&#10003; Termasuk (Included)</option>
                    <option value="excluded">&times; Tidak Termasuk (Opsional)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Jumlah Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Satuan</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="Unit, Pcs, Set, Potong"
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Keterangan / Spesifikasi</label>
                <input
                  type="text"
                  placeholder="Kapasitas, bahan, warna, ukuran..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]' : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                    isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#eeebe3]'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white font-semibold rounded-lg cursor-pointer"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
