'use client';

import { useState } from 'react';
import { Church, Save, MapPin, Phone, Mail, Globe, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ChurchInfo {
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    pastorName: string;
    foundedYear: string;
    logoUrl: string;
    serviceTimes: {
        sunday: string;
        wednesday: string;
        friday: string;
    };
}

export default function ChurchPage() {
    const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
        name: 'Grace Chapel',
        description: 'A welcoming community of believers dedicated to serving God and our community.',
        address: '123 Main Street',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        phone: '+1 (555) 123-4567',
        email: 'info@gracechapel.com',
        website: 'https://gracechapel.com',
        pastorName: 'Pastor John Doe',
        foundedYear: '1990',
        logoUrl: '',
        serviceTimes: {
            sunday: '10:00 AM',
            wednesday: '7:00 PM',
            friday: '7:00 PM'
        }
    });

    const handleSave = () => {
        console.log('Saving church info:', churchInfo);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Church Information</h1>
                    <p className="text-gray-400 mt-1">Manage your church profile and details</p>
                </div>
                <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            {/* Basic Information */}
            <Card className="glass border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-white">Church Name</Label>
                        <Input
                            id="name"
                            value={churchInfo.name}
                            onChange={(e) => setChurchInfo({ ...churchInfo, name: e.target.value })}
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description" className="text-white">Description</Label>
                        <Textarea
                            id="description"
                            value={churchInfo.description}
                            onChange={(e) => setChurchInfo({ ...churchInfo, description: e.target.value })}
                            rows={4}
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="pastorName" className="text-white">Pastor Name</Label>
                            <Input
                                id="pastorName"
                                value={churchInfo.pastorName}
                                onChange={(e) => setChurchInfo({ ...churchInfo, pastorName: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="foundedYear" className="text-white">Founded Year</Label>
                            <Input
                                id="foundedYear"
                                value={churchInfo.foundedYear}
                                onChange={(e) => setChurchInfo({ ...churchInfo, foundedYear: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="logoUrl" className="text-white">Logo URL</Label>
                        <Input
                            id="logoUrl"
                            value={churchInfo.logoUrl}
                            onChange={(e) => setChurchInfo({ ...churchInfo, logoUrl: e.target.value })}
                            placeholder="https://..."
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="glass border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="address" className="text-white">Street Address</Label>
                        <Input
                            id="address"
                            value={churchInfo.address}
                            onChange={(e) => setChurchInfo({ ...churchInfo, address: e.target.value })}
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="city" className="text-white">City</Label>
                            <Input
                                id="city"
                                value={churchInfo.city}
                                onChange={(e) => setChurchInfo({ ...churchInfo, city: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="state" className="text-white">State</Label>
                            <Input
                                id="state"
                                value={churchInfo.state}
                                onChange={(e) => setChurchInfo({ ...churchInfo, state: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="zipCode" className="text-white">ZIP Code</Label>
                            <Input
                                id="zipCode"
                                value={churchInfo.zipCode}
                                onChange={(e) => setChurchInfo({ ...churchInfo, zipCode: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="phone" className="text-white">Phone</Label>
                            <Input
                                id="phone"
                                value={churchInfo.phone}
                                onChange={(e) => setChurchInfo({ ...churchInfo, phone: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={churchInfo.email}
                                onChange={(e) => setChurchInfo({ ...churchInfo, email: e.target.value })}
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="website" className="text-white">Website</Label>
                        <Input
                            id="website"
                            value={churchInfo.website}
                            onChange={(e) => setChurchInfo({ ...churchInfo, website: e.target.value })}
                            placeholder="https://..."
                            className="bg-gray-800/50 border-gray-700 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Service Times */}
            <Card className="glass border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Service Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="sunday" className="text-white">Sunday Service</Label>
                            <Input
                                id="sunday"
                                value={churchInfo.serviceTimes.sunday}
                                onChange={(e) => setChurchInfo({
                                    ...churchInfo,
                                    serviceTimes: { ...churchInfo.serviceTimes, sunday: e.target.value }
                                })}
                                placeholder="10:00 AM"
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="wednesday" className="text-white">Wednesday Service</Label>
                            <Input
                                id="wednesday"
                                value={churchInfo.serviceTimes.wednesday}
                                onChange={(e) => setChurchInfo({
                                    ...churchInfo,
                                    serviceTimes: { ...churchInfo.serviceTimes, wednesday: e.target.value }
                                })}
                                placeholder="7:00 PM"
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="friday" className="text-white">Friday Service</Label>
                            <Input
                                id="friday"
                                value={churchInfo.serviceTimes.friday}
                                onChange={(e) => setChurchInfo({
                                    ...churchInfo,
                                    serviceTimes: { ...churchInfo.serviceTimes, friday: e.target.value }
                                })}
                                placeholder="7:00 PM"
                                className="bg-gray-800/50 border-gray-700 text-white"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


