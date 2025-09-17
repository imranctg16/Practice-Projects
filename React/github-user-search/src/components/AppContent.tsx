
import { useState, useEffect } from "react";
import { useGithub } from "../contexts/GithubContext";
import useLocalStorage from "../hooks/useLocalStorage";
import UserSearch from "./UserSearch";
import UserCard from "./UserCard";
export default function AppContent() {
    const [search, setSearch] = useState<string>('');
    const { user, loading, error, handleSearch } = useGithub();
    const { getItem } = useLocalStorage();
    // intialize search from localStorage
    useEffect(() => {
        let lastSearch = getItem('lastSearch');
        if (lastSearch) {
            console.log("🔴 APP: Calling handleSearch from localStorage:", lastSearch);
            setSearch(lastSearch);
            handleSearch(lastSearch);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps  

    return (
        <div className="App">
            <h1>GitHub User Search</h1>
            <UserSearch onSearch={handleSearch} search={search} />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <UserCard />
        </div>
    );
}
