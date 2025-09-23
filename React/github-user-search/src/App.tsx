import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { GithubProvider } from './contexts/GithubContext';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import Navigation from './components/Navigation';
function App() {
  return (
    <GithubProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    </GithubProvider>
  );
}
export default App;
