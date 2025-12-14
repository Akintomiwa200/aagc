'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Edit2, Trash2, Send, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'announcement' | 'reminder' | 'event' | 'general';
    target: 'all' | 'members' | 'volunteers' | 'leaders';
    scheduledDate?: string;
    status: 'draft' | 'scheduled' | 'sent';
    createdAt: string;
}

export default function NotificationsPage() {
    const [showForm, setShowForm] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Sunday Service Reminder',
            message: 'Join us this Sunday at 10 AM for our weekly worship service.',
            type: 'reminder',
            target: 'all',
            scheduledDate: '2024-12-15T09:00:00',
            status: 'scheduled',
            createdAt: '2024-12-10'
        },
        {
            id: '2',
            title: 'Christmas Event Announcement',
            message: 'We are excited to announce our annual Christmas celebration on December 24th.',
            type: 'event',
            target: 'all',
            status: 'sent',
            createdAt: '2024-12-08'
        },
        {
            id: '3',
            title: 'Volunteer Meeting',
            message: 'All volunteers are invited to a meeting this Wednesday at 7 PM.',
            type: 'announcement',
            target: 'volunteers',
            status: 'sent',
            createdAt: '2024-12-05'
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'general' as Notification['type'],
        target: 'all' as Notification['target'],
        scheduledDate: '',
        status: 'draft' as Notification['status']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newNotification: Notification = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setNotifications([newNotification, ...notifications]);
        setFormData({
            title: '',
            message: '',
            type: 'general',
            target: 'all',
            scheduledDate: '',
            status: 'draft'
        });
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const sendNotification = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'sent' } : n));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'announcement':
                return 'bg-blue-900/30 text-blue-300';
            case 'reminder':
                return 'bg-yellow-900/30 text-yellow-300';
            case 'event':
                return 'bg-purple-900/30 text-purple-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'bg-green-900/30 text-green-300';
            case 'scheduled':
                return 'bg-blue-900/30 text-blue-300';
            case 'draft':
                return 'bg-gray-900/30 text-gray-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400 mt-1">Send announcements and reminders to members</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Notification
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total</p>
                                <p className="text-2xl font-bold text-white">{notifications.length}</p>
                            </div>
                            <Bell className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Sent</p>
                                <p className="text-2xl font-bold text-green-300">
                                    {notifications.filter(n => n.status === 'sent').length}
                                </p>
                            </div>
                            <Send className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Scheduled</p>
                                <p className="text-2xl font-bold text-blue-300">
                                    {notifications.filter(n => n.status === 'scheduled').length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Drafts</p>
                                <p className="text-2xl font-bold text-gray-300">
                                    {notifications.filter(n => n.status === 'draft').length}
                                </p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Create Notification Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Create Notification</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-white">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message" className="text-white">Message</Label>
                                    <Textarea
                                        id="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type" className="text-white">Type</Label>
                                        <select
                                            id="type"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Notification['type'] })}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="general">General</option>
                                            <option value="announcement">Announcement</option>
                                            <option value="reminder">Reminder</option>
                                            <option value="event">Event</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="target" className="text-white">Target Audience</Label>
                                        <select
                                            id="target"
                                            value={formData.target}
                                            onChange={(e) => setFormData({ ...formData, target: e.target.value as Notification['target'] })}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">All Members</option>
                                            <option value="members">Members Only</option>
                                            <option value="volunteers">Volunteers</option>
                                            <option value="leaders">Leaders</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="scheduledDate" className="text-white">Schedule Date (Optional)</Label>
                                        <Input
                                            id="scheduledDate"
                                            type="datetime-local"
                                            value={formData.scheduledDate}
                                            onChange={(e) => setFormData({ 
                                                ...formData, 
                                                scheduledDate: e.target.value,
                                                status: e.target.value ? 'scheduled' : 'draft'
                                            })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Send className="h-4 w-4 mr-2" />
                                        {formData.scheduledDate ? 'Schedule' : 'Save Draft'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowForm(false)}
                                        className="border-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Notifications List */}
            <div className="grid gap-4">
                {notifications.map((notification, index) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="glass border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                                            <Badge className={getTypeColor(notification.type)}>
                                                {notification.type}
                                            </Badge>
                                            <Badge className={getStatusColor(notification.status)}>
                                                {notification.status}
                                            </Badge>
                                            <Badge className="bg-purple-900/30 text-purple-300">
                                                {notification.target}
                                            </Badge>
                                        </div>
                                        <p className="text-gray-300 mb-3">{notification.message}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>Created: {new Date(notification.createdAt).toLocaleDateString()}</span>
                                            {notification.scheduledDate && (
                                                <span>Scheduled: {new Date(notification.scheduledDate).toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {notification.status !== 'sent' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => sendNotification(notification.id)}
                                                className="border-green-700 text-green-300"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(notification.id)}
                                            className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {notifications.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No notifications created yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


