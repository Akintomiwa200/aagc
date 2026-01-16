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
    Users, Info, Settings, LogOut, ChevronRight,
    Bell, MessageCircle, Globe, Shield, Zap
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CustomDrawerContent(props: any) {
    const { colors, theme } = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [prayerCount, setPrayerCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await apiService.getToken();
            setIsAuthenticated(!!token);
            if (token) {
                const userData = await AsyncStorage.getItem('church_app_user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);

                    // Fetch user-specific data
                    try {
                        const [prayers, notifications] = await Promise.all([
                            apiService.getUserPrayers(),
                            apiService.getNotifications(user.id)
                        ]);
                        setPrayerCount(prayers?.length || 0);
                        const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;
                        setNotificationCount(unreadCount);
                    } catch (error) {
                        console.log('Error fetching user data:', error);
                    }
                }
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

        const handlePrayerUpdate = (data: any) => {
            if (data.userId === user.id || data.userId === user._id) {
                setPrayerCount(prev => prev + 1);
            }
        };

        socket.on('member-updated', handleMemberUpdated);
        socket.on('prayer-created', handlePrayerUpdate);
        socket.on('notification-created', () => {
            setNotificationCount(prev => prev + 1);
        });

        return () => {
            socket.off('member-updated', handleMemberUpdated);
            socket.off('prayer-added', handlePrayerUpdate);
            socket.off('notification-added');
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
            paddingTop: 60,
            paddingBottom: 24,
            paddingHorizontal: 24,
            borderBottomWidth: 1,
            borderBottomColor: colors.border + '30',
            marginBottom: 8,
        },
        profileSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.primary + '30',
        },
        userInfo: {
            flex: 1,
        },
        userName: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
        },
        userEmail: {
            fontSize: 13,
            color: colors.secondary,
            fontWeight: '400',
        },
        userStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border + '30',
        },
        statusItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        statusText: {
            fontSize: 12,
            color: colors.secondary,
            fontWeight: '500',
        },
        sectionLabel: {
            fontSize: 11,
            fontWeight: '600',
            color: colors.primary,
            marginLeft: 28,
            marginTop: 24,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 1,
            opacity: 0.6,
        },
        drawerItem: {
            borderRadius: 12,
            marginHorizontal: 12,
            marginVertical: 4,
            paddingHorizontal: 12,
        },
        drawerItemContent: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        drawerIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        drawerLabel: {
            fontSize: 15,
            fontWeight: '500',
            flex: 1,
        },
        badge: {
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingHorizontal: 6,
            paddingVertical: 2,
            minWidth: 20,
            alignItems: 'center',
        },
        badgeText: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '600',
        },
        activeIndicator: {
            width: 4,
            height: 20,
            borderRadius: 2,
            backgroundColor: colors.primary,
            position: 'absolute',
            left: 0,
        },
        footer: {
            padding: 24,
            paddingBottom: 34,
            borderTopWidth: 1,
            borderTopColor: colors.border + '30',
        },
        authButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1,
        },
        logoutButton: {
            borderColor: colors.border,
            backgroundColor: 'transparent',
        },
        loginButton: {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        authText: {
            fontSize: 15,
            fontWeight: '600',
        },
        versionText: {
            textAlign: 'center',
            fontSize: 11,
            color: colors.secondary + '80',
            marginTop: 16,
            fontWeight: '400',
        }
    });

    const menuItems = [
        {
            label: 'Home',
            icon: Home,
            route: '/(drawer)/(tabs)',
            badge: notificationCount > 0 ? notificationCount : undefined
        },
        { label: 'Events', icon: Calendar, route: '/(drawer)/(tabs)/events' },
        { label: 'Devotional', icon: BookOpen, route: '/(drawer)/(tabs)/devotional' },
        {
            label: 'Prayers',
            icon: Heart,
            route: '/(drawer)/(tabs)/prayers',
            badge: prayerCount > 0 ? prayerCount : undefined
        },
    ];

    const resourcesItems = [
        { label: 'Sermons', icon: Video, route: '/(drawer)/sermons' },
        { label: 'Live Stream', icon: Zap, route: '/(drawer)/live-meet' },
        { label: 'Give', icon: Gift, route: '/(drawer)/giving' },
        { label: 'Bible', icon: Book, route: '/(drawer)/bible' },
        { label: 'Notes', icon: FileText, route: '/(drawer)/notes' },
        { label: 'Media', icon: ImageIcon, route: '/(drawer)/gallery' },
    ];

    const communityItems = [
        { label: 'Community', icon: Users, route: '/(drawer)/friends' },
        { label: 'Messages', icon: MessageCircle, route: '/(drawer)/messages' },
        { label: 'About', icon: Info, route: '/(drawer)/about' },
        { label: 'Settings', icon: Settings, route: '/(drawer)/settings' },
    ];

    const handleNavigation = (route: string) => {
        router.push(route as any);
        if (props.navigation && props.navigation.closeDrawer) {
            props.navigation.closeDrawer();
        }

        // Reset notification count if going to home
        if (route === '/(drawer)/(tabs)' && notificationCount > 0) {
            setNotificationCount(0);
        }
    };

    const CustomDrawerItem = ({ item }: { item: any }) => {
        const Icon = item.icon;
        const isActive = pathname === item.route;

        return (
            <TouchableOpacity
                style={[styles.drawerItem, isActive && {
                    backgroundColor: colors.primary + '08',
                }]}
                onPress={() => handleNavigation(item.route)}
            >
                <View style={styles.drawerItemContent}>
                    {isActive && <View style={styles.activeIndicator} />}
                    <View style={[
                        styles.drawerIconContainer,
                        { backgroundColor: isActive ? colors.primary + '15' : colors.border + '20' }
                    ]}>
                        <Icon
                            size={20}
                            color={isActive ? colors.primary : colors.secondary}
                            strokeWidth={isActive ? 2.2 : 1.8}
                        />
                    </View>
                    <Text style={[
                        styles.drawerLabel,
                        { color: isActive ? colors.primary : colors.text }
                    ]}>
                        {item.label}
                    </Text>
                    {item.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <User size={28} color={colors.primary} strokeWidth={1.8} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {isAuthenticated ? (user?.name || 'Believer') : 'Guest User'}
                        </Text>
                        <Text style={styles.userEmail} numberOfLines={1}>
                            {isAuthenticated ? (user?.email || 'Tap to login') : 'Welcome to AAGC'}
                        </Text>
                    </View>
                </View>

                {isAuthenticated && (
                    <View style={styles.userStatus}>
                        <View style={styles.statusItem}>
                            <Bell size={14} color={colors.secondary} />
                            <Text style={styles.statusText}>{notificationCount} alerts</Text>
                        </View>
                        <View style={styles.statusItem}>
                            <Heart size={14} color={colors.secondary} />
                            <Text style={styles.statusText}>{prayerCount} prayers</Text>
                        </View>
                        <View style={styles.statusItem}>
                            <Shield size={14} color={colors.secondary} />
                            <Text style={styles.statusText}>Member</Text>
                        </View>
                    </View>
                )}
            </View>

            <DrawerContentScrollView
                {...props}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <Text style={styles.sectionLabel}>Navigation</Text>
                {menuItems.map((item, index) => (
                    <CustomDrawerItem key={index} item={item} />
                ))}

                <Text style={styles.sectionLabel}>Resources</Text>
                {resourcesItems.map((item, index) => (
                    <CustomDrawerItem key={index} item={item} />
                ))}

                <Text style={styles.sectionLabel}>Community</Text>
                {communityItems.map((item, index) => (
                    <CustomDrawerItem key={index} item={item} />
                ))}

                <View style={{ height: 40 }} />
            </DrawerContentScrollView>

            <View style={styles.footer}>
                {isAuthenticated ? (
                    <TouchableOpacity
                        style={[styles.authButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <LogOut size={18} color={colors.text} />
                        <Text style={[styles.authText, { color: colors.text }]}>
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.authButton, styles.loginButton]}
                        onPress={() => {
                            router.replace('/login');
                            props.navigation?.closeDrawer();
                        }}
                    >
                        <User size={18} color="#FFFFFF" />
                        <Text style={[styles.authText, { color: '#FFFFFF' }]}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.versionText}>
                    AAGC Global • v1.0.0
                </Text>
            </View>
        </View>
    );
}