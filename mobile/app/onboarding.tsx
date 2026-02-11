import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Globe, Zap, Heart, CheckCircle, ChevronRight, Bell, Target, Shield } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const [slide, setSlide] = useState(0);
    const [preferences, setPreferences] = useState({
        notifications: true,
        spiritualGrowth: true,
        communityEvents: true,
    });

    const slides = [
        {
            id: 1,
            title: "Welcome Home",
            desc: "Join the Apostolic Army Global Church family where every soul finds a place.",
            icon: Globe,
            color: "#7C3AED" // Premium Purple
        },
        {
            id: 2,
            title: "Prophetic Insight",
            desc: "Experience the supernatural move of God with daily prophetic guidance.",
            icon: Zap,
            color: "#F59E0B" // Amber
        },
        {
            id: 3,
            title: "Global Community",
            desc: "Connect with believers globally. Iron sharpens iron in our digital fellowship.",
            icon: Heart,
            color: "#EF4444" // Red
        },
        {
            id: 4,
            title: "Faith Journey",
            desc: "Personalized Bible study and prayer tools to fuel your spiritual growth.",
            icon: CheckCircle,
            color: "#10B981" // Emerald
        },
        {
            id: 5,
            title: "Stay Connected",
            desc: "Choose how you want to interact with the community in real-time.",
            isPersonalization: true,
            icon: Bell,
            color: "#6366F1" // Indigo
        }
    ];

    const currentSlide = slides[slide];
    const Icon = currentSlide.icon;

    const handleOnboardingComplete = async () => {
        try {
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
            router.replace('/(drawer)/(tabs)');
        } catch (error) {
            console.error('Error saving onboarding:', error);
        }
    };

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                    <View style={{ alignItems: 'center', width: '100%', maxWidth: width * 0.85 }}>
                        <View style={{
                            width: 100,
                            height: 100,
                            backgroundColor: currentSlide.color + '15',
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 40,
                            borderWidth: 1,
                            borderColor: currentSlide.color + '30'
                        }}>
                            <Icon size={44} color={currentSlide.color} />
                        </View>

                        <Text style={{
                            fontSize: 28,
                            fontWeight: '800',
                            color: '#111827',
                            textAlign: 'center',
                            marginBottom: 16,
                            letterSpacing: -0.5
                        }}>
                            {currentSlide.title}
                        </Text>

                        {!currentSlide.isPersonalization ? (
                            <Text style={{
                                color: '#4B5563',
                                textAlign: 'center',
                                lineHeight: 26,
                                fontSize: 17,
                                fontWeight: '400'
                            }}>
                                {currentSlide.desc}
                            </Text>
                        ) : (
                            <View style={{ width: '100%', gap: 12, marginTop: 10 }}>
                                <TouchableOpacity
                                    style={prefStyle(preferences.notifications, currentSlide.color)}
                                    onPress={() => togglePreference('notifications')}
                                >
                                    <Bell size={20} color={preferences.notifications ? '#FFFFFF' : '#6B7280'} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={prefText(preferences.notifications)}>Real-time Alerts</Text>
                                        <Text style={prefSubText(preferences.notifications)}>Get prophetic notifications</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={prefStyle(preferences.spiritualGrowth, currentSlide.color)}
                                    onPress={() => togglePreference('spiritualGrowth')}
                                >
                                    <Target size={20} color={preferences.spiritualGrowth ? '#FFFFFF' : '#6B7280'} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={prefText(preferences.spiritualGrowth)}>Spiritual Growth</Text>
                                        <Text style={prefSubText(preferences.spiritualGrowth)}>Personalized Bible study</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={prefStyle(preferences.communityEvents, currentSlide.color)}
                                    onPress={() => togglePreference('communityEvents')}
                                >
                                    <Heart size={20} color={preferences.communityEvents ? '#FFFFFF' : '#6B7280'} />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={prefText(preferences.communityEvents)}>Global Events</Text>
                                        <Text style={prefSubText(preferences.communityEvents)}>Connect with fellowship</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ padding: 32 }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 40,
                        gap: 10
                    }}>
                        {slides.map((_, i) => (
                            <View
                                key={i}
                                style={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: i === slide ? currentSlide.color : '#E5E7EB',
                                    width: i === slide ? 30 : 6,
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
                            backgroundColor: currentSlide.color,
                            paddingVertical: 18,
                            borderRadius: 16,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 10,
                            shadowColor: currentSlide.color,
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.25,
                            shadowRadius: 20,
                            elevation: 8
                        }}
                        activeOpacity={0.9}
                    >
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 18,
                            fontWeight: '700'
                        }}>
                            {slide === slides.length - 1 ? "Start Experience" : "Continue"}
                        </Text>
                        <ChevronRight size={22} color="#FFFFFF" strokeWidth={3} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const prefStyle = (active: boolean, color: string): any => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: active ? color : '#E5E7EB',
    backgroundColor: active ? color : '#F9FAFB',
});

const prefText = (active: boolean): any => ({
    fontSize: 16,
    fontWeight: '700',
    color: active ? '#FFFFFF' : '#111827',
});

const prefSubText = (active: boolean): any => ({
    fontSize: 12,
    color: active ? 'rgba(255,255,255,0.8)' : '#6B7280',
    marginTop: 2,
});
