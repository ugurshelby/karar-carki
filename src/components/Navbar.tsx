import React from 'react';
import { Crown, Disc, MapPin, Settings2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'venues' | 'wheel';
  onTabChange: (tab: 'venues' | 'wheel') => void;
  onOpenAdmin: (() => void) | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onOpenAdmin }) => {
  const { session, logout } = useAuth();
  const isAdmin = session?.isAdmin ?? false;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'var(--bg-overlay)',
        borderTop: '0.5px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="mx-auto max-w-md"
        style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 8px' }}
      >
        <button
          onClick={() => {
            if (!session) return;
            const ok = window.confirm('Çıkış yapılsın mı?');
            if (ok) logout();
          }}
          className="min-touch"
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: isAdmin ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label={isAdmin ? 'Shelby (Çıkış)' : 'Misafir (Çıkış)'}
          type="button"
        >
          {isAdmin ? <Crown size={20} strokeWidth={1.6} /> : <User size={20} strokeWidth={1.6} />}
        </button>

        <button
          onClick={() => onTabChange('venues')}
          className="min-touch"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'venues' ? 'var(--accent)' : 'var(--text-muted)',
          }}
          type="button"
        >
          <MapPin size={24} strokeWidth={1.6} />
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Mekanlar
          </span>
        </button>

        <button
          onClick={() => onTabChange('wheel')}
          className="min-touch"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            color: activeTab === 'wheel' ? 'var(--accent)' : 'var(--text-muted)',
          }}
          type="button"
        >
          <Disc size={24} strokeWidth={1.6} />
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Çark
          </span>
        </button>

        <button
          onClick={() => {
            if (!isAdmin || !onOpenAdmin) return;
            onOpenAdmin();
          }}
          className="min-touch"
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            border: 'none',
            background: 'transparent',
            cursor: isAdmin && onOpenAdmin ? 'pointer' : 'default',
            color: isAdmin ? 'var(--text-muted)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isAdmin ? 1 : 0,
          }}
          aria-label="Admin panelini aç"
          type="button"
        >
          <Settings2 size={20} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
};
