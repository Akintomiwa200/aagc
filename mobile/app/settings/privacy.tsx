import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { Eye, Shield, Share2, Globe } from 'lucide-react-native';

export default function PrivacySettings() {
    const { colors } = useTheme();
    const { settings, updateSettings } = useSettings();

    const toggleSwitch = (key: keyof typeof settings) => {
        updateSettings({ [key]: !settings[key as keyof typeof settings] });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        section: {
            padding: 20,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        iconBox: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        info: {
            flex: 1,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        description: {
            fontSize: 12,
            color: colors.secondary,
        }
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Globe size={20} color={colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>Public Profile</Text>
                        <Text style={styles.description}>Let others see your profile details</Text>
                    </View>
                    <Switch
                        value={settings.profilePublic}
                        onValueChange={() => toggleSwitch('profilePublic')}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Eye size={20} color={colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>Show Online Status</Text>
                        <Text style={styles.description}>Others can see when you're active</Text>
                    </View>
                    <Switch
                        value={settings.showOnlineStatus}
                        onValueChange={() => toggleSwitch('showOnlineStatus')}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Share2 size={20} color={colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>Social Tagging</Text>
                        <Text style={styles.description}>Allow friends to tag you in posts</Text>
                    </View>
                    <Switch
                        value={settings.socialTagging}
                        onValueChange={() => toggleSwitch('socialTagging')}
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.iconBox}>
                        <Shield size={20} color={colors.primary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>Usage Analytics</Text>
                        <Text style={styles.description}>Share app usage data to help us improve</Text>
                    </View>
                    <Switch
                        value={settings.usageAnalytics}
                        onValueChange={() => toggleSwitch('usageAnalytics')}
                    />
                </View>
            </View>
        </ScrollView>
    );
}
