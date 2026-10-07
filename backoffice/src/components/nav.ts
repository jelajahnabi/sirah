import {
  LayoutDashboard,
  Compass,
  Users,
  Plane,
  BedDouble,
  Wallet,
  MessageCircle,
  Luggage,
} from 'lucide-react';
import { NavTab } from '../context/AppContext';

export interface NavItem {
  id: NavTab;
  label: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Utama',
    items: [
      { id: 'dashboard', label: 'Dashboard', title: 'Dashboard', icon: LayoutDashboard },
      { id: 'packages', label: 'Paket & Kuota', title: 'Paket Umroh', icon: Compass },
      { id: 'jamaah', label: 'Data Jamaah', title: 'Data Jamaah', icon: Users },
      { id: 'manifest', label: 'Manifest', title: 'Manifest Penerbangan', icon: Plane },
    ],
  },
  {
    label: 'Operasional',
    items: [
      { id: 'rooming', label: 'Rooming List', title: 'Rooming List', icon: BedDouble },
      { id: 'finance', label: 'Keuangan', title: 'Keuangan & Kwitansi', icon: Wallet },
      { id: 'whatsapp', label: 'WhatsApp', title: 'WhatsApp Center', icon: MessageCircle },
      { id: 'equipment', label: 'Logistik Koper', title: 'Logistik Koper', icon: Luggage },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
