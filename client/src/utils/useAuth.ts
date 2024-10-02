// src/utils/useAuth.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the user object type
interface User {
    userId: string; // User's unique identifier
    role: string; // User's role (e.g., admin, user)
    iat: number; // Issued at time (JWT)
    exp: number; // Expiration time (JWT)
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/status', {
          withCredentials: true, // Include credentials in the request
        });

        if (response.status === 200) {
          setUser(response.data.user); // Set user state if authenticated
        } else {
          setUser(null); // Not authenticated
        }
      } catch (error) {
        setUser(null); // Handle error by resetting user state
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };

    checkAuthStatus(); // Check authentication status on mount
  }, []); // Run only once on mount

  useEffect(() => {
    if (user) {
      console.log("Updated user:->", user); // Log updated user information
    }
  }, [user]); // Log whenever user state changes

  return { user, loading }; // Return user and loading state
};
