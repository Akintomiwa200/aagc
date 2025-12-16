'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user for development
const MOCK_ADMIN: User = {
  id: '1',
  email: 'admin@aagc.org',
  name: 'Church Administrator',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
  lastLogin: new Date().toISOString()
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('admin_user');
    const token = localStorage.getItem('admin_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
      }
    }
    
    // For development, auto-login with mock admin
    if (process.env.NODE_ENV === 'development' && !storedUser) {
      setUser(MOCK_ADMIN);
      localStorage.setItem('admin_user', JSON.stringify(MOCK_ADMIN));
      localStorage.setItem('admin_token', 'mock_token_for_development');
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      if (email === 'admin@aagc.org' && password === 'password123') {
        const userData: User = {
          id: '1',
          email,
          name: 'Church Administrator',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80',
          lastLogin: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_token', 'mock_jwt_token_here');
        
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name })
      // });
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, only allow specific domain
      if (!email.includes('@aagc.org')) {
        return { success: false, message: 'Only @aagc.org emails allowed for admin access' };
      }
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'viewer', // New users start as viewers
        lastLogin: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      localStorage.setItem('admin_token', 'mock_jwt_token_here');
      
      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      return { success: false, message: 'Signup failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    router.push('/admin/auth/login');
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      if (email.includes('@aagc.org')) {
        return { 
          success: true, 
          message: 'Password reset link sent to your email (mock: check console for token)' 
        };
      }
      
      return { success: false, message: 'Email not found' };
    } catch (error) {
      return { success: false, message: 'Failed to send reset email' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      if (newPassword.length >= 8) {
        return { success: true, message: 'Password reset successful!' };
      }
      
      return { success: false, message: 'Password must be at least 8 characters' };
    } catch (error) {
      return { success: false, message: 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        
        return { success: true, message: 'Profile updated successfully!' };
      }
      
      return { success: false, message: 'User not found' };
    } catch (error) {
      return { success: false, message: 'Update failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}