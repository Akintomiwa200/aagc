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

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const data = await apiService.getGalleryImages();
            setImages(data);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
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

        const handleImageUpdated = (image: any) => {
            setImages(prev => prev.map(img => img.id === image.id || img._id === image._id ? image : img));
        };

        const handleImageDeleted = (data: any) => {
            setImages(prev => prev.filter(img => img.id !== data.imageId && img._id !== data.imageId));
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
                    keyExtractor={(item) => item.id}
                    numColumns={COLUMN_COUNT}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No photos available.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.url }}
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
