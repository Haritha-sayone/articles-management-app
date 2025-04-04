import React from 'react';
import UserProfile from '../components/UserProfile';

const Profile: React.FC = () => {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <UserProfile />
    </div>
  );
};

export default Profile;