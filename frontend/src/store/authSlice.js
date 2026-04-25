import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Full user data only populated if needed or saved separately
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // It's assumed the caller already set localStorage items
      if (action.payload?.user) {
         state.user = action.payload.user;
         localStorage.setItem('username', action.payload.user.username);
         localStorage.setItem('fullName', action.payload.user.fullName);
         localStorage.setItem('role', 'STUDENT'); // Generic fallback
      }
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

