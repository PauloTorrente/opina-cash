import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedRefreshToken) {
      const decodedToken = jwtDecode(storedToken);
      setUser({ 
        token: storedToken, 
        refreshToken: storedRefreshToken, 
        role: decodedToken.role 
      });
    }
    setLoading(false);
  }, []);

  const login = async (data, redirectPath = '/') => {
    try {
      const decodedToken = jwtDecode(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      setUser({ 
        token: data.token, 
        refreshToken: data.refreshToken, 
        role: decodedToken.role 
      });

      return redirectPath;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('No refresh token found');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken: storedRefreshToken,
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      return newToken;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    try {
      return await axios({
        ...options,
        url: `${API_BASE_URL}${url}`,
        headers,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newToken = await refreshToken();
        headers.Authorization = `Bearer ${newToken}`;
        return axios({
          ...options,
          url: `${API_BASE_URL}${url}`,
          headers,
        });
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      authFetch 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;