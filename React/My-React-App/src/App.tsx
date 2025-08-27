import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import UserList from './components/UserList';
import CreateUserForm from './components/CreateUserForm';
import useUsers from './hooks/useUsers';

function App() {
  const { isShow, setShow, toggleShow, isEdit, setIsEdit, user, setUser, users, setUsers, addUser, editUser, deleteUser } = useUsers();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-16 p-6">
        <UserList setShow={setShow} users={users} editUser={editUser} deleteUser={deleteUser} />
      </main>

      <Modal isShow={isShow} setShow={setShow}>
        <CreateUserForm addUser={addUser} user={user} isEdit={isEdit} setUser={setUser} />
      </Modal>
    </div>
  );
}
export default App;