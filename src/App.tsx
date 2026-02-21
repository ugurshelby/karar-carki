import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { VenuesPage } from './pages/VenuesPage';
import { WheelPage } from './pages/WheelPage';
import { MemoriesPage } from './pages/MemoriesPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'venues' | 'wheel' | 'memories'>('wheel');

  return (
    <DataProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
        <main>
          {activeTab === 'venues' && <VenuesPage />}
          {activeTab === 'wheel' && <WheelPage />}
          {activeTab === 'memories' && <MemoriesPage />}
        </main>
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </DataProvider>
  );
}
