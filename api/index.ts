// src/api/index.js
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = ' http://192.168.67.108:3000/api/v1';

// Create an Axios instance with custom configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----- Token Refresh Queue Setup ----- //
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: unknown, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----- Request Interceptor ----- //
api.interceptors.request.use(
  async config => {
    // Attach the access token from AsyncStorage to every request
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // Log request details in development mode for debugging
    if (__DEV__) {
      console.log(
        `[API REQUEST] ${config.method.toUpperCase()} ${config.url}`,
        config,
      );
    }
    return config;
  },
  error => Promise.reject(error),
);

// ----- Response Interceptor ----- //
api.interceptors.response.use(
  response => {
    // Log response details in development mode for debugging
    if (__DEV__) {
      console.log(
        `[API RESPONSE] ${response.config.method.toUpperCase()} ${
          response.config.url
        }`,
        response.data,
      );
    }
    return response.data;
  },
  async error => {
    const originalRequest = error.config;
    // Check for 401 Unauthorized errors
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // If a token refresh is already in progress, queue the request
      // if (isRefreshing) {
      //   return new Promise((resolve, reject) => {
      //     failedQueue.push({resolve, reject});
      //   })
      //     .then(token => {
      //       originalRequest.headers['Authorization'] = 'Bearer ' + token;
      //       return api(originalRequest);
      //     })
      //     .catch(err => Promise.reject(err));
      // }

      originalRequest._retry = true;
      isRefreshing = true;

      // try {
      //   // Retrieve the refresh token from AsyncStorage
      //   const refreshToken = await AsyncStorage.getItem('refreshToken');
      //   // Attempt to refresh the token (adjust the endpoint and payload as needed)
      //   const {data} = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      //     refreshToken,
      //   });
      //   const newAccessToken = data.accessToken;

      //   // Save the new token for future requests
      //   await AsyncStorage.setItem('userToken', newAccessToken);
      //   // Update the default Authorization header for all future requests
      //   api.defaults.headers.common['Authorization'] =
      //     'Bearer ' + newAccessToken;
      //   // Process any queued requests
      //   processQueue(null, newAccessToken);
      //   // Retry the original request with the new token
      //   originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      //   return api(originalRequest);
      // } catch (refreshError) {
      //   processQueue(refreshError, null);
      //   // Optionally, perform additional actions such as forcing a logout here
      //   return Promise.reject(refreshError);
      // } finally {
      //   isRefreshing = false;
      // }
    }
    // For all other errors, simply reject
    return Promise.reject(error);
  },
);

// ----- Request Cancellation Helpers ----- //
// Export these so components can cancel requests if needed.
export const CancelToken = axios.CancelToken;
export const source = () => axios.CancelToken.source();

export default api;
