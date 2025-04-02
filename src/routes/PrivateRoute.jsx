import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Redireciona para o login mantendo a rota original
    return <Navigate 
      to="/login" 
      state={{ from: location }} 
      replace 
    />;
  }

  return children;
};

export default PrivateRoute;