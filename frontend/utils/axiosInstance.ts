// utils/axiosInstance.ts
import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
type ExtraConfig = {
  API_URL?: string;
};
// Get base URL
const getBaseUrl = () => {
  console.log('Fetching base URL...');
  const envUrl = Constants.expoConfig?.extra?.API_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, '');

  const defaultPort = 5001;
  const hostUri = (Constants.expoConfig as any)?.hostUri as string | undefined;
  let host = hostUri ? hostUri.split(':')[0] : undefined;

  if (!host) {
    const dbg =
      (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants as any)?.manifest?.debuggerHost;
    if (typeof dbg === 'string') host = dbg.split(':')[0];
  }

  if (!host) {
    host = Platform.OS === 'ios' ? '192.168.1.102' : '192.168.1.102';
  }

  return `http://${host}:${defaultPort}/api`;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.107:5001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 - Token expired
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['authToken', 'authUser']);
      } catch (clearError) {
        console.error('Failed to clear auth data:', clearError);
      }
    }

    // Handle errors
    if (!error.response) {
      if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        throw {
          success: false,
          message: 'Network error. Please check your internet connection.',
        };
      }

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        throw {
          success: false,
          message: 'Request timeout. Please try again.',
        };
      }

      throw {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }

    // HTTP error responses
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        throw {
          success: false,
          message: data?.message || 'Invalid request. Please check your input.',
        };
      case 401:
        throw {
          success: false,
          message: data?.message || 'Unauthorized. Please login again.',
        };
      case 403:
        throw {
          success: false,
          message: data?.message || 'Access denied.',
        };
      case 404:
        throw {
          success: false,
          message: data?.message || 'Resource not found.',
        };
      case 422:
        throw {
          success: false,
          message: data?.message || 'Validation failed.',
        };
      case 500:
        throw {
          success: false,
          message: 'Internal server error. Please try again later.',
        };
      default:
        throw {
          success: false,
          message: data?.message || `Request failed with status ${status}`,
        };
    }
  }
);

export default axiosInstance;
