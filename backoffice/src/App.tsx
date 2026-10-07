import React from 'react';
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

// Modals
import { AddJamaahModal } from './components/modals/AddJamaahModal';
import { AddPackageModal } from './components/modals/AddPackageModal';
import { ManagePackageModal } from './components/modals/ManagePackageModal';
import { JamaahDetailModal } from './components/modals/JamaahDetailModal';
import { OfficialReceiptModal } from './components/modals/OfficialReceiptModal';
import { PackageDetailModal } from './components/modals/PackageDetailModal';
import { IdCardPrintModal } from './components/modals/IdCardPrintModal';
import { LogoUploadModal } from './components/modals/LogoUploadModal';
import { ShippingLabelPrintModal } from './components/modals/ShippingLabelPrintModal';

const MainLayout: React.FC = () => {
  const { currentTab, theme, isAuthenticated } = useApp();
  const isDark = theme === 'dark';

  // If not authenticated, render LoginView template
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div
      className={`min-h-screen flex font-sans antialiased transition-colors duration-150 selection:bg-[#f27244] selection:text-white ${
        isDark ? 'bg-[#181716] text-[#f4f3ef]' : 'bg-[#f7f6f2] text-[#23211e]'
      }`}
    >
      {/* Fixed / Sticky Left Sidebar (hidden during browser print) */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
          <Header />
        </div>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'packages' && <PackageCatalogView />}
          {currentTab === 'jamaah' && <JamaahDatabaseView />}
          {currentTab === 'manifest' && <ManifestGeneratorView />}
          {currentTab === 'rooming' && <RoomingListView />}
          {currentTab === 'finance' && <FinanceInvoicingView />}
          {currentTab === 'whatsapp' && <WhatsAppCenterView />}
          {currentTab === 'equipment' && <EquipmentTrackerView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
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
