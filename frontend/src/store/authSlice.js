import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('accessToken')
    ? {
        username: localStorage.getItem('username') || '',
        fullName: localStorage.getItem('fullName') || '',
        email: localStorage.getItem('email') || '',
      }
    : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // It's assumed the caller already set localStorage items
      if (action.payload?.user) {
        const user = action.payload.user;

        state.user = user;

        if (user.username) localStorage.setItem('username', user.username);
        if (user.fullName) localStorage.setItem('fullName', user.fullName);
        if (user.email) {
          localStorage.setItem('email', user.email);
        } else {
          localStorage.removeItem('email');
        }
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
