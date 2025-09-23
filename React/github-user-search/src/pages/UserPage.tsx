import { useParams } from "react-router-dom";
import { useGithub } from "../contexts/GithubContext";
import { useEffect } from "react";

function UserPage() {
    const { username } = useParams<{ username: string }>();
    const { user, loading, error, handleSearch } = useGithub();

    useEffect(() => {
        if (username) {
            handleSearch(username);
        }
    }, [username, handleSearch]);


    return (
        <div>
            <h1>User Page: {username}</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user && (
                <div>
                    <h2>{user.name || user.login}</h2>
                    <p>@{user.login}</p>
                    {user.bio && <p>{user.bio}</p>}
                </div>
            )}
        </div>
    );
}
export default UserPage;
