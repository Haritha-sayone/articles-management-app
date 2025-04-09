import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  uid: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null; // Store full user details as an object
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload; // Store full user details
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null; // Clear user details on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
