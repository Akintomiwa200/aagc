'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Filter, Download, Trash2, CheckCircle, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PrayerRequest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    request: string;
    date: string;
    status: 'pending' | 'ongoing' | 'answered';
    isAnonymous: boolean;
}

export default function PrayersPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'answered'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [prayers, setPrayers] = useState<PrayerRequest[]>([
        {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1234567890',
            request: 'Please pray for my mother who is recovering from surgery. She needs strength and healing.',
            date: '2024-12-10',
            status: 'ongoing',
            isAnonymous: false
        },
        {
            id: '2',
            name: 'Anonymous',
            request: 'Pray for guidance in my career decision. I am at a crossroads and need divine direction.',
            date: '2024-12-09',
            status: 'pending',
            isAnonymous: true
        },
        {
            id: '3',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            request: 'Thank God! My son got the job he was praying for. Praise the Lord!',
            date: '2024-12-08',
            status: 'answered',
            isAnonymous: false
        }
    ]);

    const handleDelete = (id: string) => {
        setPrayers(prayers.filter(p => p.id !== id));
    };

    const updateStatus = (id: string, status: PrayerRequest['status']) => {
        setPrayers(prayers.map(p => p.id === id ? { ...p, status } : p));
    };

    const filteredPrayers = prayers.filter(prayer => {
        const matchesFilter = filter === 'all' || prayer.status === filter;
        const matchesSearch = prayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prayer.request.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const exportToCSV = () => {
        // Simple CSV export functionality
        const csv = [
            ['Name', 'Email', 'Phone', 'Request', 'Date', 'Status'],
            ...prayers.map(p => [
                p.name,
                p.email || '',
                p.phone || '',
                p.request,
                p.date,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Prayer Requests</h1>
                    <p className="text-gray-400 mt-1">Manage and track prayer requests</p>
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
                                <p className="text-2xl font-bold text-white">{prayers.length}</p>
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
                                <p className="text-2xl font-bold text-yellow-300">
                                    {prayers.filter(p => p.status === 'pending').length}
                                </p>
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
                                <p className="text-2xl font-bold text-blue-300">
                                    {prayers.filter(p => p.status === 'ongoing').length}
                                </p>
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
                                <p className="text-2xl font-bold text-green-300">
                                    {prayers.filter(p => p.status === 'answered').length}
                                </p>
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
                        variant={filter === 'all' ? 'solid' : 'outline'}
                        onClick={() => setFilter('all')}
                        className={filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-gray-700'}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'solid' : 'outline'}
                        onClick={() => setFilter('pending')}
                        className={filter === 'pending' ? 'bg-yellow-600' : 'border-gray-700'}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'ongoing' ? 'solid' : 'outline'}
                        onClick={() => setFilter('ongoing')}
                        className={filter === 'ongoing' ? 'bg-blue-600' : 'border-gray-700'}
                    >
                        Ongoing
                    </Button>
                    <Button
                        variant={filter === 'answered' ? 'solid' : 'outline'}
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
                        key={prayer.id}
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
                                                {new Date(prayer.date).toLocaleDateString()}
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
                                            onClick={() => handleDelete(prayer.id)}
                                            className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Request */}
                                    <p className="text-gray-300">{prayer.request}</p>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-800">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id, 'pending')}
                                            disabled={prayer.status === 'pending'}
                                            className="border-gray-700"
                                        >
                                            Mark Pending
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id, 'ongoing')}
                                            disabled={prayer.status === 'ongoing'}
                                            className="border-gray-700"
                                        >
                                            Mark Ongoing
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateStatus(prayer.id, 'answered')}
                                            disabled={prayer.status === 'answered'}
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
