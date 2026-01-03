'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Save, Copy, ExternalLink, Radio, Youtube, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface LivestreamConfig {
    id: string;
    platform: 'youtube' | 'facebook' | 'vimeo' | 'custom';
    title: string;
    url: string;
    embedUrl?: string;
    isActive: boolean;
    description?: string;
    scheduledTime?: string;
}

export default function LivestreamPage() {
    const [showForm, setShowForm] = useState(false);
    const [livestreams, setLivestreams] = useState<LivestreamConfig[]>([
        {
            id: '1',
            platform: 'youtube',
            title: 'Sunday Service Live',
            url: 'https://youtube.com/watch?v=example123',
            embedUrl: 'https://www.youtube.com/embed/example123',
            isActive: true,
            description: 'Weekly Sunday worship service',
            scheduledTime: '2024-12-15T10:00:00'
        },
        {
            id: '2',
            platform: 'facebook',
            title: 'Midweek Bible Study',
            url: 'https://facebook.com/live/example',
            isActive: false,
            description: 'Wednesday evening Bible study',
            scheduledTime: '2024-12-18T19:00:00'
        }
    ]);

    const [formData, setFormData] = useState({
        platform: 'youtube' as LivestreamConfig['platform'],
        title: '',
        url: '',
        embedUrl: '',
        description: '',
        scheduledTime: '',
        isActive: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLivestream: LivestreamConfig = {
            id: Date.now().toString(),
            ...formData
        };
        setLivestreams([newLivestream, ...livestreams]);
        setFormData({
            platform: 'youtube',
            title: '',
            url: '',
            embedUrl: '',
            description: '',
            scheduledTime: '',
            isActive: false
        });
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        setLivestreams(livestreams.filter(l => l.id !== id));
    };

    const toggleActive = (id: string) => {
        setLivestreams(livestreams.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'youtube':
                return Youtube;
            case 'facebook':
                return Radio;
            case 'vimeo':
                return Video;
            default:
                return Link2;
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'youtube':
                return 'bg-red-900/30 text-red-300';
            case 'facebook':
                return 'bg-blue-900/30 text-blue-300';
            case 'vimeo':
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
                    <h1 className="text-3xl font-bold text-white">Livestream</h1>
                    <p className="text-gray-400 mt-1">Manage live streaming links and embeds</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Video className="h-4 w-4 mr-2" />
                    Add Livestream
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Streams</p>
                                <p className="text-2xl font-bold text-white">{livestreams.length}</p>
                            </div>
                            <Video className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active</p>
                                <p className="text-2xl font-bold text-green-300">
                                    {livestreams.filter(l => l.isActive).length}
                                </p>
                            </div>
                            <Play className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Scheduled</p>
                                <p className="text-2xl font-bold text-yellow-300">
                                    {livestreams.filter(l => l.scheduledTime && new Date(l.scheduledTime) > new Date()).length}
                                </p>
                            </div>
                            <Radio className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Livestream Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Add New Livestream</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="platform" className="text-white">Platform</Label>
                                    <select
                                        id="platform"
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value as LivestreamConfig['platform'] })}
                                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

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
                                    <Label htmlFor="url" className="text-white">Stream URL</Label>
                                    <Input
                                        id="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://..."
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="embedUrl" className="text-white">Embed URL (Optional)</Label>
                                    <Input
                                        id="embedUrl"
                                        value={formData.embedUrl}
                                        onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="scheduledTime" className="text-white">Scheduled Time (Optional)</Label>
                                        <Input
                                            id="scheduledTime"
                                            type="datetime-local"
                                            value={formData.scheduledTime}
                                            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-2 text-white cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-700 bg-gray-800/50"
                                            />
                                            <span>Set as active</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-white">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Livestream
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

            {/* Livestreams List */}
            <div className="grid gap-4">
                {livestreams.map((livestream, index) => {
                    const PlatformIcon = getPlatformIcon(livestream.platform);
                    return (
                        <motion.div
                            key={livestream.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="glass border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <PlatformIcon className="h-6 w-6" />
                                                <h3 className="text-lg font-semibold text-white">{livestream.title}</h3>
                                                <Badge className={getPlatformColor(livestream.platform)}>
                                                    {livestream.platform}
                                                </Badge>
                                                {livestream.isActive && (
                                                    <Badge className="bg-green-900/30 text-green-300">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            {livestream.description && (
                                                <p className="text-gray-300 text-sm mb-3">{livestream.description}</p>
                                            )}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">URL:</span>
                                                    <code className="text-blue-300 bg-gray-800/50 px-2 py-1 rounded text-xs">
                                                        {livestream.url}
                                                    </code>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard(livestream.url)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                {livestream.embedUrl && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-400">Embed:</span>
                                                        <code className="text-purple-300 bg-gray-800/50 px-2 py-1 rounded text-xs">
                                                            {livestream.embedUrl}
                                                        </code>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => copyToClipboard(livestream.embedUrl || '')}
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                                {livestream.scheduledTime && (
                                                    <div className="text-sm text-gray-400">
                                                        Scheduled: {new Date(livestream.scheduledTime).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleActive(livestream.id)}
                                                className={livestream.isActive ? 'border-green-700 text-green-300' : 'border-gray-700'}
                                            >
                                                {livestream.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(livestream.url, '_blank')}
                                                className="border-gray-700"
                                            >
                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                Open
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(livestream.id)}
                                                className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {livestreams.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Video className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No livestreams configured</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


