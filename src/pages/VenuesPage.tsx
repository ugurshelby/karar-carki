import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, MapPin, X, ChevronDown, ChevronUp, Utensils, Coffee } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Venue } from '../data';

export const VenuesPage: React.FC = () => {
  const { venues, districts, addVenue, removeVenue, addDistrict, removeDistrict } = useData();
  const [isAddingVenue, setIsAddingVenue] = useState(false);
  const [isAddingDistrict, setIsAddingDistrict] = useState(false);
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

  // Form States
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newVenue, setNewVenue] = useState<Partial<Venue>>({
    category: 'yemek',
    tags: []
  });
  const [newVenueTagInput, setNewVenueTagInput] = useState('');

  const groupedVenues = districts.reduce((acc, district) => {
    acc[district] = venues.filter(v => v.district === district);
    return acc;
  }, {} as Record<string, Venue[]>);

  const handleAddDistrict = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDistrictName.trim()) {
      addDistrict(newDistrictName.trim());
      setNewDistrictName('');
      setIsAddingDistrict(false);
    }
  };

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVenue.name && newVenue.district && newVenue.category) {
      addVenue({
        id: `v-${Date.now()}`,
        name: newVenue.name,
        district: newVenue.district,
        category: newVenue.category,
        tags: newVenue.tags || [],
        isCustom: true
      } as Venue);
      setNewVenue({ category: 'yemek', tags: [] });
      setIsAddingVenue(false);
    }
  };

  const toggleTag = (tag: string) => {
    setNewVenue(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 pb-32">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md py-4 z-10 -mx-6 px-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mekanlar</h1>
            <p className="text-gray-500 text-sm mt-1">{venues.length} mekan kayıtlı</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAddingDistrict(true)}
              className="w-10 h-10 flex items-center justify-center bg-[#161616] border border-[#262626] rounded-full text-gray-400 hover:text-white hover:border-gray-500 transition-all active:scale-95"
            >
              <MapPin size={18} />
            </button>
            <button 
              onClick={() => setIsAddingVenue(true)}
              className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/10"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* District List */}
        <div className="space-y-4">
          {districts.map(district => {
            const districtVenues = groupedVenues[district] || [];
            const isOpen = expandedDistrict === district;

            return (
              <motion.div 
                layout
                key={district} 
                className={`bg-[#161616] border transition-colors rounded-3xl overflow-hidden ${isOpen ? 'border-white/10' : 'border-[#262626]'}`}
              >
                <button 
                  onClick={() => setExpandedDistrict(isOpen ? null : district)}
                  className="w-full p-5 flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${districtVenues.length > 0 ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <span className="font-semibold text-white text-lg">{district}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 bg-[#262626] px-2 py-1 rounded-lg">
                      {districtVenues.length}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-gray-500" />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {districtVenues.length === 0 ? (
                          <div className="text-center py-6 px-4 border border-dashed border-[#262626] rounded-2xl">
                            <p className="text-sm text-gray-500">Henüz mekan eklenmemiş.</p>
                            <button 
                              onClick={() => {
                                if(confirm(`${district} bölgesini silmek istediğine emin misin?`)) {
                                  removeDistrict(district);
                                }
                              }}
                              className="text-xs text-red-500 mt-2 hover:underline"
                            >
                              Bölgeyi Sil
                            </button>
                          </div>
                        ) : (
                          districtVenues.map(venue => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={venue.id} 
                              className="group flex justify-between items-start p-3 bg-[#0A0A0A] border border-[#262626] rounded-2xl hover:border-white/10 transition-colors"
                            >
                              <div className="flex gap-3">
                                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                                  venue.category === 'yemek' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                  {venue.category === 'yemek' ? <Utensils size={14} /> : <Coffee size={14} />}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{venue.name}</div>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {venue.tags.map(tag => (
                                      <span key={tag} className="text-[10px] text-gray-400 bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#262626]">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => removeVenue(venue.id)}
                                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Add District Modal */}
        <AnimatePresence>
          {isAddingDistrict && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#161616] border border-[#262626] rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Yeni Bölge</h2>
                  <button onClick={() => setIsAddingDistrict(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#262626] text-gray-400 hover:text-white hover:bg-[#333]">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAddDistrict}>
                  <input 
                    type="text" 
                    placeholder="Bölge Adı (örn. Bahçeli)" 
                    value={newDistrictName}
                    onChange={e => setNewDistrictName(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-gray-600 mb-4 focus:outline-none focus:border-white/20 transition-colors"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    disabled={!newDistrictName.trim()}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl disabled:opacity-50 hover:bg-gray-100 transition-colors"
                  >
                    Ekle
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add Venue Modal */}
        <AnimatePresence>
          {isAddingVenue && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#161616] border border-[#262626] rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Yeni Mekan</h2>
                  <button onClick={() => setIsAddingVenue(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#262626] text-gray-400 hover:text-white hover:bg-[#333]">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleAddVenue} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Mekan Adı</label>
                    <input 
                      type="text" 
                      placeholder="Örn. Bigos" 
                      value={newVenue.name || ''}
                      onChange={e => setNewVenue(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Bölge</label>
                    <div className="relative">
                      <select 
                        value={newVenue.district || ''}
                        onChange={e => setNewVenue(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white focus:outline-none focus:border-white/20 appearance-none transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Kategori</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewVenue(prev => ({ ...prev, category: 'yemek' }))}
                        className={`p-4 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                          newVenue.category === 'yemek' 
                            ? 'bg-white text-black border-white shadow-lg shadow-white/5' 
                            : 'bg-[#0A0A0A] text-gray-400 border-[#262626] hover:border-gray-600'
                        }`}
                      >
                        <Utensils size={20} />
                        Yemek
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewVenue(prev => ({ ...prev, category: 'tatlı-kahve' }))}
                        className={`p-4 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                          newVenue.category === 'tatlı-kahve' 
                            ? 'bg-white text-black border-white shadow-lg shadow-white/5' 
                            : 'bg-[#0A0A0A] text-gray-400 border-[#262626] hover:border-gray-600'
                        }`}
                      >
                        <Coffee size={20} />
                        Tatlı / Kahve
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Etiketler</label>
                    <div className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        placeholder="Yeni etiket..." 
                        value={newVenueTagInput}
                        onChange={e => setNewVenueTagInput(e.target.value)}
                        className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newVenueTagInput.trim()) {
                              toggleTag(newVenueTagInput.trim());
                              setNewVenueTagInput('');
                            }
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (newVenueTagInput.trim()) {
                            toggleTag(newVenueTagInput.trim());
                            setNewVenueTagInput('');
                          }
                        }}
                        className="px-4 bg-[#262626] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
                      >
                        Ekle
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-8">
                      {newVenue.tags?.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#262626] rounded-lg text-xs font-medium text-gray-300 border border-transparent hover:border-gray-600 transition-colors">
                          {tag}
                          <button type="button" onClick={() => toggleTag(tag)} className="text-gray-500 hover:text-white transition-colors">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      {(!newVenue.tags || newVenue.tags.length === 0) && (
                        <span className="text-xs text-gray-600 italic py-1.5">Etiket eklenmedi</span>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!newVenue.name || !newVenue.district}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl disabled:opacity-50 hover:bg-gray-100 transition-colors mt-2"
                  >
                    Mekanı Kaydet
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
