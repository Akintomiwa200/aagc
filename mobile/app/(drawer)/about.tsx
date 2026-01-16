import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Globe, Mail, Phone, MapPin, Clock, Heart, Users, Youtube, Facebook, Instagram, Map } from 'lucide-react-native';
import { CHURCH_BRANCHES } from '@/constants';
import { ChurchBranch } from '@/types';


export default function AboutScreen() {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        content: {
            padding: 20,
            paddingBottom: 40,
        },
        headerImage: {
            width: '100%',
            height: 200,
            borderRadius: 24,
            marginBottom: 24,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        headerOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
        },
        section: {
            marginBottom: 32,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.primary,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginBottom: 16,
        },
        text: {
            fontSize: 16,
            lineHeight: 26,
            color: colors.secondary,
            marginBottom: 16,
        },
        infoCard: {
            backgroundColor: colors.card,
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            gap: 12,
        },
        infoText: {
            fontSize: 16,
            color: colors.text,
            flex: 1,
        },
        socialContainer: {
            flexDirection: 'row',
            gap: 16,
            marginTop: 8,
        },
        socialIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
        },
        featureGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        featureItem: {
            width: '48%',
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        featureTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.text,
            marginTop: 8,
            textAlign: 'center',
        },
        branchCard: {
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        branchName: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        branchAddress: {
            fontSize: 14,
            color: colors.secondary,
            marginBottom: 8,
        },
        mapButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary + '15',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignSelf: 'flex-start',
            gap: 8,
        },
        mapButtonText: {
            color: colors.primary,
            fontWeight: '600',
            fontSize: 14,
        },
        liveMapButton: {
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            borderRadius: 16,
            gap: 12,
            marginTop: 8,
        },
        liveMapButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        }
    });

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const openBranchInMap = (branch: ChurchBranch) => {
        const { latitude, longitude } = branch.coordinates;
        const label = branch.name;
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}(${label})`
        }) || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const openLiveMap = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=Apostolic+Army+Global+Church`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerImage}>
                    <View style={styles.headerOverlay}>
                        <Text style={styles.headerTitle}>AAGC</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', letterSpacing: 2 }}>GLOBAL CHURCH</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Our Story</Text>
                    <Text style={styles.title}>About AAGC</Text>
                    <Text style={styles.text}>
                        Apostolic Army Global Church is a ministry founded on the principles of the Word of God, led by the Holy Spirit. We are a community dedicated to the supernatural move of God, focusing on prayer, the prophetic, and empowerment.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Mission & Vision</Text>
                    <View style={styles.featureGrid}>
                        <View style={styles.featureItem}>
                            <Heart size={24} color={colors.primary} />
                            <Text style={styles.featureTitle}>Love God & People</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Users size={24} color={colors.primary} />
                            <Text style={styles.featureTitle}>Build Community</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Globe size={24} color={colors.primary} />
                            <Text style={styles.featureTitle}>Global Outreach</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MapPin size={24} color={colors.primary} />
                            <Text style={styles.featureTitle}>Locally Rooted</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Worship With Us</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Clock size={20} color={colors.primary} />
                            <View>
                                <Text style={{ fontWeight: 'bold', color: colors.text }}>Sunday Service</Text>
                                <Text style={{ color: colors.secondary }}>10:00 AM - Main Auditorium</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <Clock size={20} color={colors.primary} />
                            <View>
                                <Text style={{ fontWeight: 'bold', color: colors.text }}>Mid-Week Service</Text>
                                <Text style={{ color: colors.secondary }}>Wednesday 6:00 PM - Virtual & In-Person</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Global Presence</Text>
                    <Text style={styles.title}>Our Branches</Text>
                    <Text style={styles.text}>
                        We have a growing global presence. Join us at any of our branches for a life-changing encounter.
                    </Text>

                    {CHURCH_BRANCHES.map((branch) => (
                        <View key={branch.id} style={styles.branchCard}>
                            <Text style={styles.branchName}>{branch.name}</Text>
                            <Text style={styles.branchAddress}>{branch.address}</Text>
                            <TouchableOpacity
                                style={styles.mapButton}
                                onPress={() => openBranchInMap(branch)}
                            >
                                <MapPin size={16} color={colors.primary} />
                                <Text style={styles.mapButtonText}>Directions</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.liveMapButton} onPress={openLiveMap}>
                        <Map size={24} color="#FFFFFF" />
                        <Text style={styles.liveMapButtonText}>Live Global Map</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.subtitle}>Contact & Social</Text>
                    <View style={styles.infoCard}>
                        <TouchableOpacity style={styles.infoRow} onPress={() => openLink('tel:5551234567')}>
                            <Phone size={20} color={colors.primary} />
                            <Text style={styles.infoText}>(555) 123-4567</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.infoRow} onPress={() => openLink('mailto:info@aagc-church.org')}>
                            <Mail size={20} color={colors.primary} />
                            <Text style={styles.infoText}>info@aagc-church.org</Text>
                        </TouchableOpacity>
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://youtube.com')}>
                                <Youtube size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://facebook.com')}>
                                <Facebook size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialIcon} onPress={() => openLink('https://instagram.com')}>
                                <Instagram size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
