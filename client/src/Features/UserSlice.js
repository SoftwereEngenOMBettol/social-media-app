// Features/UserSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: {},
  users: [],
  currentUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isAuthenticated: false,
  error: null
};

// ========== AUTHENTICATION THUNKS ==========
export const registerUser = createAsyncThunk("users/registerUser",
  async (userData) => {
    try {
      const response = await axios.post("http://localhost:3001/registerUser", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const login = createAsyncThunk(
  "users/login",
  async (userData) => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email: userData.email,
        password: userData.password,
      });
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

// ========== USER PROFILE THUNKS ==========
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async ({ userId, userData }) => {
    try {
      const response = await axios.put(`http://localhost:3001/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "users/getUserProfile",
  async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

// Get all users
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      return response.data.users;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.user = {};
      state.isAuthenticated = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
        state.user = action.payload;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // User Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.user = action.payload;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.user = action.payload;
      })
      // Get all users
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
  },
});

export const { 
  logoutUser, 
  clearError, 
  clearSuccess,
  setCurrentUser,
  updateCurrentUser
} = userSlice.actions;

export default userSlice.reducer;