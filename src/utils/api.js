import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_BACKEND_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.access;

        localStorage.setItem('access_token', newAccessToken);
        
        // Dynamically import store and actions to prevent circular dependencies
        const { default: store } = await import('../store/store.js');
        const { addToken } = await import('../store/slices/authSlicer.js');
        
        store.dispatch(addToken({ token: newAccessToken, user: null }));

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        
        // Dynamically import store and actions to prevent circular dependencies
        const { default: store } = await import('../store/store.js');
        const { removeToken } = await import('../store/slices/authSlicer.js');
        
        store.dispatch(removeToken());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
