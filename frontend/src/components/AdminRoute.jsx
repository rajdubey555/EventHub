import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// AdminRoute component restricts sub-routes to authenticated admin users
const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If authenticated and role is admin, allow access. Otherwise, redirect to Home.
  return userInfo && userInfo.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute;
  
