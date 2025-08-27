import type React from "react";

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
  isEdit: boolean
}

function CreateUserForm({ addUser, user, setUser, isEdit }: props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser((prev) => {
      const { name, value } = e.target;
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = () => {
    if (user.name && user.email && user.age) {
      if (user.age < 18) {
        alert("User must be at least 18 years old.");
        return;
      }
      if (isEdit) {
        addUser({ ...user, id: user.id });
      } else {
        addUser({ ...user, id: Date.now() });
      }
    }
  }

  return (
    <div className="px-3 py-2 rounded-xl bg-white shadow max-w-md w-full mb-3">
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
            onClick={() => { setUser({id: '', name: '', email: '', age: 0, greeting: '', description: ''}); }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;