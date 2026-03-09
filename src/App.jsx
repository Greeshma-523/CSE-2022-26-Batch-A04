import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import CloudLogin from './components/CloudLogin';
import CloudDashboard from './components/CloudDashboard';
import UserDashboard from './components/UserDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/cloud/login" element={<CloudLogin />} />
          <Route path="/cloud/dashboard" element={<CloudDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;