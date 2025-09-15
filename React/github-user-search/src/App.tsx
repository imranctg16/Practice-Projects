import './App.css';
import AppContent from './components/AppContent';
import { GithubProvider } from './contexts/GithubContext';
function App() {
  return (
    <GithubProvider>
      <AppContent></AppContent>
    </GithubProvider>
  );
}
export default App;
