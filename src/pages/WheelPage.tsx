import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Coffee, 
  Cake,
  Martini,
  ChevronRight, 
  RotateCcw, 
  Plus, 
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Category, Venue } from '../types';
import { Wheel } from '../components/Wheel';
import { WinnerCard } from '../components/wheel/WinnerCard';

// --- Types ---
type Step = 'mode' | 'district' | 'checklist' | 'spin' | 'result';
type Mode = Category;

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
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3.5 font-medium transition-all disabled:pointer-events-none cursor-pointer";
  const variants = {
    primary: "",
    secondary: "",
    outline: "",
    ghost: "bg-transparent text-gray-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{
        height: 56,
        width: '100%',
        borderRadius: 'var(--r-md)',
        background: variant === 'secondary' ? 'transparent' : 'var(--accent)',
        border: variant === 'secondary' ? '0.5px solid var(--border-strong)' : 'none',
        color: variant === 'secondary' ? 'var(--text-primary)' : '#fff',
        fontSize: 16,
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
      }}
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
  const { venues, districts } = useData();
  
  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<Mode | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [excludedVenueIds, setExcludedVenueIds] = useState<Set<string>>(new Set());
  const [customVenues, setCustomVenues] = useState<Venue[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Venue | null>(null);
  const [surpriseMode, setSurpriseMode] = useState(false);
  
  // Derived state
  const activeVenues = useMemo(() => {
    if (!mode) return [];
    
    // Standard venues from context
    const standard = venues.filter(v => 
      v.category === mode && 
      !!v.district &&
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
      district: null,
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
    setSurpriseMode(false);
  };

  const handleReroll = () => {
    if (winner) {
      setExcludedVenueIds(prev => new Set(prev).add(winner.id));
      setWinner(null);
      setStep('spin');
      setTimeout(() => setIsSpinning(true), 50);
    }
  };

  const renderHeader = (title: string, subtitle?: string, showBack = true) => (
    <div className="mb-6">
      {showBack && step !== 'mode' && (
        <button 
          onClick={() => {
            if (step === 'district') setStep('mode');
            else if (step === 'checklist') setStep('district');
            else if (step === 'spin') setStep('checklist');
            else if (step === 'result') setStep('spin');
          }}
          className="flex items-center text-sm mb-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} className="mr-1" /> Geri
        </button>
      )}
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  );

  // 1. Mode Selection
  if (step === 'mode') {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: 'var(--bg-base)',
          padding: `calc(16px + env(safe-area-inset-top)) 16px calc(72px + env(safe-area-inset-bottom))`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="mode"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full"
          >
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
              onClick={() => handleModeSelect('tatlı')}
              className="group relative h-32 bg-linear-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden transition-all active:scale-98 hover:border-pink-500/30"
            >
              <div className="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">Tatlı</span>
                </div>
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-pink-500 border border-[#333] group-hover:scale-110 transition-transform shadow-lg">
                  <Cake size={28} />
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleModeSelect('kafe')}
              className="group relative h-32 bg-linear-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden transition-all active:scale-98 hover:border-amber-500/30"
            >
              <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">Kafe</span>
                </div>
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-amber-500 border border-[#333] group-hover:scale-110 transition-transform shadow-lg">
                  <Coffee size={28} />
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleModeSelect('bar')}
              className="group relative h-32 bg-linear-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-3xl overflow-hidden transition-all active:scale-98 hover:border-purple-500/30"
            >
              <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="flex flex-col items-start">
                  <span className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">Bar</span>
                </div>
                <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-purple-500 border border-[#333] group-hover:scale-110 transition-transform shadow-lg">
                  <Martini size={28} />
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ filter: 'brightness(1.08)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const cats: Category[] = ['yemek', 'tatlı', 'kafe', 'bar'];
                const cat = cats[Math.floor(Math.random() * cats.length)] ?? 'yemek';
                const dCount = Math.max(1, Math.min(3, districts.length));
                const shuffled = [...districts].sort(() => Math.random() - 0.5);
                const picked = shuffled.slice(0, dCount);
                setSurpriseMode(true);
                setMode(cat);
                setSelectedDistricts(picked);
                setExcludedVenueIds(new Set());
                setWinner(null);
                setStep('spin');
                setTimeout(() => setIsSpinning(true), 50);
              }}
              className="min-touch w-full flex items-center justify-center"
              style={{
                height: 56,
                borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                gap: 10,
                border: 'none',
                boxShadow: '0 4px 20px rgba(154,92,40,0.35)',
              }}
              type="button"
            >
              <Sparkles size={18} strokeWidth={1.6} />
              Sürpriz!
            </motion.button>
          </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 2. District Selection
  if (step === 'district') {
    return (
      <div
        className="min-h-screen"
        style={{
          background: 'var(--bg-base)',
          padding: `calc(16px + env(safe-area-inset-top)) 16px calc(72px + env(safe-area-inset-bottom))`,
        }}
      >
        <motion.div
          key="district"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="max-w-md mx-auto h-full flex flex-col"
        >
          <div className="mb-8 flex items-center">
             <button 
              onClick={() => setStep('mode')}
              className="p-2 -ml-2 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold tracking-tight ml-2" style={{ color: 'var(--text-primary)' }}>Nerde?</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-12">
            {districts.map(d => (
              <motion.button
                key={d}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleDistrict(d)}
                className="h-14 rounded-2xl text-sm font-medium transition-all border flex items-center justify-center"
                style={{
                  background: selectedDistricts.includes(d) ? 'var(--text-primary)' : 'var(--bg-elevated)',
                  color: selectedDistricts.includes(d) ? '#111' : 'var(--text-secondary)',
                  border: `0.5px solid ${selectedDistricts.includes(d) ? 'var(--text-primary)' : 'var(--border)'}`,
                }}
              >
                {d}
              </motion.button>
            ))}
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-6 z-10" style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }}>
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
        </motion.div>
      </div>
    );
  }

  // 3. Checklist
  if (step === 'checklist') {
    return (
      <div
        className="min-h-screen"
        style={{
          background: 'var(--bg-base)',
          padding: `calc(16px + env(safe-area-inset-top)) 16px calc(72px + env(safe-area-inset-bottom))`,
        }}
      >
        <motion.div
          key="checklist"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="max-w-md mx-auto"
        >
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
              <div
                className="text-center py-12 rounded-2xl"
                style={{ color: 'var(--text-muted)', border: '0.5px dashed var(--border-strong)' }}
              >
                Bu kriterlere uygun mekan bulunamadı.
              </div>
            )}

            <button 
              onClick={handleAddCustom}
              className="w-full py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
              style={{ border: '0.5px dashed var(--border-strong)', color: 'var(--text-secondary)' }}
            >
              <Plus size={18} /> Geçici Mekan Ekle
            </button>
          </div>

          <div className="fixed bottom-20 left-0 right-0 p-6 z-10" style={{ background: 'linear-gradient(to top, var(--bg-base), transparent)' }}>
            <div className="max-w-md mx-auto">
              <Button 
                onClick={() => setStep('spin')} 
                disabled={activeVenues.length < 1}
                className="w-full"
                icon={Sparkles}
              >
                Çarkı Hazırla
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // 4. Spin
  if (step === 'spin') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'var(--bg-base)',
          padding: `calc(16px + env(safe-area-inset-top)) 16px calc(72px + env(safe-area-inset-bottom))`,
        }}
      >
        <motion.div
          key="spin"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Çarkı Çevir</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Bol şans!</p>
          </div>

          <div className="mb-12">
            <div style={{ filter: 'drop-shadow(0 0 24px rgba(154,92,40,0.2))' }}>
              <Wheel 
                items={activeVenues} 
                isSpinning={isSpinning} 
                onSpinComplete={handleSpinComplete} 
              />
            </div>
            {activeVenues.length > 12 && (
              <p className="mt-2 px-2 text-center text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {activeVenues.length > 24
                  ? `${activeVenues.length} seçenek: dilimlerde numara; tam isim sonuç kartında.`
                  : 'Çok sayıda mekanda dilimlerde kısaltılmış isimler gösterilir; tam isim sonuç kartında.'}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsSpinning(true)}
              disabled={isSpinning}
              className="min-touch flex-1 flex items-center justify-center"
              style={{
                height: 56,
                borderRadius: 'var(--r-md)',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                border: 'none',
                opacity: isSpinning ? 0.6 : 1,
                gap: 10,
              }}
              type="button"
            >
              {isSpinning && (
                <span
                  className="animate-spin"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 9999,
                    border: '2px solid rgba(255,255,255,0.35)',
                    borderTopColor: '#fff',
                    display: 'inline-block',
                  }}
                />
              )}
              ÇEVİR
            </motion.button>

            <motion.button
                whileHover={{ filter: 'brightness(1.08)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const cats: Category[] = ['yemek', 'tatlı', 'kafe', 'bar'];
                  const cat = cats[Math.floor(Math.random() * cats.length)] ?? 'yemek';
                  const dCount = Math.max(1, Math.min(3, districts.length));
                  const shuffled = [...districts].sort(() => Math.random() - 0.5);
                  const picked = shuffled.slice(0, dCount);
                  setSurpriseMode(true);
                  setMode(cat);
                  setSelectedDistricts(picked);
                  setExcludedVenueIds(new Set());
                  setWinner(null);
                  setTimeout(() => setIsSpinning(true), 50);
                }}
                className="min-touch flex-1 flex items-center justify-center"
                style={{
                  height: 56,
                  borderRadius: 'var(--r-md)',
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  gap: 10,
                  border: '0.5px solid rgba(154,92,40,0.35)',
                  boxShadow: '0 4px 20px rgba(154,92,40,0.25)',
                }}
                type="button"
              >
                <Sparkles size={18} strokeWidth={1.6} />
                Sürpriz!
              </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 5. Result
  if (step === 'result' && winner) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: 'var(--bg-base)',
          padding: `calc(16px + env(safe-area-inset-top)) 16px calc(72px + env(safe-area-inset-bottom))`,
        }}
      >
        <motion.div
          key="result"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="mb-6"
          >
            <WinnerCard venue={winner} title={surpriseMode ? 'Sürpriz' : 'Kazanan'} />
          </motion.div>

          <div className="space-y-3">
            <Button onClick={handleReset} variant="primary" className="w-full">
              Kabul Et & Bitir
            </Button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleReroll}
              className="min-touch w-full flex items-center justify-center gap-2"
              style={{
                height: 48,
                borderRadius: 'var(--r-md)',
                background: 'transparent',
                border: '0.5px solid var(--border-strong)',
                color: 'var(--text-primary)',
                fontSize: 14,
                fontWeight: 500,
              }}
              type="button"
            >
              <RotateCcw size={18} strokeWidth={1.6} />
              Çıkar & Tekrar Çevir
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};
