import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('church_app_user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
                apiService.setToken(token);
            }
        } catch (error) {
            console.error('Failed to load user', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const result = await apiService.login(email, password);
        if (result.user) {
            const userData = {
                id: result.user.id || result.user._id,
                email: result.user.email,
                name: result.user.name,
                avatar: result.user.avatar,
                role: result.user.role,
            };
            setUser(userData);
            await AsyncStorage.setItem('church_app_user', JSON.stringify(userData));
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('church_app_user');
        await apiService.clearToken();
    };

    const updateUser = (userData: User | null) => {
        setUser(userData);
        if (userData) {
            AsyncStorage.setItem('church_app_user', JSON.stringify(userData));
        } else {
            AsyncStorage.removeItem('church_app_user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
