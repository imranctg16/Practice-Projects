import React, { createContext, useContext } from "react";
import useUsers from '../hooks/useUsers';
import { User } from '../types/User';

type userContextType = {
  isShow: boolean,
  setShow: (show: boolean) => void,
  toggleShow: (value: boolean) => void,
  isEdit: boolean,
  setIsEdit: (edit: boolean) => void,
  user: User,
  setUser: (user: User) => void,
  users: User[],
  setUsers: (users: User[]) => void,
  addUser: (user: User) => void,
  editUser: (user: User) => void,
  deleteUser: (user: User) => void,
};

const userContext = createContext<userContextType | null>(null);

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
