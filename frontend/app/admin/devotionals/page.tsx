'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit2, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { useEffect, useCallback } from 'react';

interface Devotional {
    id: string;
    title: string;
    author: string;
    date: string;
    scripture: string;
    content: string;
    featuredImage?: string;
    status: 'published' | 'draft';
}

export default function DevotionalsPage() {
    const [showForm, setShowForm] = useState(false);
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDevotionals = useCallback(async () => {
        try {
            setLoading(true);
            const data = await apiService.getDevotionals();
            setDevotionals(data.map((d: any) => ({
                id: d._id || d.id,
                title: d.title,
                author: d.author || 'Pastor',
                date: d.date || d.createdAt,
                scripture: d.scripture,
                content: d.content,
                featuredImage: d.featuredImage,
                status: d.status || 'draft'
            })));
        } catch (error) {
            console.error('Failed to fetch devotionals:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDevotionals();
    }, [fetchDevotionals]);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        date: '',
        scripture: '',
        content: '',
        featuredImage: null as File | null,
        status: 'draft' as 'published' | 'draft'
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, featuredImage: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('author', formData.author);
            data.append('date', formData.date);
            data.append('scripture', formData.scripture);
            data.append('content', formData.content);
            data.append('status', formData.status);
            if (formData.featuredImage) {
                data.append('featuredImage', formData.featuredImage);
            }

            await apiService.createDevotionalMultipart(data);
            fetchDevotionals();
            setFormData({
                title: '',
                author: '',
                date: '',
                scripture: '',
                content: '',
                featuredImage: null,
                status: 'draft'
            });
            setImagePreview(null);
            setShowForm(false);
        } catch (error) {
            console.error('Failed to create devotional:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this devotional?')) {
            try {
                await apiService.deleteDevotional(id);
                setDevotionals(devotionals.filter(d => d.id !== id));
            } catch (error) {
                console.error('Failed to delete devotional:', error);
            }
        }
    };

    const toggleStatus = async (id: string) => {
        const devotional = devotionals.find(d => d.id === id);
        if (!devotional) return;

        const newStatus = devotional.status === 'published' ? 'draft' : 'published';
        try {
            await apiService.updateDevotional(id, { status: newStatus });
            setDevotionals(devotionals.map(d =>
                d.id === id ? { ...d, status: newStatus } : d
            ));
        } catch (error) {
            console.error('Failed to update devotional status:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Devotionals</h1>
                    <p className="text-gray-400 mt-1">Create and manage daily devotionals</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Devotional
                </Button>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Create New Devotional</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                        <Label htmlFor="author" className="text-white">Author</Label>
                                        <Input
                                            id="author"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                                            required
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="featuredImage" className="text-white">Featured Image</Label>
                                    <div className="mt-2 flex items-center gap-4">
                                        <div
                                            className="w-32 h-24 rounded-lg bg-gray-800 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden group"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Edit2 className="h-6 w-6 text-white" />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-8 w-8 text-gray-500 mb-1" />
                                                    <span className="text-xs text-gray-500">Upload</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="content" className="text-white">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={8}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                        placeholder="Write your devotional content here..."
                                    />
                                </div>

                                <div>
                                    <Label className="text-white">Status</Label>
                                    <div className="flex gap-4 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: 'draft' })}
                                            className={`px-4 py-2 rounded-lg transition ${formData.status === 'draft'
                                                ? 'bg-yellow-600 text-white'
                                                : 'bg-gray-800 text-gray-400'
                                                }`}
                                        >
                                            Draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: 'published' })}
                                            className={`px-4 py-2 rounded-lg transition ${formData.status === 'published'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-800 text-gray-400'
                                                }`}
                                        >
                                            Published
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Save Devotional
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

            {/* Devotionals List */}
            <div className="grid gap-4">
                {devotionals.map((devotional, index) => (
                    <motion.div
                        key={devotional.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="glass border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Featured Image or Icon */}
                                    <div className="flex-shrink-0">
                                        {devotional.featuredImage ? (
                                            <img
                                                src={devotional.featuredImage}
                                                alt={devotional.title}
                                                className="w-32 h-24 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-32 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                <BookOpen className="h-8 w-8 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-white">{devotional.title}</h3>
                                                    <Badge
                                                        className={
                                                            devotional.status === 'published'
                                                                ? 'bg-green-900/30 text-green-300'
                                                                : 'bg-yellow-900/30 text-yellow-300'
                                                        }
                                                    >
                                                        {devotional.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {devotional.author} • {new Date(devotional.date).toLocaleDateString()}
                                                </p>
                                                <Badge className="mt-2 bg-blue-900/30 text-blue-300">
                                                    {devotional.scripture}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleStatus(devotional.id)}
                                                    className="border-gray-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="border-gray-700">
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(devotional.id)}
                                                    className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-3 line-clamp-2">{devotional.content}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {devotionals.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No devotionals created yet</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
