'use client';

import { useState } from 'react';
import { Settings, Save, Key, Mail, Bell, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'permissions'>('profile');
    const [profileData, setProfileData] = useState({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567890',
        role: 'Super Admin'
    });
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSaveProfile = () => {
        console.log('Saving profile:', profileData);
    };

    const handleChangePassword = () => {
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        console.log('Changing password');
        setSecurityData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your account and system settings</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'profile'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'security'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Key className="h-4 w-4 inline mr-2" />
                    Security
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'notifications'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Bell className="h-4 w-4 inline mr-2" />
                    Notifications
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'permissions'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Shield className="h-4 w-4 inline mr-2" />
                    Permissions
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-white">Full Name</Label>
                            <Input
                                id="name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="text-white">Phone</Label>
                            <Input
                                id="phone"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role" className="text-white">Role</Label>
                            <Input
                                id="role"
                                value={profileData.role}
                                disabled
                                className="bg-gray-800/50 border-gray-700 text-gray-500"
                            />
                        </div>
                        <Button
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="newPassword" className="text-white">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <Button
                            onClick={handleChangePassword}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800/50"
                                />
                                <span>Email notifications</span>
                            </label>
                            <label className="flex items-center gap-3 text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800/50"
                                />
                                <span>New member registrations</span>
                            </label>
                            <label className="flex items-center gap-3 text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800/50"
                                />
                                <span>Donation alerts</span>
                            </label>
                            <label className="flex items-center gap-3 text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800/50"
                                />
                                <span>Prayer request notifications</span>
                            </label>
                        </div>
                        <Button
                            onClick={() => console.log('Saving notification preferences')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Preferences
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-800/30 rounded-lg">
                                <h3 className="text-white font-semibold mb-2">Current Role: Super Admin</h3>
                                <p className="text-gray-400 text-sm">
                                    You have full access to all features and settings in the admin panel.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-white font-medium">Available Permissions:</h4>
                                <div className="space-y-1 text-sm text-gray-400">
                                    <div>✓ Manage Members</div>
                                    <div>✓ Manage Events</div>
                                    <div>✓ Manage Donations</div>
                                    <div>✓ Manage Sermons</div>
                                    <div>✓ Manage Settings</div>
                                    <div>✓ View Reports</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


