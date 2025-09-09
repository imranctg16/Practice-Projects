import React, { useEffect, useState } from "react";

interface userSearchProps {
    onSearch: (username: string) => void;
    search: string
}

function UserSearch({ onSearch, search }: userSearchProps) {
    const [username, setUserName] = useState("");

    useEffect(() => {
        if (!search) return;
        setUserName(search);
    }, [search]);


    useEffect(() => {
        if (!username) return;
        const timer = setTimeout(() => {
            onSearch(username);
            setUserName(username);
            console.log("Searching for user:", username);
        }, 500);
        // cleanup function to clear the timer if username changes before 500ms
        return () => clearTimeout(timer);
    }, [username, onSearch]);

    return (
        <form>
            <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your github username" />
        </form>
    );
}

export default UserSearch;