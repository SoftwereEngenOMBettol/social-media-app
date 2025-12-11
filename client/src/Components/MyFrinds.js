import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFriends, removeFriend } from '../Features/FriendSilce';
import { FaUser, FaUserMinus } from 'react-icons/fa';

const MyFriends = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users?.currentUser || state.users?.user || {});
  const currentUserID = currentUser?._id;
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  
  

  // Use the userId from params or current user ID
  const targetUserId = userId || currentUserID;

  useEffect(() => {
    const loadFriends = async () => {
      try {
        setLoading(true);
        if (targetUserId) {
          const result = await dispatch(getUserFriends(targetUserId)).unwrap();
          console.log('Friends data:', result); // Log the fetched friends data
          setFriends(result);
        }
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [dispatch, targetUserId]);

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        if (currentUserID) {
          await dispatch(removeFriend({ userId: currentUserID, friendId })).unwrap();
          setFriends(prev => prev.filter(friend => friend._id !== friendId));
          alert('Friend removed successfully!');
        }
      } catch (error) {
        alert('Error removing friend: ' + error.message);
      }
    }
  };

  // Safe image error handler
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    // Show the fallback icon
    const fallback = e.target.nextSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div className="container mt-4">
      <div className="my-friends-container">
        <h4 className="mb-4">My Friends</h4>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading friends...</p>
          </div>
        ) : (
          <div className="row">
            {friends.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <div className="empty-state">
                    <div className="mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto"
                        style={{
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#ff6b35',
                          fontSize: '24px',
                        }}
                      >
                        <FaUser />
                      </div>
                    </div>
                    <h5 className="text-muted">You haven't added any friends yet.</h5>
                    <p className="text-muted">Start adding friends to see them here!</p>
                  </div>
                </div>
              </div>
            ) : (
              friends.map(friend => (
                <div key={friend._id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">
                  <div className="friend-card card shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        {/* Profile Picture with Fallback */}
                        <div className="position-relative mb-3">
                          {friend.profilePicture ? (
                            <>
                              <img
                                src={friend.profilePicture}
                                alt="User profile"
                                className="rounded-circle"
                                style={{ 
                                  width: '80px', 
                                  height: '80px', 
                                  objectFit: 'cover',
                                  border: '3px solid #dee2e6'
                                }}
                  
                              />
                             
                            </>
                          ) : (
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white"
                              style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#ff6b35',
                                fontSize: '24px',
                              }}
                            >
                              <FaUser />
                            </div>
                          )}
                        </div>

                        {/* Friend Info */}
                        <div className="friend-info w-100">
                          <div className="fw-bold fs-5 text-dark mb-1">{friend.name}</div>
                          <div className="text-muted small mb-2">{friend.email}</div>
                        
                        </div>

                        {/* Remove Friend Button */}
                        <button 
                          className="btn btn-sm mt-2 d-flex align-items-center"
                          onClick={() => handleRemoveFriend(friend._id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                          }}
                        >
                          <FaUserMinus className="me-2" />
                          Remove Friend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFriends;