import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const PlaceholderScreen = ({ title }: { title: string }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

export default function BibleScreen() {
    return <PlaceholderScreen title="Bible" />;
}
