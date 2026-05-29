import React, { createContext, useContext, useMemo } from 'react';

export type NgoSection =
  | 'Dashboard'
  | 'Orders'
  | 'Plantation'
  | 'Bulk Entry'
  | 'Profile'
  | 'Reports'
  | 'Volunteers';

type NgoNavContextValue = {
  activeSection: NgoSection;
  setActiveSection: (section: NgoSection) => void;
  title: string;
  subtitle: string;
  notifications: unknown[];
  onLogout?: () => void;
};

const NgoNavContext = createContext<NgoNavContextValue | null>(null);

export function NgoNavProvider({
  children,
  activeSection,
  setActiveSection,
  title,
  subtitle,
  notifications,
  onLogout,
}: NgoNavContextValue & { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ activeSection, setActiveSection, title, subtitle, notifications, onLogout }),
    [activeSection, setActiveSection, title, subtitle, notifications, onLogout],
  );
  return <NgoNavContext.Provider value={value}>{children}</NgoNavContext.Provider>;
}

export function useNgoNav(): NgoNavContextValue {
  const ctx = useContext(NgoNavContext);
  if (!ctx) throw new Error('useNgoNav must be used within NgoNavProvider');
  return ctx;
}
