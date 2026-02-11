import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { Moon, Bell, Type, Shield, CircleHelp as HelpCircle, Info, User, Lock, Eye, Languages, Database, LogOut, ChevronRight, Zap, Heart } from 'lucide-react-native';

export default function SettingsScreen() {
    const { theme, toggleTheme, colors } = useTheme();
    const { settings, updateSettings } = useSettings();
    const router = useRouter();
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        section: {
            marginTop: 24,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '700',
            color: colors.primary,
            marginLeft: 20,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
        },
        menuContainer: {
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            marginLeft: 16,
        },
        settingItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        iconContainer: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        settingLabel: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
            fontWeight: '500',
        },
        settingValue: {
            fontSize: 14,
            color: colors.secondary,
            marginRight: 8,
        },
        logoutButton: {
            margin: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#EF444415',
        },
        logoutText: {
            color: '#EF4444',
            fontWeight: 'bold',
            fontSize: 16,
        }
    });

    const SettingRow = ({ icon: Icon, label, value, onPress, hasSwitch, switchValue, onSwitchChange, isLast }: any) => (
        <TouchableOpacity
            style={[styles.settingItem, !isLast && styles.settingItemBorder]}
            onPress={onPress}
            disabled={hasSwitch}
        >
            <View style={styles.iconContainer}>
                <Icon size={18} color={colors.primary} />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
            {value && <Text style={styles.settingValue}>{value}</Text>}
            {hasSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
                />
            ) : (
                <ChevronRight size={18} color={colors.border} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <View style={styles.menuContainer}>
                        <SettingRow
                            icon={User}
                            label="Personal Information"
                            onPress={() => router.push('/settings/profile')}
                        />
                        <SettingRow
                            icon={Lock}
                            label="Security & Password"
                            onPress={() => router.push('/settings/security')}
                        />
                        <SettingRow icon={Languages} label="Language" value="English" isLast />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Appearance</Text>
                    <View style={styles.menuContainer}>
                        <SettingRow
                            icon={Moon}
                            label="Dark Mode"
                            hasSwitch
                            switchValue={isDark}
                            onSwitchChange={toggleTheme}
                        />
                        <SettingRow icon={Type} label="Text Size" value="Default" isLast />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.menuContainer}>
                        <SettingRow
                            icon={Bell}
                            label="Push Notifications"
                            hasSwitch
                            switchValue={settings.pushNotifications}
                            onSwitchChange={(val: boolean) => updateSettings({ pushNotifications: val })}
                        />
                        <SettingRow
                            icon={Zap}
                            label="Spiritual Growth Alerts"
                            hasSwitch
                            switchValue={settings.spiritualGrowthAlerts}
                            onSwitchChange={(val: boolean) => updateSettings({ spiritualGrowthAlerts: val })}
                        />
                        <SettingRow
                            icon={Heart}
                            label="Community Event Alerts"
                            hasSwitch
                            switchValue={settings.communityEventAlerts}
                            onSwitchChange={(val: boolean) => updateSettings({ communityEventAlerts: val })}
                            isLast
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Data</Text>
                    <View style={styles.menuContainer}>
                        <SettingRow
                            icon={Eye}
                            label="Privacy Center"
                            onPress={() => router.push('/settings/privacy')}
                            isLast
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.menuContainer}>
                        <SettingRow
                            icon={Info}
                            label="About AAGC App"
                            value="v1.0.0"
                            onPress={() => router.push('/(drawer)/about')}
                            isLast
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
