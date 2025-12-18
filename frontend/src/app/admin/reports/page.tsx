'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Download, Calendar, TrendingUp, Users, DollarSign, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Report {
    id: string;
    title: string;
    type: 'donations' | 'members' | 'events' | 'prayers' | 'sermons';
    period: string;
    generatedDate: string;
    data: any;
}

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reports, setReports] = useState<Report[]>([
        {
            id: '1',
            title: 'Monthly Donations Report',
            type: 'donations',
            period: 'December 2024',
            generatedDate: '2024-12-10',
            data: { total: 45230, count: 156 }
        },
        {
            id: '2',
            title: 'Member Growth Report',
            type: 'members',
            period: 'Q4 2024',
            generatedDate: '2024-12-01',
            data: { newMembers: 45, total: 1245 }
        },
        {
            id: '3',
            title: 'Event Attendance Report',
            type: 'events',
            period: 'November 2024',
            generatedDate: '2024-11-30',
            data: { events: 12, attendance: 2340 }
        }
    ]);

    const generateReport = (type: Report['type']) => {
        const newReport: Report = {
            id: Date.now().toString(),
            title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
            type,
            period: selectedPeriod,
            generatedDate: new Date().toISOString().split('T')[0],
            data: {}
        };
        setReports([newReport, ...reports]);
    };

    const exportReport = (report: Report) => {
        // Simulate report export
        const data = JSON.stringify(report, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}-${report.generatedDate}.json`;
        a.click();
    };

    const getReportIcon = (type: string) => {
        switch (type) {
            case 'donations':
                return DollarSign;
            case 'members':
                return Users;
            case 'events':
                return Calendar;
            case 'prayers':
                return Heart;
            case 'sermons':
                return Music;
            default:
                return BarChart;
        }
    };

    const getReportColor = (type: string) => {
        switch (type) {
            case 'donations':
                return 'bg-green-900/30 text-green-300';
            case 'members':
                return 'bg-blue-900/30 text-blue-300';
            case 'events':
                return 'bg-purple-900/30 text-purple-300';
            case 'prayers':
                return 'bg-red-900/30 text-red-300';
            case 'sermons':
                return 'bg-yellow-900/30 text-yellow-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reports</h1>
                    <p className="text-gray-400 mt-1">Generate and view church reports</p>
                </div>
            </div>

            {/* Generate Report Section */}
            <Card className="glass border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Generate New Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-white mb-2 block">Report Period</Label>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="week">Last Week</option>
                                    <option value="month">Last Month</option>
                                    <option value="quarter">Last Quarter</option>
                                    <option value="year">Last Year</option>
                                </select>
                            </div>
                            <div>
                                <Label className="text-white mb-2 block">Custom Date Range (Optional)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                        placeholder="Start Date"
                                    />
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                        placeholder="End Date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-white mb-2 block">Report Type</Label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {(['donations', 'members', 'events', 'prayers', 'sermons'] as Report['type'][]).map((type) => {
                                    const Icon = getReportIcon(type);
                                    return (
                                        <Button
                                            key={type}
                                            variant="outline"
                                            onClick={() => generateReport(type)}
                                            className="border-gray-700 flex flex-col items-center gap-2 h-auto py-4"
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-xs capitalize">{type}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reports List */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Generated Reports</h2>
                <div className="grid gap-4">
                    {reports.map((report, index) => {
                        const Icon = getReportIcon(report.type);
                        return (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="glass border-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`p-3 rounded-lg ${getReportColor(report.type)}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                                                    <div className="space-y-1 text-sm text-gray-400">
                                                        <div>Period: {report.period}</div>
                                                        <div>Generated: {new Date(report.generatedDate).toLocaleDateString()}</div>
                                                        {report.data && (
                                                            <div className="mt-2 flex gap-4">
                                                                {Object.entries(report.data).map(([key, value]) => (
                                                                    <div key={key} className="flex items-center gap-1">
                                                                        <TrendingUp className="h-4 w-4" />
                                                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: {typeof value === 'number' && key.includes('total') ? `$${value.toLocaleString()}` : String(value)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => exportReport(report)}
                                                    className="border-gray-700"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {reports.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <BarChart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No reports generated yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


