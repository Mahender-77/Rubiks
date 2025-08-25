// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  login as apiLogin,
  forgotPassword as apiForgotPassword,
  resendVerification as apiResendVerification,
  updateProfile as apiUpdateProfile,
  updateAvatar as apiUpdateAvatar,
  updateContact as apiUpdateContact,
  addJob as apiAddJob,
  getJobs as apiGetJobs,
  getJobDetails as apiGetJobDetails,
  updateJob as apiUpdateJob,
  deleteJob as apiDeleteJob,
  logout as apiLogout,
  User,
} from "../utils/api";

import Constants from "expo-constants";



// Types
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Auth methods
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;

  // Profile methods
  updateProfile: (profileData: any) => Promise<any>;
  updateAvatar: (avatar: string) => Promise<any>;
  updateContact: (contactData: any) => Promise<any>;

  // Job methods
  addJob: (jobData: any) => Promise<any>;
  getJobs: () => Promise<any>;
  getJobDetails: (jobId: string | null) => Promise<any>;
  deleteJob: (id: string) => Promise<any>;
  updateJob: (jobData: any) => Promise<any>;

  // Utility
  refreshUser: () => Promise<void>;
}
type ExtraConfig = {
  API_URL?: string;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Storage Keys - Using the same keys as your API functions
const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

// ---------- Helpers ----------
const storeAuth = async (token: string, user: User) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)]
    ]);
    console.log("✅ Auth stored successfully", { 
      email: user.email, 
      role: user.role,
      userId: user.id 
    });
  } catch (err) {
    console.error("❌ Error storing auth:", err);
  }
};

const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    console.log("🗑️ Auth cleared from AsyncStorage");
  } catch (err) {
    console.error("❌ Error clearing auth:", err);
  }
};

const getStoredAuth = async (): Promise<{ token: string | null; user: User | null }> => {
  try {
    const values = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
    const token = values[0][1];
    const userStr = values[1][1];
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    
    if (parsedUser && token) {
      console.log("🔑 Retrieved stored auth:", { 
        email: parsedUser.email, 
        role: parsedUser.role,
        hasToken: !!token
      });
    }
    
    return { token, user: parsedUser };
  } catch (err) {
    console.error("❌ Error retrieving stored auth:", err);
    return { token: null, user: null };
  }
};
// -----------------------------

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const isAuthenticated = Boolean(user && token && authInitialized);

  // Load stored authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔄 Initializing authentication...");
      setIsLoading(true);
      
      try {
        const { token: storedToken, user: storedUser } = await getStoredAuth();

        if (storedToken && storedUser) {
          console.log("✅ Authentication restored from storage");
          setToken(storedToken);
          setUser(storedUser);
        } else {
          console.log("ℹ️ No stored authentication found");
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("❌ Error initializing auth:", err);
        setToken(null);
        setUser(null);
      } finally {
        setAuthInitialized(true);
        setIsLoading(false);
        console.log("✅ Authentication initialization completed");
      }
    };

    initializeAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const { user: storedUser } = await getStoredAuth();
      if (storedUser) {
        setUser(storedUser);
        console.log("🔄 User refreshed from storage");
      }
    } catch (err) {
      console.error("❌ Error refreshing user:", err);
    }
  };

  // -------- Auth Methods --------
const login = async (email: string, password: string) => {
  console.log("🔐 Attempting login for:", email);

  try {
    const result = await apiLogin(email, password);

    if (result.success && result.data?.token && result.data?.user) {
      console.log("✅ Login successful for:", {
        email: result.data.user.email,
        role: result.data.user.role,
        id: result.data.user.id
      });

      const newToken = result.data.token;
      const newUser = result.data.user;

      setToken(newToken);
      setUser(newUser);

      console.log("🎯 Login process completed successfully");
      return { success: true, message: "Login successful" };
    } else {
      console.log("❌ Login failed:", result.message || "Unknown error");
      return { success: false, message: result.message || "Invalid email or password" };
    }
  } catch (error: any) {
    console.error("❌ Login error:", error);

    // Extract backend error message if available
    let errorMessage = "Login failed";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return { success: false, message: errorMessage };
  }
};

  const logout = async () => {
    console.log("🚪 Starting logout process...");
    
    try {
      // Clear local state first
      setToken(null);
      setUser(null);
      
      // Call API logout - this also clears AsyncStorage
      await apiLogout();
      
      console.log("✅ Logout completed, redirecting to login...");
      
      // Force navigation to login with replace to clear stack
      router.replace("/(auth)/login");
    } catch (err) {
      console.error("❌ Error during logout:", err);
      // Ensure AsyncStorage is cleared even if API call fails
      await clearAuth();
      // Still try to navigate
      router.replace("/(auth)/login");
    }
  };

  // -------- Profile Methods --------
  const updateProfile = async (profileData: any) => {
    try {
      const result = await apiUpdateProfile(profileData);
      if (result.success && result.user) {
        const updatedUser = result.user;
        setUser(updatedUser);
        // API already updates AsyncStorage
        console.log("✅ Profile updated successfully");
      }
      return result;
    } catch (err) {
      console.error("❌ Profile update error:", err);
      return { success: false, message: "Profile update failed" };
    }
  };

  const updateAvatar = async (avatar: string) => {
    try {
      const result = await apiUpdateAvatar(avatar);
      if (result.success && result.user) {
        const updatedUser = result.user;
        setUser(updatedUser);
        // API already updates AsyncStorage
        console.log("✅ Avatar updated successfully");
      }
      return result;
    } catch (err) {
      console.error("❌ Avatar update error:", err);
      return { success: false, message: "Avatar update failed" };
    }
  };

  const updateContact = async (contactData: any) => {
    try {
      const result = await apiUpdateContact(contactData);
      if (result.success && result.user) {
        const updatedUser = result.user;
        setUser(updatedUser);
        // API already updates AsyncStorage
        console.log("✅ Contact updated successfully");
      }
      return result;
    } catch (err) {
      console.error("❌ Contact update error:", err);
      return { success: false, message: "Contact update failed" };
    }
  };

  // -------- Job Methods --------
  const addJob = (jobData: any) => apiAddJob(jobData);
  const getJobs = () => apiGetJobs();
  const getJobDetails = (jobId: string | null) => apiGetJobDetails(jobId);
  const deleteJob = (id: string) => apiDeleteJob(id);
  const updateJob = (jobData: any) => apiUpdateJob(jobData);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    forgotPassword: apiForgotPassword,
    resendVerification: apiResendVerification,
    updateProfile,
    updateAvatar,
    updateContact,
    addJob,
    getJobs,
    getJobDetails,
    deleteJob,
    updateJob,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};