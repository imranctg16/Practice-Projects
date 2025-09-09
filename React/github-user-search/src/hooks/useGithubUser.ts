import { useCallback, useState } from "react";
import { userData } from "../services/githubApi";
import type { userType } from "../types/Users";
import useLocalStorage from "./useLocalStorage";
function useGithubUser() {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const { setItem } = useLocalStorage();
  const handleSearch = useCallback(
    async (username: string) => {
      if (abortController) {
        abortController.abort(); // abort previous request if any
      }
      const newAbortController = new AbortController();
      setAbortController(newAbortController);
      setLoading(true);
      setError(null);
      try {
        const data = await userData(username, newAbortController.signal);
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
    },
    [abortController, setItem]
  );

  return { user, loading, error, handleSearch };
}
export default useGithubUser;
