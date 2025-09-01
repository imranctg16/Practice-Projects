import React, { createContext, useContext } from "react";
import useUsers from '../hooks/useUsers';
import type { UserContextType } from '../types/User';

const userContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userState = useUsers();

  return (
    <userContext.Provider value={userState}>{children}</userContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
