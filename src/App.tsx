import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { VenuesPage } from './pages/VenuesPage';
import { WheelPage } from './pages/WheelPage';
import { ProfileSelect } from './components/auth/ProfileSelect';
import { PinModal } from './components/auth/PinModal';
import { AdminPanel } from './components/admin/AdminPanel';

const InnerApp: React.FC<{
  activeTab: 'venues' | 'wheel';
  setActiveTab: (t: 'venues' | 'wheel') => void;
  adminOpen: boolean;
  setAdminOpen: (v: boolean) => void;
}> = ({ activeTab, setActiveTab, adminOpen, setAdminOpen }) => {
  const { venues, districts, bulkUpdateVenues } = useData();
  const { session } = useAuth();
  const isAdmin = session?.isAdmin ?? false;

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">
      <main>
        {activeTab === 'venues' && <VenuesPage />}
        {activeTab === 'wheel' && <WheelPage />}
      </main>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAdmin={isAdmin ? () => setAdminOpen(true) : null}
      />

      {isAdmin && (
        <AdminPanel
          open={adminOpen}
          onClose={() => setAdminOpen(false)}
          venues={venues}
          districts={districts}
          onSave={(patches) => {
            bulkUpdateVenues(patches);
            setAdminOpen(false);
          }}
        />
      )}
    </div>
  );
};

const AuthedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'venues' | 'wheel'>('venues');
  const { session, selectRole, verifyPin } = useAuth();
  const [pinOpen, setPinOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if (!session) return;
    setActiveTab('venues');
  }, [session?.role]);

  if (!session) {
    return (
      <>
        <ProfileSelect
          onSelectGuest={() => selectRole('guest')}
          onSelectShelby={() => setPinOpen(true)}
        />
        <PinModal
          open={pinOpen}
          onClose={() => setPinOpen(false)}
          onVerify={verifyPin}
        />
      </>
    );
  }

  return (
    <DataProvider>
      <InnerApp
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminOpen={adminOpen}
        setAdminOpen={setAdminOpen}
      />
    </DataProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AuthedApp />
    </AuthProvider>
  );
}
