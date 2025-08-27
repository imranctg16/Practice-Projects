function Basic() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 border">
            <nav className="fixed top-0 left-0 w-full border mb-4 flex justify-end items-end">
                <ul className="flex space-x-4">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
            <div className="flex mt-5">
                <aside className="bg-white p-4 shadow rounded-lg mb-4 mr-4 w-1/4 ">
                    <h2>Sidebar</h2>
                    <p>This is the sidebar content.</p>
                </aside>
                <div className="flex flex-col space-y-4 bg-white p-4 shadow rounded-lg w-3/4">
                    <div className="relative card bg-gray-50 m-2 p-2">
                        <h2>Main Content</h2>
                        <p>This is the main content area.</p>
                        <div className="flex justify-between">
                            <p>This is some additional content.</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="absolute top-0 right-0 p-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>

                        </div>
                    </div>
                    {/* <div className="card bg-gray-50 m-2 p-2">
                        <h2>Main Content</h2>
                        <p>This is the main content area.</p>
                        <div className="flex justify-between">
                            <p>This is some additional content.</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Basic;