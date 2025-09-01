import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import CreateUserForm from './components/CreateUserForm';
import { UserProvider } from './providers/UserProvider';
import UserList from './components/UserList';
import UserDetails from './pages/UserDetails';

function Dashboard() {
  return <div className="p-6"><h1>Dashboard Page</h1></div>;
}

function Settings() {
  return <div className="p-6"><h1>Settings Page</h1></div>;
}

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Sidebar />

          <div className="ml-64 pt-16">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/:id" element={<UserDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>

          <Modal>
            <CreateUserForm />
          </Modal>
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;
