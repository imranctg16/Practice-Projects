export default function useLocalStorage() {
  const getItem = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  const setItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
  };

  const removeItem = (key: string): void => {
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
}
