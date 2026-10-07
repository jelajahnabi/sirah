import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginView } from './components/auth/LoginView';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { PackageCatalogView } from './components/packages/PackageCatalogView';
import { JamaahDatabaseView } from './components/jamaah/JamaahDatabaseView';
import { ManifestGeneratorView } from './components/manifest/ManifestGeneratorView';
import { RoomingListView } from './components/rooming/RoomingListView';
import { FinanceInvoicingView } from './components/finance/FinanceInvoicingView';
import { WhatsAppCenterView } from './components/whatsapp/WhatsAppCenterView';
import { EquipmentTrackerView } from './components/equipment/EquipmentTrackerView';

import { AddJamaahModal } from './components/modals/AddJamaahModal';
import { AddPackageModal } from './components/modals/AddPackageModal';
import { ManagePackageModal } from './components/modals/ManagePackageModal';
import { JamaahDetailModal } from './components/modals/JamaahDetailModal';
import { OfficialReceiptModal } from './components/modals/OfficialReceiptModal';
import { PackageDetailModal } from './components/modals/PackageDetailModal';
import { IdCardPrintModal } from './components/modals/IdCardPrintModal';
import { LogoUploadModal } from './components/modals/LogoUploadModal';
import { ShippingLabelPrintModal } from './components/modals/ShippingLabelPrintModal';

const VIEWS = {
  dashboard: DashboardView,
  packages: PackageCatalogView,
  jamaah: JamaahDatabaseView,
  manifest: ManifestGeneratorView,
  rooming: RoomingListView,
  finance: FinanceInvoicingView,
  whatsapp: WhatsAppCenterView,
  equipment: EquipmentTrackerView,
};

const MainLayout: React.FC = () => {
  const { currentTab, isAuthenticated } = useApp();
  const [navOpen, setNavOpen] = useState(false);

  if (!isAuthenticated) return <LoginView />;

  const View = VIEWS[currentTab];

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenNav={() => setNavOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <View key={currentTab} />
        </main>
      </div>

      <AddJamaahModal />
      <AddPackageModal />
      <ManagePackageModal />
      <JamaahDetailModal />
      <OfficialReceiptModal />
      <PackageDetailModal />
      <IdCardPrintModal />
      <LogoUploadModal />
      <ShippingLabelPrintModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
