import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UmrohPackage,
  Jamaah,
  DepartureGroup,
  PaymentTransaction,
  RoomAssignment,
  EquipmentStatus,
  VisaStatus,
  PaymentStatus,
  EquipmentItem,
} from '../types';
import {
  INITIAL_PACKAGES,
  INITIAL_JAMAAH,
  INITIAL_DEPARTURE_GROUPS,
  INITIAL_TRANSACTIONS,
  INITIAL_ROOMS,
  INITIAL_EQUIPMENT_ITEMS,
} from '../data/mockData';

export type NavTab =
  | 'dashboard'
  | 'packages'
  | 'jamaah'
  | 'manifest'
  | 'rooming'
  | 'finance'
  | 'whatsapp'
  | 'equipment';

interface AppContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  packages: UmrohPackage[];
  jamaahList: Jamaah[];
  departureGroups: DepartureGroup[];
  transactions: PaymentTransaction[];
  rooms: RoomAssignment[];

  // Auth methods & state
  isAuthenticated: boolean;
  currentUser: { username: string; role: string; name: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  // Package methods
  addPackage: (pkg: Omit<UmrohPackage, 'id' | 'bookedSeats'>) => void;
  updatePackage: (id: string, pkg: Partial<UmrohPackage>) => void;
  updatePackageStatus: (id: string, status: 'Open' | 'Fast Filling' | 'Sold Out' | 'Closed') => void;
  deletePackage: (id: string) => void;

  // Jamaah methods
  addJamaah: (jamaah: {
    fullName: string;
    phoneWhatsapp: string;
    packageId?: string;
    departureDate?: string;
    downPayment?: number;
    ktpFileUrl?: string;
    ktpFileName?: string;
    passportFileUrl?: string;
    passportFileName?: string;
    nik?: string;
    passportNumber?: string;
    birthDate?: string;
    birthPlace?: string;
    city?: string;
    address?: string;
    specialNotes?: string;
  }) => void;
  updateJamaah: (id: string, jamaah: Partial<Jamaah>) => void;
  deleteJamaah: (id: string) => void;
  updateJamaahVisa: (id: string, status: VisaStatus) => void;
  updateJamaahEquipment: (id: string, status: EquipmentStatus, resi?: string) => void;
  uploadJamaahDocument: (id: string, type: 'ktp' | 'passport', fileUrl: string, fileName: string) => void;

  // Finance methods
  addPaymentTransaction: (tx: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => PaymentTransaction;
  signatoryStaffName: string;
  setSignatoryStaffName: (name: string) => void;
  showSignatoryModal: boolean;
  setShowSignatoryModal: (show: boolean) => void;
  customFinanceFormat: { fileName: string; uploadDate: string; rowCount: number } | null;
  setCustomFinanceFormat: (fmt: { fileName: string; uploadDate: string; rowCount: number } | null) => void;

  // Equipment & Logistics
  equipmentCatalog: EquipmentItem[];
  addEquipmentItem: (item: Omit<EquipmentItem, 'id'>) => void;
  updateEquipmentItem: (id: string, item: Partial<EquipmentItem>) => void;
  deleteEquipmentItem: (id: string) => void;
  shippingLabelJamaah: Jamaah | null;
  setShippingLabelJamaah: (jamaah: Jamaah | null) => void;

  // Rooming methods
  assignToRoom: (roomId: string, jamaah: { jamaahId: string; jamaahName: string; gender: 'L' | 'P'; phone: string }) => void;
  removeFromRoom: (roomId: string, jamaahId: string) => void;
  createRoom: (room: Omit<RoomAssignment, 'id' | 'occupants'>) => void;

  // Modals & Selection states
  selectedJamaah: Jamaah | null;
  setSelectedJamaah: (jamaah: Jamaah | null) => void;
  showAddJamaahModal: boolean;
  setShowAddJamaahModal: (show: boolean) => void;
  showAddPackageModal: boolean;
  setShowAddPackageModal: (show: boolean) => void;
  showManagePackageModal: boolean;
  setShowManagePackageModal: (show: boolean) => void;
  receiptModalTx: PaymentTransaction | null;
  setReceiptModalTx: (tx: PaymentTransaction | null) => void;
  selectedPackageDetail: UmrohPackage | null;
  setSelectedPackageDetail: (pkg: UmrohPackage | null) => void;
  idCardJamaah: Jamaah | null;
  setIdCardJamaah: (jamaah: Jamaah | null) => void;

  // Theme & Logo
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
  isLogoModalOpen: boolean;
  setIsLogoModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mkb_auth_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<{ username: string; role: string; name: string } | null>(() => {
    const isLogged = localStorage.getItem('mkb_auth_logged_in') === 'true';
    return isLogged ? { username: 'admin', role: 'Super Admin Backoffice', name: 'Administrator MKB' } : null;
  });

  const login = (u: string, p: string): boolean => {
    if (u === 'admin' && p === 'adminmkb') {
      setIsAuthenticated(true);
      setCurrentUser({ username: 'admin', role: 'Super Admin Backoffice', name: 'Administrator MKB' });
      localStorage.setItem('mkb_auth_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('mkb_auth_logged_in');
  };

  // Signatory Staff Name for Receipts
  const [signatoryStaffName, setSignatoryStaffNameState] = useState<string>(() => {
    return localStorage.getItem('mkb_signatory_staff') || 'Umi Kalsum (Finance MKB)';
  });

  const setSignatoryStaffName = (name: string) => {
    setSignatoryStaffNameState(name);
    localStorage.setItem('mkb_signatory_staff', name);
  };

  const [showSignatoryModal, setShowSignatoryModal] = useState(false);

  // Custom Finance Format Template Upload
  const [customFinanceFormat, setCustomFinanceFormatState] = useState<{
    fileName: string;
    uploadDate: string;
    rowCount: number;
  } | null>(() => {
    const saved = localStorage.getItem('mkb_custom_finance_fmt');
    return saved ? JSON.parse(saved) : null;
  });

  const setCustomFinanceFormat = (fmt: { fileName: string; uploadDate: string; rowCount: number } | null) => {
    setCustomFinanceFormatState(fmt);
    if (fmt) {
      localStorage.setItem('mkb_custom_finance_fmt', JSON.stringify(fmt));
    } else {
      localStorage.removeItem('mkb_custom_finance_fmt');
    }
  };

  // Dark and Light Mode state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('mkb_theme_mode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem('mkb_theme_mode', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Custom Logo upload state (persisted as Base64 Data URL)
  const [customLogo, setCustomLogoState] = useState<string | null>(() => {
    return localStorage.getItem('mkb_custom_logo');
  });

  const setCustomLogo = (logo: string | null) => {
    setCustomLogoState(logo);
    if (logo) {
      localStorage.setItem('mkb_custom_logo', logo);
    } else {
      localStorage.removeItem('mkb_custom_logo');
    }
  };

  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  // Packages state
  const [packages, setPackages] = useState<UmrohPackage[]>(() => {
    const saved = localStorage.getItem('mkb_packages_v3');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [jamaahList, setJamaahList] = useState<Jamaah[]>(() => {
    const saved = localStorage.getItem('mkb_jamaah_v2');
    return saved ? JSON.parse(saved) : INITIAL_JAMAAH;
  });

  const [departureGroups, setDepartureGroups] = useState<DepartureGroup[]>(() => {
    const saved = localStorage.getItem('mkb_departures_v2');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTURE_GROUPS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('mkb_transactions_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [rooms, setRooms] = useState<RoomAssignment[]>(() => {
    const saved = localStorage.getItem('mkb_rooms_v2');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  // Equipment Catalog state
  const [equipmentCatalog, setEquipmentCatalog] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem('mkb_equipment_catalog_v2');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('mkb_equipment_catalog_v2', JSON.stringify(equipmentCatalog));
  }, [equipmentCatalog]);

  const addEquipmentItem = (item: Omit<EquipmentItem, 'id'>) => {
    const newItem: EquipmentItem = {
      ...item,
      id: `eq-${Date.now()}`,
    };
    setEquipmentCatalog((prev) => [newItem, ...prev]);
  };

  const updateEquipmentItem = (id: string, item: Partial<EquipmentItem>) => {
    setEquipmentCatalog((prev) => prev.map((e) => (e.id === id ? { ...e, ...item } : e)));
  };

  const deleteEquipmentItem = (id: string) => {
    setEquipmentCatalog((prev) => prev.filter((e) => e.id !== id));
  };

  // Shipping Label modal state
  const [shippingLabelJamaah, setShippingLabelJamaah] = useState<Jamaah | null>(null);

  // Modal states
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null);
  const [showAddJamaahModal, setShowAddJamaahModal] = useState<boolean>(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
  const [showManagePackageModal, setShowManagePackageModal] = useState<boolean>(false);
  const [receiptModalTx, setReceiptModalTx] = useState<PaymentTransaction | null>(null);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState<UmrohPackage | null>(null);
  const [idCardJamaah, setIdCardJamaah] = useState<Jamaah | null>(null);

  // Sync back to localStorage
  useEffect(() => {
    localStorage.setItem('mkb_packages_v3', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('mkb_jamaah_v2', JSON.stringify(jamaahList));
  }, [jamaahList]);

  useEffect(() => {
    localStorage.setItem('mkb_departures_v2', JSON.stringify(departureGroups));
  }, [departureGroups]);

  useEffect(() => {
    localStorage.setItem('mkb_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mkb_rooms_v2', JSON.stringify(rooms));
  }, [rooms]);

  // Actions
  const addPackage = (pkg: Omit<UmrohPackage, 'id' | 'bookedSeats'>) => {
    // Generate harmonious kanbanColors if not set
    const defaultColor = {
      accent: '#f27244',
      dotColor: '#f27244',
      badgeBgDark: '#361e15',
      badgeBgLight: '#ffede6',
      badgeTextDark: '#ff8f6b',
      badgeTextLight: '#c8471b',
      columnBorderDark: '#4d291c',
      columnBorderLight: '#fed7c8',
      columnHeaderDark: '#281711',
      columnHeaderLight: '#fff5f1',
      cardBgDark: '#231814',
      cardBgLight: '#fffaf8',
    };
    const newPkg: UmrohPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      bookedSeats: 0,
      kanbanColors: pkg.kanbanColors || defaultColor,
    };
    setPackages((prev) => [newPkg, ...prev]);
  };

  const updatePackage = (id: string, updated: Partial<UmrohPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const updatePackageStatus = (id: string, status: 'Open' | 'Fast Filling' | 'Sold Out' | 'Closed') => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Simple registration: ONLY Nama and No HP required!
  const addJamaah = (input: {
    fullName: string;
    phoneWhatsapp: string;
    packageId?: string;
    departureDate?: string;
    downPayment?: number;
    ktpFileUrl?: string;
    ktpFileName?: string;
    passportFileUrl?: string;
    passportFileName?: string;
    nik?: string;
    passportNumber?: string;
    birthDate?: string;
    birthPlace?: string;
    city?: string;
    address?: string;
    specialNotes?: string;
  }) => {
    const targetPkgId = input.packageId || packages[0]?.id || 'pkg-sebulan-nov';
    const pkg = packages.find((p) => p.id === targetPkgId) || packages[0];
    const targetCost = pkg ? pkg.price : 29900000;
    const paid = input.downPayment || 0;

    let payStatus: PaymentStatus = 'Belum Bayar';
    if (paid >= targetCost) payStatus = 'Lunas';
    else if (paid > 0) payStatus = 'DP Terbayar';

    const isComplete = Boolean(
      input.nik &&
      input.passportNumber &&
      (input.ktpFileUrl || input.ktpFileName) &&
      (input.passportFileUrl || input.passportFileName)
    );

    const newJamaah: Jamaah = {
      id: `jmh-${Date.now()}`,
      packageId: targetPkgId,
      departureDate: input.departureDate || pkg?.departureDates[0] || '2026-11-05',
      fullName: input.fullName,
      phoneWhatsapp: input.phoneWhatsapp,
      nik: input.nik,
      passportNumber: input.passportNumber,
      birthDate: input.birthDate,
      birthPlace: input.birthPlace,
      city: input.city || 'Yogyakarta',
      address: input.address || 'Jl. Bener, Tegalrejo, Kota Yogyakarta',
      specialNotes: input.specialNotes,
      documentStatus: {
        passportUploaded: Boolean(input.passportFileUrl || input.passportFileName),
        ktpUploaded: Boolean(input.ktpFileUrl || input.ktpFileName),
        passportOriginal: false,
        meningitisVaccine: false,
        biometricPhoto: false,
        kemenhajRecommendation: false,
      },
      ktpFileUrl: input.ktpFileUrl,
      ktpFileName: input.ktpFileName,
      passportFileUrl: input.passportFileUrl,
      passportFileName: input.passportFileName,
      visaStatus: 'Belum Proses',
      paymentStatus: payStatus,
      totalCost: targetCost,
      amountPaid: paid,
      registeredDate: new Date().toISOString().split('T')[0],
      equipmentStatus: 'Belum Diambil',
      isDataComplete: isComplete,
    };

    setJamaahList((prev) => [newJamaah, ...prev]);

    // Update package booked seat count
    setPackages((prev) =>
      prev.map((p) => (p.id === targetPkgId ? { ...p, bookedSeats: p.bookedSeats + 1 } : p))
    );

    // Auto create transaction if DP is given
    if (paid > 0) {
      addPaymentTransaction({
        invoiceNumber: `INV-MKB-${Date.now().toString().slice(-6)}`,
        jamaahId: newJamaah.id,
        jamaahName: newJamaah.fullName,
        packageName: pkg ? pkg.name : 'Paket Umroh MKB',
        amount: paid,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Transfer BSI',
        paymentType: paid >= targetCost ? 'Pelunasan Akhir' : 'DP Pendaftaran',
        notes: 'Pembayaran otomatis saat pendaftaran jamaah',
        verifiedBy: signatoryStaffName,
      });
    }
  };

  const updateJamaah = (id: string, updated: Partial<Jamaah>) => {
    setJamaahList((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const merged = { ...j, ...updated };
          const isComplete = Boolean(
            merged.nik &&
            merged.passportNumber &&
            (merged.ktpFileUrl || merged.ktpFileName || merged.documentStatus.ktpUploaded) &&
            (merged.passportFileUrl || merged.passportFileName || merged.documentStatus.passportUploaded)
          );
          return { ...merged, isDataComplete: isComplete };
        }
        return j;
      })
    );
  };

  const deleteJamaah = (id: string) => {
    setJamaahList((prev) => prev.filter((j) => j.id !== id));
  };

  const updateJamaahVisa = (id: string, status: VisaStatus) => {
    setJamaahList((prev) =>
      prev.map((j) => (j.id === id ? { ...j, visaStatus: status } : j))
    );
  };

  const updateJamaahEquipment = (id: string, status: EquipmentStatus, resi?: string) => {
    setJamaahList((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, equipmentStatus: status, equipmentResi: resi } : j
      )
    );
  };

  const uploadJamaahDocument = (
    id: string,
    type: 'ktp' | 'passport',
    fileUrl: string,
    fileName: string
  ) => {
    setJamaahList((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const docStatus = { ...j.documentStatus };
          if (type === 'ktp') {
            docStatus.ktpUploaded = true;
            return {
              ...j,
              documentStatus: docStatus,
              ktpFileUrl: fileUrl,
              ktpFileName: fileName,
            };
          } else {
            docStatus.passportUploaded = true;
            return {
              ...j,
              documentStatus: docStatus,
              passportFileUrl: fileUrl,
              passportFileName: fileName,
            };
          }
        }
        return j;
      })
    );
  };

  const addPaymentTransaction = (
    txData: Omit<PaymentTransaction, 'id' | 'receiptNumber'>
  ): PaymentTransaction => {
    const counter = transactions.length + 1;
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const receiptNum = `KW-MKB-${year}-${month}-${String(counter).padStart(4, '0')}`;

    const newTx: PaymentTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      receiptNumber: receiptNum,
      verifiedBy: txData.verifiedBy || signatoryStaffName,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update jamaah amount paid and status
    setJamaahList((prev) =>
      prev.map((j) => {
        if (j.id === txData.jamaahId) {
          const newPaid = j.amountPaid + txData.amount;
          let newStatus: PaymentStatus = j.paymentStatus;
          if (newPaid >= j.totalCost) {
            newStatus = 'Lunas';
          } else if (newPaid > 0) {
            newStatus = 'DP Terbayar';
          }
          return {
            ...j,
            amountPaid: newPaid,
            paymentStatus: newStatus,
          };
        }
        return j;
      })
    );

    return newTx;
  };

  const assignToRoom = (
    roomId: string,
    jamaah: { jamaahId: string; jamaahName: string; gender: 'L' | 'P'; phone: string }
  ) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          if (r.occupants.some((o) => o.jamaahId === jamaah.jamaahId)) {
            return r;
          }
          return {
            ...r,
            occupants: [...r.occupants, jamaah],
          };
        }
        return r;
      })
    );
  };

  const removeFromRoom = (roomId: string, jamaahId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            occupants: r.occupants.filter((o) => o.jamaahId !== jamaahId),
          };
        }
        return r;
      })
    );
  };

  const createRoom = (roomData: Omit<RoomAssignment, 'id' | 'occupants'>) => {
    const newRoom: RoomAssignment = {
      ...roomData,
      id: `room-${Date.now()}`,
      occupants: [],
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        packages,
        jamaahList,
        departureGroups,
        transactions,
        rooms,
        isAuthenticated,
        currentUser,
        login,
        logout,
        addPackage,
        updatePackage,
        updatePackageStatus,
        deletePackage,
        addJamaah,
        updateJamaah,
        deleteJamaah,
        updateJamaahVisa,
        updateJamaahEquipment,
        uploadJamaahDocument,
        addPaymentTransaction,
        signatoryStaffName,
        setSignatoryStaffName,
        showSignatoryModal,
        setShowSignatoryModal,
        customFinanceFormat,
        setCustomFinanceFormat,
        equipmentCatalog,
        addEquipmentItem,
        updateEquipmentItem,
        deleteEquipmentItem,
        shippingLabelJamaah,
        setShippingLabelJamaah,
        assignToRoom,
        removeFromRoom,
        createRoom,
        selectedJamaah,
        setSelectedJamaah,
        showAddJamaahModal,
        setShowAddJamaahModal,
        showAddPackageModal,
        setShowAddPackageModal,
        showManagePackageModal,
        setShowManagePackageModal,
        receiptModalTx,
        setReceiptModalTx,
        selectedPackageDetail,
        setSelectedPackageDetail,
        idCardJamaah,
        setIdCardJamaah,
        theme,
        setTheme,
        toggleTheme,
        customLogo,
        setCustomLogo,
        isLogoModalOpen,
        setIsLogoModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
