import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './Login.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import routes from '../routes.js';

const App = () => (
  <Router>
    <div className="d-flex flex-column h-100">
      <Routes>
        <Route path={routes.loginPagePath()} element={<Login />} />
        <Route path={routes.chatPagePath()} element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  </Router>
);
export default App;
