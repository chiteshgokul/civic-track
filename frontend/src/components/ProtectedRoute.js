import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Corrected import path

function ProtectedRoute({ component: Component, isAdmin = false }) {
  const { user } = useContext(AuthContext);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/verify');
        if (response.status === 200) {
          if (isAdmin && !user.isAdmin) {
            setIsAuthorized(false);
          } else {
            setIsAuthorized(true);
          }
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };

    if (user) {
      checkAuth();
    } else {
      setIsAuthorized(false);
    }
  }, [user, isAdmin]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Component /> : <Navigate to="/login" />;
}

export default ProtectedRoute;