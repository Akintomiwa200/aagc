'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Edit2, Trash2, Users, MapPin, Clock, Image as ImageIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/contexts/SocketContext';
import { apiService } from '@/lib/api';

interface Event {
    id: string;
    _id?: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string;
    image?: string;
    capacity?: number;
    registrations?: number;
    registrationDeadline?: string;
    status?: 'upcoming' | 'ongoing' | 'completed';
    type?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function EventsPage() {
    const [showForm, setShowForm] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { socket, isConnected } = useSocket();

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/events`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data.map((e: any) => ({
                id: e._id || e.id,
                ...e,
            })));
        } catch (err: any) {
            setError(err.message || 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();

        if (socket) {
            socket.on('event-created', (data: Event) => {
                const eventId = data._id || data.id || '';
                setEvents(prev => [{
                    ...data,
                    id: eventId,
                }, ...prev]);
            });

            socket.on('event-updated', (data: Event) => {
                const eventId = data._id || data.id || '';
                setEvents(prev => prev.map(e =>
                    (e.id === eventId) ? {
                        ...data,
                        id: eventId,
                    } : e
                ));
            });

            socket.on('event-deleted', (data: { eventId: string }) => {
                setEvents(prev => prev.filter(e => e.id !== data.eventId));
            });

            return () => {
                socket.off('event-created');
                socket.off('event-updated');
                socket.off('event-deleted');
            };
        }
    }, [socket, fetchEvents]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        capacity: '',
        registrationDeadline: '',
        status: 'upcoming' as Event['status'],
        type: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiService.createEvent({
                ...formData,
                capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
            });
            // Socket event will update the state
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                location: '',
                image: '',
                capacity: '',
                registrationDeadline: '',
                status: 'upcoming',
                type: ''
            });
            setShowForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create event.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await apiService.deleteEvent(id);
            // Socket event will update the state
        } catch (err: any) {
            setError(err.message || 'Failed to delete event.');
        }
    };

    const duplicateEvent = async (event: Event) => {
        try {
            await apiService.createEvent({
                ...event,
                title: `${event.title} (Copy)`,
                registrations: 0,
            });
            // Socket event will update the state
        } catch (err: any) {
            setError(err.message || 'Failed to duplicate event.');
        }
    };

    if (loading) {
        return <div className="text-white text-center py-10">Loading events...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">Error: {error}</div>;
    }

    const upcomingEvents = events.filter(e => !e.status || e.status === 'upcoming');
    const pastEvents = events.filter(e => e.status === 'completed');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Events</h1>
                    <p className="text-gray-400 mt-1">Create and manage church events</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                </Button>
            </div>

            {/* Create Event Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Create New Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-white">Event Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-white">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        required
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <Label htmlFor="time" className="text-white">Time</Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location" className="text-white">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="capacity" className="text-white">Capacity (Optional)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="image" className="text-white">Event Image URL (Optional)</Label>
                                        <Input
                                            id="image"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://..."
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="registrationDeadline" className="text-white">Registration Deadline (Optional)</Label>
                                        <Input
                                            id="registrationDeadline"
                                            type="date"
                                            value={formData.registrationDeadline}
                                            onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Create Event
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

            {/* Upcoming Events */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Upcoming Events</h2>
                <div className="grid gap-4">
                    {upcomingEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="glass border-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Event Image/Icon */}
                                        <div className="flex-shrink-0">
                                            {event.image ? (
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-32 h-24 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-32 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <Calendar className="h-8 w-8 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                                    <p className="text-gray-300 text-sm mt-2">{event.description}</p>

                                                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                        {event.time && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {event.time}
                                                            </div>
                                                        )}
                                                        {event.location && (
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {event.location}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {event.capacity && (
                                                        <div className="mt-3">
                                                            <div className="flex items-center justify-between text-sm mb-1">
                                                                <span className="text-gray-400">
                                                                    <Users className="h-4 w-4 inline mr-1" />
                                                                    {event.registrations || 0} / {event.capacity} registered
                                                                </span>
                                                                <span className="text-gray-400">
                                                                    {Math.round(((event.registrations || 0) / event.capacity) * 100)}%
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                                                                    style={{ width: `${Math.min(((event.registrations || 0) / event.capacity) * 100, 100)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {event.registrationDeadline && (
                                                        <Badge className="mt-2 bg-orange-900/30 text-orange-300">
                                                            Registration closes: {new Date(event.registrationDeadline).toLocaleDateString()}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => duplicateEvent(event)}
                                                        className="border-gray-700"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="border-gray-700">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(event.id)}
                                                        className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {upcomingEvents.length === 0 && (
                    <Card className="glass border-gray-800">
                        <CardContent className="p-12 text-center">
                            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No upcoming events</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
