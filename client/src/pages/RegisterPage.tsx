// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi'; // Import the register function from API module

const RegisterPage: React.FC = () => {
  // State to hold input values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await register(username, email, password); // Call the register API
      navigate('/login'); // Navigate to login page on successful registration
    } catch (error) {
      console.error('Registration failed:', error); // Log any errors
    }
  };

  return (
    <div className="auth-page">
      <div>
        <h2>SaaS Platform Registration</h2>
        <form onSubmit={handleSubmit} className='page-form'>
          <div className='label-input'>
            <h3>
              <label>
                Username:
              </label>
            </h3>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required // Ensure input is filled
            />
          </div>
          <div className='label-input'>
            <h3>
              <label>
                Email:
              </label>
            </h3>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required // Ensure input is filled
            />
          </div>
          <div className='label-input'>
            <h3>
              <label>
                Password:
              </label>
            </h3>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required // Ensure input is filled
            />
          </div>
          <div className="form-btn">
            <button type="submit">Register</button>
            <h3>
              Already have an account? <Link to="/login">Log in here</Link> {/* Link to login page */}
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
