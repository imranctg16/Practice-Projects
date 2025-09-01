import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-gray-800 text-white">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${location.pathname === '/' ? 'bg-gray-700' : ''
                }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${location.pathname === '/users' ? 'bg-gray-700' : ''
                }`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`block px-4 py-2 rounded-lg hover:bg-gray-700 ${location.pathname === '/settings' ? 'bg-gray-700' : ''
                }`}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;

