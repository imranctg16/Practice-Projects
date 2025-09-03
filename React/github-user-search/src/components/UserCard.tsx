import type { userType } from '../types/Users';

interface UserCardProps {
    user: userType;
}

function UserCard({ user }: UserCardProps) {
    return (
        <div className="user-card">
            <img src={user.avatar_url} alt={`${user.login}'s avatar`}
                width="150" />
            <h2>{user.name || user.login}</h2>
            <p>@{user.login}</p>
            {user.bio && <p>{user.bio}</p>}

            <div className="user-stats">
                <div>
                    <strong>{user.public_repos}</strong>
                    <span>Repositories</span>
                </div>
                <div>
                    <strong>{user.followers}</strong>
                    <span>Followers</span>
                </div>
                <div>
                    <strong>{user.following}</strong>
                    <span>Following</span>
                </div>
            </div>
        </div>
    );

}
export default UserCard;