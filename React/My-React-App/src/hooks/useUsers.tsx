import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { userApi } from "../services/userApi";

function useUsers() {
  const [isShow, setShow] = useState(false);

  const toggleShow = (value: boolean) => {
    setShow(value);
  }
  const [isEdit, setIsEdit] = useState(false);

  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    age: 0,
    greeting: '',
    description: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For fetching users
  const [isSubmitting, setIsSubmitting] = useState(false); // For create/update
  const [error, setError] = useState<string | null>(null);

  const addUser = async (user: User) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        const updatedUser = await userApi.updateUser(user);
        setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      } else {
        const newUser = await userApi.createUser(user);
        setUsers([...users, newUser]);
      }
      setShow(false);
      setIsEdit(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  const editUser = (user: User) => {
    setUser(user);
    setIsEdit(true);
    setShow(true);
  }

  const deleteUser = async (user: User) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userApi.deleteUser(user.id);
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  }

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userApi.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    isShow,
    setShow,
    toggleShow,
    isEdit,
    setIsEdit,
    user,
    setUser,
    users,
    setUsers,
    addUser,
    editUser,
    deleteUser,
    isLoading,        // For user list loading
    isSubmitting,     // For form submission loading
    error,
    refetch: fetchUsers
  };
}

export default useUsers;
