import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const ProtectedRoute = ({ children }) => {
  const { activeProfileId } = useProfile();
  
  // LOGGING: This will tell us if the guard is blocking you
  console.log("Protected Route Check - Active Profile:", activeProfileId);

  if (!activeProfileId) {
    return <Navigate to="/profiles" replace />;
  }

  return children;
};

export default ProtectedRoute;