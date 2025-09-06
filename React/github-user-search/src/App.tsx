import { useEffect, useState } from 'react';
import './App.css';
import { userData } from './services/githubApi';
import UserSearch from './components/UserSearch';
import UserCard from './components/UserCard';
import type { userType } from './types/Users';
function App() {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [abortSignal, setAbortSignal] = useState<AbortSignal | null>(null);
  // init AbortController and signal on component mount
  useEffect(() => {

  }, []);
  // load last search from localStorage on component mount
  useEffect(() => {
    let lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
      setSearch(lastSearch);
      handleSearch(lastSearch);
    }
  }, []);
  const handleSearch = async (username: string) => {
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
      setSearch(username);
      localStorage.setItem('lastSearch', username);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError("User not found");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="App">
      <h1>GitHub User Search</h1>
      <UserSearch onSearch={handleSearch} search={search} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && <UserCard user={user} />}
    </div>
  );

}

export default App;
