import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api';

const AuthContext = createContext();

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

// Shared client for authenticated calls: the httpOnly accessToken/refreshToken
// cookies set by the backend ride along automatically (withCredentials), so
// there's no token to read out of localStorage — which is exactly the point,
// since that's what made it readable by an XSS bug in the first place.
const client = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

client.interceptors.request.use((config) => {
  // SameSite=None cookies are sent cross-site, so the cookie alone doesn't
  // rule out CSRF. Mirror the readable csrfToken cookie into a header the
  // backend checks against the claim embedded in the access token.
  const method = config.method?.toUpperCase();
  if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = getCookie('csrfToken');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userResponse = await client.get('/users/me');
        setUser(userResponse.data);
      } catch (error) {
        // No valid session cookie (or it expired) — stay logged out.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Called after the login request has already set the auth cookies —
  // fetches the profile to populate `user` (role included).
  const login = async () => {
    try {
      const userResponse = await client.get('/users/me');
      setUser(userResponse.data);
      return '/';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
    }
    setUser(null);
  };

  // Refreshes the access token cookie using the refresh token cookie.
  const refreshToken = async () => {
    try {
      await client.post('/auth/refresh-token');
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const authFetch = async (url, options = {}) => {
    try {
      return await client({ ...options, url });
    } catch (error) {
      // 401 means the access token itself expired; 403 is what the backend
      // sends for a stale/missing CSRF token (see auth.user.middleware.js) —
      // which happens whenever the access token (and the csrfToken cookie
      // tied to its 1h lifetime, see auth.session.controller.js) outlives
      // how long the user spent on the page before submitting. Both are
      // fixed the same way: refresh, which reissues a matching csrfToken
      // cookie, then retry once.
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        await refreshToken();
        return client({ ...options, url });
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
