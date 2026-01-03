'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Download, Search, Filter, TrendingUp, Calendar, CreditCard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { useEffect, useCallback } from 'react';

interface Donation {
    id: string;
    donorName: string;
    email?: string;
    amount: number;
    date: string;
    method: 'online' | 'cash' | 'check' | 'bank_transfer';
    category?: 'tithe' | 'offering' | 'building' | 'missions' | 'other';
    status: 'completed' | 'pending' | 'failed';
    transactionId?: string;
}

export default function DonationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiService.getDonations();
            setDonations(data.map((d: any) => ({
                id: d._id || d.id,
                donorName: d.donorName || d.user?.name || 'Anonymous',
                email: d.email || d.user?.email,
                amount: d.amount,
                date: d.date || d.createdAt,
                method: d.method,
                category: d.category,
                status: d.status,
                transactionId: d.transactionId
            })));
        } catch (error) {
            console.error('Failed to fetch donations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const filteredDonations = donations.filter(donation => {
        const matchesFilter = filter === 'all' || donation.status === filter;
        const matchesSearch =
            donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const totalAmount = donations.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
    const monthlyAmount = donations
        .filter(d => d.status === 'completed' && new Date(d.date).getMonth() === new Date().getMonth())
        .reduce((sum, d) => sum + d.amount, 0);

    const exportToCSV = () => {
        const csv = [
            ['Date', 'Donor Name', 'Email', 'Amount', 'Method', 'Category', 'Status', 'Transaction ID'],
            ...donations.map(d => [
                d.date,
                d.donorName,
                d.email || '',
                d.amount.toFixed(2),
                d.method,
                d.category || '',
                d.status,
                d.transactionId || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-900/30 text-green-300';
            case 'pending':
                return 'bg-yellow-900/30 text-yellow-300';
            case 'failed':
                return 'bg-red-900/30 text-red-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'online':
                return CreditCard;
            case 'cash':
                return DollarSign;
            case 'check':
                return DollarSign;
            case 'bank_transfer':
                return DollarSign;
            default:
                return DollarSign;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Donations</h1>
                    <p className="text-gray-400 mt-1">Track and manage church donations</p>
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
                                <p className="text-gray-400 text-sm">Total Donations</p>
                                <p className="text-2xl font-bold text-white">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">This Month</p>
                                <p className="text-2xl font-bold text-blue-300">${monthlyAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Transactions</p>
                                <p className="text-2xl font-bold text-purple-300">{donations.length}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-yellow-300">
                                    {donations.filter(d => d.status === 'pending').length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search donations..."
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
                        variant={filter === 'completed' ? 'solid' : 'outline'}
                        onClick={() => setFilter('completed')}
                        className={filter === 'completed' ? 'bg-green-600' : 'border-gray-700'}
                    >
                        Completed
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'solid' : 'outline'}
                        onClick={() => setFilter('pending')}
                        className={filter === 'pending' ? 'bg-yellow-600' : 'border-gray-700'}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'failed' ? 'solid' : 'outline'}
                        onClick={() => setFilter('failed')}
                        className={filter === 'failed' ? 'bg-red-600' : 'border-gray-700'}
                    >
                        Failed
                    </Button>
                </div>
            </div>

            {/* Donations List */}
            <div className="grid gap-4">
                {filteredDonations.map((donation, index) => {
                    const MethodIcon = getMethodIcon(donation.method);
                    return (
                        <motion.div
                            key={donation.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="glass border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <MethodIcon className="h-5 w-5 text-blue-400" />
                                                <h3 className="text-lg font-semibold text-white">{donation.donorName}</h3>
                                                <Badge className={getStatusColor(donation.status)}>
                                                    {donation.status}
                                                </Badge>
                                                {donation.category && (
                                                    <Badge className="bg-purple-900/30 text-purple-300">
                                                        {donation.category}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="space-y-1 text-sm text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span className="text-xl font-bold text-green-300">
                                                        ${donation.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                                {donation.email && (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4" />
                                                        {donation.email}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(donation.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    Method: {donation.method.replace('_', ' ')}
                                                </div>
                                                {donation.transactionId && (
                                                    <div className="text-xs text-gray-500">
                                                        Transaction ID: {donation.transactionId}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {filteredDonations.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No donations found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


