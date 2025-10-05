import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User,AppState } from 'types/index';
import axiosInstance from '@services/axiosInstance';
// import { User, AppState } from '@types';

interface AuthContextType extends AppState {
  login: (token: String) => Promise<void>;
  signup: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'AUTH_TOKEN';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (token) {
        const resp = await axiosInstance.get("/api/auth/getInfo")
        const user = resp.data;
        setState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = async (token: String) => {
    try {
      const user = null;
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(token));
      setState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (updatedUser: Partial<User>) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
      if (state.user && token) {
        const newUser = { ...state.user, ...updatedUser };
        const resp = await axiosInstance.put("/api/auth/updateProfile", JSON.stringify(newUser))
        setState(prev => ({
          ...prev,
          user: newUser,
        }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const signup = async (userData: User) => {
    // API call for signup
    try {
      setState({
        isAuthenticated: true,
        user:userData,
        loading: false,
      });
      await AsyncStorage.setItem('@user_token', 'mock_token');
    } catch (error) {
      console.log('error', error)
      throw new Error(`Error during Signup ${error}`);
      
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login,signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
