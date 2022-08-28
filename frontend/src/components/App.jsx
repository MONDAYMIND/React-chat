/* eslint-disable arrow-body-style */
import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import AuthProvider from '../contexts/AuthContext.jsx';
import { useAuth } from '../hooks/index.js';

import Navbar from './Navbar.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import Chat from './Chat.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import routes from '../routes.js';

const ChatPrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    user ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column h-100">
          <Navbar />
          <Routes>
            <Route path={routes.loginPagePath()} element={<LoginPage />} />
            <Route path={routes.signupPagePath()} element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route
              path={routes.chatPagePath()}
              element={(
                <ChatPrivateRoute>
                  <Chat />
                </ChatPrivateRoute>
              )}
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
};

export default App;
