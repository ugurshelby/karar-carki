import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Coffee, 
  ChevronRight, 
  RotateCcw, 
  Plus, 
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Venue } from '../data';
import { Wheel } from '../components/Wheel';

// --- Types ---
type Step = 'mode' | 'district' | 'checklist' | 'spin' | 'result';
type Mode = 'yemek' | 'tatlı-kahve';

// --- Components ---

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon: Icon
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/5",
    secondary: "bg-[#262626] text-white hover:bg-[#333] border border-white/5",
    outline: "bg-transparent border border-[#262626] text-gray-400 hover:text-white hover:border-gray-600",
    ghost: "bg-transparent text-gray-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ 
  label, 
  selected, 
  onClick 
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
      selected 
        ? 'bg-white text-black border-white' 
        : 'bg-[#161616] text-gray-400 border-[#262626] hover:border-gray-600'
    }`}
  >
    {label}
  </motion.button>
);

interface VenueCardProps {
  venue: Venue;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  onRemove,
  compact = false
}) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`group relative bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden ${compact ? 'p-3' : 'p-4'}`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>{venue.name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-[#262626] px-1.5 py-0.5 rounded">
            {venue.district}
          </span>
          {venue.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-gray-500 border border-[#262626] px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {onRemove && (
        <button 
          onClick={() => onRemove(venue.id)}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  </motion.div>
);

export const WheelPage: React.FC = () => {
  const { venues, districts, addVenue } = useData();
  
  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<Mode | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [excludedVenueIds, setExcludedVenueIds] = useState<Set<string>>(new Set());
  const [customVenues, setCustomVenues] = useState<Venue[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Venue | null>(null);
  
  // Derived state
  const activeVenues = useMemo(() => {
    if (!mode) return [];
    
    // Standard venues from context
    const standard = venues.filter(v => 
      v.category === mode && 
      selectedDistricts.includes(v.district) &&
      !excludedVenueIds.has(v.id)
    );

    // Temporary custom venues added during this session
    const custom = customVenues.filter(v => 
      v.category === mode && 
      !excludedVenueIds.has(v.id)
    );

    return [...standard, ...custom];
  }, [mode, selectedDistricts, excludedVenueIds, customVenues, venues]);

  // Handlers
  const handleModeSelect = (m: Mode) => {
    setMode(m);
    setStep('district');
  };

  const toggleDistrict = (d: string) => {
    setSelectedDistricts(prev => 
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const handleAddCustom = () => {
    const name = prompt("Mekan Adı:");
    if (!name) return;
    
    const newVenue: Venue = {
      id: `temp-${Date.now()}`,
      name,
      district: 'Özel',
      category: mode!,
      tags: ['Özel'],
      isCustom: true
    };
    
    setCustomVenues(prev => [...prev, newVenue]);
  };

  const handleSpinComplete = (w: Venue) => {
    setWinner(w);
    setIsSpinning(false);
    setTimeout(() => setStep('result'), 500);
  };

  const handleReset = () => {
    setStep('mode');
    setMode(null);
    setSelectedDistricts([]);
    setExcludedVenueIds(new Set());
    setWinner(null);
  };

  const handleReroll = () => {
    if (winner) {
      setExcludedVenueIds(prev => new Set(prev).add(winner.id));
      setWinner(null);
      setStep('spin');
    }
  };

  const renderHeader = (title: string, subtitle?: string, showBack = true) => (
    <div className="mb-8">
      {showBack && step !== 'mode' && (
        <button 
          onClick={() => {
            if (step === 'district') setStep('mode');
            else if (step === 'checklist') setStep('district');
            else if (step === 'spin') setStep('checklist');
            else if (step === 'result') setStep('spin');
          }}
          className="flex items-center text-sm text-gray-500 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Geri
        </button>
      )}
      <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );

  // 1. Mode Selection
  if (step === 'mode') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24 flex flex-col">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 mb-6 border border-white/10 shadow-2xl shadow-purple-500/10">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Date Çarkı</h1>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => handleModeSelect('yemek')}
              className="group relative h-32 bg-linear-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden transition-all active:scale-98 hover:border-orange-500/30"
            >
              <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">Yemek</span>
                </div>
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-orange-500 border border-[#333] group-hover:scale-110 transition-transform shadow-lg">
                  <Utensils size={28} />
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleModeSelect('tatlı-kahve')}
              className="group relative h-32 bg-linear-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden transition-all active:scale-98 hover:border-blue-500/30"
            >
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">Tatlı / Kahve</span>
                </div>
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-blue-500 border border-[#333] group-hover:scale-110 transition-transform shadow-lg">
                  <Coffee size={28} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. District Selection
  if (step === 'district') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <div className="mb-8 flex items-center">
             <button 
              onClick={() => setStep('mode')}
              className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight ml-2">Nerde?</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-12">
            {districts.map(d => (
              <motion.button
                key={d}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleDistrict(d)}
                className={`h-14 rounded-2xl text-sm font-medium transition-all border flex items-center justify-center ${
                  selectedDistricts.includes(d)
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
                    : 'bg-[#161616] text-gray-400 border-[#262626] hover:border-gray-600'
                }`}
              >
                {d}
              </motion.button>
            ))}
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-6 bg-linear-to-t from-[#0A0A0A] to-transparent z-10">
            <div className="max-w-md mx-auto">
              <Button 
                onClick={() => setStep('checklist')} 
                disabled={selectedDistricts.length === 0}
                className="w-full"
                icon={ChevronRight}
              >
                Devam Et ({selectedDistricts.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Checklist
  if (step === 'checklist') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 pb-32">
        <div className="max-w-md mx-auto">
          {renderHeader("Mekanları İncele", `${activeVenues.length} mekan seçildi.`)}

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {activeVenues.map(venue => (
                <VenueCard 
                  key={venue.id} 
                  venue={venue} 
                  onRemove={(id) => setExcludedVenueIds(prev => new Set(prev).add(id))} 
                />
              ))}
            </AnimatePresence>
            
            {activeVenues.length === 0 && (
              <div className="text-center py-12 text-gray-500 border border-dashed border-[#262626] rounded-2xl">
                Bu kriterlere uygun mekan bulunamadı.
              </div>
            )}

            <button 
              onClick={handleAddCustom}
              className="w-full py-4 border border-dashed border-[#262626] rounded-2xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Geçici Mekan Ekle
            </button>
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-6 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent z-10">
            <div className="max-w-md mx-auto">
              <Button 
                onClick={() => setStep('spin')} 
                disabled={activeVenues.length < 2}
                className="w-full"
                icon={Sparkles}
              >
                Çarkı Hazırla
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Spin
  if (step === 'spin') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Çarkı Çevir</h2>
            <p className="text-gray-400">Bol şans!</p>
          </div>

          <div className="mb-12">
            <Wheel 
              items={activeVenues} 
              isSpinning={isSpinning} 
              onSpinComplete={handleSpinComplete} 
            />
          </div>

          {!isSpinning && (
            <Button 
              onClick={() => setIsSpinning(true)} 
              className="w-full max-w-xs mx-auto"
              variant="primary"
            >
              ÇEVİR
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 5. Result
  if (step === 'result' && winner) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] p-6 pb-24 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium mb-6 border border-green-500/20">
              Kazanan Seçildi
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{winner.name}</h1>
            <p className="text-xl text-gray-400">{winner.district}</p>
          </motion.div>

          <div className="bg-[#161616] border border-[#262626] rounded-3xl p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {winner.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#262626] rounded-lg text-sm text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleReset} variant="primary" className="w-full">
              Kabul Et & Bitir
            </Button>
            <Button onClick={handleReroll} variant="secondary" className="w-full" icon={RotateCcw}>
              Çıkar & Tekrar Çevir
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
