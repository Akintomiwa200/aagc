import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { DollarSign, CreditCard, Building2, History } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { apiService } from '@/services/apiService';
import { useSocket } from '@/context/SocketContext';

export default function GivingScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [givingType, setGivingType] = useState<'tithe' | 'offering' | 'special'>('tithe');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const quickAmounts = [10, 25, 50, 100, 250, 500];

    useEffect(() => {
        fetchUserDataAndHistory();
    }, []);

    const fetchUserDataAndHistory = async () => {
        try {
            const userData = await apiService.getMe();
            setUser(userData);
            if (userData?.id || userData?._id) {
                const donations = await apiService.getDonations(userData.id || userData._id);
                setHistory(donations);
            }
        } catch (error) {
            console.error('Failed to fetch user or history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket || !user) return;

        const handleDonationCreated = (data: any) => {
            if (data.userId === user.id || data.userId === user._id) {
                setHistory(prev => [data, ...prev]);
            }
        };

        socket.on('donation-created', handleDonationCreated);

        return () => {
            socket.off('donation-created', handleDonationCreated);
        };
    }, [socket, user]);

    const handleGive = async () => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to give.');
            return;
        }

        const amount = selectedAmount || parseFloat(customAmount);
        if (!amount || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please select or enter a valid amount.');
            return;
        }

        setProcessing(true);
        try {
            await apiService.createDonation({
                type: givingType,
                amount: amount,
                userId: user.id || user._id
            });
            Alert.alert('Success', 'Thank you for your generosity!');
            // Refresh history
            const donations = await apiService.getDonations(user.id || user._id);
            setHistory(donations);
            // Reset form
            setSelectedAmount(null);
            setCustomAmount('');
        } catch (error) {
            Alert.alert('Error', 'Failed to process donation. Please try again.');
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const totalGiving = history.reduce((sum, item) => sum + item.amount, 0);

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
            marginBottom: 24,
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
        statsCard: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            alignItems: 'center',
        },
        statsAmount: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#7C3AED',
            marginBottom: 4,
        },
        statsLabel: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 12,
        },
        typeContainer: {
            flexDirection: 'row',
            gap: 8,
            marginBottom: 24,
        },
        typeButton: {
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 2,
            alignItems: 'center',
        },
        typeButtonInactive: {
            borderColor: isDark ? '#374151' : '#E5E7EB',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        typeButtonActive: {
            borderColor: '#7C3AED',
            backgroundColor: '#7C3AED20',
        },
        typeText: {
            fontSize: 14,
            fontWeight: '600',
        },
        typeTextInactive: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        typeTextActive: {
            color: '#7C3AED',
        },
        amountGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
        },
        amountButton: {
            width: '30%',
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 2,
            alignItems: 'center',
        },
        amountButtonInactive: {
            borderColor: isDark ? '#374151' : '#E5E7EB',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        amountButtonActive: {
            borderColor: '#7C3AED',
            backgroundColor: '#7C3AED20',
        },
        amountText: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        customInput: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            color: isDark ? '#FFFFFF' : '#111827',
            borderWidth: 2,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            marginBottom: 24,
        },
        paymentContainer: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 24,
        },
        paymentButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 16,
            borderRadius: 16,
            borderWidth: 2,
        },
        giveButton: {
            backgroundColor: '#7C3AED',
            borderRadius: 16,
            padding: 18,
            alignItems: 'center',
            marginBottom: 32,
        },
        giveButtonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
        historyItem: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#E5E7EB',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        historyLeft: {
            flex: 1,
        },
        historyType: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#111827',
            marginBottom: 4,
            textTransform: 'capitalize'
        },
        historyDate: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        historyAmount: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#10B981',
        },
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={styles.title}>Give</Text>
                <Text style={styles.subtitle}>SUPPORT THE MINISTRY</Text>
            </View>

            {/* Total Giving Stats */}
            <View style={styles.statsCard}>
                <Text style={styles.statsAmount}>${totalGiving}</Text>
                <Text style={styles.statsLabel}>Total Giving</Text>
            </View>

            {/* Giving Type Selection */}
            <Text style={styles.sectionTitle}>Giving Type</Text>
            <View style={styles.typeContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, givingType === 'tithe' ? styles.typeButtonActive : styles.typeButtonInactive]}
                    onPress={() => setGivingType('tithe')}
                >
                    <Text style={[styles.typeText, givingType === 'tithe' ? styles.typeTextActive : styles.typeTextInactive]}>
                        Tithe
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, givingType === 'offering' ? styles.typeButtonActive : styles.typeButtonInactive]}
                    onPress={() => setGivingType('offering')}
                >
                    <Text style={[styles.typeText, givingType === 'offering' ? styles.typeTextActive : styles.typeTextInactive]}>
                        Offering
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, givingType === 'special' ? styles.typeButtonActive : styles.typeButtonInactive]}
                    onPress={() => setGivingType('special')}
                >
                    <Text style={[styles.typeText, givingType === 'special' ? styles.typeTextActive : styles.typeTextInactive]}>
                        Special
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Quick Amount Selection */}
            <Text style={styles.sectionTitle}>Select Amount</Text>
            <View style={styles.amountGrid}>
                {quickAmounts.map((amount) => (
                    <TouchableOpacity
                        key={amount}
                        style={[styles.amountButton, selectedAmount === amount ? styles.amountButtonActive : styles.amountButtonInactive]}
                        onPress={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                        }}
                    >
                        <Text style={[styles.amountText, { color: selectedAmount === amount ? '#7C3AED' : (isDark ? '#FFFFFF' : '#111827') }]}>
                            ${amount}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Amount */}
            <Text style={styles.sectionTitle}>Or Enter Custom Amount</Text>
            <TextInput
                style={styles.customInput}
                placeholder="$0.00"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="numeric"
                value={customAmount}
                onChangeText={(text) => {
                    setCustomAmount(text);
                    setSelectedAmount(null);
                }}
            />

            {/* Payment Method */}
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentContainer}>
                <TouchableOpacity
                    style={[styles.paymentButton, paymentMethod === 'card' ? styles.amountButtonActive : styles.amountButtonInactive]}
                    onPress={() => setPaymentMethod('card')}
                >
                    <CreditCard size={20} color={paymentMethod === 'card' ? '#7C3AED' : (isDark ? '#9CA3AF' : '#6B7280')} />
                    <Text style={[styles.typeText, paymentMethod === 'card' ? styles.typeTextActive : styles.typeTextInactive]}>
                        Card
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.paymentButton, paymentMethod === 'bank' ? styles.amountButtonActive : styles.amountButtonInactive]}
                    onPress={() => setPaymentMethod('bank')}
                >
                    <Building2 size={20} color={paymentMethod === 'bank' ? '#7C3AED' : (isDark ? '#9CA3AF' : '#6B7280')} />
                    <Text style={[styles.typeText, paymentMethod === 'bank' ? styles.typeTextActive : styles.typeTextInactive]}>
                        Bank
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Give Button */}
            <TouchableOpacity style={styles.giveButton} onPress={handleGive} disabled={processing}>
                {processing ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.giveButtonText}>
                        Give ${selectedAmount || customAmount || '0'}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Giving History */}
            <Text style={styles.sectionTitle}>Recent Giving</Text>
            {loadingHistory ? (
                <ActivityIndicator size="small" color="#7C3AED" />
            ) : history.length > 0 ? (
                history.map((item) => (
                    <View key={item.id} style={styles.historyItem}>
                        <View style={styles.historyLeft}>
                            <Text style={styles.historyType}>{item.type}</Text>
                            <Text style={styles.historyDate}>
                                {new Date(item.date).toLocaleDateString()}
                            </Text>
                        </View>
                        <Text style={styles.historyAmount}>${item.amount}</Text>
                    </View>
                ))
            ) : (
                <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontStyle: 'italic' }}>
                    No giving history found.
                </Text>
            )}
        </ScrollView>
    );
}
