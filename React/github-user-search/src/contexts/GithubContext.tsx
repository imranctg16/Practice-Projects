import { createContext, useContext, useState } from "react";
import { userType } from "../types/Users";
import useLocalStorage from "../hooks/useLocalStorage";

type GithubContextType = {
  user: userType | null,
  loading: boolean,
  error: string | null,
  handleSearch: (username: string) => void
}

const defaultUser = {
  user: null,
  loading: false,
  error: null,
  handleSearch: (username: string) => { }
};

const GithubContext = createContext<GithubContextType>(defaultUser);

export function GithubProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const { setItem } = useLocalStorage();

  const handleSearch = () = {

  };
  return (
    <GithubContext.Provider value={{ user, loading, error, handleSearch }} >{children}</GithubContext.Provider>
  );
}

export function useGithub() {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error(
      'useGithub must be used within GithubProvider'
    )
  }
  return context;
}
