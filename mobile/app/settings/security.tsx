import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';

export default function SecuritySettings() {
    const { colors } = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        section: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
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
        updateButton: {
            backgroundColor: colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 10,
        },
        updateButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Change Password</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password</Text>
                    <View style={styles.inputWrapper}>
                        <Lock size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputWrapper}>
                        <Lock size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <View style={styles.inputWrapper}>
                        <Lock size={20} color={colors.secondary} />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            placeholder="••••••••"
                            placeholderTextColor={colors.border}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 }}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={18} color={colors.primary} /> : <Eye size={18} color={colors.primary} />}
                    <Text style={{ color: colors.primary, fontWeight: '600' }}>Show Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>Update Password</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { borderTopWidth: 1, borderTopColor: colors.border }]}>
                <Text style={styles.sectionTitle}>Security Features</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 16, borderRadius: 12, gap: 12 }}>
                    <ShieldCheck size={24} color={colors.primary} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>Two-Factor Authentication</Text>
                        <Text style={{ fontSize: 12, color: colors.secondary }}>Add an extra layer of security</Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Enable</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
