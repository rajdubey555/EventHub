import axios from 'axios';

// Configure axios instance with backend baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to automatically attach JWT token to requests if user is logged in
api.interceptors.request.use(
  (config) => {
    const userInfo = sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
