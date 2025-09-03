import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { User } from "../types/User";
import { userApi } from "../services/userApi";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";
import { setUsers, addUser, updateUser, deleteUser } from "../store/usersSlice";

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

  // Redux hooks - get state and dispatch from global store
  const users = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false); // For fetching users
  const [isSubmitting, setIsSubmitting] = useState(false); // For create/update
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const addUser = useCallback(async (user: User) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        const updatedUser = await userApi.updateUser(user);
        dispatch(updateUser(updatedUser));
        navigate(`/users/${updatedUser.id}`); // Navigate to user detail
      } else {
        const newUser = await userApi.createUser(user);
        dispatch(addUser(newUser));
        navigate(`/users/${newUser.id}`); // Navigate to user detail
      }
      setShow(false);
      setIsEdit(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [isEdit, navigate]);

  const editUser = useCallback((user: User) => {
    setUser(user);
    setIsEdit(true);
    setShow(true);
  }, []);

  const deleteUser = useCallback(async (user: User) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await userApi.deleteUser(user.id);
      dispatch(deleteUser(user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userApi.getUsers();
      dispatch(setUsers(fetchedUsers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // useMemo: Expensive calculation - only recalculates when users array changes
  const userStats = useMemo(() => {
    console.log('📊 Calculating user stats (expensive operation)');
    return {
      total: users.length,
      averageAge: users.length > 0 ? users.reduce((sum, user) => sum + user.age, 0) / users.length : 0,
      youngestAge: users.length > 0 ? Math.min(...users.map(u => u.age)) : 0,
      oldestAge: users.length > 0 ? Math.max(...users.map(u => u.age)) : 0,
    };
  }, [users]); // Only recalculates when users change

  return {
    isShow,
    setShow,
    toggleShow,
    isEdit,
    setIsEdit,
    user,
    setUser,
    users,
    addUser,
    editUser,
    deleteUser,
    isLoading,        // For user list loading
    isSubmitting,     // For form submission loading
    error,
    refetch: fetchUsers,
    userStats         // Memoized user statistics
  };
}

export default useUsers;
