// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Features/UserSlice';
import postReducer from '../Features/PostSilce';
import friendReducer from '../Features/FriendSilce';

export const store = configureStore({
  reducer: {
    users: userReducer,
    posts: postReducer,
    friends: friendReducer,
  },
});

export default store;