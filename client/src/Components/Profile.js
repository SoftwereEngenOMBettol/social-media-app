// Components/Profile.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { getUserProfile, updateUserProfile } from '../Features/UserSlice';

const Profile = () => {
  const dispatch = useDispatch();

  
  // SAFE access to user data
  const currentUser = useSelector((state) => state.users?.currentUser || state.users?.user || {});
  const currentUserID = currentUser?._id || currentUser?.id;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (currentUserID) {
      dispatch(getUserProfile(currentUserID));
    }
  }, [dispatch, currentUserID]);

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        profilePicture: currentUser.profilePicture || ''
      });
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUserID) {
      dispatch(updateUserProfile({ 
        userId: currentUserID, 
        userData: formData 
      }));
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Safe user data
  const userName = currentUser?.name || 'User';
  const userBio = currentUser?.bio || 'No bio yet';
  const userFriendsCount = currentUser?.friends?.length || 0;
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";
  const hasProfilePicture = currentUser?.profilePicture;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="p-4">
            <div className="text-center mb-4">
              <div className="profile-avatar-large mb-3">
                {hasProfilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      backgroundColor: '#ff8800ff',
                      fontSize: '48px'
                    }}
                  >
                    {userInitial}
                  </div>
                )}
              </div>
              <h2>{userName}</h2>
              <p className="text-muted">{currentUser?.email || 'No email'}</p>
            </div>
           <hr/>

            {isEditing ? (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="bio">Bio</Label>
                  <Input
                    type="textarea"
                    name="bio"
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell us about yourself"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="profilePicture">Profile Picture URL</Label>
                  <Input
                    type="text"
                    name="profilePicture"
                    id="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                </FormGroup>
                <div className="d-flex gap-2">
                  <Button type="submit" color="primary">Save Changes</Button>
                  <Button type="button" color="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </Form>
            ) : (
              <div>
                <div className="mb-3">
                  <strong>Bio:</strong> 
                  <p className="mt-1">{userBio}</p>
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> 
                  <p className="mt-1">{currentUser?.email || 'No email provided'}</p>
                </div>
                <div className="mb-3">
                  <strong>Friends:</strong> 
                  <p className="mt-1">{userFriendsCount} friends</p>
                  </div>
                  <hr/>
                <Button className="btn"
                          style={{ backgroundColor: '#ff6b35', color: 'white' }} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;