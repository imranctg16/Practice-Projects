import type React from "react";
import { useForm } from "../hooks/useForm";
import { useUserContext } from "../providers/UserProvider";

type User = {
  id: string | number;
  name: string;
  email: string;
  age: number;
  greeting: string;
  description: string;
}


const validationRules = {
  name: (value: string) => !value ? "Name is required" : "",
  email: (value: string) => !value ? "Email is required" : "",
  age: (value: number) => !value ? "Age is required" : value < 18 ? "Must be at least 18" : "",
  greeting: (value: string) => !value ? "Greeting is required" : "",
  description: (value: string) => !value ? "Description is required" : ""
};

function CreateUserForm() {
  const { addUser, user, setUser, isEdit } = useUserContext();
  const { values, errors, handleChange, hasErrors } = useForm(user, validationRules);

  const handleSubmit = () => {
    if (hasErrors()) {
      alert("Please fix the errors before submitting.");
      return;
    }
    if (isEdit) {
      addUser({ ...values, id: user.id });
    } else {
      addUser({ ...values, id: Date.now() });
    }
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
            value={values.name}
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
            value={values.age}
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
            value={values.email}
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
            value={values.greeting}
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
            value={values.description}
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