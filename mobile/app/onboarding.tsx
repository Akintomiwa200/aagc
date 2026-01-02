import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Globe, Zap, Heart, CheckCircle, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const [slide, setSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Welcome Home",
            desc: "Join the Apostolic Army Global Church family.",
            icon: Globe,
            color: "#2563eb"
        },
        {
            id: 2,
            title: "Supernatural Encounter",
            desc: "Experience the prophetic move of God in your life.",
            icon: Zap,
            color: "#3b82f6"
        },
        {
            id: 3,
            title: "Global Community",
            desc: "Connect with believers from all around the world.",
            icon: Heart,
            color: "#ef4444"
        },
        {
            id: 4,
            title: "Grow in Faith",
            desc: "Daily devotionals, bible study, and prayers.",
            icon: CheckCircle,
            color: "#10b981"
        }
    ];

    const currentSlide = slides[slide];
    const Icon = currentSlide.icon;

    const handleOnboardingComplete = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            // Navigate to root (which handles auth redirect or goes to home)
            // But usually we want to go to Login if not authenticated, or Home if allowing guest
            // Based on App.tsx logic, completion goes to main stack.
            // Let's assume we go to login or home.
            // For now, replace to '/' which is the Drawer (Home)
            router.replace('/(drawer)/(tabs)');
        } catch (error) {
            console.error('Error saving onboarding:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <View style={{ alignItems: 'center', maxWidth: width * 0.8 }}>
                        <View style={{
                            width: 96,
                            height: 96,
                            backgroundColor: currentSlide.color,
                            borderRadius: 24,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 32,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.2,
                            shadowRadius: 16,
                            elevation: 10,
                            borderWidth: 4,
                            borderColor: '#fff'
                        }}>
                            <Icon size={40} color="#fff" />
                        </View>

                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: '#111827',
                            textAlign: 'center',
                            marginBottom: 12
                        }}>
                            {currentSlide.title}
                        </Text>

                        <Text style={{
                            color: '#6b7280',
                            textAlign: 'center',
                            lineHeight: 24,
                            fontSize: 16
                        }}>
                            {currentSlide.desc}
                        </Text>
                    </View>
                </View>

                <View style={{ padding: 32 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 32,
                        gap: 8
                    }}>
                        {slides.map((_, i) => (
                            <View
                                key={i}
                                style={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: i === slide ? currentSlide.color : '#e5e7eb',
                                    width: i === slide ? 32 : 8,
                                }}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (slide < slides.length - 1) {
                                setSlide(slide + 1);
                            } else {
                                handleOnboardingComplete();
                            }
                        }}
                        style={{
                            backgroundColor: '#3b82f6',
                            paddingVertical: 16,
                            borderRadius: 12,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 8,
                            shadowColor: '#3b82f6',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}>
                            {slide === slides.length - 1 ? "Get Started" : "Next"}
                        </Text>
                        <ChevronRight size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
