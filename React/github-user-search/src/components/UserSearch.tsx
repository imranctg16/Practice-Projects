import React, { useEffect, useState } from "react";

interface userSearchProps {
    onSearch: (username: string) => void;
    search: string
}

function UserSearch({ onSearch, search }: userSearchProps) {
    const [username, setUserName] = useState(search);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (username) {
            console.log("Searching for user:", username);
            onSearch(username);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your github username" />
            <button type="submit">Search</button>
        </form>
    );
}

export default UserSearch;