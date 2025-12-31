import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        content: {
            padding: 20,
            paddingBottom: 40,
        },
        headerImage: {
            width: '100%',
            height: 200,
            borderRadius: 20,
            marginBottom: 20,
            backgroundColor: '#7C3AED', // Placeholder color as I don't have an asset
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#7C3AED',
            marginBottom: 16,
        },
        text: {
            fontSize: 16,
            lineHeight: 26,
            color: isDark ? '#D1D5DB' : '#4B5563',
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginTop: 10,
            marginBottom: 12,
        },
        infoBlock: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        }
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerImage} />
                {/* Real app would use an Image component with require(...) or uri */}

                <Text style={styles.title}>About AAGC</Text>
                <Text style={styles.subtitle}>A Place to Call Home</Text>

                <Text style={styles.text}>
                    We are a community of believers dedicated to spreading the love of Christ and empowering individuals to live their best lives. Our mission is to create a welcoming environment where everyone feels valued, supported, and inspired.
                </Text>

                <Text style={styles.sectionTitle}>Our Vision</Text>
                <Text style={styles.text}>
                    To be a beacon of hope and a catalyst for positive change in our community and beyond. We envision a world where every person has the opportunity to experience the transformative power of God's grace.
                </Text>

                <Text style={styles.sectionTitle}>Service Times</Text>
                <View style={styles.infoBlock}>
                    <Text style={[styles.text, { marginBottom: 4, fontWeight: 'bold' }]}>Sundays</Text>
                    <Text style={[styles.text, { marginBottom: 12 }]}>10:00 AM - Worship Service</Text>

                    <Text style={[styles.text, { marginBottom: 4, fontWeight: 'bold' }]}>Wednesdays</Text>
                    <Text style={[styles.text, { marginBottom: 0 }]}>6:00 PM - Bible Study</Text>
                </View>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <View style={styles.infoBlock}>
                    <Text style={styles.text}>
                        123 Apostolic Way{'\n'}
                        Global Heights, GH 12345{'\n'}
                        {'\n'}
                        Phone: (555) 123-4567{'\n'}
                        Email: info@aagc-church.org
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
