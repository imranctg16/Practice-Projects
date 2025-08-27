import { useState } from "react";
import FormComponent from "./components/FormComponent";
import BusinessCard from "./components/BusinessCard";
import UserAge from "./components/UserAge";
import FormBuilder from "./components/FormBuilder";

// LEVEL 2: BETTER TAILWIND - Adding spacing, colors, and responsive design
function AppBetter() {
  const [name, setName] = useState("John Doe");
  const names = ["Alice", "Bob", "Charlie", "David"];
  
  const people = [
    { name: "John Smith", title: "Software Engineer", company: "Tech Corp", email: "john@techcorp.com", phone: "+1-555-0101" },
    { name: "Sarah Johnson", title: "Product Manager", company: "StartupXYZ", email: "sarah@startup.com", phone: "+1-555-0102" },
    { name: "Mike Davis", title: "UX Designer", company: "Design Studio", email: "mike@design.com", phone: "+1-555-0103" },
    { name: "Emily Brown", title: "Marketing Director", company: "Brand Co", email: "emily@brand.com", phone: "+1-555-0104" }
  ];

  return (
    // Better: Add background color and better spacing
    <div className="min-h-screen bg-gray-50 py-8">
      
      {/* Better: Center content and add container */}
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Better: Improved header with colors */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">React Learning Hub</h1>
          <p className="text-lg text-gray-600">Building beautiful UIs with Tailwind CSS</p>
        </div>

        {/* Better: Enhanced cards with better shadows and spacing */}
        <div className="space-y-8">
          
          {/* Name Input Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Your Name?</h2>
            
            <div className="max-w-md mx-auto">
              <FormComponent 
                label="Your Name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required={true} 
              />
            </div>
            
            {/* Better: Improved info display */}
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl text-gray-800 mb-4">
                Hello, <span className="font-bold text-blue-600">{name}</span>! 👋
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Welcome</p>
                  <p className="font-semibold">Welcome to React!</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Characters</p>
                  <p className="font-semibold">{name.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Conditional Rendering Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Conditional Rendering</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {name && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">✅</span>
                    <h3 className="text-lg font-semibold text-green-800">Logged In</h3>
                  </div>
                  <p className="text-green-700">You are logged in as: <strong>{name}</strong></p>
                </div>
              )}
              
              <div className={name ? "bg-blue-50 p-6 rounded-lg border border-blue-200" : "bg-red-50 p-6 rounded-lg border border-red-200"}>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{name ? "🔐" : "🔓"}</span>
                  <h3 className="text-lg font-semibold">Authentication</h3>
                </div>
                <p className={name ? "text-blue-700" : "text-red-700"}>
                  {name ? `Authenticated as: ${name}` : "You are not logged in."}
                </p>
              </div>
            </div>
          </section>

          {/* List Rendering Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dynamic List</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {names.map((listName, index) => (
                <div key={index} className="bg-orange-50 p-6 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                      {listName.charAt(0)}
                    </div>
                    <p className="font-semibold text-gray-800">{listName}</p>
                    <p className="text-sm text-gray-500">User #{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Business Cards Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Network</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {people.map((person, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{person.name}</h3>
                      <p className="text-gray-600">{person.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Company:</strong> {person.company}</p>
                    <p className="text-sm"><strong>Email:</strong> {person.email}</p>
                    <p className="text-sm"><strong>Phone:</strong> {person.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Components Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Age Counter</h2>
              <UserAge />
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Builder</h2>
              <FormBuilder />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-12">
          <p className="text-gray-600">Built with React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default AppBetter;