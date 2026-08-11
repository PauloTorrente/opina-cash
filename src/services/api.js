import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // withCredentials so the browser stores the httpOnly auth cookies the
  // backend sets on this response.
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, { withCredentials: true });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Falha ao solicitar redefinição de senha');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Falha ao redefinir senha');
  }
};

