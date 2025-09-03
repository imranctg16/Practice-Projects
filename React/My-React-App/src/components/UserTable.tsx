import React from "react";
import type { User } from "../types";
import { Link } from 'react-router-dom';


interface UserTableProps {
  users: User[];
  isLoading: boolean;
  error?: string | null;
  isSubmitting: boolean;
  setShow: (show: boolean) => void;
  editUser: (user: User) => void;
  deleteUser: (user: User) => void;
  refetch: () => void;
  userStats: {
    total: number;
    averageAge: number;
    youngestAge: number;
    oldestAge: number;
  };
}

const UserTable = React.memo(function UserTable({
  users,
  isLoading,
  error,
  isSubmitting,
  setShow,
  editUser,
  deleteUser,
  refetch,
  userStats
}: UserTableProps) {
  console.log('🔄 UserTable re-rendered - React.memo working!');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => {
            setShow(true);
          }}
          disabled={isSubmitting}
        >
          Create User
        </button>
      </div>

      {/* User Statistics - useMemo optimization showcase */}
      {users.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">User Statistics 📊</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.total}</div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.averageAge.toFixed(1)}</div>
              <div className="text-sm text-blue-800">Avg Age</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.youngestAge}</div>
              <div className="text-sm text-blue-800">Youngest</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.oldestAge}</div>
              <div className="text-sm text-blue-800">Oldest</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-4">
        <div className="rounded-lg shadow border text-center">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-gray-500">No Users Found</div>
          ) : (
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b py-2">
                      <Link
                        to={`/users/${user.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="border-b py-2">{user.email}</td>
                    <td className="border-b py-2">{user.age}</td>
                    <td className="border-b py-2 space-x-4">
                      <button
                        className="text-blue-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        onClick={() => editUser(user)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        onClick={() => deleteUser(user)}
                        disabled={isSubmitting}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

export default UserTable;
