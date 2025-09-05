// utils/axiosInstance.ts
import axios, { InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ExtraConfig = {
  API_BASE_URL?: string;
};

// Debug logging
console.log('=== AXIOS CONFIGURATION ===');
console.log('Platform:', Platform.OS);
console.log('Environment EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
console.log('__DEV__:', __DEV__);

// Get API Base URL with multiple fallbacks
const getApiBaseUrl = (): string => {
  // Try environment variable first (from EAS build)
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    console.log('Using environment variable:', process.env.EXPO_PUBLIC_API_BASE_URL);
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  // Try Constants.expoConfig.extra (from app.json)
  if (Constants.expoConfig?.extra?.API_BASE_URL) {
    console.log('Using expoConfig.extra:', Constants.expoConfig.extra.API_BASE_URL);
    return Constants.expoConfig.extra.API_BASE_URL;
  }

  // Try Constants.manifest.extra (legacy fallback)
  if (Constants.manifest?.extra?.API_BASE_URL) {
    console.log('Using manifest.extra:', Constants.manifest.extra.API_BASE_URL);
    return Constants.manifest.extra.API_BASE_URL;
  }

  // Production fallback
  const productionUrl = 'http://145.223.21.150:5001/api';
  console.log('Using production fallback:', productionUrl);
  return productionUrl;
};

// const API_BASE_URL = getApiBaseUrl();
const API_BASE_URL ='http://192.168.1.107:5001/api' ;

console.log('Final API_BASE_URL:', API_BASE_URL);
console.log('============================');

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for production
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper function to get full URL safely
const getFullUrl = (config: InternalAxiosRequestConfig): string => {
  const baseURL = config.baseURL || '';
  const url = config.url || '';
  return `${baseURL}${url}`;
};

// Request interceptor - Add auth token and logging
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const fullUrl = getFullUrl(config);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        if (!config.headers) {
          config.headers = {} as any;
        }
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('ℹ️ No auth token found');
      }
    } catch (error) {
      console.warn('❌ Failed to get auth token:', error);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const fullUrl = error.config ? getFullUrl(error.config) : 'unknown';
    
    console.error('❌ API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: fullUrl,
      data: error.response?.data
    });

    // Handle 401 - Token expired
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['authToken', 'authUser']);
        console.log('🗑️ Auth data cleared due to 401');
      } catch (clearError) {
        console.error('❌ Failed to clear auth data:', clearError);
      }
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        console.error('🌐 Network error detected');
        throw {
          success: false,
          message: 'Network error. Please check your internet connection and try again.',
        };
      }

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.error('⏱️ Timeout error detected');
        throw {
          success: false,
          message: 'Request timeout. Please try again.',
        };
      }

      if (error.code === 'ECONNREFUSED' || error.message?.includes('Connection refused')) {
        console.error('🚫 Connection refused');
        throw {
          success: false,
          message: 'Cannot connect to server. Please check if the server is running.',
        };
      }

      console.error('🔌 Server unavailable');
      throw {
        success: false,
        message: 'Server not available. Please try again later.',
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
          errors: data?.errors,
        };
      case 401:
        throw {
          success: false,
          message: data?.message || 'Unauthorized. Please login again.',
        };
      case 403:
        throw {
          success: false,
          message: data?.message || 'Access denied. You do not have permission.',
        };
      case 404:
        throw {
          success: false,
          message: data?.message || 'Resource not found.',
        };
      case 422:
        throw {
          success: false,
          message: data?.message || 'Validation failed. Please check your input.',
          errors: data?.errors,
        };
      case 429:
        throw {
          success: false,
          message: 'Too many requests. Please wait and try again.',
        };
      case 500:
        throw {
          success: false,
          message: 'Internal server error. Please try again later.',
        };
      case 502:
      case 503:
      case 504:
        throw {
          success: false,
          message: 'Server is temporarily unavailable. Please try again later.',
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