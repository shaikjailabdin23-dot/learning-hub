import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data && response.data.token) {
    localStorage.setItem('hub_auth_token', response.data.token);
    localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data && response.data.token) {
    localStorage.setItem('hub_auth_token', response.data.token);
    localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  if (response.data && response.data.user) {
    localStorage.setItem('hub_user_profile', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('hub_auth_token');
  localStorage.removeItem('hub_user_profile');
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('hub_user_profile');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('hub_auth_token');
};

export default {
  register,
  login,
  getMe,
  logout,
  getCurrentUser,
  getToken,
};
