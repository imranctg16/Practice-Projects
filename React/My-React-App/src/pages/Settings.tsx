function Settings() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Theme</label>
                        <select className="border rounded-lg px-3 py-2">
                            <option>Light</option>
                            <option>Dark</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select className="border rounded-lg px-3 py-2">
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Settings;