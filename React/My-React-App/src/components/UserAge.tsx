import { useState } from 'react';

function UserAge() {
    const [user, setUser] = useState({ id: 1, name: "John Doe", age: 30 });

    const incrementAge = () => {
        setUser((prev) => ({ ...prev, age: prev.age + 1 }));
    };

    const decrementAge = () => {
        setUser((prev) => ({ ...prev, age: Math.max(0, prev.age - 1) }));
    };

    const resetAge = () => {
        setUser((prev) => ({ ...prev, age: 30 }));
    };

    return (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {user.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h3>
                <p className="text-gray-600">Interactive Age Counter</p>
            </div>

            <div className="text-center mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Current Age</p>
                    <div className="flex items-center justify-center">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                            {user.age}
                        </span>
                        <span className="text-2xl text-gray-500 ml-2">years</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={decrementAge}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                >
                    <span className="mr-2">-</span>
                    Younger
                </button>
                
                <button 
                    onClick={resetAge}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                >
                    <span className="mr-2">↻</span>
                    Reset
                </button>
                
                <button 
                    onClick={incrementAge}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                >
                    <span className="mr-2">+</span>
                    Older
                </button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    🎂 {user.age < 18 ? "Minor" : user.age < 65 ? "Adult" : "Senior"} • 
                    🎯 Born in {new Date().getFullYear() - user.age}
                </p>
            </div>
        </div>
    );
}
export default UserAge;