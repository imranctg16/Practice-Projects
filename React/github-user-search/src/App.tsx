import { useEffect, useState } from 'react';
import './App.css';
import UserSearch from './components/UserSearch';
import UserCard from './components/UserCard';
import useGithubUser from './hooks/useGithubUser';
import useLocalStorage from './hooks/useLocalStorage';
function App() {
  const [ search, setSearch] = useState<string>('');
  const { user, loading, error, handleSearch } = useGithubUser();
  const { getItem } = useLocalStorage();

  // intialize search from localStorage
  useEffect(() => {
    let lastSearch = getItem('lastSearch');
    if (lastSearch) {
      setSearch(lastSearch);
      handleSearch(lastSearch);
    }
  }, []);
  
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
