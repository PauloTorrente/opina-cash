import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api';

const AuthContext = createContext();

// The csrfToken cookie the backend sets is unreadable here on purpose —
// it belongs to enova-backend.onrender.com, a different registrable domain
// than this frontend, and document.cookie can never see another origin's
// cookie (that's a browser boundary, not a bug we can configure around).
// So the backend also returns the value in the login/refresh response
// body, and we keep it in memory instead — same double-submit security
// property (an attacker's forged request still can't produce this value),
// but it actually works cross-origin. Module-level since this survives
// across the app but resets on a full page reload, which is why
// initializeUser() below re-primes it via a refresh call on mount.
let csrfTokenMemory = null;
export const setCsrfToken = (token) => { csrfTokenMemory = token || null; };
export const getCsrfToken = () => csrfTokenMemory;

// Shared client for authenticated calls: the httpOnly accessToken/refreshToken
// cookies set by the backend ride along automatically (withCredentials), so
// there's no token to read out of localStorage — which is exactly the point,
// since that's what made it readable by an XSS bug in the first place.
const client = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

client.interceptors.request.use((config) => {
  // SameSite=None cookies are sent cross-site, so the cookie alone doesn't
  // rule out CSRF. Mirror the in-memory csrfToken (see above) into a header
  // the backend checks against the claim embedded in the access token.
  const method = config.method?.toUpperCase();
  if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    if (csrfTokenMemory) {
      config.headers['X-CSRF-Token'] = csrfTokenMemory;
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
        // A page reload wipes csrfTokenMemory (it only ever lived in JS),
        // even though the httpOnly session cookies survived. Re-prime it
        // so the first save/submit after a reload doesn't have to fail
        // once before authFetch's retry-after-refresh kicks in.
        try {
          const refreshResponse = await client.post('/auth/refresh-token');
          setCsrfToken(refreshResponse.data.csrfToken);
        } catch {
          // Non-fatal — authFetch still recovers on the first mutating call.
        }
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
    setCsrfToken(null);
    setUser(null);
  };

  // Refreshes the access token cookie using the refresh token cookie, and
  // updates the in-memory csrfToken to match the freshly issued one.
  const refreshToken = async () => {
    try {
      const response = await client.post('/auth/refresh-token');
      setCsrfToken(response.data.csrfToken);
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
