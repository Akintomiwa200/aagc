import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { User, Mail, Phone, Info, MessageSquare, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

import { apiService } from '../services/apiService';

export default function FirstTimerScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        heardFrom: '',
        interestedIn: [] as string[],
    });

    const interests = [
        'Pastor Visit',
        'Small Groups',
        'Serving',
        'Baptism',
        'Church Membership',
    ];

    const toggleInterest = (interest: string) => {
        if (formData.interestedIn.includes(interest)) {
            setFormData({
                ...formData,
                interestedIn: formData.interestedIn.filter((i) => i !== interest),
            });
        } else {
            setFormData({
                ...formData,
                interestedIn: [...formData.interestedIn, interest],
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Required Fields', 'Please enter your name and email to proceed.');
            return;
        }

        setLoading(true);
        try {
            await apiService.submitConnectionCard(formData);
            setSubmitted(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit connection card. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 40,
        },
        header: {
            alignItems: 'center',
            marginBottom: 32,
            marginTop: 20,
        },
        welcomeTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            textAlign: 'center',
            marginBottom: 8,
        },
        welcomeSubtitle: {
            fontSize: 16,
            color: '#7C3AED',
            fontWeight: '600',
            textAlign: 'center',
            letterSpacing: 1.2,
        },
        card: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        infoTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 16,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
            borderRadius: 12,
            paddingHorizontal: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        input: {
            flex: 1,
            paddingVertical: 12,
            marginLeft: 12,
            color: isDark ? '#FFFFFF' : '#111827',
        },
        sectionLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 12,
            marginTop: 8,
        },
        interestGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 20,
        },
        interestChip: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        interestChipActive: {
            backgroundColor: '#7C3AED',
            borderColor: '#7C3AED',
        },
        interestText: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        interestTextActive: {
            color: '#FFFFFF',
        },
        submitButton: {
            backgroundColor: '#7C3AED',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        submitButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
        successContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        },
        successTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginTop: 24,
            marginBottom: 12,
            textAlign: 'center',
        },
        successText: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
        },
        churchInfoCard: {
            backgroundColor: '#7C3AED10',
            borderRadius: 20,
            padding: 20,
            borderWidth: 1,
            borderColor: '#7C3AED30',
            marginTop: 24,
        },
        churchInfoTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginBottom: 8,
        },
        churchInfoText: {
            fontSize: 14,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 20,
        },
    });

    if (submitted) {
        return (
            <View style={[styles.container, styles.successContainer]}>
                <CheckCircle2 size={80} color="#10B981" />
                <Text style={styles.successTitle}>Welcome to the Family!</Text>
                <Text style={styles.successText}>
                    We're so glad you joined us today. Someone from our welcome team will be in touch with you soon to answer any questions you may have.
                </Text>
                <TouchableOpacity style={styles.submitButton} onPress={() => setSubmitted(false)}>
                    <Text style={[styles.submitButtonText, { paddingHorizontal: 40 }]}>Done</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.welcomeTitle}>Welcome Home</Text>
                    <Text style={styles.welcomeSubtitle}>WE'RE HONORED YOU'RE HERE</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.infoTitle}>Tell us about yourself</Text>

                    <View style={styles.inputWrapper}>
                        <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Phone size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number (Optional)"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Info size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        <TextInput
                            style={styles.input}
                            placeholder="How did you hear about us?"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            value={formData.heardFrom}
                            onChangeText={(text) => setFormData({ ...formData, heardFrom: text })}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>I'm interested in...</Text>
                    <View style={styles.interestGrid}>
                        {interests.map((interest) => (
                            <TouchableOpacity
                                key={interest}
                                style={[
                                    styles.interestChip,
                                    formData.interestedIn.includes(interest) && styles.interestChipActive,
                                ]}
                                onPress={() => toggleInterest(interest)}
                            >
                                <Text
                                    style={[
                                        styles.interestText,
                                        formData.interestedIn.includes(interest) && styles.interestTextActive,
                                    ]}
                                >
                                    {interest}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit Connection Card'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.churchInfoCard}>
                    <Text style={styles.churchInfoTitle}>Service Times</Text>
                    <Text style={styles.churchInfoText}>
                        • Sundays: 10:00 AM (Main Worship){'\n'}
                        • Wednesdays: 6:00 PM (Bible Study){'\n'}
                        • Fridays: 7:00 PM (Prayer Meeting)
                    </Text>
                </View>

                <View style={[styles.churchInfoCard, { marginTop: 16 }]}>
                    <Text style={styles.churchInfoTitle}>Location</Text>
                    <Text style={styles.churchInfoText}>
                        123 Apostolic Way, Global Heights{'\n'}
                        Connect with us on social media @aagc_church
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
