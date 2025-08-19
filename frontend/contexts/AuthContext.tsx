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

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
  role?: 'admin' | 'user'; // 👈 Add this
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
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resendVerification: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  updateProfile: (
    profileData: any
  ) => Promise<{ success: boolean; message: string }>;
  updateAvatar: (
    avatar: string
  ) => Promise<{ success: boolean; message: string }>;
  updateContact: (
    contactData: any
  ) => Promise<{ success: boolean; message: string }>;
  addJob: (jobData: any) => Promise<{ success: boolean; message: string }>;
  getJobs: () => Promise<{ success: boolean; jobs?: any[]; message?: string }>;
  getJobDetails: (jobId: string | null) => Promise<any | null>; // 👈 Add this
  deleteJob: (id: string) => Promise<{ success: boolean; message: string }>;
  updateJob: (jobData: any) => Promise<{ success: boolean; message: string }>;
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
const AUTH_URL = `http://192.168.1.106:5001/api/auth`;
const PROFILE_URL = `http://192.168.1.106:5001/api/profile`;
const ADMIN_URL = `http://192.168.1.106:5001/api/admin`;

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
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  };

  const clearAuth = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // backend sends user and token inside data.data
        const token = data.data?.token;
        const user = data.data?.user;

        if (!token || !user) {
          return {
            success: false,
            message: 'Invalid server response: missing token or user',
          };
        }

        await storeAuth(token, user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Registration sends verification email; do not store auth here
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${AUTH_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch(`${AUTH_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await fetch(`${PROFILE_URL}/basic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        await AsyncStorage.setItem('authUser', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const updateAvatar = async (avatar: string) => {
    try {
      const response = await fetch(`${PROFILE_URL}/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        await AsyncStorage.setItem('authUser', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update avatar error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const updateContact = async (contactData: any) => {
    try {
      const response = await fetch(`${PROFILE_URL}/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        await AsyncStorage.setItem('authUser', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update contact error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const addJob = async (jobData: any) => {
    try {
      const response = await fetch(`${ADMIN_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, message: 'Job added successfully' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Add job error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const getJobs = async () => {
    try {
      const response = await fetch(`${ADMIN_URL}/getJobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, jobs: data.jobs };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Get jobs error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const getJobDetails = async (id: string | null) => {
    console.log('getJobDetails called with jobId:', id);
    if (!id) {
      console.error('getJobDetails called with null jobId');
      return null;
    }
    try {
      const response = await fetch(`${ADMIN_URL}/job/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
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

  const deleteJob = async (id: string) => {
    try {
      const response = await fetch(`${ADMIN_URL}/deletejob/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, message: 'Job deleted successfully' };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Delete job error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  };

  const updateJob = async (jobData: any) => {
    try {
      const response = await fetch(`${ADMIN_URL}/update/${jobData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (data.success) {
        return { success: true, message: 'Job updated successfully' };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Update job error:', error);
      return {
        success: false,
        message: 'Server not available. Please start the backend server.',
      };
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resendVerification,
    updateProfile,
    updateAvatar,
    updateContact,
    getJobs,
    addJob, // 👈 Add this
    getJobDetails, // 👈 Add this
    deleteJob, // 👈 Add this
    updateJob, // 👈 Add this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
