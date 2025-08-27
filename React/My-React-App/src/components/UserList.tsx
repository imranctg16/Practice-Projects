type User = {
  id: string | number;
  name: string;
  age: number;
  email: string;
  greeting: string;
  description: string;
};

type Props = {
  setShow: (show: boolean) => void;
  users: User[];
  editUser: (user: User) => void;
  deleteUser: (user: User) => void;
};
function UserList({ setShow, users, editUser, deleteUser }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={() => { setShow(true) }}>
          Create User
        </button>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg shadow border text-center">
          {
            users.length === 0 ? "No Users Found" :

              <table className="min-w-full bg-white border-gray-200 border">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Age</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="border-b py-2">{user.name}</td>
                      <td className="border-b py-2">{user.email}</td>
                      <td className="border-b py-2">{user.age}</td>
                      <td className="border-b py-2 space-x-4">
                        <button className="text-blue-500 hover:underline" onClick={() => editUser(user)}>Edit</button>
                        <button className="text-red-500 hover:underline" onClick={()=>deleteUser(user)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>
    </div>
  );
}

export default UserList;