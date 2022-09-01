/* eslint-disable arrow-body-style */
import React from 'react';
import { ToastContainer } from 'react-toastify';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import AuthProvider from '../contexts/AuthContext.jsx';
import { useAuth } from '../hooks/index.js';

import Navbar from './Navbar.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import Chat from './Chat.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import routes from '../routes.js';

const PrivateRoute = ({ direction }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (direction === 'chat') {
    return user ? <Outlet /> : <Navigate to={routes.loginPagePath()} state={{ from: location }} />;
  }
  if (direction === 'login' || direction === 'signup') {
    return user ? <Navigate to={routes.chatPagePath()} state={{ from: location }} /> : <Outlet />;
  }
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column h-100">
          <Navbar />
          <Routes>
            <Route path={routes.loginPagePath()} element={<PrivateRoute direction="login" />}>
              <Route path="" element={<LoginPage />} />
            </Route>
            <Route path={routes.signupPagePath()} element={<PrivateRoute direction="signup" />}>
              <Route path="" element={<SignupPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
            <Route path={routes.chatPagePath()} element={<PrivateRoute direction="chat" />}>
              <Route path="" element={<Chat />} />
            </Route>
          </Routes>
        </div>
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
    </Router>
  );
};

export default App;
