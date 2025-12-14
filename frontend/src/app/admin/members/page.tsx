'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit2, Trash2, Search, Mail, Phone, MapPin, Calendar, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Member {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    joinDate: string;
    role: 'member' | 'volunteer' | 'leader' | 'pastor';
    status: 'active' | 'inactive';
    groups?: string[];
}

export default function MembersPage() {
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState<Member[]>([
        {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            address: '123 Main St, City, State',
            joinDate: '2023-01-15',
            role: 'member',
            status: 'active',
            groups: ['Worship Team', 'Youth Group']
        },
        {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+1234567891',
            joinDate: '2022-06-20',
            role: 'volunteer',
            status: 'active',
            groups: ['Children\'s Ministry']
        },
        {
            id: '3',
            name: 'Pastor Mark',
            email: 'pastor@example.com',
            phone: '+1234567892',
            joinDate: '2020-03-10',
            role: 'pastor',
            status: 'active',
            groups: ['Leadership']
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        joinDate: '',
        role: 'member' as Member['role'],
        status: 'active' as Member['status']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMember: Member = {
            id: Date.now().toString(),
            ...formData
        };
        setMembers([newMember, ...members]);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            joinDate: '',
            role: 'member',
            status: 'active'
        });
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'pastor':
                return 'bg-purple-900/30 text-purple-300';
            case 'leader':
                return 'bg-blue-900/30 text-blue-300';
            case 'volunteer':
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
                    <h1 className="text-3xl font-bold text-white">Members</h1>
                    <p className="text-gray-400 mt-1">Manage church members and volunteers</p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Members</p>
                                <p className="text-2xl font-bold text-white">{members.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Active</p>
                                <p className="text-2xl font-bold text-green-300">
                                    {members.filter(m => m.status === 'active').length}
                                </p>
                            </div>
                            <UserPlus className="h-8 w-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Volunteers</p>
                                <p className="text-2xl font-bold text-purple-300">
                                    {members.filter(m => m.role === 'volunteer' || m.role === 'leader').length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass border-gray-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">New This Month</p>
                                <p className="text-2xl font-bold text-yellow-300">12</p>
                            </div>
                            <Calendar className="h-8 w-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search members by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                />
            </div>

            {/* Add Member Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="glass gradient-border">
                        <CardHeader>
                            <CardTitle className="text-white">Add New Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="text-white">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-white">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-white">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="joinDate" className="text-white">Join Date</Label>
                                        <Input
                                            id="joinDate"
                                            type="date"
                                            value={formData.joinDate}
                                            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role" className="text-white">Role</Label>
                                        <select
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Member['role'] })}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="member">Member</option>
                                            <option value="volunteer">Volunteer</option>
                                            <option value="leader">Leader</option>
                                            <option value="pastor">Pastor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="status" className="text-white">Status</Label>
                                        <select
                                            id="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Member['status'] })}
                                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="address" className="text-white">Address</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="bg-gray-800/50 border-gray-700 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Add Member
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

            {/* Members List */}
            <div className="grid gap-4">
                {filteredMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="glass border-gray-800">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                                            <Badge className={getRoleColor(member.role)}>
                                                {member.role}
                                            </Badge>
                                            <Badge className={member.status === 'active' ? 'bg-green-900/30 text-green-300' : 'bg-gray-900/30 text-gray-300'}>
                                                {member.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-400">
                                            {member.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {member.email}
                                                </div>
                                            )}
                                            {member.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {member.phone}
                                                </div>
                                            )}
                                            {member.address && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {member.address}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Joined: {new Date(member.joinDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {member.groups && member.groups.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {member.groups.map((group, idx) => (
                                                    <Badge key={idx} className="bg-blue-900/30 text-blue-300">
                                                        {group}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-gray-700">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(member.id)}
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

            {filteredMembers.length === 0 && (
                <Card className="glass border-gray-800">
                    <CardContent className="p-12 text-center">
                        <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No members found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


