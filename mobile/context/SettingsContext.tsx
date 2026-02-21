import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface Settings {
    pushNotifications: boolean;
    marketingEmails: boolean;
    dataSavingMode: boolean;
    spiritualGrowthAlerts: boolean;
    communityEventAlerts: boolean;
    bibleVersion: string;
    // Privacy
    profilePublic: boolean;
    showOnlineStatus: boolean;
    socialTagging: boolean;
    usageAnalytics: boolean;
    language: string;
    textSize: string;
}

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
    pushNotifications: true,
    marketingEmails: false,
    dataSavingMode: false,
    spiritualGrowthAlerts: true,
    communityEventAlerts: true,
    bibleVersion: 'kjv',
    profilePublic: true,
    showOnlineStatus: true,
    socialTagging: false,
    usageAnalytics: true,
    language: 'English',
    textSize: 'Default',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, [user]);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const localSettings = await AsyncStorage.getItem('userSettings');
            if (localSettings) {
                setSettings(JSON.parse(localSettings));
            }

            // Sync with backend if user is logged in
            if (user?.id) {
                try {
                    const response = await apiService.get<any>(`/users/${user.id}/settings`);
                    // If response is the settings object directly or wrapped in data
                    const remoteSettings = response.data || response;
                    if (remoteSettings && typeof remoteSettings === 'object' && !Array.isArray(remoteSettings)) {
                        const merged = { ...defaultSettings, ...remoteSettings };
                        setSettings(merged);
                        await AsyncStorage.setItem('userSettings', JSON.stringify(merged));
                    }
                } catch (error) {
                    console.warn('Failed to sync settings from backend:', error);
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);

        try {
            await AsyncStorage.setItem('userSettings', JSON.stringify(updated));

            if (user?.id) {
                await apiService.post(`/users/${user.id}/settings`, updated);
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading, refreshSettings: loadSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
