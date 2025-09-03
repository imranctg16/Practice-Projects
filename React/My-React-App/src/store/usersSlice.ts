import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/User';

// Initial state - same as your useReducer
const initialState: User[] = [];

// Create slice - converts your reducer to Redux
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Same logic as your useReducer, but cleaner syntax!
    setUsers: (state, action: PayloadAction<User[]>) => {
      return action.payload; // Replace entire array
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload); // Immer makes this safe
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload; // Direct assignment with Immer
      }
    },
    deleteUser: (state, action: PayloadAction<string | number>) => {
      return state.filter(user => user.id !== action.payload);
    }
  }
});

// Export actions - these create action objects automatically
export const { setUsers, addUser, updateUser, deleteUser } = usersSlice.actions;

// Export reducer - this goes into the store
export default usersSlice.reducer;

// Debug: Log what we created
console.log('🔧 Redux Actions Created:', usersSlice.actions);