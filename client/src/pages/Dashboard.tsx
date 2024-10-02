// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import OrdersTable from './components/OrdersTable';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth(); // Access loading state
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Only redirect if loading is false and user is still null
      navigate('/login');
    }
  }, [user, loading, navigate]); // Trigger when user, loading, or navigate changes

  // Show a loading spinner or message while checking authentication
  if (loading) {
    return <div>Loading...</div>; // Display this while waiting for auth check
  }

  // Render the dashboard if user is authenticated
  if (user) {
    return (
      <div className="dashboard">
        <div>
          <h1>Welcome, {user.username} to  </h1> {/* Accessing specific property 'role' */}
          <h1>SaaS Platform with Shopify!</h1>
        </div>
        <OrdersTable />
      </div>
    );
  }

  return null; // Avoid rendering content before redirect
};

export default Dashboard;
