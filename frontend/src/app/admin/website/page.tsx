'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, Eye, Settings, Image, FileText, Link2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WebsiteSettings {
    siteName: string;
    siteDescription: string;
    logoUrl: string;
    faviconUrl: string;
    primaryColor: string;
    secondaryColor: string;
    footerText: string;
    socialLinks: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        youtube?: string;
    };
}

export default function WebsitePage() {
    const [settings, setSettings] = useState<WebsiteSettings>({
        siteName: 'Grace Chapel',
        siteDescription: 'A place of worship and community',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        footerText: '© 2024 Grace Chapel. All rights reserved.',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: ''
        }
    });

    const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'social'>('general');

    const handleSave = () => {
        // Save settings logic here
        console.log('Saving settings:', settings);
    };

    const previewSite = () => {
        window.open('/', '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Website Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your church website</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={previewSite}
                        className="border-gray-700"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'general'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Settings className="h-4 w-4 inline mr-2" />
                    General
                </button>
                <button
                    onClick={() => setActiveTab('appearance')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'appearance'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Palette className="h-4 w-4 inline mr-2" />
                    Appearance
                </button>
                <button
                    onClick={() => setActiveTab('social')}
                    className={`px-4 py-2 font-medium transition ${
                        activeTab === 'social'
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Link2 className="h-4 w-4 inline mr-2" />
                    Social Links
                </button>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="siteName" className="text-white">Site Name</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="siteDescription" className="text-white">Site Description</Label>
                            <Textarea
                                id="siteDescription"
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                rows={3}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
                                <Input
                                    id="logoUrl"
                                    value={settings.logoUrl}
                                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-gray-800/50 border-gray-700 text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="faviconUrl" className="text-white">Favicon URL</Label>
                                <Input
                                    id="faviconUrl"
                                    value={settings.faviconUrl}
                                    onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-gray-800/50 border-gray-700 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="footerText" className="text-white">Footer Text</Label>
                            <Input
                                id="footerText"
                                value={settings.footerText}
                                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="primaryColor" className="text-white">Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="primaryColor"
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="h-10 w-20 bg-gray-800/50 border-gray-700"
                                    />
                                    <Input
                                        value={settings.primaryColor}
                                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="secondaryColor" className="text-white">Secondary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="secondaryColor"
                                        type="color"
                                        value={settings.secondaryColor}
                                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                        className="h-10 w-20 bg-gray-800/50 border-gray-700"
                                    />
                                    <Input
                                        value={settings.secondaryColor}
                                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                        className="bg-gray-800/50 border-gray-700 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Social Links */}
            {activeTab === 'social' && (
                <Card className="glass border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-white">Social Media Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="facebook" className="text-white">Facebook URL</Label>
                            <Input
                                id="facebook"
                                value={settings.socialLinks.facebook || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                                })}
                                placeholder="https://facebook.com/..."
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="twitter" className="text-white">Twitter URL</Label>
                            <Input
                                id="twitter"
                                value={settings.socialLinks.twitter || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                                })}
                                placeholder="https://twitter.com/..."
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram" className="text-white">Instagram URL</Label>
                            <Input
                                id="instagram"
                                value={settings.socialLinks.instagram || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                                })}
                                placeholder="https://instagram.com/..."
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="youtube" className="text-white">YouTube URL</Label>
                            <Input
                                id="youtube"
                                value={settings.socialLinks.youtube || ''}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                                })}
                                placeholder="https://youtube.com/..."
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


