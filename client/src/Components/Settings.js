import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Settings = () => {
  const currentUser = useSelector((state) => state.users.user);
  const currentUserID = useSelector((state) => state.users.user._id);
  const email = useSelector((state) => state.users.user?.email);
  


  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Settings</h4>
            </div>
            <div className="card-body">
              <div className="list-group">
                <Link 
                  to={`/profile/${currentUserID}`}
                  className="list-group-item list-group-item-action"
                >
                  Profile Settings
                </Link>
               
                <Link 
                  to={`/my-posts/${currentUserID}`}
                  className="list-group-item list-group-item-action"
                >
                  Manage Posts
                </Link>
                <Link 
                  to={`/myfriends/${currentUserID}`}
                  className="list-group-item list-group-item-action"
                >
                  Friends
                </Link>
                <Link 
                  to={`/location`}
                  className="list-group-item list-group-item-action"
                >
                  Location
                </Link>
              </div>
              
              <div className="mt-4 p-3 bg-light rounded">
                <h6>Account Information</h6>
                <p><strong>User ID:</strong> {currentUserID}</p>
                <p><strong>Name:</strong> {currentUser?.name}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;