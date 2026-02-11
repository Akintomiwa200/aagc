import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react-native';

export default function ProfileSettings() {
    const { colors } = useTheme();
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
            // Assuming apiService.updateUserProfile exists or using generic put
            await apiService.put(`/users/${user.id}/profile`, formData);

            const updatedUser = { ...user, ...formData };
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
        header: {
            padding: 20,
            alignItems: 'center',
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        form: {
            padding: 20,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.secondary,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        input: {
            flex: 1,
            paddingVertical: 12,
            marginLeft: 12,
            fontSize: 16,
            color: colors.text,
        },
        saveButton: {
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
        },
        saveButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <User size={48} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{user?.name || 'Believer'}</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <User size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Your Name"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <Mail size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            placeholder="Your Email"
                            keyboardType="email-address"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Phone size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            placeholder="+1 234 567 890"
                            keyboardType="phone-pad"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <View style={styles.inputWrapper}>
                        <MapPin size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                            placeholder="City, Country"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, saving && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
