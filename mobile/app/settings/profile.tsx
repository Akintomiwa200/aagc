import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { User, Mail, Phone, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSettings() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem('church_app_user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    }

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
                            value={user?.name}
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
                            value={user?.email}
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
                            placeholder="City, Country"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
