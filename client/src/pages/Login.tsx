// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi'; // Import the login function from API module

const LoginPage: React.FC = () => {
  // State to hold input values for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      await login(email, password); // Call the login API
      navigate('/dashboard'); // Navigate to the dashboard on successful login
    } catch (error) {
      console.error('Login failed:', error); // Log any errors
    }
  };

  return (
    <div className="auth-page">
      <div>
        <h2>SaaS Platform Login</h2>
        <form onSubmit={handleSubmit} className='page-form'>
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
            <button type="submit">Login</button> {/* Submit button for logging in */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
