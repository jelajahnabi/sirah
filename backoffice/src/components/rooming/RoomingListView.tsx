import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoomAssignment } from '../../types';
import { Badge, Button, Card, EmptyState, Field, IconButton, Modal, PageHeader, Segmented, cx } from '../ui';
import { BedDouble, MapPin, Plus, Trash2, UserPlus } from 'lucide-react';

const CAPACITY: Record<RoomAssignment['roomType'], number> = { Quad: 4, Triple: 3, Double: 2 };
const GENDER_TONE = { Ikhwan: 'info', Akhwat: 'violet', Family: 'accent' } as const;

export const RoomingListView: React.FC = () => {
  const { rooms, jamaahList, assignToRoom, removeFromRoom, createRoom } = useApp();
  const [location, setLocation] = useState<'all' | 'Makkah' | 'Madinah'>('all');
  const [assigningRoomId, setAssigningRoomId] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    roomNumber: '',
    hotelLocation: 'Makkah' as RoomAssignment['hotelLocation'],
    hotelName: 'Emaar Grand Makkah',
    roomType: 'Quad' as RoomAssignment['roomType'],
    gender: 'Ikhwan' as RoomAssignment['gender'],
  });

  const filtered = rooms.filter((r) => location === 'all' || r.hotelLocation === location);
  const totalBeds = filtered.reduce((a, r) => a + CAPACITY[r.roomType], 0);
  const usedBeds = filtered.reduce((a, r) => a + r.occupants.length, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.roomNumber.trim()) return;
    createRoom({ ...form, roomNumber: form.roomNumber.trim() });
    setForm({ ...form, roomNumber: '' });
    setShowAdd(false);
  };

  const handleAssign = (roomId: string, jamaahId: string) => {
    const j = jamaahList.find((x) => x.id === jamaahId);
    if (!j) return;
    assignToRoom(roomId, { jamaahId: j.id, jamaahName: j.fullName, gender: j.gender || 'L', phone: j.phoneWhatsapp });
    setAssigningRoomId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rooming list"
        description="Penempatan kamar Quad (4), Triple (3), dan Double (2) di hotel Makkah & Madinah."
        actions={
          <>
            <Segmented
              value={location}
              onChange={setLocation}
              options={[
                { value: 'all', label: 'Semua' },
                { value: 'Makkah', label: 'Makkah' },
                { value: 'Madinah', label: 'Madinah' },
              ]}
            />
            <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>
              Tambah Kamar
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Kamar', value: filtered.length },
          { label: 'Kasur terisi', value: `${usedBeds}/${totalBeds}` },
          { label: 'Kasur kosong', value: totalBeds - usedBeds },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-[13px] text-muted">{s.label}</div>
            <div className="num mt-2 text-2xl font-bold text-ink">{s.value}</div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={BedDouble} title="Belum ada kamar">
            Tambahkan kamar hotel untuk mulai menempatkan jamaah.
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((room) => {
            const limit = CAPACITY[room.roomType];
            const full = room.occupants.length >= limit;
            const candidates = jamaahList.filter(
              (j) =>
                !room.occupants.some((o) => o.jamaahId === j.id) &&
                (room.gender === 'Family' ||
                  (room.gender === 'Ikhwan' && j.gender !== 'P') ||
                  (room.gender === 'Akhwat' && j.gender === 'P'))
            );
            return (
              <Card key={room.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-ink">{room.roomNumber}</h3>
                      <Badge tone={GENDER_TONE[room.gender]}>{room.gender}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="size-3.5" />
                      <span className="truncate">
                        {room.hotelName} · {room.hotelLocation}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-lg bg-subtle px-2 py-1 text-[11px] font-semibold text-muted">{room.roomType}</span>
                </div>

                {/* Slot kasur */}
                <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${limit}, minmax(0, 1fr))` }}>
                  {Array.from({ length: limit }).map((_, i) => (
                    <span
                      key={i}
                      className={cx('h-1.5 rounded-full', i < room.occupants.length ? 'bg-accent' : 'bg-subtle')}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-muted">
                  {full ? 'Kamar penuh' : `${limit - room.occupants.length} kasur tersedia`}
                </div>

                <ul className="mt-4 flex-1 divide-y divide-line">
                  {room.occupants.length === 0 && <li className="py-4 text-center text-xs text-faint">Kamar masih kosong.</li>}
                  {room.occupants.map((o) => (
                    <li key={o.jamaahId} className="flex items-center justify-between gap-2 py-2.5">
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold text-ink">{o.jamaahName}</div>
                        <div className="text-[11px] text-muted">
                          {o.gender === 'L' ? 'Ikhwan' : 'Akhwat'} · <span className="font-mono">{o.phone}</span>
                        </div>
                      </div>
                      <IconButton
                        icon={Trash2}
                        label="Keluarkan dari kamar"
                        className="size-8 hover:text-rose-500"
                        onClick={() => removeFromRoom(room.id, o.jamaahId)}
                      />
                    </li>
                  ))}
                </ul>

                {!full &&
                  (assigningRoomId === room.id ? (
                    <div className="mt-3 flex gap-2">
                      <select
                        className="input h-9 flex-1"
                        defaultValue=""
                        autoFocus
                        onChange={(e) => e.target.value && handleAssign(room.id, e.target.value)}
                      >
                        <option value="" disabled>
                          Pilih jamaah ({room.gender})…
                        </option>
                        {candidates.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.fullName} ({j.phoneWhatsapp})
                          </option>
                        ))}
                      </select>
                      <Button size="sm" variant="ghost" className="h-9" onClick={() => setAssigningRoomId(null)}>
                        Batal
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigningRoomId(room.id)}
                      className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-strong text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <UserPlus className="size-3.5" /> Masukkan jamaah
                    </button>
                  ))}
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Tambah kamar hotel"
        icon={BedDouble}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Batal
            </Button>
            <Button variant="primary" type="submit" form="add-room-form">
              Simpan Kamar
            </Button>
          </>
        }
      >
        <form id="add-room-form" onSubmit={handleCreate} className="space-y-4">
          <Field label="Nomor kamar">
            <input
              className="input"
              required
              placeholder="Misal: Room 804"
              value={form.roomNumber}
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lokasi">
              <select
                className="input"
                value={form.hotelLocation}
                onChange={(e) => setForm({ ...form, hotelLocation: e.target.value as RoomAssignment['hotelLocation'] })}
              >
                <option value="Makkah">Makkah</option>
                <option value="Madinah">Madinah</option>
              </select>
            </Field>
            <Field label="Tipe kamar">
              <select
                className="input"
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value as RoomAssignment['roomType'] })}
              >
                <option value="Quad">Quad (4 pax)</option>
                <option value="Triple">Triple (3 pax)</option>
                <option value="Double">Double (2 pax)</option>
              </select>
            </Field>
          </div>
          <Field label="Nama hotel">
            <input className="input" required value={form.hotelName} onChange={(e) => setForm({ ...form, hotelName: e.target.value })} />
          </Field>
          <Field label="Penghuni">
            <select
              className="input"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value as RoomAssignment['gender'] })}
            >
              <option value="Ikhwan">Ikhwan (laki-laki)</option>
              <option value="Akhwat">Akhwat (perempuan)</option>
              <option value="Family">Keluarga</option>
            </select>
          </Field>
        </form>
      </Modal>
    </div>
  );
};
