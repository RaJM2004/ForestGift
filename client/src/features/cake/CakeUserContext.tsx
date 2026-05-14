import React, { createContext, useContext } from 'react';

export type CakeUser = {
  id?: string;
  name?: string;
  area?: string;
  email?: string;
  phone?: string;
  contact?: string;
  costPerCake?: number;
};

const CakeUserContext = createContext<CakeUser | null>(null);

export function CakeUserProvider({
  user,
  children,
}: {
  user: CakeUser | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <CakeUserContext.Provider value={user ?? null}>{children}</CakeUserContext.Provider>
  );
}

export function useCakeUser(): CakeUser {
  return useContext(CakeUserContext) ?? {};
}
