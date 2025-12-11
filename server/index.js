import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./Model/UserModel.js";
import PostModel from "./Model/PostModel.js";


const app = express();
app.use(express.json());
app.use(cors());

const connectString = `URL of MongoDB`;

mongoose.connect(connectString)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


  
app.get("/", async (req, res) => {
  const posts = await PostModel.find();
  res.json(posts);
});// Check if User model exists
 


// ========== AUTHENTICATION APIs ==========

// Register User
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new UserModel({name,email,password: hashedpassword});
    await user.save();
    res.status(200).json({ user: user, msg: "You registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found." });

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);
    if (!passwordMatch) return res.status(401).json({ error: "Authentication failed" });

    console.log('=== LOGIN SUCCESSFUL ===');
    res.status(200).json({ user, message: "Login successful." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ========== USER PROFILE APIs ==========

// Get User Profile
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile
app.put("/user/:userId", async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    
    const updatedUser = await UserModel.findByIdAndUpdate( 
      req.params.userId,
      { name, bio, profilePicture },
      { new: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ========== POSTS MANAGEMENT APIs ==========

// Create New Post (based on user ID)
app.post("/posts/create", async (req, res) => {
  try {
    const { userId, content, image, privacy = "public" } = req.body;

    // Validate required fields
    if (!userId || !content) {
      return res.status(400).json({ error: "User ID and content are required" });
    }

    const post = new PostModel({
      userId,
      content,
      image: image || "",
      privacy: privacy // public, private, friends
    });

    await post.save();
    res.status(201).json({ post: post, msg: "Your Post created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Posts (for main feed - with user details)
app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('userId', 'name profilePicture')
      .populate('comments.userId', 'name profilePicture')
      .sort({ createdAt: -1 }); // Newest first
    const countPost = await PostModel.countDocuments({});
 
    res.send({ posts: posts, totalPosts: countPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Own Posts (for "My Posts" page)
app.get("/my-posts/:userId", async (req, res) => {
  try {

    const posts = await PostModel.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      posts,
      totalPosts: posts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit User's Own Post
app.put("/edit/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, image, privacy } = req.body;
    
    // Find the post first to check ownership
    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Not authorized to edit this post" });
    }

    // Update the post
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        content: content || post.content,
        image: image !== undefined ? image : post.image,
        privacy: privacy || post.privacy,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    );
    
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User's Own Post
app.delete("/delete/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user owns the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await PostModel.findByIdAndDelete(postId);
    
    res.status(200).json({ 
      message: "Post deleted successfully",
      deletedPostId: postId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike Post
app.post("/:postId/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike - remove user ID from likes array
      post.likes.splice(likeIndex, 1);
    } else {
      // Like - add user ID to likes array
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: likeIndex > -1 ? "Post unliked" : "Post liked",
      post: post
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Comment to Post
app.post("/:postId/comment", async (req, res) => {
  try {
    const {  userId, text } = req.body;
   
    const { postId } = req.params;

    if (!userId || !text) {
      return res.status(400).json({ error: "User ID and comment text are required" });
    }

    const post = await PostModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      userId,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the comment user details
    await post.populate('comments.userId', 'name profilePicture');

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ========== FRIENDS APIs ==========

// Get Users who are not friends (Find Friends)
app.get("/findFriends/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Correct destructuring here

    // Find current user
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all users who are NOT friends and NOT the current user
    const notFriends = await UserModel.find({
      _id: { 
        $ne: userId, // Exclude the current user
        $nin: currentUser.friends // Exclude current friends
      }
    }).select('_id name email profilePicture bio'); // Select the fields you need

    res.status(200).json(notFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Friend (move from "Find Friends" to "Friends")
app.post("/addFriend", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ error: "User ID and Friend ID are required" });
    }

    // Add friend to user's friends list
    await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }
    );

    // Also add user to friend's friends list (reciprocal)
    await UserModel.findByIdAndUpdate(
      friendId,
      { $addToSet: { friends: userId } }
    );

    res.status(200).json({ 
      message: "Friend added successfully",
      friendId: friendId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User's Friends (for "Friends" page)
app.get("/myfriends/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Retrieve userId from the route params

    // Find user and populate their friends' details
    const user = await UserModel.findById(userId)
      .populate('friends', '_id name email profilePicture bio'); // Populate the friends array

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Handle user not found
    }

    res.status(200).json(user.friends); // Respond with the friends array
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle internal server error
  }
});

// Remove Friend (move from "Friends" back to "Find Friends")
app.delete("/myfriends/remove", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({ error: "User ID and Friend ID are required" });
    }

    // Remove friend from user's friends list
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }
    );

    // Also remove user from friend's friends list
    await UserModel.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } }
    );

    res.status(200).json({ 
      message: "Friend removed successfully",
      friendId: friendId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ========== SEARCH API ==========

// Search Users
app.get("/search/users", async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const users = await UserModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('name email profilePicture bio').limit(20);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3001, () => {
  console.log(` Server running on port 3001`);
  console.log(`it is connected with server successfully`);
});