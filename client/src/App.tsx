// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary components from react-router-dom
import LoginPage from './pages/Login'; // Import the LoginPage component
import RegisterPage from './pages/RegisterPage'; // Import the RegisterPage component
import Dashboard from './pages/Dashboard'; // Import the Dashboard component

// Define the main App component
const App: React.FC = () => {
  return (
    // Wrap the app with the Router component to enable routing
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App; 