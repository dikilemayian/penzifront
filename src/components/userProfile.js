

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/receive-message/${userId}/`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <img src={user.profile_picture} alt="Profile" />
        <h2>{user.name}</h2>
        <p>Age: {user.age}</p>
        <p>Location: {user.location}</p>
        <p>Description: {user.description}</p>
      </div>
    </div>
  );
};

export default UserProfile;
