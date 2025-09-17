import { createContext, useCallback, useContext, useState } from "react";
import { userType } from "../types/Users";
import useLocalStorage from "../hooks/useLocalStorage";
import { userData } from "../services/githubApi";

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
  const handleSearch = useCallback(async (username: string) => {
    if (abortController) {
      abortController.abort();
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    setAbortController(controller);
    try {
      console.log("🔵 CONTEXT: handleSearch called with:", username);
      const data = await userData(username, controller.signal);
      setUser(data);
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
      setError("User not found");
      setUser(null);
    } finally {
      setLoading(false);
      setItem("lastSearch", username);
    }
  }, [abortController, setItem])
  return (
    <GithubContext.Provider value={{ user, loading, error, handleSearch }} >{children}</GithubContext.Provider>
  );
};

export function useGithub() {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error(
      'useGithub must be used within GithubProvider'
    )
  }
  return context;
}
