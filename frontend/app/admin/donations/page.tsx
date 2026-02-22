'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, Download, Search, TrendingUp,
    Calendar, CreditCard, User, CheckCircle,
    Clock, XCircle, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Donation {
    id:            string;
    donorName:     string;
    email?:        string;
    amount:        number;
    currency?:     string;
    date:          string;
    method:        'online' | 'cash' | 'check' | 'bank_transfer' | 'opay' | 'palmpay' | 'kuda' | 'card' | string;
    category?:     'tithe' | 'offering' | 'firstfruit' | 'project' | 'welfare' | 'missions' | 'other' | string;
    status:        'completed' | 'pending' | 'failed';
    transactionId?: string;
}

type FilterType = 'all' | 'completed' | 'pending' | 'failed';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS: Record<string, string> = {
    NGN: '₦', USD: '$', GBP: '£', EUR: '€',
    CAD: 'CA$', GHS: '₵', KES: 'KSh', ZAR: 'R',
};

const fmtAmount = (amount: number, currency = 'NGN') => {
    const sym = CURRENCY_SYMBOLS[currency] ?? currency + ' ';
    return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const METHOD_LABELS: Record<string, string> = {
    online: 'Online', cash: 'Cash', check: 'Cheque',
    bank_transfer: 'Bank Transfer', opay: 'OPay',
    palmpay: 'PalmPay', kuda: 'Kuda', card: 'Debit Card',
};

const CATEGORY_LABELS: Record<string, string> = {
    tithe: 'Tithe 🙏', offering: 'Offering 🕊️', firstfruit: 'First Fruit 🌾',
    project: 'Church Project ⛪', welfare: 'Welfare ❤️', missions: 'Missions 🌍',
};

const STATUS_CONFIG = {
    completed: {
        label: 'Completed',
        icon:  CheckCircle,
        badge: 'bg-green-900/40 text-green-300 border-green-800',
        dot:   'bg-green-400',
    },
    pending: {
        label: 'Pending',
        icon:  Clock,
        badge: 'bg-yellow-900/40 text-yellow-300 border-yellow-800',
        dot:   'bg-yellow-400',
    },
    failed: {
        label: 'Failed',
        icon:  XCircle,
        badge: 'bg-red-900/40 text-red-300 border-red-800',
        dot:   'bg-red-400',
    },
};

const FILTER_TABS: { key: FilterType; label: string; color: string; activeClass: string }[] = [
    { key: 'all',       label: 'All',       color: 'border-gray-700 text-gray-300',  activeClass: 'bg-gray-700 text-white border-gray-700'       },
    { key: 'completed', label: 'Completed', color: 'border-gray-700 text-gray-300',  activeClass: 'bg-green-600 text-white border-green-600'     },
    { key: 'pending',   label: 'Pending',   color: 'border-gray-700 text-gray-300',  activeClass: 'bg-yellow-600 text-white border-yellow-600'   },
    { key: 'failed',    label: 'Failed',    color: 'border-gray-700 text-gray-300',  activeClass: 'bg-red-600 text-white border-red-600'         },
];

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
    label: string; value: string | number; icon: any; color: string;
}) {
    return (
        <Card className="bg-gray-900/60 border-gray-800">
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">{label}</p>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    </div>
                    <div className={`p-2 rounded-xl bg-gray-800`}>
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── DONATION CARD ────────────────────────────────────────────────────────────
function DonationCard({ donation, index }: { donation: Donation; index: number }) {
    const statusCfg = STATUS_CONFIG[donation.status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
        >
            <Card className="bg-gray-900/60 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">

                        {/* Left — donor info */}
                        <div className="flex-1 min-w-0">

                            {/* Name + badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <User className="h-4 w-4 text-gray-400 shrink-0" />
                                <span className="text-white font-semibold text-base truncate">
                                    {donation.donorName}
                                </span>
                                <Badge className={`text-xs border ${statusCfg.badge}`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusCfg.label}
                                </Badge>
                                {donation.category && (
                                    <Badge className="bg-purple-900/40 text-purple-300 border-purple-800 text-xs border">
                                        {CATEGORY_LABELS[donation.category] ?? donation.category}
                                    </Badge>
                                )}
                            </div>

                            {/* Detail rows */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-400">
                                {donation.email && (
                                    <span className="truncate">📧 {donation.email}</span>
                                )}
                                <span>
                                    📅 {new Date(donation.date).toLocaleDateString(undefined, {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                </span>
                                <span>💳 {METHOD_LABELS[donation.method] ?? donation.method}</span>
                                {donation.currency && donation.currency !== 'NGN' && (
                                    <span>🌍 {donation.currency}</span>
                                )}
                                {donation.transactionId && (
                                    <span className="text-xs text-gray-500 col-span-2 truncate">
                                        Ref: {donation.transactionId}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right — amount */}
                        <div className="text-right shrink-0">
                            <p className={`text-xl font-bold ${
                                donation.status === 'completed' ? 'text-green-400'
                                : donation.status === 'pending'   ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}>
                                {fmtAmount(donation.amount, donation.currency)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function DonationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter]         = useState<FilterType>('all');
    const [donations, setDonations]   = useState<Donation[]>([]);
    const [loading, setLoading]       = useState(true);

    const fetchDonations = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiService.getDonations();
            setDonations(data.map((d: any) => ({
                id:            d._id || d.id,
                donorName:     d.donorName || d.user?.name || 'Anonymous',
                email:         d.email || d.user?.email,
                amount:        d.amount,
                currency:      d.currency ?? 'NGN',
                date:          d.date || d.createdAt,
                method:        d.method ?? d.paymentMethod ?? 'online',
                category:      d.category ?? d.type,
                status:        d.status,
                transactionId: d.transactionId ?? d.reference,
            })));
        } catch (err) {
            console.error('Failed to fetch donations:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDonations(); }, [fetchDonations]);

    // ── Derived stats ──────────────────────────────────────────────────────
    const completed      = donations.filter(d => d.status === 'completed');
    const totalAmount    = completed.reduce((s, d) => s + d.amount, 0);
    const thisMonth      = completed.filter(d =>
        new Date(d.date).getMonth()    === new Date().getMonth() &&
        new Date(d.date).getFullYear() === new Date().getFullYear()
    ).reduce((s, d) => s + d.amount, 0);
    const pendingCount   = donations.filter(d => d.status === 'pending').length;

    // ── Filtered list ──────────────────────────────────────────────────────
    const filtered = donations.filter(d => {
        const matchStatus = filter === 'all' || d.status === filter;
        const q = searchTerm.toLowerCase();
        const matchSearch =
            d.donorName.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            d.transactionId?.toLowerCase().includes(q) ||
            (d.category ?? '').toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    // ── CSV export ─────────────────────────────────────────────────────────
    const exportCSV = () => {
        const rows = [
            ['Date', 'Donor Name', 'Email', 'Amount', 'Currency', 'Method', 'Category', 'Status', 'Reference'],
            ...donations.map(d => [
                d.date, d.donorName, d.email ?? '',
                d.amount.toFixed(2), d.currency ?? 'NGN',
                d.method, d.category ?? '', d.status, d.transactionId ?? '',
            ]),
        ].map(r => r.map(v => `"${v}"`).join(',')).join('\n');

        const a = Object.assign(document.createElement('a'), {
            href:     URL.createObjectURL(new Blob([rows], { type: 'text/csv' })),
            download: `donations-${new Date().toISOString().split('T')[0]}.csv`,
        });
        a.click();
    };

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Donations</h1>
                    <p className="text-gray-400 mt-1 text-sm">Track and manage all church giving</p>
                </div>
                <Button
                    variant="outline"
                    onClick={exportCSV}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 shrink-0"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* ── Stats ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Received"     value={fmtAmount(totalAmount)}  icon={DollarSign}  color="text-green-400"  />
                <StatCard label="This Month"         value={fmtAmount(thisMonth)}    icon={Calendar}    color="text-blue-400"   />
                <StatCard label="Total Transactions" value={donations.length}        icon={TrendingUp}  color="text-purple-400" />
                <StatCard label="Pending"            value={pendingCount}            icon={Clock}       color="text-yellow-400" />
            </div>

            {/* ── Search + filter ──────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email or reference…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500"
                    />
                </div>

                {/* Filter tabs — use 'default' or 'outline' only (valid shadcn variants) */}
                <div className="flex gap-2 flex-wrap">
                    {FILTER_TABS.map(tab => (
                        <Button
                            key={tab.key}
                            variant={filter === tab.key ? 'default' : 'outline'}
                            onClick={() => setFilter(tab.key)}
                            className={filter === tab.key ? tab.activeClass : tab.color}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* ── Donations list ───────────────────────────────────────────── */}
            {loading ? (
                <div className="grid gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="bg-gray-900/60 border-gray-800 animate-pulse">
                            <CardContent className="p-5 h-24" />
                        </Card>
                    ))}
                </div>
            ) : filtered.length > 0 ? (
                <div className="grid gap-4">
                    {filtered.map((donation, i) => (
                        <DonationCard key={donation.id} donation={donation} index={i} />
                    ))}
                </div>
            ) : (
                <Card className="bg-gray-900/60 border-gray-800">
                    <CardContent className="p-14 text-center">
                        <DollarSign className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No donations found</p>
                        <p className="text-gray-600 text-sm mt-1">
                            {searchTerm ? 'Try a different search term' : 'No records match this filter'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}