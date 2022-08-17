/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
// import i18next from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import resources from '../locales/index.js';
import AuthContext from '../contexts/index.js';
import useAuth from '../hooks/index.js';

import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import routes from '../routes.js';

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

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  return (
    <AuthContext.Provider value={{
      logIn, logOut, getAuthHeader, user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const ChatPrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => {
  // const defaultlanguage = 'ru';
  // await i18next.use(initReactI18next).init({
  //   lng: defaultlanguage,
  //   debug: false,
  //   resources,
  // });
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Routes>
            <Route path={routes.loginPagePath()} element={<LoginPage />} />
            {/* <Route path={routes.signupPagePath()} element={<SignupPage />} /> */}
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path={routes.chatPagePath()}
              element={(
                <ChatPrivateRoute>
                  {/* <PrivatePage /> */}
                </ChatPrivateRoute>
              )}
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
