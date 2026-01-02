import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // stert login with loading spinner
    loginStart: (state) => {
      state.loading = true;
    },

    // when login is successful user + token
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;

      // save user to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(action.payload.user));
    },

    // when login is failed
    loginFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    //logout - clear user and token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // remove user from localStorage
      localStorage.removeItem("loggedInUser");
    },

    //update current user
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    restoreSession: (state) => {
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, restoreSession } =
  authSlice.actions;
export default authSlice.reducer;
