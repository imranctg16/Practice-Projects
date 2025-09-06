import { userType } from "../types/Users";
const userData = async (username: string, signal: AbortSignal | null): Promise<userType> => {

  let response = await fetch(`https://api.github.com/users/${username}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

export { userData };
