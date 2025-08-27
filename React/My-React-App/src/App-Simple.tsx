import { useState } from "react";
import FormComponent from "./components/FormComponent";
import BusinessCard from "./components/BusinessCard";
import UserAge from "./components/UserAge";
import FormBuilder from "./components/FormBuilder";

// LEVEL 1: BASIC TAILWIND - Just the essentials!
function AppSimple() {
  const [name, setName] = useState("John Doe");
  const names = ["Alice", "Bob", "Charlie", "David"];
  
  const people = [
    { name: "John Smith", title: "Software Engineer", company: "Tech Corp", email: "john@techcorp.com", phone: "+1-555-0101" },
    { name: "Sarah Johnson", title: "Product Manager", company: "StartupXYZ", email: "sarah@startup.com", phone: "+1-555-0102" }
  ];

  return (
    // Step 1: Basic container with padding
    <div className="p-8">
      
      {/* Step 2: Simple header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">React Learning App</h1>
        <p className="text-gray-600">Learning Tailwind step by step</p>
      </div>

      {/* Step 3: Basic card layout */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">What's Your Name?</h2>
        
        <FormComponent 
          label="Your Name" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required={true} 
        />
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg">Hello, <span className="font-bold">{name}</span>!</p>
          <p>Welcome to React!</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
          <p>Name length: {name.length}</p>
        </div>
      </div>

      {/* Step 4: Simple conditional rendering */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Conditional Rendering</h2>
        
        {name && (
          <div className="p-4 bg-green-100 rounded mb-4">
            <p>✅ You are logged in as: {name}</p>
          </div>
        )}
        
        <div className="p-4 bg-blue-100 rounded">
          <p>{name ? `🔐 Authenticated as: ${name}` : "🔓 You are not logged in"}</p>
        </div>
      </div>

      {/* Step 5: Simple list */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Name List</h2>
        <div className="flex gap-4">
          {names.map((listName, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                {listName.charAt(0)}
              </div>
              <p className="font-semibold">{listName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 6: Simple business cards */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Business Cards</h2>
        <div className="flex gap-4">
          {people.map((person, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-bold">{person.name}</h3>
              <p className="text-gray-600">{person.title}</p>
              <p className="text-sm">{person.company}</p>
              <p className="text-sm">{person.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 7: Simple components */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">User Age Counter</h2>
        <UserAge />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Form Builder</h2>
        <FormBuilder />
      </div>
    </div>
  );
}

export default AppSimple;