import React, { useMemo, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { VenueCard } from '../components/venues/VenueCard';
import { VenueForm } from '../components/venues/VenueForm';
import { DistrictForm } from '../components/venues/DistrictForm';

export const VenuesPage: React.FC = () => {
  const { venues, districts, addVenue, removeVenue, updateVenue, addDistrict, removeDistrict } = useData();
  const { session } = useAuth();
  const isAdmin = session?.isAdmin ?? false;
  const [venueFormOpen, setVenueFormOpen] = useState(false);
  const [districtFormOpen, setDistrictFormOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<null | (typeof venues)[number]>(null);
  const [activeDistrict, setActiveDistrict] = useState<string>('Tümü');

  const filtered = useMemo(() => {
    if (activeDistrict === 'Tümü') return venues;
    return venues.filter((v) => v.district === activeDistrict);
  }, [activeDistrict, venues]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--bg-base)',
        padding: `calc(16px + env(safe-area-inset-top)) 16px calc(56px + 16px + env(safe-area-inset-bottom)) 16px`,
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Mekanlar
          </div>

          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setVenueFormOpen(true)}
              className="min-touch flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--r-full)',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
              }}
              aria-label="Mekan ekle"
              type="button"
            >
              <Plus size={18} strokeWidth={1.6} />
            </motion.button>
          )}
        </div>

        {/* District chips */}
        <div
          className="flex"
          style={{
            gap: 8,
            overflowX: 'auto',
            marginBottom: 16,
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}
        >
          {['Tümü', ...districts].map((d) => {
            const active = activeDistrict === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDistrict(d)}
                style={{
                  background: active ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  border: `0.5px solid ${active ? 'rgba(154,92,40,0.4)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-full)',
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  minHeight: 36,
                }}
                type="button"
              >
                {d}
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => setDistrictFormOpen(true)}
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--r-full)',
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                minHeight: 36,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              type="button"
            >
              <MapPin size={16} strokeWidth={1.6} />
              Semt ekle
            </button>
          )}
        </div>

        {/* List / empty */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center" style={{ padding: '48px 0' }}>
            <div style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 12 }}>Henüz mekan eklenmedi</div>
            {isAdmin ? (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', opacity: 0.6, marginTop: 8 }}>
                Mekan eklemek için + butonuna dokun
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col" style={{ gap: 12 }}>
            <AnimatePresence>
              {filtered.map((v, idx) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.22, delay: idx * 0.04 }}
                >
                  <VenueCard
                    venue={v}
                    {...(isAdmin ? { onDelete: removeVenue, onEdit: setEditingVenue } : {})}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <VenueForm
            open={venueFormOpen || !!editingVenue}
            onClose={() => {
              setVenueFormOpen(false);
              setEditingVenue(null);
            }}
            districts={districts}
            onSubmit={addVenue}
            {...(editingVenue ? { initialVenue: editingVenue, onUpdate: updateVenue } : {})}
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
