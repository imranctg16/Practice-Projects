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
  // load last search from localStorage on component mount
  useEffect(() => {
    console.log("useEffect running on mount");

    let lastSearch = localStorage.getItem('lastSearch')
    console.log("lastSearch from localStorage:", lastSearch);
    if (lastSearch) {
      console.log("Found last search in localStorage:", lastSearch);
      setSearch(lastSearch);
      handleSearch(lastSearch);
    }
  }, []);
  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userData(username);
      setUser(data);
      setSearch(username);
      localStorage.setItem('lastSearch', username);
    } catch (err) {
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
