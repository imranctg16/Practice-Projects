import type { User } from "../types/User";

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
    }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldFail = () => Math.random() < 0.1;

export const useApi = {
    async fetchUsers() {
        await delay(800);
        if (shouldFail()) {
            throw new Error('Failed to fetch users from server');
        }
        return [...mockUsers];
    },

    async addUser(user: User) {
        await delay(800);
        if (shouldFail()) {
            throw new Error('Failed to add user to server');
        }
        mockUsers.push({ ...user, id: mockUsers.length + 1 });
        return { ...user, id: mockUsers.length };
    },
    async updateUser(user: User) {
        await delay(800);
        if (shouldFail()) {
            throw new Error('Failed to update user on server');
        }
        const index = mockUsers.findIndex(u => u.id === user.id);
        if (index === -1) {
            throw new Error('User not found');
        }
        mockUsers[index] = user;
        return user;
    },
    async deleteUser(id: number) {
        await delay(800);
        if (shouldFail()) {
            throw new Error('Failed to delete user from server');
        }
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error('User not found');
        }
        mockUsers.splice(index, 1);
        return { id };
    }

};
