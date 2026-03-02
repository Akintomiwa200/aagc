import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, FileText, Camera } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/apiService';
import { toast } from 'sonner-native';

export default function EditProfileScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.getMe();
                setUserData(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    bio: data.bio || '',
                    avatar: data.avatar || '',
                });
            } catch (error) {
                toast.error('Failed to fetch profile data.');
                console.error(error);
                router.back();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiService.updateUserProfile(userData.id, formData);
            toast.success('Profile updated successfully!');
            router.back();
        } catch (error) {
            toast.error('Failed to update profile.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        cancelText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            fontSize: 16,
        },
        saveText: {
            color: '#7C3AED',
            fontWeight: 'bold',
            fontSize: 16,
        },
        content: {
            padding: 20,
        },
        avatarContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#7C3AED',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            borderWidth: 4,
            borderColor: isDark ? '#000000' : '#FFFFFF',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 'bold',
        },
        avatarImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
        },
        changePhotoText: {
            color: '#7C3AED',
            fontWeight: '600',
            fontSize: 14,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            paddingHorizontal: 16,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            paddingVertical: 12,
            color: isDark ? '#FFFFFF' : '#111827',
            fontSize: 16,
        },
        textAreaWrapper: {
            alignItems: 'flex-start',
            paddingVertical: 12,
            height: 100,
        },
        textArea: {
            textAlignVertical: 'top',
        },
        disabledInput: {
            opacity: 0.6,
        },
    });

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator size="small" color="#7C3AED" /> : <Text style={styles.saveText}>Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity style={styles.avatar}>
                        {formData.avatar ? (
                            <Image source={{ uri: formData.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{formData.name.charAt(0).toUpperCase()}</Text>
                        )}
                        <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: isDark ? '#374151' : '#F3F4F6', padding: 6, borderRadius: 12 }}>
                            <Camera size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Your Name"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, styles.disabledInput]}>
                        <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            editable={false}
                            placeholder="email@example.com"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.inputWrapper}>
                        <Phone size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            placeholder="+1 234 567 8900"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <View style={styles.inputWrapper}>
                        <MapPin size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                            placeholder="City, Country"
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                        <FileText size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={[styles.inputIcon, { marginTop: 4 }]} />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            placeholder="Tell us a bit about yourself..."
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
