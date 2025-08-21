// utils/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axiosInstance';

// Storage Keys - Consistent across the app
const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

// Types
export interface User {
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

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API Functions
export const login = async (email: string, password: string) => {
  try {
    console.log("🔐 API: Attempting login for:", email);
    
    const { data } = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    
    console.log("📥 API: Login response received:", {
      success: data.success,
      hasToken: !!data.data?.token,
      hasUser: !!data.data?.user,
      userRole: data.data?.user?.role
    });
    
    if (data.success && data.data?.token && data.data?.user) {
      // Store auth data
      await AsyncStorage.multiSet([
        [TOKEN_KEY, data.data.token],
        [USER_KEY, JSON.stringify(data.data.user)],
      ]);
      
      console.log("✅ API: Auth data stored successfully");
    }
    
    return data;
  } catch (error) {
    console.error("❌ API: Login error:", error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const { data } = await axiosInstance.post('/auth/register', {
      name,
      email,
      password,
    });
    return data;
  } catch (error) {
    console.error("❌ API: Register error:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const { data } = await axiosInstance.post('/auth/forgot-password', {
      email,
    });
    return data;
  } catch (error) {
    console.error("❌ API: Forgot password error:", error);
    throw error;
  }
};

export const resendVerification = async (email: string) => {
  try {
    const { data } = await axiosInstance.post('/auth/resend-verification', {
      email,
    });
    return data;
  } catch (error) {
    console.error("❌ API: Resend verification error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log("🚪 API: Clearing stored auth data");
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    console.log("✅ API: Auth data cleared successfully");
  } catch (error) {
    console.error("❌ API: Logout error:", error);
    throw error;
  }
};

// Profile API Functions
export const updateProfile = async (profileData: any) => {
  try {
    const { data } = await axiosInstance.put('/profile/basic', profileData);
    
    if (data.success && data.user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      console.log("✅ API: Profile updated and stored");
    }
    
    return data;
  } catch (error) {
    console.error("❌ API: Update profile error:", error);
    throw error;
  }
};

export const updateAvatar = async (avatar: string) => {
  try {
    const { data } = await axiosInstance.put('/profile/avatar', {
      avatar,
    });
    
    if (data.success && data.user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      console.log("✅ API: Avatar updated and stored");
    }
    
    return data;
  } catch (error) {
    console.error("❌ API: Update avatar error:", error);
    throw error;
  }
};

export const updateContact = async (contactData: any) => {
  try {
    const { data } = await axiosInstance.put('/profile/contact', contactData);
    
    if (data.success && data.user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
      console.log("✅ API: Contact updated and stored");
    }
    
    return data;
  } catch (error) {
    console.error("❌ API: Update contact error:", error);
    throw error;
  }
};

// Job API Functions
export const addJob = async (jobData: any) => {
  try {
    const { data } = await axiosInstance.post('/admin/jobs', jobData);
    return data;
  } catch (error) {
    console.error("❌ API: Add job error:", error);
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const { data } = await axiosInstance.get('/admin/getJobs');
    return data;
  } catch (error) {
    console.error("❌ API: Get jobs error:", error);
    throw error;
  }
};

export const getJobDetails = async (jobId: string | null) => {
  if (!jobId) {
    console.warn('getJobDetails called with null jobId');
    return null;
  }
  
  try {
    const { data } = await axiosInstance.get(`/admin/job/${jobId}`);
    
    if (data.success && data.job) {
      return data.job;
    }
    
    console.warn('Get job details failed:', data.message);
    return null;
  } catch (error) {
    console.error("❌ API: Get job details error:", error);
    throw error;
  }
};

export const updateJob = async (jobData: any) => {
  try {
    // Make sure jobData has an id field
    if (!jobData.id && !jobData._id) {
      throw new Error("Job ID is required for update");
    }
    
    const jobId = jobData.id || jobData._id;
    const { data } = await axiosInstance.put(`/admin/updateJob/${jobId}`, jobData);
    return data;
  } catch (error: any) {
    console.error("❌ API: Update job error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || error.message };
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/deletejob/${jobId}`);
    return data;
  } catch (error) {
    console.error("❌ API: Delete job error:", error);
    throw error;
  }
};

// Utility Functions
export const getStoredAuth = async () => {
  try {
    const [token, userString] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
    
    const result = {
      token: token[1],
      user: userString[1] ? JSON.parse(userString[1]) : null,
    };
    
    console.log("🔍 API: getStoredAuth result:", {
      hasToken: !!result.token,
      hasUser: !!result.user,
      userRole: result.user?.role
    });
    
    return result;
  } catch (error) {
    console.error('❌ API: Error getting stored auth:', error);
    return {
      token: null,
      user: null,
    };
  }
};