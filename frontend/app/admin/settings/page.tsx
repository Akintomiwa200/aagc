'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  Save, 
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  Lock,
  Bell,
  Palette,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Smartphone,
  Zap,
  Database,
  CreditCard,
  ShieldCheck,
  Users,
  Download,
  Trash2,
  Clock,
  Key,
  Network,
  Activity,
  Check,
  XCircle
} from 'lucide-react';

// Mock data for demo purposes
const mockSessions = [
  { id: 1, device: 'Windows Chrome', location: 'New York, US', time: '2024-01-15 14:30', current: true },
  { id: 2, device: 'iPhone Safari', location: 'London, UK', time: '2024-01-14 09:15', current: false },
  { id: 3, device: 'MacBook Safari', location: 'San Francisco, US', time: '2024-01-13 22:45', current: false },
];

const mockNotifications = [
  { id: 1, type: 'security', title: 'New login detected', time: '2 hours ago', read: false },
  { id: 2, type: 'system', title: 'System update available', time: '1 day ago', read: true },
  { id: 3, type: 'activity', title: 'Profile updated', time: '2 days ago', read: true },
];

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });
  const [securityData, setSecurityData] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    twoFactorEnabled: boolean;
    backupCodes: string[];
  }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    backupCodes: []
  });
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState(mockSessions);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [storageUsage, setStorageUsage] = useState({ used: 2.5, total: 10 }); // GB
  const [apiUsage, setApiUsage] = useState({ calls: 1245, limit: 10000 });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate API usage increase
      setApiUsage(prev => ({
        ...prev,
        calls: Math.min(prev.calls + Math.floor(Math.random() * 10), prev.limit)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update notifications
      setNotifications(prev => [
        { id: Date.now(), type: 'activity', title: 'Profile updated', time: 'Just now', read: false },
        ...prev.slice(0, 4)
      ]);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (securityData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccess('Password updated successfully!');
    setSecurityData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const terminateSession = (sessionId: number) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    setSuccess('Session terminated successfully');
  };

  const terminateAllSessions = () => {
    setActiveSessions(prev => prev.filter(session => session.current));
    setSuccess('All other sessions terminated');
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setSecurityData(prev => ({ ...prev, backupCodes: codes }));
  };

  const toggleTwoFactor = () => {
    setSecurityData(prev => ({ 
      ...prev, 
      twoFactorEnabled: !prev.twoFactorEnabled 
    }));
    setSuccess(`Two-factor authentication ${!securityData.twoFactorEnabled ? 'enabled' : 'disabled'}`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearStorage = () => {
    setStorageUsage(prev => ({ ...prev, used: 0.5 }));
    setSuccess('Storage cleared successfully');
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Personal Information
        </h3>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <User className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={isEditing ? formData.name : user.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={isEditing ? formData.email : user.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="+1 (555) 000-0000"
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                placeholder="City, Country"
                className="block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            rows={3}
            placeholder="Tell us about yourself..."
            className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={user.role}
              disabled
              className="block w-full pl-10 pr-3 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Role changes require administrator approval
          </p>
        </div>
      </form>

      {/* Avatar Upload */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Picture
        </h4>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <img
                src={isEditing ? formData.avatar : user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition shadow-lg">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Upload a new photo. Maximum file size: 5MB. Supported formats: JPG, PNG, GIF.
            </p>
            {isEditing && (
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Upload className="h-4 w-4" />
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Password Change */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Change Password
        </h4>
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                className="block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                className="block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={toggleTwoFactor}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              securityData.twoFactorEnabled ? 'bg-green-600 dark:bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {securityData.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Two-factor authentication is enabled
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Your account is protected with an extra layer of security
                </p>
                
                {securityData.backupCodes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                      Backup Codes (Save these securely):
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {securityData.backupCodes.map((code, index) => (
                        <code
                          key={index}
                          className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border"
                        >
                          {code}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={generateBackupCodes}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <Download className="h-4 w-4" />
                Generate Backup Codes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Active Sessions
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your logged-in devices
            </p>
          </div>
          {activeSessions.length > 1 && (
            <button
              onClick={terminateAllSessions}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <Trash2 className="h-4 w-4" />
              Terminate All Others
            </button>
          )}
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  session.current 
                    ? 'bg-green-100 dark:bg-emerald-900/30' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {session.current ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-emerald-900 text-green-800 dark:text-emerald-300 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.location} • {session.time}
                  </p>
                </div>
              </div>
              
              {!session.current && (
                <button
                  onClick={() => terminateSession(session.id)}
                  className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-8">
      {/* Theme Settings */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Appearance
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Palette, label: 'System' }
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setPreferences({ ...preferences, theme: theme.value })}
                  className={`p-4 rounded-lg border-2 transition ${
                    preferences.theme === theme.value
                      ? 'border-green-500 dark:border-emerald-500 bg-green-50 dark:bg-emerald-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <theme.icon className="h-5 w-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notifications
        </h4>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email updates' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive product updates and offers' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{setting.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
              </div>
              <button
                onClick={() => setPreferences({ 
                  ...preferences, 
                  [setting.key]: !preferences[setting.key as keyof typeof preferences] 
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  preferences[setting.key as keyof typeof preferences] 
                    ? 'bg-green-600 dark:bg-emerald-600' 
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences[setting.key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Language & Region
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Recent Notifications
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            You have {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg font-medium transition"
        >
          <Check className="h-4 w-4" />
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition ${
              notification.read
                ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                : 'bg-white dark:bg-gray-800 border-green-200 dark:border-emerald-800 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                notification.type === 'security' 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : notification.type === 'system'
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-green-100 dark:bg-emerald-900/30'
              }`}>
                <Bell className={`h-5 w-5 ${
                  notification.type === 'security'
                    ? 'text-red-600 dark:text-red-400'
                    : notification.type === 'system'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-green-600 dark:text-emerald-400'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notification.type === 'security' 
                    ? 'Security alert for your account' 
                    : notification.type === 'system'
                    ? 'System update notification'
                    : 'Activity on your account'
                  }
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-green-500 dark:bg-emerald-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-8">
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Storage Usage
            </h4>
            <Database className="h-5 w-5 text-gray-500" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {storageUsage.used.toFixed(1)} GB of {storageUsage.total} GB used
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {((storageUsage.used / storageUsage.total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 dark:bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={clearStorage}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Trash2 className="h-4 w-4" />
            Clear Temporary Files
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              API Usage
            </h4>
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {apiUsage.calls.toLocaleString()} of {apiUsage.limit.toLocaleString()} calls
              </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {((apiUsage.calls / apiUsage.limit) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 dark:bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(apiUsage.calls / apiUsage.limit) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Resets on the 1st of each month
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 dark:border-red-800 rounded-xl p-6 bg-red-50 dark:bg-red-900/10">
        <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Danger Zone
        </h4>
        <p className="text-sm text-red-700 dark:text-red-400 mb-6">
          These actions are irreversible. Please proceed with caution.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Handle account deletion
                setSuccess('Account deletion scheduled');
              }
            }}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="text-left">
                <p className="font-medium text-red-700 dark:text-red-300">
                  Delete Account
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Logout All Devices
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign out from all active sessions
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Navigation & Profile Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg mx-auto">
                    <img
                      src={isEditing ? formData.avatar : user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
                  {isEditing ? formData.name : user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                
                {/* Role Badge */}
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-emerald-900/30 text-green-800 dark:text-emerald-400 rounded-full">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(user.lastLogin || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(user.lastLogin || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {activeSessions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'preferences', label: 'Preferences', icon: Palette },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'account', label: 'Account', icon: CreditCard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition ${
                    activeTab === tab.id
                      ? 'bg-green-50 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'notifications' && notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-auto bg-green-500 dark:bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <Users className="h-4 w-4" />
                  Invite Friends
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
                  <Zap className="h-4 w-4" />
                  Keyboard Shortcuts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'account' && renderAccountTab()}
          </div>
        </div>
      </div>
    </div>
  );
}