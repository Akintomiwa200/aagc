import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const TILE_SIZE = width / COLUMN_COUNT;

export default function GalleryScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const data = await apiService.getGalleryImages();
            setImages(Array.isArray(data) ? data : []);
            setError(null);
        } catch {
            // Silently handle — empty gallery state shown
            setImages([]);
            setError('Unable to load gallery right now. Pull to refresh when network is stable.');
        } finally {
            setLoading(false);
        }
    };

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleImageCreated = (image: any) => {
            setImages(prev => [image, ...prev]);
        };

        const getId = (item: any) => item?.id || item?._id;

        const handleImageUpdated = (image: any) => {
            const imageId = getId(image);
            setImages(prev => prev.map(img => getId(img) === imageId ? image : img));
        };

        const handleImageDeleted = (data: any) => {
            setImages(prev => prev.filter(img => getId(img) !== data.imageId));
        };

        socket.on('gallery-image-created', handleImageCreated);
        socket.on('gallery-image-updated', handleImageUpdated);
        socket.on('gallery-image-deleted', handleImageDeleted);

        return () => {
            socket.off('gallery-image-created', handleImageCreated);
            socket.off('gallery-image-updated', handleImageUpdated);
            socket.off('gallery-image-deleted', handleImageDeleted);
        };
    }, [socket]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#000000' : '#F9FAFB',
        },
        header: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
        },
        imageContainer: {
            width: TILE_SIZE,
            height: TILE_SIZE,
            padding: 1,
        },
        image: {
            flex: 1,
            backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 40,
        },
        emptyText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Gallery</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => (item?.id || item?._id || String(index))}
                    numColumns={COLUMN_COUNT}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                {error || 'No photos available.'}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.imageUrl || item.url }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
