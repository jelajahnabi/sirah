export type PackageDuration = '16 Hari' | '30 Hari';

export interface RoomPrice {
  quad: number; // 4 orang per kamar
  triple?: number; // 3 orang per kamar
  double?: number; // 2 orang per kamar
}

export interface KanbanColorConfig {
  accent: string;
  dotColor: string;
  badgeBgDark: string;
  badgeBgLight: string;
  badgeTextDark: string;
  badgeTextLight: string;
  columnBorderDark: string;
  columnBorderLight: string;
  columnHeaderDark: string;
  columnHeaderLight: string;
  cardBgDark?: string;
  cardBgLight?: string;
}

export interface UmrohPackage {
  id: string;
  name: string;
  code: string;
  durationDays: number;
  departureMonth: string;
  price: number; // Base price in IDR
  roomPrices?: RoomPrice;
  makkahHotel: string;
  madinahHotel: string;
  airline: string;
  departureDates: string[];
  description: string;
  highlightFeatures: string[];
  quota: number;
  bookedSeats: number;
  status: 'Open' | 'Fast Filling' | 'Sold Out' | 'Closed';
  kanbanColors: KanbanColorConfig;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Koper & Tas' | 'Pakaian Ibadah' | 'Buku & Identitas' | 'Aksesoris';
  isIncluded: boolean; // Termasuk dalam paket atau Tidak termasuk
  stockQuantity: number;
  unit: string;
  description?: string;
}

export type Gender = 'L' | 'P';
export type VisaStatus = 'Belum Proses' | 'Proses Enjaz' | 'Issued' | 'Reject';
export type PaymentStatus = 'Belum Bayar' | 'DP Terbayar' | 'Cicilan' | 'Lunas';
export type EquipmentStatus = 'Belum Diambil' | 'Diambil di Kantor' | 'Dikirim Ekspedisi';

export interface Jamaah {
  id: string;
  packageId: string;
  departureDate: string;
  fullName: string; // WAJIB
  phoneWhatsapp: string; // WAJIB

  // Data pelengkap (bisa diisi belakangan)
  nik?: string; // 16 digit KTP
  title?: 'Mr' | 'Mrs' | 'Miss' | 'Mstr';
  gender?: Gender;
  birthPlace?: string;
  birthDate?: string; // YYYY-MM-DD
  age?: number;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  passportIssuePlace?: string;
  address?: string;
  city?: string;
  province?: string;
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  roomType?: 'Quad' | 'Triple' | 'Double' | 'Single';
  roomNumberMakkah?: string;
  roomNumberMadinah?: string;

  // File uploads (Data KTP & Paspor)
  ktpFileUrl?: string;
  ktpFileName?: string;
  passportFileUrl?: string;
  passportFileName?: string;

  // Status berkas Kemenhaj
  documentStatus: {
    ktpUploaded: boolean;
    passportUploaded: boolean;
    passportOriginal: boolean;
    meningitisVaccine: boolean;
    biometricPhoto: boolean;
    kemenhajRecommendation: boolean;
  };

  isDataComplete: boolean;

  visaStatus: VisaStatus;
  paymentStatus: PaymentStatus;
  totalCost: number;
  amountPaid: number;
  registeredDate: string;
  equipmentStatus: EquipmentStatus;
  equipmentResi?: string;
  specialNotes?: string;
}

export interface PaymentTransaction {
  id: string;
  invoiceNumber: string;
  receiptNumber: string;
  jamaahId: string;
  jamaahName: string;
  packageName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Transfer BSI' | 'Transfer Mandiri' | 'Tunai di Kantor' | 'BSI QRIS';
  paymentType: 'DP Pendaftaran' | 'Cicilan Ke-1' | 'Cicilan Ke-2' | 'Pelunasan Akhir';
  notes?: string;
  verifiedBy: string;
}

export interface RoomAssignment {
  id: string;
  hotelLocation: 'Makkah' | 'Madinah';
  hotelName: string;
  roomNumber: string;
  roomType: 'Quad' | 'Triple' | 'Double';
  gender: 'Ikhwan' | 'Akhwat' | 'Family';
  occupants: {
    jamaahId: string;
    jamaahName: string;
    gender: Gender;
    phone: string;
  }[];
}

export interface DepartureGroup {
  id: string;
  code: string;
  name: string;
  packageId: string;
  packageName: string;
  departureDate: string;
  returnDate: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  tourLeader: string;
  muthawif: string;
  totalQuota: number;
  status: 'Preparation' | 'Ready to Depart' | 'In Flight' | 'Completed';
}
