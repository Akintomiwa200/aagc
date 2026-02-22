'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Download, Trash2, CheckCircle, Clock, Search, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { useEffect, useCallback } from 'react';

interface FirstTimer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  visitDate: string;
  howDidYouHear?: string;
  interests?: string[];
  followUpStatus: 'pending' | 'contacted' | 'completed';
  notes?: string;
}

export default function FirstTimersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  const [firstTimers, setFirstTimers] = useState<FirstTimer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFirstTimers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getFirstTimers();
      setFirstTimers(data.map((ft: any) => ({
        id: ft._id || ft.id,
        name: ft.name,
        email: ft.email,
        phone: ft.phone,
        address: ft.address,
        visitDate: ft.visitDate || ft.createdAt,
        howDidYouHear: ft.howDidYouHear,
        interests: ft.interests,
        followUpStatus: ft.followUpStatus || 'pending',
        notes: ft.notes
      })));
    } catch (error) {
      console.error('Failed to fetch first timers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirstTimers();
  }, [fetchFirstTimers]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this first timer record?')) {
      try {
        await apiService.deleteFirstTimer(id);
        setFirstTimers(firstTimers.filter(ft => ft.id !== id));
      } catch (error) {
        console.error('Failed to delete first timer:', error);
      }
    }
  };

  const updateStatus = async (id: string, status: FirstTimer['followUpStatus']) => {
    try {
      await apiService.updateFirstTimerStatus(id, status);
      setFirstTimers(firstTimers.map(ft => ft.id === id ? { ...ft, followUpStatus: status } : ft));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredFirstTimers = firstTimers.filter(ft => {
    const matchesFilter = filter === 'all' || ft.followUpStatus === filter;
    const matchesSearch = ft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ft.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Address', 'Visit Date', 'How Did You Hear', 'Interests', 'Status', 'Notes'],
      ...firstTimers.map(ft => [
        ft.name,
        ft.email,
        ft.phone,
        ft.address || '',
        ft.visitDate,
        ft.howDidYouHear || '',
        ft.interests?.join('; ') || '',
        ft.followUpStatus,
        ft.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `first-timers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-300';
      case 'contacted':
        return 'bg-blue-900/30 text-blue-300';
      case 'completed':
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
          <h1 className="text-3xl font-bold text-white">First Timers</h1>
          <p className="text-gray-400 mt-1">Track and follow up with first-time visitors</p>
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
                <p className="text-gray-400 text-sm">Total Visitors</p>
                <p className="text-2xl font-bold text-white">{firstTimers.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {firstTimers.filter(ft => ft.followUpStatus === 'pending').length}
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
                <p className="text-gray-400 text-sm">Contacted</p>
                <p className="text-2xl font-bold text-blue-300">
                  {firstTimers.filter(ft => ft.followUpStatus === 'contacted').length}
                </p>
              </div>
              <Phone className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-300">
                  {firstTimers.filter(ft => ft.followUpStatus === 'completed').length}
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
            placeholder="Search first timers..."
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
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-yellow-600' : 'border-gray-700'}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'contacted' ? 'default' : 'outline'}
            onClick={() => setFilter('contacted')}
            className={filter === 'contacted' ? 'bg-blue-600' : 'border-gray-700'}
          >
            Contacted
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-green-600' : 'border-gray-700'}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* First Timers List */}
      <div className="grid gap-4">
        {filteredFirstTimers.map((firstTimer, index) => (
          <motion.div
            key={firstTimer.id}
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
                        <h3 className="text-lg font-semibold text-white">{firstTimer.name}</h3>
                        <Badge className={getStatusColor(firstTimer.followUpStatus)}>
                          {firstTimer.followUpStatus}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Visited: {new Date(firstTimer.visitDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(firstTimer.id)}
                      className="border-red-900/50 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {firstTimer.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {firstTimer.phone}
                    </div>
                    {firstTimer.address && (
                      <div className="flex items-center gap-2 text-gray-300 md:col-span-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {firstTimer.address}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {firstTimer.howDidYouHear && (
                    <div className="text-sm">
                      <span className="text-gray-400">How they heard about us: </span>
                      <span className="text-gray-300">{firstTimer.howDidYouHear}</span>
                    </div>
                  )}

                  {firstTimer.interests && firstTimer.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {firstTimer.interests.map((interest, i) => (
                        <Badge key={i} className="bg-purple-900/30 text-purple-300">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {firstTimer.notes && (
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-400">Notes:</p>
                      <p className="text-sm text-gray-300 mt-1">{firstTimer.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-800">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(firstTimer.id, 'pending')}
                      disabled={firstTimer.followUpStatus === 'pending'}
                      className="border-gray-700"
                    >
                      Mark Pending
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(firstTimer.id, 'contacted')}
                      disabled={firstTimer.followUpStatus === 'contacted'}
                      className="border-gray-700"
                    >
                      Mark Contacted
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(firstTimer.id, 'completed')}
                      disabled={firstTimer.followUpStatus === 'completed'}
                      className="border-gray-700"
                    >
                      Mark Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFirstTimers.length === 0 && (
        <Card className="glass border-gray-800">
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No first-time visitors found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
