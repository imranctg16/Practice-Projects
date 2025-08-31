import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import UserList from './components/UserList';
import CreateUserForm from './components/CreateUserForm';
import { UserProvider } from './providers/UserProvider';
function App() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Sidebar />
        <main className="ml-64 pt-16 p-6">
          <UserList />
        </main>

        <Modal>
          <CreateUserForm />
        </Modal>
      </div>
    </UserProvider>
  );
}
export default App;