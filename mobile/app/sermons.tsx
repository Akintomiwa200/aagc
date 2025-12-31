import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search, Play, Download, Share2, Clock, User } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';

export default function SermonsScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');
    const [sermons, setSermons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSermons = async () => {
            try {
                const data = await apiService.getSermons();
                setSermons(data);
            } catch (error) {
                console.error('Failed to fetch sermons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSermons();
    }, []);

    const filteredSermons = sermons.filter(sermon =>
        (sermon.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (sermon.speaker?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (sermon.series?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const displaySermons = activeTab === 'popular'
        ? [...filteredSermons].sort((a, b) => (b.views || 0) - (a.views || 0))
        : filteredSermons;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 100,
        },
        header: {
            marginBottom: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 14,
            color: '#7C3AED',
            fontWeight: '600',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            padding: 12,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            color: isDark ? '#FFFFFF' : '#111827',
        },
        tabContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 20,
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 2,
        },
        tabInactive: {
            borderColor: isDark ? '#374151' : '#E5E7EB',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        tabActive: {
            borderColor: '#7C3AED',
            backgroundColor: '#7C3AED20',
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
        },
        tabTextInactive: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        tabTextActive: {
            color: '#7C3AED',
        },
        sermonCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            overflow: 'hidden',
        },
        thumbnailContainer: {
            height: 160,
            backgroundColor: '#7C3AED20',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        thumbnailEmoji: {
            fontSize: 64,
        },
        playButton: {
            position: 'absolute',
            backgroundColor: '#7C3AED',
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
        },
        sermonContent: {
            padding: 16,
        },
        sermonTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 8,
        },
        sermonSeries: {
            fontSize: 12,
            color: '#7C3AED',
            fontWeight: '600',
            marginBottom: 8,
        },
        sermonMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginBottom: 12,
        },
        metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        metaText: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        actionContainer: {
            flexDirection: 'row',
            gap: 8,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        actionButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
        },
        actionText: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyText: {
            fontSize: 16,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Sermons</Text>
                <Text style={styles.subtitle}>MESSAGES THAT TRANSFORM</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search sermons..."
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'recent' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => setActiveTab('recent')}
                >
                    <Text style={[styles.tabText, activeTab === 'recent' ? styles.tabTextActive : styles.tabTextInactive]}>
                        Recent
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'popular' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => setActiveTab('popular')}
                >
                    <Text style={[styles.tabText, activeTab === 'popular' ? styles.tabTextActive : styles.tabTextInactive]}>
                        Popular
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Sermon List */}
            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : displaySermons.length > 0 ? (
                displaySermons.map((sermon) => (
                    <TouchableOpacity key={sermon.id} style={styles.sermonCard}>
                        <View style={styles.thumbnailContainer}>
                            <Text style={styles.thumbnailEmoji}>{sermon.thumbnail || '🎥'}</Text>
                            <View style={styles.playButton}>
                                <Play size={24} color="#FFFFFF" />
                            </View>
                        </View>
                        <View style={styles.sermonContent}>
                            <Text style={styles.sermonSeries}>{sermon.series || 'Sunday Service'}</Text>
                            <Text style={styles.sermonTitle}>{sermon.title}</Text>
                            <View style={styles.sermonMeta}>
                                <View style={styles.metaItem}>
                                    <User size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                    <Text style={styles.metaText}>{sermon.speaker || 'Pastor'}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                    <Text style={styles.metaText}>{sermon.duration || 'Unknown'}</Text>
                                </View>
                            </View>
                            <View style={styles.actionContainer}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Download size={16} color={isDark ? '#D1D5DB' : '#4B5563'} />
                                    <Text style={styles.actionText}>Download</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Share2 size={16} color={isDark ? '#D1D5DB' : '#4B5563'} />
                                    <Text style={styles.actionText}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        {searchQuery ? `No sermons found matching "${searchQuery}"` : "No sermons available yet."}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
