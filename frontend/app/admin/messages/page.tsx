'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Mail, Reply, Trash2, CheckCircle, Clock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { useEffect, useCallback } from 'react';

interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    date: string;
    status: 'unread' | 'read' | 'replied';
    category?: 'general' | 'prayer' | 'event' | 'giving' | 'other';
}

export default function MessagesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiService.getMessages();
            setMessages(data.map((m: any) => ({
                id: m._id || m.id,
                name: m.name,
                email: m.email,
                phone: m.phone,
                subject: m.subject,
                message: m.message,
                date: m.date || m.createdAt,
                status: m.status || 'unread',
                category: m.category || 'general'
            })));
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                await apiService.deleteMessage(id);
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null);
                }
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await apiService.markMessageAsRead(id);
            setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    // markAsReplied integrated into sendReply and API response handling ideally
    // Keeping a helper function if needed for optimistic updates or internal use
    const updateMessageStatus = (id: string, status: Message['status']) => {
        setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
    };

    const handleReply = (message: Message) => {
        setSelectedMessage(message);
        markAsRead(message.id);
    };

    const sendReply = async () => {
        if (selectedMessage && replyText.trim()) {
            try {
                await apiService.replyToMessage(selectedMessage.id, replyText);
                updateMessageStatus(selectedMessage.id, 'replied'); // Optimistic or after success
                setSelectedMessage(null);
                setReplyText('');
            } catch (error) {
                console.error('Failed to send reply:', error);
            }
        }
    };

    const filteredMessages = messages.filter(message => {
        const matchesFilter = filter === 'all' || message.status === filter;
        const matchesSearch =
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'unread':
                return 'bg-blue-900/30 text-blue-300';
            case 'read':
                return 'bg-gray-900/30 text-gray-300';
            case 'replied':
                return 'bg-green-900/30 text-green-300';
            default:
                return 'bg-gray-900/30 text-gray-300';
        }
    };

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'prayer':
                return 'bg-purple-900/30 text-purple-300';
            case 'event':
                return 'bg-orange-900/30 text-orange-300';
            case 'giving':
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
                    <h1 className="text-3xl font-bold text-white">Messages</h1>
                    <p className="text-gray-400 mt-1">Manage incoming messages and inquiries</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Messages</p>
                                <p className="text-2xl font-bold text-white">{messages.length}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Unread</p>
                                <p className="text-2xl font-bold text-blue-300">
                                    {messages.filter(m => m.status === 'unread').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Read</p>
                                <p className="text-2xl font-bold text-gray-300">
                                    {messages.filter(m => m.status === 'read').length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Replied</p>
                                <p className="text-2xl font-bold text-green-300">
                                    {messages.filter(m => m.status === 'replied').length}
                                </p>
                            </div>
                            <Reply className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search messages..."
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
                        variant={filter === 'unread' ? 'solid' : 'outline'}
                        onClick={() => setFilter('unread')}
                        className={filter === 'unread' ? 'bg-blue-600' : 'border-gray-700'}
                    >
                        Unread
                    </Button>
                    <Button
                        variant={filter === 'read' ? 'solid' : 'outline'}
                        onClick={() => setFilter('read')}
                        className={filter === 'read' ? 'bg-gray-600' : 'border-gray-700'}
                    >
                        Read
                    </Button>
                    <Button
                        variant={filter === 'replied' ? 'solid' : 'outline'}
                        onClick={() => setFilter('replied')}
                        className={filter === 'replied' ? 'bg-green-600' : 'border-gray-700'}
                    >
                        Replied
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredMessages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`glass border-gray-800 cursor-pointer hover:border-blue-500 transition ${selectedMessage?.id === message.id ? 'border-blue-500' : ''
                                    }`}
                                onClick={() => handleReply(message)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-white truncate">{message.subject}</h3>
                                                {message.status === 'unread' && (
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    {message.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {message.email}
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm line-clamp-2">{message.message}</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Badge className={getStatusColor(message.status)}>
                                                    {message.status}
                                                </Badge>
                                                {message.category && (
                                                    <Badge className={getCategoryColor(message.category)}>
                                                        {message.category}
                                                    </Badge>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(message.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(message.id);
                                                }}
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

                {/* Message Detail/Reply */}
                <div className="lg:col-span-1">
                    {selectedMessage ? (
                        <Card className="glass border-gray-800 sticky top-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">{selectedMessage.subject}</h3>
                                        <div className="space-y-2 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {selectedMessage.name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {selectedMessage.email}
                                            </div>
                                            {selectedMessage.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {selectedMessage.phone}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500">
                                                {new Date(selectedMessage.date).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-800 pt-4">
                                        <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                                    </div>
                                    <div className="border-t border-gray-800 pt-4">
                                        <Label className="text-white mb-2">Reply</Label>
                                        <Textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your reply..."
                                            rows={6}
                                            className="bg-gray-800/50 border-gray-700 text-white mb-3"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={sendReply}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 flex-1"
                                                disabled={!replyText.trim()}
                                            >
                                                <Reply className="h-4 w-4 mr-2" />
                                                Send Reply
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedMessage(null);
                                                    setReplyText('');
                                                }}
                                                className="border-gray-700"
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="glass border-gray-800">
                            <CardContent className="p-12 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">Select a message to view details</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {filteredMessages.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No messages found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


