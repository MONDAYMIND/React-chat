import React, { useState } from 'react';
import { AuthContext } from './index.js';

const AuthProvider = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(currentUser ? { username: currentUser.username } : null);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };

  const getAuthHeader = () => (currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {});

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
