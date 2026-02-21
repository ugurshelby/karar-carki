import React from 'react';
import { MapPin, Disc, Camera } from 'lucide-react';

interface NavbarProps {
  activeTab: 'venues' | 'wheel' | 'memories';
  onTabChange: (tab: 'venues' | 'wheel' | 'memories') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-lg border-t border-[#262626] pt-2 pb-safe z-50" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
      <div className="flex justify-around items-center h-14 min-h-[56px] max-w-md mx-auto px-2">
        <button
          onClick={() => onTabChange('venues')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'venues' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <MapPin size={24} strokeWidth={activeTab === 'venues' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Mekanlar</span>
        </button>

        <button
          onClick={() => onTabChange('wheel')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'wheel' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Disc size={24} strokeWidth={activeTab === 'wheel' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Çark</span>
        </button>

        <button
          onClick={() => onTabChange('memories')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'memories' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Camera size={24} strokeWidth={activeTab === 'memories' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Anılar</span>
        </button>
      </div>
    </div>
  );
};
