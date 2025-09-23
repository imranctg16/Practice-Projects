import { createContext, useCallback, useContext, useReducer, useState } from "react";
import { userType } from "../types/Users";
import useLocalStorage from "../hooks/useLocalStorage";
import { userData } from "../services/githubApi";

type GithubContextType = {
  user: userType | null,
  loading: boolean,
  error: string | null,
  handleSearch: (username: string) => void
}

type AppAction =
  | { type: 'SEARCH_START'; payload: string }
  | { type: 'SEARCH_SUCCESS'; payload: userType }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SEARCH_ABORT' };

interface AppState {
  user: userType | null;
  loading: boolean;
  error: string | null;
  currentSearch: string | null;
}

const initialState: AppState = {
  user: null,
  loading: false,
  error: null,
  currentSearch: null,
};

function githubReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        loading: true,
        error: null,
        currentSearch: action.payload,
      };

    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
        currentSearch: null,
      };
    case 'SEARCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        currentSearch: null,
      };
    case 'SEARCH_ABORT':
      return {
        ...state,
        loading: false,
        currentSearch: null,
      };
    default:
      return state;
  }
}

const defaultUser = {
  user: null,
  loading: false,
  error: null,
  handleSearch: (username: string) => { }
};

const GithubContext = createContext<GithubContextType>(defaultUser);

export function GithubProvider({ children }: { children: React.ReactNode }) {
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const { setItem } = useLocalStorage();
  // reducer setup 
  const [reducerState, dispatch] = useReducer(githubReducer, initialState);

  const handleSearch = useCallback(async (username: string) => {
    if (abortController) {
      abortController.abort();
    }
    // Dispatch: "Search started"
    dispatch({ type: 'SEARCH_START', payload: username });
    const controller = new AbortController();
    setAbortController(controller);
    try {
      const data = await userData(username, controller.signal);
      dispatch({ type: 'SEARCH_SUCCESS', payload: data });
    } catch (err: any) {
      if (err.name === "AbortError") {
        dispatch({ type: 'SEARCH_ABORT' });
        return;
      }
      dispatch({ type: 'SEARCH_ERROR', payload: "User not found" });
    } finally {
      setItem("lastSearch", username);
    }
  }, [setItem, dispatch])
  return (
    <GithubContext.Provider value={{
      user: reducerState.user,
      loading: reducerState.loading,
      error: reducerState.error,
      handleSearch
    }} >{children}</GithubContext.Provider>
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
