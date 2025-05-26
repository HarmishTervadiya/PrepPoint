// src/api/index.js
import axios from 'axios';
import { getAuthData, saveAuthData } from '@/utils/authStorage';
import { apiErrorMessageHandler } from '@/utils/apiMessageHandler';

const API_BASE_URL = 'http://192.168.203.108:3000/api/v1';

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

const processQueue = (error: any, token: any) => {
  failedQueue.forEach((prom: any) => {
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
  async (config) => {
    try {
      const authData = await getAuthData();
      if (authData?.accessToken) {
        config.headers.Authorization = `Bearer${authData.accessToken}`;
      }

      // Log request details in development mode for debugging
      if (__DEV__) {
        console.log(
          `[API REQUEST] => URL : ${config.url} \nMethod : ${config.method?.toUpperCase()} \nData : ${JSON.stringify(config.data)}`
        );
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ----- Response Interceptor ----- //
api.interceptors.response.use(
  (response) => {
    try {
      // Log response details in development mode for debugging
      if (__DEV__) {
        console.log(
          `[API RESPONSE] => \nURL : ${
            response.config.url
          } \nMethod : ${response.config.method?.toUpperCase()} \nData : ${JSON.stringify(response.data)}`
        );
      }
      return response.data;
    } catch (error) {
      console.error('Error in response interceptor:', error);
      return Promise.reject(error);
    }
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.message);
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Check for 401 Unauthorized errors (Token Expiry)
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const authData = await getAuthData();
        if (authData?.refreshToken) {
          const response  = await axios.post(`${API_BASE_URL}/student/auth/refresh/`, {
            refreshToken: authData.refreshToken,
            studentId: authData.userId
          });

          const newAccessToken = response.data.data.accessToken;
          const newrefreshToken = response.data.data.refreshToken;
          await saveAuthData(authData.userId, newAccessToken, newrefreshToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          processQueue(null, newAccessToken);

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        console.log(refreshError)
        processQueue(refreshError, null);
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    // General error handling for other status codes
    const errorMessage = apiErrorMessageHandler(error) || 'An unexpected error occurred.';
    console.error(`API Error (${error.response.status}): ${errorMessage}`);

    return Promise.reject(new Error(errorMessage));
  }
);

// ----- Request Cancellation Helpers ----- //
export const CancelToken = axios.CancelToken;
export const source = () => axios.CancelToken.source();

export default api;
