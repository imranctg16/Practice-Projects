import { userType } from "../types/Users";
const userData = async (username: string): Promise<userType> => {
  let response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

export { userData };