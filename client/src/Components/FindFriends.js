import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotFriends, addFriend } from '../Features/FriendSilce';
import { FaUser, FaUserPlus } from 'react-icons/fa';

const FindFriends = () => {
  const dispatch = useDispatch();
  const { notFriends } = useSelector((state) => state.friends || {});
  const currentUser = useSelector((state) => state.users?.currentUser || state.users?.user || {});
  const currentUserID = currentUser?._id;

  
  useEffect(() => {
    if (currentUserID) {
      dispatch(getNotFriends(currentUserID));
    }
  }, [dispatch, currentUserID]);
  
  const handleAddFriend = (friendId) => {
    if (currentUserID) {
      dispatch(addFriend({ userId: currentUserID, friendId }));
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
      <div className="find-friends-container">
        <h4 className="mb-4">Find New Friends</h4>
        {notFriends?.length > 0 ? (
          <div className="row">
            {notFriends.map((user) => (
              <div key={user._id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="friend-card card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      {/* Profile Picture with Fallback */}
                      <div className="position-relative mb-3">
                        {user.profilePicture ? (
                          <>
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="rounded-circle"
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover',
                                border: '3px solid #dee2e6'
                              }}
                              onError={handleImageError}
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

                      {/* User Info */}
                      <div className="user-info w-100">
                        <div className="fw-bold fs-5 text-dark mb-1">{user.name}</div>
                        <div className="text-muted small mb-2">{user.email}</div>
     
                      </div>

                      {/* Add Friend Button */}
                      <button 
                        className="btn btn-sm mt-2 d-flex align-items-center"
                        onClick={() => handleAddFriend(user._id)}
                        style={{
                          backgroundColor: '#ff6b35',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '20px'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#e55a2b';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#ff6b35';
                        }}
                      >
                        <FaUserPlus className="me-2" />
                        Add Friend
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
              <h5 className="text-muted">No new friends to add right now.</h5>
              <p className="text-muted">Check back later to find new friends!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindFriends;