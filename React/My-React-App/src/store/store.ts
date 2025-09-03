import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

// Create the Redux store
export const store = configureStore({
  reducer: {
    users: usersReducer, // Your users slice becomes part of global state
  },
  // Redux DevTools enabled automatically in development!
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Debug: Show store structure
console.log('🏪 Redux Store Created:', {
  initialState: store.getState(),
  reducers: Object.keys(store.getState())
});