import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export const CAKE_PATHS = ['/', '/deliveries', '/earnings', '/invoices', '/profile'] as const;
export type CakePathname = (typeof CAKE_PATHS)[number];

type CakeNavContextValue = {
  pathname: CakePathname;
  navigate: (to: CakePathname) => void;
};

const CakeNavContext = createContext<CakeNavContextValue | null>(null);

export function CakeNavProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<CakePathname>('/');

  const navigate = useCallback((to: CakePathname) => {
    setPathname(to);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);

  return <CakeNavContext.Provider value={value}>{children}</CakeNavContext.Provider>;
}

export function useCakeNav(): CakeNavContextValue {
  const ctx = useContext(CakeNavContext);
  if (!ctx) {
    throw new Error('useCakeNav must be used within CakeNavProvider');
  }
  return ctx;
}
