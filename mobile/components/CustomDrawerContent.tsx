import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import { useSocket } from '../context/SocketContext';
import {
    Home, Calendar, BookOpen, Heart, User,
    Video, Gift, Book, FileText, Image as ImageIcon,
    Users, Info, Settings, LogOut, ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CustomDrawerContent(props: any) {
    const { colors, theme, isDark } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await apiService.getToken();
            setIsAuthenticated(!!token);
            if (token) {
                const userData = await AsyncStorage.getItem('church_app_user');
                if (userData) setUser(JSON.parse(userData));
            }
        };
        checkAuth();
    }, [pathname]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket || !user) return;

        const handleMemberUpdated = (member: any) => {
            if (member.id === user.id || member._id === user._id) {
                setUser(member);
                AsyncStorage.setItem('church_app_user', JSON.stringify(member));
            }
        };

        socket.on('member-updated', handleMemberUpdated);

        return () => {
            socket.off('member-updated', handleMemberUpdated);
        };
    }, [socket, user]);

    const handleLogout = async () => {
        await apiService.clearToken();
        await AsyncStorage.removeItem('church_app_user');
        setIsAuthenticated(false);
        setUser(null);
        router.replace('/login');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingTop: 40,
            paddingBottom: 24,
            paddingHorizontal: 20,
            backgroundColor: colors.primary,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            marginBottom: 16,
        },
        profileSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.3)',
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
        },
        userEmail: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: '800',
            color: colors.primary,
            marginLeft: 24,
            marginTop: 20,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            opacity: 0.8,
        },
        drawerItem: {
            borderRadius: 12,
            marginHorizontal: 12,
            marginVertical: 2,
            paddingHorizontal: 4,
        },
        drawerLabel: {
            fontSize: 15,
            fontWeight: '600',
            marginLeft: -8, // Adjusted for better spacing (previous was -16)
        },
        footer: {
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.card,
        },
        authButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderRadius: 12,
            gap: 12,
            justifyContent: 'center',
        },
        logoutButton: {
            backgroundColor: '#EF444415',
        },
        loginButton: {
            backgroundColor: colors.primary,
        },
        authText: {
            fontSize: 16,
            fontWeight: 'bold',
        }
    });

    const menuItems = [
        { label: 'Home', icon: Home, route: '/(drawer)/(tabs)' },
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
                    <Icon size={22} color={color} strokeWidth={isActive ? 2.5 : 2} />
                )}
                focused={isActive}
                activeTintColor={colors.primary}
                inactiveTintColor={colors.secondary}
                activeBackgroundColor={colors.primary + '10'}
                style={styles.drawerItem}
                labelStyle={[
                    styles.drawerLabel,
                    isActive && { color: colors.primary, fontWeight: 'bold' }
                ]}
                onPress={() => handleNavigation(item.route)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <User size={32} color="#FFFFFF" strokeWidth={1.5} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {isAuthenticated ? (user?.name || 'Believer') : 'AAGC Global'}
                        </Text>
                        <Text style={styles.userEmail}>
                            {isAuthenticated ? (user?.email || 'Active Member') : 'Welcome Home'}
                        </Text>
                    </View>
                </View>
            </View>

            <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionLabel}>Overview</Text>
                {menuItems.map(renderItem)}

                <Text style={styles.sectionLabel}>Spiritual Walk</Text>
                {resourcesItems.map(renderItem)}

                <Text style={styles.sectionLabel}>Connect</Text>
                {communityItems.map(renderItem)}

                <View style={{ height: 20 }} />
            </DrawerContentScrollView>

            <View style={styles.footer}>
                {isAuthenticated ? (
                    <TouchableOpacity
                        style={[styles.authButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <LogOut size={20} color="#EF4444" />
                        <Text style={[styles.authText, { color: '#EF4444' }]}>Logout</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.authButton, styles.loginButton]}
                        onPress={() => router.replace('/login')}
                    >
                        <LogOut size={20} color="#FFFFFF" />
                        <Text style={[styles.authText, { color: '#FFFFFF' }]}>Login / Sign Up</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
