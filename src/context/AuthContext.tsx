import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthSession, UserRole } from '../types';

interface AuthContextType {
  session: AuthSession | null;
  selectRole: (role: UserRole) => void;
  verifyPin: (pin: string) => boolean;
  logout: () => void;
}

const SESSION_KEY = 'auth.session';
const ADMIN_PIN = '4153';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession> | null;
    if (!parsed || (parsed.role !== 'guest' && parsed.role !== 'admin')) return null;
    return { role: parsed.role, isAdmin: parsed.role === 'admin' };
  } catch {
    return null;
  }
}

function saveSession(next: AuthSession | null) {
  try {
    if (!next) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const value = useMemo<AuthContextType>(() => ({
    session,
    selectRole: (role) => {
      if (role === 'guest') setSession({ role: 'guest', isAdmin: false });
      else setSession(null); // admin requires PIN; keep unauthenticated until verified
    },
    verifyPin: (pin) => {
      if (pin === ADMIN_PIN) {
        setSession({ role: 'admin', isAdmin: true });
        return true;
      }
      return false;
    },
    logout: () => setSession(null),
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

