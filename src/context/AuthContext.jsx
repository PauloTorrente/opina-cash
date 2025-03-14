import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importação corrigida
import axios from 'axios';

const API_BASE_URL = 'https://enova-backend.onrender.com/api'; // URL base do backend

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedRefreshToken) {
      // Decodifica o token para obter as informações do usuário
      const decodedToken = jwtDecode(storedToken);
      setUser({ token: storedToken, refreshToken: storedRefreshToken, role: decodedToken.role });
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    // Decodifica o token para obter as informações do usuário
    const decodedToken = jwtDecode(data.token);

    // Armazena o token e refreshToken no localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);

    // Atualiza o estado do usuário com os tokens e a role
    setUser({ token: data.token, refreshToken: data.refreshToken, role: decodedToken.role });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  // Função para renovar o token
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
      localStorage.setItem('token', newToken); // Armazena o novo token
      return newToken;
    } catch (error) {
      logout(); // Faz logout se a renovação falhar
      throw error;
    }
  };

  // Função para fazer requisições autenticadas
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
        // Token expirado, tenta renovar
        const newToken = await refreshToken();
        headers.Authorization = `Bearer ${newToken}`; // Atualiza o cabeçalho com o novo token

        // Repete a requisição com o novo token
        return axios({
          ...options,
          url: `${API_BASE_URL}${url}`,
          headers,
        });
      }
      throw error; // Lança o erro se não for um erro 401
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
