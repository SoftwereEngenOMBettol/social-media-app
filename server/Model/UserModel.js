import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("users", UserSchema);