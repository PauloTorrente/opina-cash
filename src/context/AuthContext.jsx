import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api'; // Base URL for the backend

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store the user info
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Get token from localStorage
    const storedRefreshToken = localStorage.getItem('refreshToken'); // Get refresh token from localStorage

    if (storedToken && storedRefreshToken) {
      // Decode the token to get user information
      const decodedToken = jwtDecode(storedToken);
      setUser({ token: storedToken, refreshToken: storedRefreshToken, role: decodedToken.role }); // Set user state with token, refreshToken, and role
    }
    setLoading(false); // Set loading to false once token check is done
  }, []);

  const login = async (data) => {
    // Decode the token to get user information
    const decodedToken = jwtDecode(data.token);

    // Store token and refreshToken in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Update user state with token, refreshToken, and role
    setUser({ token: data.token, refreshToken: data.refreshToken, role: decodedToken.role });
  };

  const logout = () => {
    setUser(null); // Clear user state on logout
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('refreshToken'); // Remove refresh token from localStorage
  };

  // Function to refresh the token
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      throw new Error('No refresh token found'); // Throw error if no refresh token is found
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken: storedRefreshToken,
      });

      const newToken = response.data.token;
      localStorage.setItem('token', newToken); // Store new token in localStorage
      return newToken; // Return new token
    } catch (error) {
      logout(); // Log out if refresh token request fails
      throw error; // Throw error after logout
    }
  };

  // Function to make authenticated requests
  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found'); // Throw error if no token is found
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`, // Add token to the request headers
    };

    try {
      return await axios({
        ...options,
        url: `${API_BASE_URL}${url}`,
        headers,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If token is expired, try to refresh it
        const newToken = await refreshToken(); // Get new token
        headers.Authorization = `Bearer ${newToken}`; // Update the header with the new token

        // Retry the request with the new token
        return axios({
          ...options,
          url: `${API_BASE_URL}${url}`,
          headers,
        });
      }
      throw error; // Throw error if not a 401 error
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authFetch }}>
      {children} {/* Render children components with the provided context values */}
    </AuthContext.Provider>
  );
};

export default AuthContext; // Export the AuthContext for use in other parts of the app
