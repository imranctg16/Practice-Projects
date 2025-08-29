import type React from "react";
import { useState } from "react";

type User = {
  id: string | number;
  name: string;
  email: string;
  age: number;
  greeting: string;
  description: string;
}
interface props {
  addUser: (user: User) => void,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  isEdit: boolean,
  errors: { name?: string; email?: string; age?: string; greeting?: string; description?: string }
  setErrors: React.Dispatch<React.SetStateAction<{ name?: string; email?: string; age?: string; greeting?: string; description?: string }>>
}

function CreateUserForm({ addUser, user, setUser, isEdit, errors, setErrors }: props) {
  const [submitFlag, setSubmitFlag] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    validateFields(e.target.name, e.target.value);
    setUser((prev) => {
      const { name, value } = e.target;
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = () => {
    if (Object.values(errors).some((error) => error != "")) {
      alert("Please fix the errors before submitting.");
      return;
    }
    if (isEdit) {
      addUser({ ...user, id: user.id });
    } else {
      addUser({ ...user, id: Date.now() });
    }
  }
  const validateFields = (name: string, value: string | number) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        break;
      case "email":
        if (!value) error = "Email is required";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (typeof value === "number" && value < 18) error = "Must be at least 18";
        break;
      case "greeting":
        if (!value) error = "Greeting is required";
        break;
      case "description":
        if (!value) error = "Description is required";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="px-3 py-2 rounded-xl bg-white shadow max-w-md w-full mb-3">
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold">Create New User</h2>
        <p className="text-gray-600">Fill out the form below to add a new user.</p>
      </div>
      { /** show this element based on isShow*/}
      <form className="form-items space-y-4 mt-4" >
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm text-gray-500 font-semibold">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={user.name}
            onChange={handleChange}

            className="px-3 py-2 w-full bg-gray-50 border rounded-lg border-gray"
            required
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="age" className="text-sm text-gray-500 font-semibold">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            value={user.age}
            onChange={handleChange}
            className="px-3 py-2 w-full bg-gray-50 border rounded-lg border-gray"
            required
          />
          {errors.age && <span className="text-red-500 text-sm">{errors.age}</span>}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm text-gray-500 font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            className="px-3 py-2 w-full bg-gray-50 border rounded-lg border-gray"
            required
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="greeting" className="text-sm text-gray-500 font-semibold">Greeting</label>
          <input
            id="greeting"
            name="greeting"
            type="text"
            value={user.greeting}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full bg-gray-50"
          />
          {errors.greeting && <span className="text-red-500 text-sm">{errors.greeting}</span>}
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="text-sm text-gray-500 font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            value={user.description}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full bg-gray-50"
          />
          {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 flex-1 rounded-xl hover:bg-blue-600 transition-colors"
            onClick={(e) => { e.preventDefault(); handleSubmit(); }}
          >
            {isEdit ? "Update" : "Create"} User
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white p-2 flex-1 rounded-xl hover:bg-gray-600 transition-colors"
            onClick={() => { setUser({ id: '', name: '', email: '', age: 0, greeting: '', description: '' }); }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;