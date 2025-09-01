import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";


function UserDetails() {
    const { id } = useParams();
    const { users } = useUserContext();
    // Debug information
    console.log('URL ID:', id, typeof id);
    console.log('Available users:', users.map(u => ({ id: u.id, type: typeof u.id })));

    // Try both string and number comparison
    const user = users.find(u => u.id.toString() === id || u.id === Number(id));

    console.log(user);
    if (!user) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                <Link to="/users" className="text-blue-500 hover:underline">
                    ← Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Link to="/users" className="text-blue-500 hover:underline mb-4 inline-block">
                ← Back to Users
            </Link>

            <div className="bg-white p-6 rounded-lg shadow">
                <h1 className="text-3xl font-bold mb-6">{user.name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-2">Email</p>
                        <p className="text-lg">{user.email}</p>
                    </div>

                    <div>
                        <p className="text-gray-600 mb-2">Age</p>
                        <p className="text-lg">{user.age}</p>
                    </div>

                    <div>
                        <p className="text-gray-600 mb-2">Greeting</p>
                        <p className="text-lg">{user.greeting}</p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-gray-600 mb-2">Description</p>
                        <p className="text-lg">{user.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserDetails;