import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
            padding: 16,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 24,
        },
        setting: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        settingText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#FFFFFF' : '#111827',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.setting}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>
        </View>
    );
}
