import { useEffect, useState } from "react";

function useUsers() {
  type User = {
    id: string | number;
    name: string;
    age: number;
    email: string;
    greeting: string;
    description: string;
  };

  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      greeting: "Hello!",
      description: "A software engineer from NY."
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 25,
      email: "jane@example.com",
      greeting: "Hi there!",
      description: "A graphic designer from CA."
    }
  ];
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

  const addUser = (user: User) => {
    if (isEdit) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, user]);
    }
    setShow(false);
  }

  const editUser = (user: User) => {
    setUser(user);
    setIsEdit(true);
    setShow(true);
  }

  const deleteUser = (user: User) => {
    let filtered = users.filter(u => u.id !== user.id)
    setUsers(filtered);
  }

  useEffect(() => {
    setUsers(mockUsers);
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
    deleteUser
  };
}

export default useUsers;
