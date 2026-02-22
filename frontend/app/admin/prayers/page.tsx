'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Filter, Download, Trash2, CheckCircle, Clock, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/contexts/SocketContext';
import { apiService } from '@/lib/api';

interface PrayerRequest {
    _id: string;
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    request: string;
    createdAt?: string;
    date?: string;
    status: 'pending' | 'ongoing' | 'answered';
    isAnonymous: boolean;
}

interface PrayerStats {
    total: number;
    pending: number;
    ongoing: number;
    answered: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

export default function PrayersPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'answered'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
    const [stats, setStats] = useState<PrayerStats>({ total: 0, pending: 0, ongoing: 0, answered: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const { socket, isConnected } = useSocket();

    // Fetch initial data
    useEffect(() => {
        fetchPrayers();
        fetchStats();
    }, []);

    // Set up real-time listeners
    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.on('initial-data', (data: { prayers: PrayerRequest[], prayerStats: PrayerStats }) => {
            if (data.prayers) {
                setPrayers(data.prayers.map(normalizePrayer));
            }
            if (data.prayerStats) {
                setStats(data.prayerStats);
            }
        });

        socket.on('prayer-created', (data: { prayer: PrayerRequest, stats: PrayerStats }) => {
            setPrayers(prev => [normalizePrayer(data.prayer), ...prev]);
            setStats(data.stats);
        });

        socket.on('prayer-updated', (data: { prayer: PrayerRequest, stats: PrayerStats }) => {
            setPrayers(prev => prev.map(p =>
                p.id === data.prayer._id || p._id === data.prayer._id
                    ? normalizePrayer(data.prayer)
                    : p
            ));
            setStats(data.stats);
        });

        socket.on('prayer-deleted', (data: { prayerId: string, stats: PrayerStats }) => {
            setPrayers(prev => prev.filter(p => p.id !== data.prayerId && p._id !== data.prayerId));
            setStats(data.stats);
        });

        return () => {
            socket.off('initial-data');
            socket.off('prayer-created');
            socket.off('prayer-updated');
            socket.off('prayer-deleted');
        };
    }, [socket, isConnected]);

    const normalizePrayer = (prayer: PrayerRequest): PrayerRequest => {
        return {
            ...prayer,
            id: prayer._id || prayer.id || '',
            date: prayer.createdAt || prayer.date || new Date().toISOString(),
        };
    };

    const fetchPrayers = async () => {
        try {
            const data = await apiService.getPrayers();
            setPrayers(data.map(normalizePrayer));
        } catch (error) {
            console.error('Error fetching prayers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Assuming we'll add getPrayerStats or similar to apiService, or use generic request
            // Checking api.ts showed we might need to add it or it's missing.
            // Let's use direct request via apiService for now until explicit method added
            // Wait, apiService has getDashboardStats but maybe not specific prayer stats? 
            // In api.ts there is only `updatePrayerStatus` and `getPrayers`.
            // I should add `getPrayerStats` to `api.ts` first or just cast specific endpoint.
            // Actually, I'll update api.ts in a bit. For now let's assume getPrayerStats will exist.
            const data = await apiService.getPrayerStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this prayer request?')) return;

        setUpdating(id);
        try {
            await apiService.deletePrayer(id);
            // Real-time update will handle the state change
        } catch (error) {
            console.error('Error deleting prayer:', error);
            alert('Failed to delete prayer request');
        } finally {
            setUpdating(null);
        }
    };

    const updateStatus = async (id: string, status: PrayerRequest['status']) => {
        setUpdating(id);
        try {
            await apiService.updatePrayerStatus(id, status);
            // Real-time update will handle state change
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update prayer status');
        } finally {
            setUpdating(null);
        }
    };

    const filteredPrayers = prayers.filter(prayer => {
        const matchesFilter = filter === 'all' || prayer.status === filter;
        const matchesSearch = prayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prayer.request.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const exportToCSV = () => {
        const csv = [
            ['Name', 'Email', 'Phone', 'Request', 'Date', 'Status'],
            ...prayers.map(p => [
                p.name,
                p.email || '',
                p.phone || '',
                p.request,
                p.date ? new Date(p.date).toLocaleDateString() : '',
                p.status
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prayer-requests-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-900/30 text-yellow-300';
            case 'ongoing':
                return 'bg-blue-900/30 text-blue-300';
            case 'answered':
                return 'bg-green-900/30 text-green-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Prayer Requests</h1>
                    <p className="text-gray-400 mt-1">
                        Manage and track prayer requests
                        {isConnected && (
                            <span className="ml-2 text-green-400 text-sm">● Live</span>
                        )}
                    </p>
                </div>
                <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="border-gray-700"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total</p>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                            </div>
                            <Heart className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-yellow-300">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Ongoing</p>
                                <p className="text-2xl font-bold text-blue-300">{stats.ongoing}</p>
                            </div>
                            <Heart className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Answered</p>
                                <p className="text-2xl font-bold text-green-300">{stats.answered}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search prayer requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-700'}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilter('pending')}
                        className={filter === 'pending' ? 'bg-yellow-600' : 'border-gray-700'}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'ongoing' ? 'default' : 'outline'}
                        onClick={() => setFilter('ongoing')}
                        className={filter === 'ongoing' ? 'bg-blue-600' : 'border-gray-700'}
                    >
                        Ongoing
                    </Button>
                    <Button
                        variant={filter === 'answered' ? 'default' : 'outline'}
                        onClick={() => setFilter('answered')}
                        className={filter === 'answered' ? 'bg-green-600' : 'border-gray-700'}
                    >
                        Answered
                    </Button>
                </div>
            </div>

            {/* Prayer Requests List */}
            <div className="grid gap-4">
                {filteredPrayers.map((prayer, index) => (
                    <motion.div
                        key={prayer.id || prayer._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="glass border-gray-800">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold text-white">{prayer.name}</h3>
                                                {prayer.isAnonymous && (
                                                    <Badge className="bg-gray-900/30 text-gray-300">Anonymous</Badge>
                                                )}
                                                <Badge className={getStatusColor(prayer.status)}>
                                                    {prayer.status}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-400 text-sm mt-1">
                                                {prayer.date ? new Date(prayer.date).toLocaleDateString() : 'N/A'}
                                            </p>
                                            {!prayer.isAnonymous && (prayer.email || prayer.phone) && (
                                                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                                    {prayer.email && <span>{prayer.email}</span>}
                                                    {prayer.phone && <span>{prayer.phone}</span>}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(prayer.id || prayer._id)}
                                            disabled={updating === (prayer.id || prayer._id)}
                                            className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                        >
                                            {updating === (prayer.id || prayer._id) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>

                                    {/* Request */}
                                    <p className="text-gray-300">{prayer.request}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id || prayer._id, 'pending')}
                                            disabled={prayer.status === 'pending' || updating === (prayer.id || prayer._id)}
                                            className="border-gray-700"
                                        >
                                            Mark Pending
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id || prayer._id, 'ongoing')}
                                            disabled={prayer.status === 'ongoing' || updating === (prayer.id || prayer._id)}
                                            className="border-gray-700"
                                        >
                                            Mark Ongoing
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id || prayer._id, 'answered')}
                                            disabled={prayer.status === 'answered' || updating === (prayer.id || prayer._id)}
                                            className="border-gray-700"
                                        >
                                            Mark Answered
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredPrayers.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No prayer requests found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
