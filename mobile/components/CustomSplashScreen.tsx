import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, SafeAreaView, Dimensions, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';
import { APP_NAME } from '../constants';

const { width } = Dimensions.get('window');

interface CustomSplashScreenProps {
    onAnimationComplete: () => void;
}

export default function CustomSplashScreen({ onAnimationComplete }: CustomSplashScreenProps) {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Wait a bit, then fade out
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onAnimationComplete();
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: fadeAnim }
            ]}
        >
            <SafeAreaView style={styles.content}>
                <View style={styles.logoContainer}>
                    <Globe size={64} color="#2563eb" />
                </View>

                <Text style={styles.title}>
                    {APP_NAME || 'Apostolic Army'}
                </Text>

                <Text style={styles.subtitle}>
                    Home of the Supernatural
                </Text>
            </SafeAreaView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f9fafb',
        zIndex: 100, // Ensure it sits on top
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        padding: 24,
        backgroundColor: '#dbeafe',
        borderRadius: 999,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#3b82f6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
        // fontFamily: 'serif' // Custom font might need loading
    },
    subtitle: {
        color: '#2563eb',
        fontSize: 16,
        fontWeight: '300',
        letterSpacing: 4,
        textTransform: 'uppercase'
    }
});
