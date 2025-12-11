// Components/Header.js
import { Navbar, Button } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from "../Features/UserSlice";
import { 
  FaHome, 
  FaUserFriends, 
  FaUserPlus, 
  FaPlusSquare, 
  FaCog,
  FaUser 
} from 'react-icons/fa';
import logo from "../Images/big-logo.png";
import { useState } from 'react';

const Header = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentUser = useSelector((state) => state.users?.user);
  const currentUserID = useSelector((state) => state.users.user?._id);
  const friendsCount = useSelector((state) => 
    state?.friends?.friends?.length || state?.users?.friends?.length || 0
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logoutUser());
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const userName = currentUser?.name || currentUser?.username || "User";
  const userEmail = currentUser?.email || "user@example.com";
  const profilePictureUrl = currentUser?.profilePicture;

  // State for handling image load error
  const [imageError, setImageError] = useState(false);

  // Safe image error handler
  const handleImageError = (e) => {
    setImageError(true);
    // Don't try to access nextSibling, just hide the image
    e.target.style.display = 'none';
  };

  return (
    <div className="app-layout">
      <Navbar className="app-navbar dark-header" fixed="top">
        <div className="navbar-content">
          <Link to="/posts" className="navbar-brand">
            <img src={logo} alt='Logo' />
          </Link>

          <div className="nav-icons-container">
            <Link
              to="/posts"
              className={`nav-icon-link ${isActive('/posts') ? 'active' : ''}`}
              title="Home"
            >
              <FaHome className="nav-icon" />
            </Link>

            {currentUserID ? (
              <>
                <Link
                  to={`/myfriends/${currentUserID}`}
                  className={`nav-icon-link ${isActive('/myfriends') ? 'active' : ''}`}
                  title="My Friends"
                >
                  <FaUserFriends className="nav-icon" />
                  {friendsCount > 0 && (
                    <span className="friends-badge">{friendsCount}</span>
                  )}
                </Link>

                <Link
                  to={`/findfriends/${currentUserID}`}
                  className={`nav-icon-link ${isActive('/findFriend') ? 'active' : ''}`}
                  title="Find Friends"
                >
                  <FaUserPlus className="nav-icon" />
                </Link>

                <Link
                  to={`/addPost/${currentUserID}`}
                  className={`nav-icon-link ${isActive('/addPost') ? 'active' : ''}`}
                  title="Create Post"
                >
                  <FaPlusSquare className="nav-icon" />
                </Link>

                <Link
                  to={`/settings/${currentUserID}`}
                  className={`nav-icon-link ${isActive('/settings') ? 'active' : ''}`}
                  title="Settings"
                >
                  <FaCog className="nav-icon" />
                </Link>

                <div className="user-dropdown">
                  <div className="user-avatar-icon">
                    {profilePictureUrl? (
                      <img
                        src={currentUser.profilePicture}
                        alt={userName}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        onError={handleImageError}
                      />
                    ) : (
                      <div
                        className="rounded-circle"
                    
                      >
                        {userName.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  {/* User Dropdown Content */}
                  <div className="user-dropdown-content">
                    <div className="user-info-dropdown">
                      <div className="user-avatar-small">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#e68703ff',
                            fontSize: '18px',
                          }}
                        >
                          {userName.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      </div>

                      <div className="user-details">
                        <div className="user-name">{userName}</div>
                        <div className="user-email">{userEmail}</div>
                      </div>
                    </div>
                    <Button className="logout-btn-dropdown" onClick={handleLogout}>
                      <span className="logout-icon">🚪</span>
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="user-dropdown">
                <div className="user-avatar-icon">
                  <div className="default-icon" style={{ width: '50px', height: '50px' }}>
                    <FaUser size={24} color="#ff6b35" />
                  </div>
                </div>
                <div className="user-dropdown-content">
                  <div className="user-info-dropdown">
                    <div className="user-avatar-small">
                      <div className="default-icon" style={{ width: '50px', height: '50px' }}>
                        <FaUser size={24} color="#ff6b35" />
                      </div>
                    </div>
                    <div className="user-details">
                      <div className="user-name">{userName}</div>
                      <div className="user-email">{userEmail}</div>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button className="logout-btn-dropdown">Login</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Navbar>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Header;