// Features/FriendSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  friends: [],
  notFriends: [],
  suggestedFriends: [],
  friendRequests: [],
  isLoading: false,
  isError: false,
  error: null
};

// ========== FRIENDS MANAGEMENT THUNKS ==========
export const getNotFriends = createAsyncThunk(
  "friends/getNotFriends",
  async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/findfriends/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
  }
);

export const getUserFriends = createAsyncThunk(
  "friends/getUserFriends",
  async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/myfriends/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch friends");
    }
  }
);

export const addFriend = createAsyncThunk(
  "friends/addFriend",
  async ({ userId, friendId }) => {
    try {
      const response = await axios.post("http://localhost:3001/addFriend", {
        userId,
        friendId
      });
      return { friendId, message: response.data.message };
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to add friend");
    }
  }
);

export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async ({ userId, friendId }) => {
    try {
      const response = await axios.delete("http://localhost:3001/myfriends/remove", {
        data: { userId, friendId }
      });
      return { friendId, message: response.data.message };
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to remove friend");
    }
  }
);

export const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addLocalFriend: (state, action) => {
      if (!state.friends) state.friends = [];
      state.friends.push(action.payload);
    },
    removeLocalFriend: (state, action) => {
      state.friends = state.friends.filter(friend => friend._id !== action.payload);
    },
    clearAllFriends: (state) => {
      state.friends = [];
      state.notFriends = [];
      state.suggestedFriends = [];
      state.friendRequests = [];
    },
    initializeFriends: (state) => {
      if (!state.friends) {
        state.friends = [];
      }
    },
    clearFriendsError: (state) => {
      state.isError = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Not Friends
      .addCase(getNotFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notFriends = action.payload || [];
      })
      .addCase(getNotFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      // Get User Friends
      .addCase(getUserFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload || [];
      })
      .addCase(getUserFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      // Add Friend
      .addCase(addFriend.fulfilled, (state, action) => {
        state.notFriends = state.notFriends.filter(user => user._id !== action.payload.friendId);
      })
      // Remove Friend
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(friend => friend._id !== action.payload.friendId);
      });
  },
});

export const { 
  addLocalFriend,
  removeLocalFriend,
  clearAllFriends,
  initializeFriends,
  clearFriendsError
} = friendSlice.actions;

export default friendSlice.reducer;