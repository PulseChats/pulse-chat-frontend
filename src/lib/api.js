import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedInfo = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${parsedInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
