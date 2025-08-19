import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosError } from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
  role?: 'admin' | 'user';
  profile: {
    avatar?: string;
    headline?: string;
    location?: string;
    bio?: string;
    skills: string[];
    education: any[];
    experience: any[];
    resume?: any;
    profileCompletion: number;
    url?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Single base URL for API (auto-detected for development)
const resolveBaseUrl = () => {
  // Allow override via Expo public env
  const envUrl = Constants.expoConfig?.extra?.API_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, '');

  const defaultPort = 5001;
  // Try to infer host from Expo dev server
  const hostUri = (Constants.expoConfig as any)?.hostUri as string | undefined;
  let host = hostUri ? hostUri.split(':')[0] : undefined;
  if (!host) {
    const dbg =
      (Constants as any)?.manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants as any)?.manifest?.debuggerHost;
    if (typeof dbg === 'string') host = dbg.split(':')[0];
  }
  if (!host) {
    host = Platform.OS === 'ios' ? '192.168.1.106' : '192.168.1.106';
  }
  return `http://${host}:${defaultPort}/api`;
};

const BASE_URL = resolveBaseUrl();

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for consistent error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        return Promise.reject(new Error('Server not available. Please start the backend server.'));
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Global axios instance
let apiInstance = createApiInstance();

// Helper function to update token in axios instance
const updateApiToken = (token: string | null) => {
  apiInstance = createApiInstance();
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Helper function to handle API responses consistently
const handleApiResponse = async function<T>(
  apiCall: () => Promise<any>,
  errorContext: string
): Promise<{ success: boolean; message: string; data?: T }> {
  try {
    const response = await apiCall();
    const data = response.data;
    
    if (data.success) {
      return { 
        success: true, 
        message: data.message,
        data: data.data || data
      };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error(`${errorContext} error:`, error);
    const message = error instanceof Error ? error.message : 'Server not available. Please start the backend server.';
    return { success: false, message };
  }
};

// Helper to get current token
const getCurrentToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Helper to get current user
const getCurrentUser = async (): Promise<User | null> => {
  try {
    const storedUser = await AsyncStorage.getItem('authUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Auth storage helpers
const storeAuth = async (newToken: string, newUser: User) => {
  if (!newToken || !newUser) {
    console.error('storeAuth called with invalid data:', {
      newToken,
      newUser,
    });
    return;
  }
  try {
    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(newUser));
    updateApiToken(newToken);
  } catch (error) {
    console.error('Error storing auth:', error);
  }
};

const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
    updateApiToken(null);
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

// Exported Auth Functions
interface LoginResponse {
  token: string;
  user: User;
}
export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  const result = await handleApiResponse<LoginResponse>(
    () => apiInstance.post('/auth/login', { email, password }),
    'Login'
  );

  if (result.success && result.data) {
    const { token: newToken, user: newUser } = result.data;
    
    if (!newToken || !newUser) {
      return {
        success: false,
        message: 'Invalid server response: missing token or user',
      };
    }

    await storeAuth(newToken, newUser);
    return { success: true, message: result.message };
  }

  return { success: result.success, message: result.message };
};

export const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
  return handleApiResponse(
    () => apiInstance.post('/auth/register', { name, email, password }),
    'Register'
  );
};

export const logout = async (): Promise<void> => {
  await clearAuth();
};

export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  return handleApiResponse(
    () => apiInstance.post('/auth/forgot-password', { email }),
    'Forgot password'
  );
};

export const resendVerification = async (email: string): Promise<{ success: boolean; message: string }> => {
  return handleApiResponse(
    () => apiInstance.post('/auth/resend-verification', { email }),
    'Resend verification'
  );
};

interface UpdateProfileResponse {
  user: User;
}


export const updateProfile = async (profileData: any): Promise<{ success: boolean; message: string }> => {
  const token = await getCurrentToken();
  if (!token) {
    return { success: false, message: 'Authentication required' };
  }
  
  updateApiToken(token);
  const result = await handleApiResponse<UpdateProfileResponse>(
    () => apiInstance.put('/profile/basic', profileData),
    'Update profile'
  );

  if (result.success && result.data?.user) {
    await AsyncStorage.setItem('authUser', JSON.stringify(result.data.user));
  }

  return { success: result.success, message: result.message };
};

export const updateAvatar = async (avatar: string): Promise<{ success: boolean; message: string }> => {
  const token = await getCurrentToken();
  if (!token) {
    return { success: false, message: 'Authentication required' };
  }
  
  updateApiToken(token);
  const result = await handleApiResponse<UpdateProfileResponse>(
    () => apiInstance.put('/profile/avatar', { avatar }),
    'Update avatar'
  );

  if (result.success && result.data?.user) {
    await AsyncStorage.setItem('authUser', JSON.stringify(result.data.user));
  }

  return { success: result.success, message: result.message };
};

export const updateContact = async (contactData: any): Promise<{ success: boolean; message: string }> => {
  const token = await getCurrentToken();
  if (!token) {
    return { success: false, message: 'Authentication required' };
  }
  
  updateApiToken(token);
  const result = await handleApiResponse<UpdateProfileResponse>(
    () => apiInstance.put('/profile/contact', contactData),
    'Update contact'
  );

  if (result.success && result.data?.user) {
    await AsyncStorage.setItem('authUser', JSON.stringify(result.data.user));
  }

  return { success: result.success, message: result.message };
};

export const addJob = async (jobData: any): Promise<{ success: boolean; message: string }> => {
  const token = await getCurrentToken();
  if (!token) {
    return { success: false, message: 'Authentication required' };
  }
  
  updateApiToken(token);
  const result = await handleApiResponse(
    () => apiInstance.post('/admin/jobs', jobData),
    'Add job'
  );

  return {
    success: result.success,
    message: result.success ? 'Job added successfully' : result.message,
  };
};

export const getJobs = async (): Promise<{ success: boolean; jobs?: any[]; message?: string }> => {
  const token = await getCurrentToken();
  if (!token) {
    return { success: false, message: 'Authentication required' };
  }
  
  updateApiToken(token);
  const result = await handleApiResponse<{ jobs: any[] }>(
    () => apiInstance.get('/admin/getJobs'),
    'Get jobs'
  );

  if (result.success && result.data) {
    return { success: true, jobs: result.data.jobs };
  }

  return { success: result.success, message: result.message };
};

export const getJobDetails = async (jobId: string | null): Promise<any | null> => {
  if (!jobId) {
    console.error('getJobDetails called with null jobId');
    return null;
  }

  const token = await getCurrentToken();
  if (!token) {
    console.error('Authentication required for getJobDetails');
    return null;
  }
  
  updateApiToken(token);

  try {
    const response = await apiInstance.get(`/admin/job/${jobId}`);
    const data = response.data;
    
    if (data.success) {
      return data.job;
    }
    
    console.error('Get job details error:', data.message);
    return null;
  } catch (error) {
    console.error('Get job details error:', error);
    return null;
  }
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('authUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        updateApiToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};