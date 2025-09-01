export type User = {
  id: string | number;
  name: string;
  age: number;
  email: string;
  greeting: string;
  description: string;
};

export type UserContextType = {
  isShow: boolean;
  setShow: (show: boolean) => void;
  toggleShow: (value: boolean) => void;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => Promise<void>;
  editUser: (user: User) => void;
  deleteUser: (user: User) => Promise<void>;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};