import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import {
    Home, Calendar, BookOpen, Heart, User,
    Video, Gift, Book, FileText, Image as ImageIcon,
    Users, Info, Settings, LogOut
} from 'lucide-react-native';

export default function CustomDrawerContent(props: any) {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
        header: {
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
            alignItems: 'center',
            marginBottom: 10,
        },
        logoText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginTop: 10,
        },
        sectionLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#6B7280' : '#9CA3AF',
            marginLeft: 20,
            marginTop: 16,
            marginBottom: 8,
            textTransform: 'uppercase',
        },
        drawerItem: {
            borderRadius: 8,
            marginHorizontal: 10,
            marginVertical: 2,
        },
        drawerLabel: {
            fontSize: 14,
            fontWeight: '500',
            marginLeft: -16,
        },
        logoutButton: {
            marginTop: 'auto',
            marginBottom: 20,
            marginHorizontal: 20,
            padding: 12,
            borderRadius: 8,
            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        logoutText: {
            color: '#EF4444',
            fontWeight: '600',
        },
    });

    const menuItems = [
        { label: 'Home', icon: Home, route: '/(drawer)/(tabs)' }, // Go to tabs index
        { label: 'Events', icon: Calendar, route: '/(drawer)/(tabs)/events' },
        { label: 'Devotional', icon: BookOpen, route: '/(drawer)/(tabs)/devotional' },
        { label: 'Prayers', icon: Heart, route: '/(drawer)/(tabs)/prayers' },
    ];

    const resourcesItems = [
        { label: 'Sermons', icon: Video, route: '/(drawer)/sermons' },
        { label: 'Live Meet', icon: Video, route: '/(drawer)/live-meet' },
        { label: 'Giving', icon: Gift, route: '/(drawer)/giving' },
        { label: 'Bible', icon: Book, route: '/(drawer)/bible' },
        { label: 'Notes', icon: FileText, route: '/(drawer)/notes' },
        { label: 'Gallery', icon: ImageIcon, route: '/(drawer)/gallery' },
    ];

    const communityItems = [
        { label: 'Friends', icon: Users, route: '/(drawer)/friends' },
        { label: 'About', icon: Info, route: '/(drawer)/about' },
        { label: 'Settings', icon: Settings, route: '/(drawer)/settings' },
    ];

    const handleNavigation = (route: string) => {
        router.push(route as any);
        // Explicitly close drawer if the navigation prop is available (it is in props)
        if (props.navigation && props.navigation.closeDrawer) {
            props.navigation.closeDrawer();
        }
    };

    const renderItem = (item: any) => {
        const Icon = item.icon;
        const isActive = pathname === item.route;

        return (
            <DrawerItem
                key={item.route}
                label={item.label}
                icon={({ color, size }) => (
                    <Icon size={20} color={color} />
                )}
                focused={isActive}
                activeTintColor="#7C3AED"
                inactiveTintColor={isDark ? '#D1D5DB' : '#374151'}
                activeBackgroundColor={isDark ? '#7C3AED20' : '#F3E8FF'}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
                onPress={() => handleNavigation(item.route)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.header}>
                    {/* Placeholder Logo */}
                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 30 }}>✝️</Text>
                    </View>
                    <Text style={styles.logoText}>AAGC Mobile</Text>
                </View>

                <Text style={styles.sectionLabel}>Main</Text>
                {menuItems.map(renderItem)}

                <Text style={styles.sectionLabel}>Resources</Text>
                {resourcesItems.map(renderItem)}

                <Text style={styles.sectionLabel}>Community</Text>
                {communityItems.map(renderItem)}

            </DrawerContentScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
