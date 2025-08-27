function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, Admin</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;