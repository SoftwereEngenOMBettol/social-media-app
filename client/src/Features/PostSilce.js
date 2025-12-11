// Features/PostSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  myPosts: [],
  isLoading: false,
  isError: false,
  error: null
};

// ========== POSTS THUNKS ==========
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    try {
      const response = await axios.post("http://localhost:3001/posts/create", postData);
      return response.data.post;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create post");
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      return response.data.posts;
    } catch (error) {
      alert(error.response?.data?.error );
    }
  }
);

export const getMyPosts = createAsyncThunk(
  "posts/getMyPosts",
  async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/my-posts/${userId}`);
      return response.data.posts;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch your posts");
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch post");
    }
  }
);

export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, postData }) => {
    try {
      const response = await axios.put(`http://localhost:3001/edit/${postId}`, postData);
      return response.data.post;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to edit post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, userId }) => {
    try {
      await axios.delete(`http://localhost:3001/delete/${postId}`, { 
        data: { userId } 
      });
      return postId;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete post");
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }) => {
    try {
      const response = await axios.post(`http://localhost:3001/${postId}/like`, { userId });
      return response.data.post;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to like post");
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, userId, text }) => {
    const response = await axios.post(`http://localhost:3001/${postId}/comment`, {
      userId,
      text
    });
    return response.data.post; // Ensure this returns the updated post with the new comment
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId, userId }) => {
    try {
      const response = await axios.delete(`http://localhost:3001/${postId}/comment/${commentId}`, {
        data: { userId }
      });
      return response.data.post;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete comment");
    }
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addLocalPost: (state, action) => {
      if (!state.posts) state.posts = [];
      state.posts.unshift(action.payload);
    },
    updatePostInPosts: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    updatePostInMyPosts: (state, action) => {
      const index = state.myPosts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.myPosts[index] = action.payload;
      }
    },
    clearPostsError: (state) => {
      state.isError = false;
      state.error = null;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.myPosts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          if (!state.posts) state.posts = [];
          state.posts.unshift(action.payload);
          if (!state.myPosts) state.myPosts = [];
          state.myPosts.unshift(action.payload);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
      })
      // Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload || [];
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
        state.posts = [];
      })
      // Get My Posts
      .addCase(getMyPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPosts = action.payload || [];
      })
      .addCase(getMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.error.message;
        state.myPosts = [];
      })
      // Edit Post
      .addCase(editPost.fulfilled, (state, action) => {
        if (action.payload) {
          const postIndex = state.posts.findIndex(post => post._id === action.payload._id);
          if (postIndex !== -1) {
            state.posts[postIndex] = action.payload;
          }
          const myPostIndex = state.myPosts.findIndex(post => post._id === action.payload._id);
          if (myPostIndex !== -1) {
            state.myPosts[myPostIndex] = action.payload;
          }
        }
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        state.myPosts = state.myPosts.filter(post => post._id !== action.payload);
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        if (action.payload) {
          const postIndex = state.posts.findIndex(post => post._id === action.payload._id);
          if (postIndex !== -1) {
            state.posts[postIndex] = action.payload;
          }
          const myPostIndex = state.myPosts.findIndex(post => post._id === action.payload._id);
          if (myPostIndex !== -1) {
            state.myPosts[myPostIndex] = action.payload;
          }
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (action.payload) {
          const postIndex = state.posts.findIndex(post => post._id === action.payload._id);
          if (postIndex !== -1) {
            state.posts[postIndex] = action.payload;
          }
          const myPostIndex = state.myPosts.findIndex(post => post._id === action.payload._id);
          if (myPostIndex !== -1) {
            state.myPosts[myPostIndex] = action.payload;
          }
        }
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        if (action.payload) {
          const postIndex = state.posts.findIndex(post => post._id === action.payload._id);
          if (postIndex !== -1) {
            state.posts[postIndex] = action.payload;
          }
          const myPostIndex = state.myPosts.findIndex(post => post._id === action.payload._id);
          if (myPostIndex !== -1) {
            state.myPosts[myPostIndex] = action.payload;
          }
        }
      });
  },
});

export const { 
  addLocalPost,
  updatePostInPosts,
  updatePostInMyPosts,
  clearPostsError,
  clearPosts
} = postSlice.actions;

export default postSlice.reducer;