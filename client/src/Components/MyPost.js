import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyPosts, likePost, deletePost } from '../Features/PostSilce';
import { FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa'; // import FontAwesome icons

const MyPosts = () => {
  const dispatch = useDispatch();
  
  const currentUser = useSelector((state) => state.users?.currentUser || state.users?.user || {});
  const isLoading = useSelector((state) => state.posts?.isLoading);
  const posts = useSelector((state) => state.posts?.myPosts || []);
  const currentUserID = currentUser?._id;

  useEffect(() => {
    if (currentUserID) {
      dispatch(getMyPosts(currentUserID));
    }
  }, [dispatch, currentUserID]);

  const handleLike = async (postId) => {
    try {
      if (currentUserID) {
        await dispatch(likePost({ postId, userId: currentUserID })).unwrap();
        dispatch(getMyPosts(currentUserID));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Error liking post: ' + error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (currentUserID) {
          await dispatch(deletePost({ postId, userId: currentUserID })).unwrap();
          alert('Post deleted successfully!');
          dispatch(getMyPosts(currentUserID));
        }
      } catch (error) {
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Posts</h2>
            <span  className="badge bg-dark" >{posts.length} posts</span>
          </div>
          
          {posts.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="text-muted mb-3">
                  <i className="fas fa-edit fa-3x"></i>
                </div>
                <h5 className="card-title">No posts yet</h5>
                <p className="card-text">You haven't created any posts yet. Start sharing your thoughts!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.href = `/addPost/${currentUserID}`}
                >
                  Create Your First Post
                </button>
              </div>
            </div>
          ) : (
            <div className="posts-container">
              {posts.map(post => (
                <div key={post._id || post.id} className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                      {post.content || 'No content available'}
                    </p>
                    
                    {post.image && (
                      <div className="mb-3">
                        <img 
                          src={post.image} 
                          alt="Post" 
                          className="img-fluid rounded"
                          style={{ 
                            maxHeight: '400px', 
                            width: '100%', 
                            objectFit: 'cover' 
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                      <span>
                        <i className="fas fa-calendar me-1"></i>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Unknown date'}
                      </span>
                      <span>
                        {post.privacy === 'private' ? '🔒 Private' : 
                         post.privacy === 'friends' ? '👥 Friends Only' : '🌍 Public'}
                      </span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleLike(post._id || post.id)}
                          title="Like post"
                        >
                          { post.likes?.includes(currentUserID) ? <FaHeart /> : <FaRegHeart /> }
                          <span className="ms-1">{post.likes?.length || 0}</span>
                        </button>
                        
                        <span className="btn btn-outline-secondary btn-sm disabled">
                          <i className="fas fa-comment me-1"></i>
                          {post.comments?.length || 0}
                        </span>
                      </div>
                      
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(post._id || post.id)}
                        title="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    {post.comments && post.comments.length > 0 && post.comments[0]?.text && (
                      <div className="mt-3 p-2 bg-light rounded">
                        <small className="text-muted">
                          <strong>Latest comment:</strong> "{post.comments[0].text}"
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;