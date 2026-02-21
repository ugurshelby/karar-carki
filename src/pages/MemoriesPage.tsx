import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon, X, Calendar, ChevronDown, Trash2, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Memory } from '../data';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const MEMORIES_BUCKET = 'memories';

export const MemoriesPage: React.FC = () => {
  const { memories, venues, addMemory, removeMemory } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToStorage = async (dataUrl: string, memoryId: string): Promise<string | null> => {
    if (!supabase) return null;
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const ext = blob.type.split('/')[1] || 'jpg';
      const path = `${memoryId}.${ext}`;
      const { error } = await supabase.storage.from(MEMORIES_BUCKET).upload(path, blob, {
        contentType: blob.type,
        upsert: true,
      });
      if (error) return null;
      const { data: { publicUrl } } = supabase.storage.from(MEMORIES_BUCKET).getPublicUrl(path);
      return publicUrl;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenueId || !note) return;
    const venue = venues.find(v => v.id === selectedVenueId);
    if (!venue) return;

    setSubmitting(true);
    const memoryId = `mem-${Date.now()}`;
    let imageUrl: string | undefined;
    if (image && isSupabaseEnabled() && supabase) {
      imageUrl = (await uploadImageToStorage(image, memoryId)) ?? undefined;
    } else if (image) {
      imageUrl = image;
    }

    const newMemory: Memory = {
      id: memoryId,
      venueId: selectedVenueId,
      venueName: venue.name,
      date,
      note,
      image: imageUrl,
    };

    addMemory(newMemory);
    setSubmitting(false);
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedVenueId('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setImage(null);
  };

  // Sort memories by date desc
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 pb-32">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-md py-4 z-10 -mx-6 px-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Anılar</h1>
            <p className="text-gray-500 text-sm mt-1">{memories.length} anı biriktirdin</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {sortedMemories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#262626] rounded-3xl bg-[#161616]/50">
              <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center mb-4 text-gray-500">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">Henüz anı yok</h3>
              <p className="text-gray-500 text-sm max-w-[200px]">Gittiğin mekanları ve yaşadığın güzel anları buraya kaydet.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-6 px-6 py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                İlk Anını Ekle
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {sortedMemories.map((memory, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={memory.id} 
                  className="group bg-[#161616] border border-[#262626] rounded-3xl overflow-hidden hover:border-white/10 transition-all"
                >
                  {memory.image && (
                    <div className="relative w-full aspect-4/3 bg-[#0A0A0A]">
                      <img src={memory.image} alt="Memory" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-linear-to-t from-[#161616] to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="p-6 relative">
                    {!memory.image && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 to-blue-500 opacity-50" />
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{memory.venueName}</h3>
                        <div className="flex items-center text-xs font-medium text-gray-500 mt-2 bg-[#262626] px-2 py-1 rounded-lg w-fit">
                          <Calendar size={12} className="mr-1.5" />
                          {new Date(memory.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          if(confirm('Bu anıyı silmek istediğine emin misin?')) {
                            removeMemory(memory.id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#262626] text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="relative">
                      <p className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap">
                        {memory.note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Memory Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#161616] border border-[#262626] rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Yeni Anı</h2>
                  <button onClick={() => setIsAdding(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#262626] text-gray-400 hover:text-white hover:bg-[#333]">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Mekan</label>
                    <div className="relative">
                      <select 
                        value={selectedVenueId}
                        onChange={e => setSelectedVenueId(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white focus:outline-none focus:border-white/20 appearance-none transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        {venues.map(v => (
                          <option key={v.id} value={v.id}>{v.name} ({v.district})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Tarih</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Fotoğraf</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full h-40 bg-[#0A0A0A] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group ${
                        image ? 'border-transparent' : 'border-[#262626] hover:border-gray-500'
                      }`}
                    >
                      {image ? (
                        <div className="relative w-full h-full">
                          <img src={image} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <span className="text-white text-sm font-medium">Değiştir</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[#161616] flex items-center justify-center mb-3 text-gray-400 group-hover:text-white transition-colors">
                            <ImageIcon size={20} />
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-gray-300">Fotoğraf Seç</span>
                        </>
                      )}
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {image && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setImage(null); }}
                        className="text-xs text-red-500 mt-2 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Fotoğrafı Kaldır
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Notun</label>
                    <textarea 
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Bugün nasıldı? Neler yedik, neler konuştuk..."
                      rows={4}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-2xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 resize-none transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={!selectedVenueId || !note || submitting}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl disabled:opacity-50 hover:bg-gray-100 transition-colors mt-2 flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      'Anıyı Kaydet'
                    )}
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
