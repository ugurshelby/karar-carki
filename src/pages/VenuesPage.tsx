import React, { useMemo, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { VenueCard } from '../components/venues/VenueCard';
import { VenueForm } from '../components/venues/VenueForm';
import { DistrictForm } from '../components/venues/DistrictForm';
import { EmptyState } from '../components/ui/EmptyState';

export const VenuesPage: React.FC = () => {
  const { venues, districts, addVenue, removeVenue, addDistrict, removeDistrict } = useData();
  const { session } = useAuth();
  const isAdmin = session?.isAdmin ?? false;
  const [venueFormOpen, setVenueFormOpen] = useState(false);
  const [districtFormOpen, setDistrictFormOpen] = useState(false);

  const venuesByDistrict = useMemo(() => {
    const map = new Map<string, typeof venues>();
    for (const d of districts) map.set(d, []);
    const unmatched: typeof venues = [];
    for (const v of venues) {
      if (v.district && map.has(v.district)) map.get(v.district)!.push(v);
      else unmatched.push(v);
    }
    return { map, unmatched };
  }, [districts, venues]);

  return (
    <div className="min-h-screen bg-[#111] p-6 pb-32">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-end mb-6 sticky top-0 bg-[#111]/80 backdrop-blur-md py-4 z-10 -mx-6 px-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mekanlar</h1>
            <p className="text-gray-500 text-sm mt-1">{venues.length} mekan kayıtlı</p>
          </div>
          {isAdmin && (
            <div className="flex gap-3">
              <button 
                onClick={() => setDistrictFormOpen(true)}
                className="min-touch w-10 h-10 flex items-center justify-center bg-[#161616] border border-[#262626] rounded-full text-gray-300 hover:text-white hover:border-white/10 transition-all active:scale-95"
              >
                <MapPin size={18} />
              </button>
              <button 
                onClick={() => setVenueFormOpen(true)}
                className="min-touch w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/10"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>

        {venues.length === 0 ? (
          <EmptyState
            title="Henüz mekan yok"
            description={isAdmin ? 'Google Places ile ilk mekanını ekle.' : 'Shelby profili ile giriş yaparak mekan ekleyebilirsin.'}
            action={
              isAdmin ? (
                <button
                  onClick={() => setVenueFormOpen(true)}
                  className="min-h-[48px] px-6 rounded-2xl bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                >
                  Mekan Ekle
                </button>
              ) : null
            }
          />
        ) : (
          <div className="space-y-8">
            {venuesByDistrict.unmatched.length > 0 && (
              <section>
                <div className="text-xs uppercase tracking-wider text-white/50 mb-3">Eşleştirilmemiş</div>
                <div className="space-y-4">
                  {venuesByDistrict.unmatched.map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              </section>
            )}

            {districts.map((d) => {
              const list = venuesByDistrict.map.get(d) ?? [];
              if (list.length === 0) return null;
              return (
                <section key={d}>
                  <div className="text-xs uppercase tracking-wider text-white/50 mb-3">{d}</div>
                  <div className="space-y-4">
                    {list.map((v) => (
                      <VenueCard key={v.id} venue={v} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <VenueForm
            open={venueFormOpen}
            onClose={() => setVenueFormOpen(false)}
            districts={districts}
            onSubmit={addVenue}
          />
          <DistrictForm
            open={districtFormOpen}
            onClose={() => setDistrictFormOpen(false)}
            onSubmit={addDistrict}
          />
        </>
      )}
    </div>
  );
};
