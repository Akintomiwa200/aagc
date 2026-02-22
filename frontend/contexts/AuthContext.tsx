  'use client';

  import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
  import { useRouter } from 'next/navigation';

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'staff' | 'member';
    avatar?: string;
    lastLogin?: string;
    bio?: string;
    phone?: string;
    location?: string;
  }

  interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (
  email: string,
  password: string,
  rememberMe?: boolean
) => Promise<{ success: boolean; message: string }>;
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
    googleAuth: (idToken: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
    resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
    isAuthenticated: boolean;
    isAdmin: boolean;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

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

      // For development, we no longer auto-login to prevent dashboard auto-open
      // if (process.env.NODE_ENV === 'development' && !storedUser) {
      //   setUser(MOCK_ADMIN);
      //   localStorage.setItem('admin_user', JSON.stringify(MOCK_ADMIN));
      //   localStorage.setItem('admin_token', 'mock_token_for_development');
      // }

      setLoading(false);
    }, []);

   const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          const message = data?.message || 'Invalid credentials';
          return { success: false, message };
        }

        const userData: User = {
          id: data.user.id?.toString() ?? data.user._id ?? 'unknown',
          email: data.user.email,
          name: data.user.name ?? 'Church Administrator',
          role: (data.user.role as User['role']) ?? 'admin',
          avatar: data.user.avatar,
          lastLogin: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_token', data.token || '');

        return { success: true, message: 'Login successful!' };
      } catch {
        return { success: false, message: 'Login failed. Please try again.' };
      } finally {
        setLoading(false);
      }
    };



const signup = async (
  email: string,
  password: string,
  name: string
) => {
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data?.message || 'Signup failed' };
    }

    return { success: true, message: 'Signup successful! Awaiting approval.' };
  } catch {
    return { success: false, message: 'Signup failed. Please try again.' };
  } finally {
    setLoading(false);
  }
};


    

    const googleAuth = async (idToken: string) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/oauth/mobile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google', token: idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, message: data?.message || 'Google Auth failed' };
        }

        const userData: User = {
          id: data.user.id?.toString() ?? data.user._id ?? 'unknown',
          email: data.user.email,
          name: data.user.name ?? 'User',
          role: (data.user.role as User['role']) ?? 'member',
          avatar: data.user.avatar,
          lastLogin: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_token', data.token || '');

        return { success: true, message: 'Authentication successful!' };
      } catch {
        return { success: false, message: 'Google Auth failed. Please try again.' };
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
      googleAuth,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
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