import type { User } from '../types/User';

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    greeting: "Hello!",
    description: "A software engineer from NY."
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com",
    greeting: "Hi there!",
    description: "A graphic designer from CA."
  },
  {
    id: 3,
    name: "Mike Johnson",
    age: 35,
    email: "mike@example.com", 
    greeting: "Good morning!",
    description: "A product manager from TX."
  }
];

let users = [...mockUsers];
let nextId = 4;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (10% chance)
const simulateFailure = () => Math.random() < 0.1;

export const userApi = {
  async getUsers(): Promise<User[]> {
    await delay(800); // Simulate network delay
    
    if (simulateFailure()) {
      throw new Error('Failed to fetch users from server');
    }
    
    return [...users];
  },

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    await delay(600);
    
    if (simulateFailure()) {
      throw new Error('Failed to create user');
    }
    
    const newUser: User = {
      ...userData,
      id: nextId++
    };
    
    users.push(newUser);
    return newUser;
  },

  async updateUser(updatedUser: User): Promise<User> {
    await delay(500);
    
    if (simulateFailure()) {
      throw new Error('Failed to update user');
    }
    
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users[index] = updatedUser;
    return updatedUser;
  },

  async deleteUser(userId: string | number): Promise<void> {
    await delay(400);
    
    if (simulateFailure()) {
      throw new Error('Failed to delete user');
    }
    
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    users.splice(index, 1);
  }
};