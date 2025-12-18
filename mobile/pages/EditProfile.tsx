import React, { useState } from 'react';
import { ArrowLeft, Save, Camera, Mail, MapPin, User, Phone, AlignLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAppHooks';
import { Button } from '../components/ui/Button';

export const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
  });

  const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      
      updateUser(formData);
      setIsSaving(false);
      navigate('/profile');
  };

  if (!user) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p>Please log in first.</p>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <ArrowLeft className="text-gray-900 dark:text-white" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving || !formData.name} size="sm" className="gap-2">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save
          </Button>
      </div>

      <div className="p-6 max-w-lg mx-auto space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white shadow-md border-2 border-white dark:border-black">
                      <Camera size={16} />
                  </button>
              </div>
              <p className="mt-3 text-xs text-gray-500">Tap to change photo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="Your Name"
                      />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Email</label>
                  <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="email@example.com"
                      />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Phone</label>
                  <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="+1 234 567 890"
                      />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Location</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-all"
                        placeholder="City, Country"
                      />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider ml-1">Bio</label>
                  <div className="relative">
                      <AlignLeft className="absolute left-4 top-4 text-gray-400" size={18} />
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition-all h-32 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                  </div>
              </div>
          </form>
      </div>
    </div>
  );
};