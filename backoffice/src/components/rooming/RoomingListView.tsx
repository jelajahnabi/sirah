import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoomAssignment, Gender } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import {
  BedDouble,
  Building,
  UserPlus,
  Users,
  Plus,
  Trash2,
  Printer,
  ShieldAlert,
  CheckCircle,
  MapPin,
  X,
} from 'lucide-react';

export const RoomingListView: React.FC = () => {
  const { rooms, jamaahList, assignToRoom, removeFromRoom, createRoom, theme } = useApp();

  const isDark = theme === 'dark';
  const [locationFilter, setLocationFilter] = useState<'all' | 'Makkah' | 'Madinah'>('all');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomLocation, setNewRoomLocation] = useState<'Makkah' | 'Madinah'>('Makkah');
  const [newHotelName, setNewHotelName] = useState('Emaar Grand Makkah');
  const [newRoomType, setNewRoomType] = useState<'Quad' | 'Triple' | 'Double'>('Quad');
  const [newRoomGender, setNewRoomGender] = useState<'Ikhwan' | 'Akhwat' | 'Family'>('Ikhwan');

  const [assigningRoomId, setAssigningRoomId] = useState<string | null>(null);

  const filteredRooms = rooms.filter(
    (r) => locationFilter === 'all' || r.hotelLocation === locationFilter
  );

  const maxCapacity = (type: 'Quad' | 'Triple' | 'Double'): number => {
    switch (type) {
      case 'Quad':
        return 4;
      case 'Triple':
        return 3;
      case 'Double':
        return 2;
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber) return;

    createRoom({
      roomNumber: newRoomNumber,
      hotelLocation: newRoomLocation,
      hotelName: newHotelName,
      roomType: newRoomType,
      gender: newRoomGender,
    });

    setNewRoomNumber('');
    setShowAddRoomModal(false);
  };

  const handleAssignSubmit = (roomId: string, jamaahId: string) => {
    const j = jamaahList.find((item) => item.id === jamaahId);
    if (!j) return;

    assignToRoom(roomId, {
      jamaahId: j.id,
      jamaahName: j.fullName,
      gender: j.gender || 'L',
      phone: j.phoneWhatsapp,
    });
    setAssigningRoomId(null);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div
        className={`p-5 rounded-xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
            : 'bg-white border-[#e8e5dc] text-[#23211e]'
        }`}
      >
        <div>
          <h2 className="text-base font-bold">
            Alokasi Rooming List Hotel
          </h2>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? 'text-[#9c988f]' : 'text-[#737069]'
            }`}
          >
            Penempatan kamar Quad (4 Pax), Triple (3 Pax), Double (2 Pax) Makkah &amp; Madinah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Location Filter */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg border text-xs ${
              isDark
                ? 'bg-[#1a1918] border-[#2d2c29]'
                : 'bg-[#f7f6f2] border-[#dedbd2]'
            }`}
          >
            <button
              onClick={() => setLocationFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                locationFilter === 'all'
                  ? isDark
                    ? 'bg-[#2d2b28] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#23211e] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              Semua Lokasi
            </button>
            <button
              onClick={() => setLocationFilter('Makkah')}
              className={`px-3 py-1 rounded-md transition-colors ${
                locationFilter === 'Makkah'
                  ? isDark
                    ? 'bg-[#2d2b28] text-[#f27244] font-semibold shadow-xs'
                    : 'bg-white text-[#e06336] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              Makkah
            </button>
            <button
              onClick={() => setLocationFilter('Madinah')}
              className={`px-3 py-1 rounded-md transition-colors ${
                locationFilter === 'Madinah'
                  ? isDark
                    ? 'bg-[#2d2b28] text-[#f27244] font-semibold shadow-xs'
                    : 'bg-white text-[#e06336] font-semibold shadow-2xs'
                  : 'text-[#8c8982]'
              }`}
            >
              Madinah
            </button>
          </div>

          <button
            onClick={() => setShowAddRoomModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kamar</span>
          </button>
        </div>
      </div>

      {/* Rooming Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const limit = maxCapacity(room.roomType);
          const isFull = room.occupants.length >= limit;

          return (
            <div
              key={room.id}
              className={`rounded-xl border overflow-hidden shadow-xs flex flex-col justify-between transition-colors ${
                isDark
                  ? 'bg-[#22211f] border-[#33312e]'
                  : 'bg-white border-[#e8e5dc]'
              }`}
            >
              <div>
                {/* Room Header */}
                <div
                  className={`p-4 border-b flex items-center justify-between ${
                    isDark
                      ? 'border-[#2d2c29] bg-[#1e1d1b]'
                      : 'border-[#eeece6] bg-[#faf9f6]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                        }`}
                      >
                        {room.roomNumber}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          isDark
                            ? 'text-[#a6a39b] bg-[#282725] border-[#383633]'
                            : 'text-[#6b6760] bg-[#f0ede6] border-[#dedbd2]'
                        }`}
                      >
                        {room.roomType} ({limit} Pax)
                      </span>
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 flex items-center gap-1.5 ${
                        isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#f27244]" />
                      <span>{room.hotelName}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold ${
                      room.gender === 'Ikhwan'
                        ? 'text-[#38bdf8]'
                        : room.gender === 'Akhwat'
                        ? 'text-[#f472b6]'
                        : 'text-[#10b981]'
                    }`}
                  >
                    {room.gender}
                  </span>
                </div>

                {/* Occupants List */}
                <div className="p-4 space-y-2">
                  <div
                    className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${
                      isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                    }`}
                  >
                    <span>Penghuni ({room.occupants.length}/{limit})</span>
                    {isFull ? (
                      <span className="text-emerald-500 font-bold">Penuh</span>
                    ) : (
                      <span className="text-amber-500">Tersedia {limit - room.occupants.length} Kasur</span>
                    )}
                  </div>

                  <div
                    className={`divide-y ${
                      isDark ? 'divide-[#2d2c29]' : 'divide-[#f0ede6]'
                    }`}
                  >
                    {room.occupants.length === 0 ? (
                      <div
                        className={`py-4 text-center text-xs ${
                          isDark ? 'text-[#737069]' : 'text-[#9c988f]'
                        }`}
                      >
                        Kamar masih kosong.
                      </div>
                    ) : (
                      room.occupants.map((occ) => (
                        <div
                          key={occ.jamaahId}
                          className="py-2 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div
                              className={`font-semibold ${
                                isDark ? 'text-[#f4f3ef]' : 'text-[#23211e]'
                              }`}
                            >
                              {occ.jamaahName}
                            </div>
                            <div
                              className={`text-[11px] ${
                                isDark ? 'text-[#737069]' : 'text-[#8c8982]'
                              }`}
                            >
                              {occ.gender === 'L' ? 'Ikhwan' : 'Akhwat'} · {occ.phone}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromRoom(room.id, occ.jamaahId)}
                            className={`p-1 transition-colors ${
                              isDark
                                ? 'text-[#737069] hover:text-[#f87171]'
                                : 'text-[#9c988f] hover:text-[#e11d48]'
                            }`}
                            title="Keluarkan dari kamar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Assign Action */}
              <div
                className={`p-4 pt-0 border-t mt-2 ${
                  isDark ? 'border-[#2d2c29]' : 'border-[#eeece6]'
                }`}
              >
                {!isFull && (
                  <div>
                    {assigningRoomId === room.id ? (
                      <div className="space-y-2 pt-2">
                        <select
                          className={`w-full text-xs p-2 border rounded-lg ${
                            isDark
                              ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                              : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                          }`}
                          onChange={(e) => {
                            if (e.target.value) handleAssignSubmit(room.id, e.target.value);
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            -- Pilih Jamaah ({room.gender}) --
                          </option>
                          {jamaahList
                            .filter(
                              (j) =>
                                !room.occupants.some((o) => o.jamaahId === j.id) &&
                                (room.gender === 'Family' ||
                                  (room.gender === 'Ikhwan' && j.gender !== 'P') ||
                                  (room.gender === 'Akhwat' && j.gender === 'P'))
                            )
                            .map((j) => (
                              <option key={j.id} value={j.id}>
                                {j.fullName} ({j.phoneWhatsapp})
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => setAssigningRoomId(null)}
                          className={`text-[11px] ${
                            isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#8c8982] hover:text-[#23211e]'
                          }`}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningRoomId(room.id)}
                        className={`w-full mt-3 py-1.5 rounded-lg border border-dashed text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                          isDark
                            ? 'border-[#383633] text-[#a6a39b] hover:text-white hover:border-[#f27244]/60'
                            : 'border-[#dedbd2] text-[#6b6760] hover:text-[#23211e] hover:border-[#f27244]/60'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#f27244]" />
                        <span>+ Masukkan Jamaah</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${
              isDark
                ? 'bg-[#22211f] border-[#33312e] text-[#f4f3ef]'
                : 'bg-white border-[#dedbd2] text-[#23211e]'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b"
              style={{ borderColor: isDark ? '#2d2c29' : '#eeece6' }}
            >
              <h3 className="text-sm font-bold">
                Tambah Kamar Hotel Baru
              </h3>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className={`p-1 rounded-md ${
                  isDark ? 'text-[#737069] hover:text-[#f4f3ef]' : 'text-[#9c988f] hover:text-[#23211e]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">
                  Nomor Kamar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Room 804"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">
                    Lokasi Hotel
                  </label>
                  <select
                    value={newRoomLocation}
                    onChange={(e) => setNewRoomLocation(e.target.value as any)}
                    className={`w-full p-2 border rounded-lg ${
                      isDark
                        ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  >
                    <option value="Makkah">Makkah</option>
                    <option value="Madinah">Madinah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Tipe Kamar
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className={`w-full p-2 border rounded-lg ${
                      isDark
                        ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                        : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                    }`}
                  >
                    <option value="Quad">Quad (4 Pax)</option>
                    <option value="Triple">Triple (3 Pax)</option>
                    <option value="Double">Double (2 Pax)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Nama Hotel
                </label>
                <input
                  type="text"
                  required
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Kategori Penghuni
                </label>
                <select
                  value={newRoomGender}
                  onChange={(e) => setNewRoomGender(e.target.value as any)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? 'bg-[#1a1918] border-[#33312e] text-[#f4f3ef]'
                      : 'bg-[#faf9f6] border-[#dedbd2] text-[#23211e]'
                  }`}
                >
                  <option value="Ikhwan">Ikhwan (Laki-laki)</option>
                  <option value="Akhwat">Akhwat (Perempuan)</option>
                  <option value="Family">Keluarga (Family)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className={`px-3 py-1.5 rounded-lg ${
                    isDark ? 'text-[#9c988f] hover:bg-[#282725]' : 'text-[#737069] hover:bg-[#eeebe3]'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#f27244] hover:bg-[#e06336] text-white font-semibold rounded-lg shadow-xs"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
