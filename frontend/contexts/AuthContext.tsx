import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isEmailVerified: boolean;
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
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (profileData: any) => Promise<{ success: boolean; message: string }>;
  updateAvatar: (avatar: string) => Promise<{ success: boolean; message: string }>;
  updateContact: (contactData: any) => Promise<{ success: boolean; message: string }>;
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

const API_URL = 'http://192.168.1.105:5000/api/auth';

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
    console.error("storeAuth called with invalid data:", { newToken, newUser });
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
    const response = await fetch(`${API_URL}/login`, {
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
        return { success: false, message: 'Invalid server response: missing token or user' };
      }

      await storeAuth(token, user);
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Server not available. Please start the backend server.' };
  }
};


  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        await storeAuth(data.token, data.user);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Server not available. Please start the backend server.' };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
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
      return { success: false, message: 'Server not available. Please start the backend server.' };
    }
  };

  const resendVerification = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
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
      return { success: false, message: 'Server not available. Please start the backend server.' };
    }
  };

const updateProfile = async (profileData: any) => {
  try {
    const response = await fetch(`http://192.168.0.141:5000/api/profile/basic`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (data.success) {
      setUser(data.user);  // backend should send updated user
      await AsyncStorage.setItem('authUser', JSON.stringify(data.user));
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Server not available. Please start the backend server.' };
  }
};

const updateAvatar = async (avatar: string) => {
  try {
    const response = await fetch(`http://192.168.0.141:5000/api/profile/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar }),
    });

    const data = await response.json();
    if (data.success) {
      setUser(data.user);
      await AsyncStorage.setItem('authUser', JSON.stringify(data.user));
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Update avatar error:', error);
    return { success: false, message: 'Server not available. Please start the backend server.' };
  }
};


  const updateContact = async (contactData: any) => {
    try {
      const response = await fetch(`${API_URL.replace('/auth', '/profile')}/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (data.success) {
                 // Update user with new profile info
         if (user) {
           const updatedUser = {
             ...user,
             name: contactData.name || user.name,
             phone: contactData.phone || user.phone,
             profile: {
               ...user.profile,
               headline: contactData.headline || user.profile.headline,
               location: contactData.location || user.profile.location,
               url: contactData.url || user.profile.url,
             }
           };
           setUser(updatedUser);
           await AsyncStorage.setItem('authUser', JSON.stringify(updatedUser));
         }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update contact error:', error);
      return { success: false, message: 'Server not available. Please start the backend server.' };
    }
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
