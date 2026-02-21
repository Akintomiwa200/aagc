import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import { User, Mail, Phone, MapPin, CheckCircle, Camera, Edit2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileSettings() {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        if (!user?.id) return;
        try {
            setSaving(true);
            const updatedProfile = await apiService.put<any>(`/users/${user.id}`, formData);

            const updatedUser = { ...user, ...(updatedProfile.user || updatedProfile) };
            updateUser(updatedUser);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        headerGradient: {
            height: 180,
            width: '100%',
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            position: 'absolute',
            top: 0,
            left: 0,
        },
        headerContent: {
            alignItems: 'center',
            marginTop: 80,
            marginBottom: 30,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: colors.background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 10,
        },
        cameraButton: {
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: colors.primary,
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: colors.background,
        },
        nameText: {
            fontSize: 26,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 16,
            letterSpacing: 0.5,
        },
        roleText: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginTop: 4,
        },
        formCard: {
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 24,
            marginHorizontal: 20,
            marginTop: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: colors.border,
        },
        inputGroup: {
            marginBottom: 24,
        },
        label: {
            fontSize: 13,
            fontWeight: 'bold',
            color: colors.secondary,
            marginBottom: 8,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
            borderRadius: 16,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
            overflow: 'hidden',
        },
        input: {
            flex: 1,
            paddingVertical: 16,
            marginLeft: 12,
            fontSize: 16,
            color: colors.text,
        },
        saveButton: {
            backgroundColor: colors.primary,
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 10,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        iconWrapper: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
        }
    });

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={isDark ? ['#1F2937', colors.background] : [colors.primary + '30', colors.background]}
                    style={styles.headerGradient}
                />

                <View style={styles.headerContent}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {user?.avatar ? (
                                <Image source={{ uri: user.avatar }} style={{ width: 112, height: 112, borderRadius: 56 }} />
                            ) : (
                                <User size={56} color={colors.primary} />
                            )}
                        </View>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.nameText}>{user?.name || 'Believer'}</Text>
                    <Text style={styles.roleText}>{user?.role || 'Member'}</Text>
                </View>

                <View style={[styles.formCard, { marginBottom: 40 }]}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.iconWrapper}>
                                <User size={18} color={colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Your Name"
                                placeholderTextColor={colors.border}
                            />
                            <Edit2 size={16} color={colors.border} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.iconWrapper}>
                                <Mail size={18} color={colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="Your Email"
                                keyboardType="email-address"
                                placeholderTextColor={colors.border}
                                autoCapitalize="none"
                            />
                            <Edit2 size={16} color={colors.border} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.iconWrapper}>
                                <Phone size={18} color={colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                placeholder="+1 234 567 890"
                                keyboardType="phone-pad"
                                placeholderTextColor={colors.border}
                            />
                            <Edit2 size={16} color={colors.border} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.inputWrapper}>
                            <View style={styles.iconWrapper}>
                                <MapPin size={18} color={colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                value={formData.location}
                                onChangeText={(text) => setFormData({ ...formData, location: text })}
                                placeholder="City, Country"
                                placeholderTextColor={colors.border}
                            />
                            <Edit2 size={16} color={colors.border} />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, saving && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
