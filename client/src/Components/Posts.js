import { Container, Col, Row, Button, Card, CardBody } from 'reactstrap'; 
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { likePost, deletePost, getAllPosts, addComment } from '../Features/PostSilce';
import { useEffect, useState } from 'react';
import { FaHeart, FaTrashAlt, FaRegHeart, FaComment, FaUser, FaPlusSquare} from 'react-icons/fa';
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const Posts = () => {
  const dispatch = useDispatch();
  const allPost = useSelector((state) => state.posts.posts);
  const currentUser = useSelector((state) => state.users?.user);
  const currentUserID = currentUser?._id;
  const [commentTexts, setCommentTexts] = useState({});
  const isLoading = allPost?.isLoading;

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    currentUserID ? dispatch(likePost({ postId, userId: currentUserID })) : alert('Please login to like posts');
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?') && currentUserID) {
      dispatch(deletePost({ postId, userId: currentUserID }));
    }
  };

  const handleComment = (postId) => {
    const text = commentTexts[postId];
    if (currentUserID && text?.trim()) {
      dispatch(addComment({ postId, userId: currentUserID, text }))
        .then(() => setCommentTexts((prev) => ({ ...prev, [postId]: '' })))
        .catch((error) => alert('Error adding comment: ' + error.message));
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : 'Unknown date';
  };

  if (isLoading) {
    return (
      <Container className="posts-container mt-4">
        <Row className="justify-content-center">
          <Col md="8" lg="6" className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading posts...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="posts-container mt-4">
      {currentUserID && (
        <Row className="justify-content-center mb-4">
          <Col>
            <Link to={`/addPost/${currentUserID}`} >
              <Button className="add-post-link">
                <FaPlusSquare /> Create New Post
              </Button>
            </Link>
          </Col>
        </Row>
      )}

      { allPost.length > 0 ? (
        <Row>
          {allPost.map((post) => {
            const likesCount = post.likes?.length || 0;
            const isLikedByCurrentUser = post.likes?.includes(currentUserID);

            return (
              <Col key={post._id} xl="4" lg="4" md="6" sm="12" className="mb-4">
                <Card className="h-100 shadow-sm post-card-small">
                  <CardBody className="p-3">
                    <div className="post-header d-flex justify-content-between align-items-start mb-2">
                    
                        <div className="user-avatar me-2">
                          {post.userId?.profilePicture ? (
                            <img src={post.userId.profilePicture} alt='User profile' className="rounded-circle" style={{ width: '35px', height: '35px', objectFit: 'cover' }} />
                          ) : (
                            <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '35px', height: '35px', backgroundColor: '#ff8400ff' }}>
                              <FaUser />
                            </div>
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name fw-bold">{post.userId?.name || "Unknown User"}</div>
                          <div className="post-date">{formatDate(post.createdAt)} {moment(post.createdAt).fromNow()}</div>
                        </div>
                      
                      {currentUserID === post.userId?._id && (
                        <Button onClick={() => handleDelete(post._id)} className="delete-btn" title="Delete post"><FaTrashAlt /></Button>
                      )}
                    </div>

                    <div className="post-content mb-2">
                      <p className="mb-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>{post.content || 'No content available'}</p>
                      {post.image && <img src={post.image} alt="Post" className="img-fluid rounded" style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }} />}
                    </div>

     <div className="post-stats d-flex justify-content-between text-muted mb-2">
   <Button
  onClick={() => handleLike(post._id)}
  style={{ border: "none", backgroundColor: "white" }}
  
>
  {isLikedByCurrentUser ? (
    <FaHeart  size={12} style={{color: "red"}}/>
  ) : (
  <FaRegHeart size={12} style={{color: "red"}}/>
  )}
</Button><p style={{marginRight:"auto", marginTop: "20px"}}>{likesCount}</p>
  
  <span className="d-flex align-items-center text-muted">
    <FaComment className="me-1" size={12} />
    {post.comments?.length || 0}
  </span>
</div>

                   {currentUserID && (
  <div className="add-comment mb-1 comment-input-container">
    <input
      type="text"
      className="form-control form-control-sm comment-input"
      placeholder="Write a comment..."
      value={commentTexts[post._id] || ''}
      onChange={e => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
      onKeyPress={e => e.key === 'Enter' && handleComment(post._id)}
    />
    <Button
      className="comment-btn"
      onClick={() => handleComment(post._id)}
      disabled={!commentTexts[post._id]?.trim()}
    >
      <IoMdSend className="send-icon" />
    </Button>
  </div>
)}

                    {post.comments.length > 0 && (
                      <div className="comments-list">
                        <h6 className="text-muted mb-2 small">Comments:</h6>
                        {post.comments.slice(0, 2).map((comment, idx) => (
                          <div key={comment._id || idx} className="comment-item mb-1 p-2 bg-light rounded">
                            <div className="d-flex align-items-start">
                              <div className="comment-avatar me-2">
                                {comment.userId?.profilePicture ? (
                                  <img src={comment.userId.profilePicture} alt={comment.userId?.name || 'User'} className="rounded-circle" style={{ width: '25px', height: '25px', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                ) : (
                                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '25px', height: '25px', backgroundColor: '#f79b07ff' }}>
                                    <FaUser />
                                  </div>
                                )}
                              </div>
                              <div className="comment-content flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <span className="fw-bold">{comment.userId?.name || "Unknown"}</span>
                                </div>
                                <p className="mb-0">{comment.text}</p>
                                <small className="text-muted">{formatDate(comment.createdAt)}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                        {post.comments.length > 2 && <small className="text-center text-muted">+{post.comments.length - 2} more comments</small>}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col md="6" className="text-center py-5">
            <h4 className="text-muted">No posts yet</h4>
            <p className="text-muted mb-4">Be the first to create a post!</p>
            <Link to={'/login'}>
              <Button style={{backgroundColor: "orange", border: "none"}} size="lg"><i className="bi bi-plus-circle me-2"></i> Create Your First Post</Button>
            </Link>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Posts;