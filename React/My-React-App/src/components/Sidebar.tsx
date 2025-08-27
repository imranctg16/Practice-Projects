function Sidebar() {
  return (
    <aside className="bg-gray-50 border-r w-64 fixed left-0 top-16 bottom-0 pt-6">
      <nav className="px-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center px-4 py-2 text-gray-700 bg-blue-50 border-r-2 border-blue-500 rounded-l-lg">
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;