'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Music, Plus, Edit2, Trash2, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Sermon {
    id: string;
    title: string;
    speaker: string;
    date: string;
    type: 'video' | 'audio';
    url: string;
    scripture: string;
    description: string;
    thumbnail?: string;
    duration?: string;
}

export default function SermonsPage() {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadType, setUploadType] = useState<'video' | 'audio'>('video');
    const [sermons, setSermons] = useState<Sermon[]>([
        {
            id: '1',
            title: 'The Power of Faith',
            speaker: 'Pastor John Doe',
            date: '2024-12-08',
            type: 'video',
            url: 'https://youtube.com/watch?v=example',
            scripture: 'Hebrews 11:1',
            description: 'A powerful message about faith and trust in God',
            duration: '45:30'
        },
        {
            id: '2',
            title: 'Walking in Love',
            speaker: 'Pastor Jane Smith',
            date: '2024-12-01',
            type: 'audio',
            url: '/sermons/audio/walking-in-love.mp3',
            scripture: '1 Corinthians 13',
            description: 'Understanding the depth of God\'s love',
            duration: '38:15'
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        date: '',
        scripture: '',
        description: '',
        url: '',
        thumbnail: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSermon: Sermon = {
            id: Date.now().toString(),
            ...formData,
            type: uploadType
        };
        setSermons([newSermon, ...sermons]);
        setFormData({
            title: '',
            speaker: '',
            date: '',
            scripture: '',
            description: '',
            url: '',
            thumbnail: ''
        });
        setShowUploadForm(false);
    };

    const handleDelete = (id: string) => {
        setSermons(sermons.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Sermons</h1>
                    <p className="text-gray-400 mt-1">Manage video and audio sermons</p>
                </div>
                <Button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Sermon
                </Button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Upload New Sermon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Selection */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setUploadType('video')}
                                        className={`flex-1 p-4 rounded-lg border-2 transition ${uploadType === 'video'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-gray-700 bg-gray-800/50'
                                            }`}
                                    >
                                        <Video className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                                        <p className="text-white font-medium">Video Sermon</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUploadType('audio')}
                                        className={`flex-1 p-4 rounded-lg border-2 transition ${uploadType === 'audio'
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-700 bg-gray-800/50'
                                            }`}
                                    >
                                        <Music className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                                        <p className="text-white font-medium">Audio Sermon</p>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <Label htmlFor="speaker" className="text-white">Speaker</Label>
                                        <Input
                                            id="speaker"
                                            value={formData.speaker}
                                            onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                            required
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="date" className="text-white">Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="scripture" className="text-white">Scripture Reference</Label>
                                        <Input
                                            id="scripture"
                                            value={formData.scripture}
                                            onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                                            placeholder="e.g., John 3:16"
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="url" className="text-white">
                                        {uploadType === 'video' ? 'Video URL (YouTube/Vimeo) or File' : 'Audio File URL'}
                                    </Label>
                                    <Input
                                        id="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder={uploadType === 'video' ? 'https://youtube.com/watch?v=...' : '/uploads/sermon.mp3'}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                {uploadType === 'video' && (
                                    <div>
                                        <Label htmlFor="thumbnail" className="text-white">Thumbnail URL (Optional)</Label>
                                        <Input
                                            id="thumbnail"
                                            value={formData.thumbnail}
                                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                            placeholder="https://..."
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                )}

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
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Sermon
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowUploadForm(false)}
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

            {/* Sermons List */}
            <div className="grid gap-4">
                {sermons.map((sermon, index) => (
                    <motion.div
                        key={sermon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="glass border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail/Icon */}
                                    <div className="flex-shrink-0">
                                        {sermon.type === 'video' ? (
                                            <div className="w-32 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                <Video className="h-8 w-8 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-32 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                                <Music className="h-8 w-8 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{sermon.title}</h3>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {sermon.speaker} • {new Date(sermon.date).toLocaleDateString()}
                                                </p>
                                                {sermon.scripture && (
                                                    <Badge className="mt-2 bg-blue-900/30 text-blue-300">
                                                        {sermon.scripture}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="border-gray-700">
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-gray-700">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(sermon.id)}
                                                    className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-3">{sermon.description}</p>
                                        {sermon.duration && (
                                            <p className="text-gray-500 text-xs mt-2">Duration: {sermon.duration}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {sermons.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Music className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No sermons uploaded yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
