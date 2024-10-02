// src/api/authApi.ts
import axios from 'axios'; // Import axios for making HTTP requests

// Function to handle user login
export const login = async (email: string, password: string) => {
  const response = await axios.post(
    'http://localhost:5000/api/auth/login', // Login API endpoint
    { email, password }, // Request body
    { withCredentials: true } // Include credentials
  );
  return response.data; // Return the response data
};

// Function to handle user registration
export const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(
    'http://localhost:5000/api/auth/signup', // Signup API endpoint
    { username, email, password }, // Request body
    { withCredentials: true } // Include credentials
  );
  return response.data; // Return the response data
};
