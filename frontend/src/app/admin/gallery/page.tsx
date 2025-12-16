'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Users, 
  Calendar, 
  Church, 
  Settings, 
  Trash2, 
  Edit, 
  Eye, 
  Star, 
  CheckCircle, 
  XCircle, 
  Download,
  FolderPlus,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  AlertCircle,
  BarChart3,
  Clock,
  Tag,
  Layers,
  Database,
  Cloud,
  RefreshCw,
  Save,
  MoreVertical
} from 'lucide-react';
import Image from 'next/image';

// Types for admin gallery management
interface AdminImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  date: string;
  category: 'main' | 'department' | 'event' | 'pastorate' | 'screens';
  department?: string;
  event?: string;
  pastor?: string;
  tags: string[];
  width: number;
  height: number;
  size: number; // in KB
  uploadedBy: string;
  uploadedAt: string;
  status: 'published' | 'pending' | 'archived';
  featured: boolean;
  views: number;
  downloads: number;
}

interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageCount: number;
  color: string;
}

interface Department {
  id: string;
  name: string;
  slug: string;
  imageCount: number;
  lastUpdated: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  imageCount: number;
}

interface Pastor {
  id: string;
  name: string;
  imageCount: number;
}

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'manage' | 'categories' | 'departments' | 'events' | 'pastors'>('dashboard');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isBulkEditing, setIsBulkEditing] = useState(false);

  // Form states for upload
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'main',
    department: '',
    event: '',
    pastor: '',
    tags: '',
    featured: false,
  });

  // Dummy data for admin
  const [images, setImages] = useState<AdminImage[]>([
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
      alt: 'Sunday Service Worship',
      title: 'Sunday Morning Worship',
      description: 'Our vibrant Sunday service with full congregation',
      date: '2024-03-10',
      category: 'main',
      tags: ['worship', 'sunday', 'congregation'],
      width: 800,
      height: 600,
      size: 450,
      uploadedBy: 'Admin User',
      uploadedAt: '2024-03-10 09:30:00',
      status: 'published',
      featured: true,
      views: 1245,
      downloads: 89,
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80',
      alt: 'Prayer Meeting',
      title: 'Wednesday Prayer Night',
      description: 'Intimate prayer and worship evening',
      date: '2024-03-06',
      category: 'main',
      tags: ['prayer', 'worship', 'midweek'],
      width: 800,
      height: 600,
      size: 520,
      uploadedBy: 'Admin User',
      uploadedAt: '2024-03-06 15:45:00',
      status: 'published',
      featured: false,
      views: 876,
      downloads: 42,
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
      alt: 'Children Ministry',
      title: 'Children Sunday School',
      description: 'Interactive learning for children',
      date: '2024-03-09',
      category: 'department',
      department: 'Children Ministry',
      tags: ['children', 'sundayschool', 'learning'],
      width: 800,
      height: 600,
      size: 380,
      uploadedBy: 'Children Ministry',
      uploadedAt: '2024-03-09 11:20:00',
      status: 'pending',
      featured: true,
      views: 532,
      downloads: 31,
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
      alt: 'Christmas Concert',
      title: 'Christmas Concert 2023',
      description: 'Annual Christmas musical celebration',
      date: '2023-12-24',
      category: 'event',
      event: 'Christmas Concert 2023',
      tags: ['christmas', 'concert', 'celebration'],
      width: 800,
      height: 600,
      size: 620,
      uploadedBy: 'Event Team',
      uploadedAt: '2023-12-25 14:30:00',
      status: 'published',
      featured: true,
      views: 2100,
      downloads: 156,
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      alt: 'Senior Pastor',
      title: 'Rev. John Daniels',
      description: 'Senior Pastor portrait',
      date: '2024-01-15',
      category: 'pastorate',
      pastor: 'Rev. John Daniels',
      tags: ['pastor', 'leadership', 'portrait'],
      width: 800,
      height: 600,
      size: 410,
      uploadedBy: 'Admin User',
      uploadedAt: '2024-01-15 10:15:00',
      status: 'archived',
      featured: false,
      views: 345,
      downloads: 12,
    },
  ]);

  const categories: Category[] = [
    { id: '1', name: 'Main Gallery', slug: 'main', description: 'General church activities and services', imageCount: 45, color: 'bg-blue-500' },
    { id: '2', name: 'Departments', slug: 'department', description: 'Ministry department activities', imageCount: 120, color: 'bg-green-500' },
    { id: '3', name: 'Events', slug: 'event', description: 'Special events and conferences', imageCount: 85, color: 'bg-purple-500' },
    { id: '4', name: 'Pastorate', slug: 'pastorate', description: 'Pastoral team photos and events', imageCount: 23, color: 'bg-amber-500' },
    { id: '5', name: 'Screens', slug: 'screens', description: 'Building plans and infrastructure', imageCount: 12, color: 'bg-red-500' },
  ];

  const departments: Department[] = [
    { id: '1', name: 'Children Ministry', slug: 'children', imageCount: 35, lastUpdated: '2024-03-09' },
    { id: '2', name: 'Youth Ministry', slug: 'youth', imageCount: 42, lastUpdated: '2024-03-08' },
    { id: '3', name: 'Women\'s Ministry', slug: 'women', imageCount: 28, lastUpdated: '2024-03-02' },
    { id: '4', name: 'Men\'s Ministry', slug: 'men', imageCount: 15, lastUpdated: '2024-02-15' },
    { id: '5', name: 'Worship & Creative Arts', slug: 'worship', imageCount: 56, lastUpdated: '2024-03-10' },
  ];

  const events: Event[] = [
    { id: '1', name: 'Christmas Concert 2023', date: '2023-12-24', imageCount: 24 },
    { id: '2', name: 'Easter Resurrection Service', date: '2024-03-31', imageCount: 0 },
    { id: '3', name: 'Annual Church Retreat', date: '2024-10-15', imageCount: 0 },
  ];

  const pastors: Pastor[] = [
    { id: '1', name: 'Rev. John Daniels', imageCount: 8 },
    { id: '2', name: 'Pastor Grace Daniels', imageCount: 6 },
    { id: '3', name: 'Pastor Michael Chen', imageCount: 5 },
    { id: '4', name: 'Pastor Sarah Johnson', imageCount: 4 },
  ];

  // Statistics
  const stats = {
    totalImages: images.length,
    publishedImages: images.filter(img => img.status === 'published').length,
    pendingImages: images.filter(img => img.status === 'pending').length,
    archivedImages: images.filter(img => img.status === 'archived').length,
    totalViews: images.reduce((sum, img) => sum + img.views, 0),
    totalDownloads: images.reduce((sum, img) => sum + img.downloads, 0),
    storageUsed: images.reduce((sum, img) => sum + img.size, 0) / 1024, // MB
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newUploads: UploadProgress[] = [];
    
    Array.from(files).forEach((file, index) => {
      const uploadId = `upload-${Date.now()}-${index}`;
      
      newUploads.push({
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading',
      });
      
      // Simulate upload progress
      simulateUpload(uploadId, file);
    });
    
    setUploadProgress(prev => [...prev, ...newUploads]);
  }, []);

  // Simulate upload progress (replace with actual API call)
  const simulateUpload = (uploadId: string, file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => 
        prev.map(upload => 
          upload.id === uploadId 
            ? { ...upload, progress: Math.min(progress, 100) }
            : upload
        )
      );
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Simulate success/error
        const isSuccess = Math.random() > 0.2; // 80% success rate
        setUploadProgress(prev =>
          prev.map(upload =>
            upload.id === uploadId
              ? {
                  ...upload,
                  progress: 100,
                  status: isSuccess ? 'success' : 'error',
                  error: isSuccess ? undefined : 'Upload failed. Please try again.'
                }
              : upload
          )
        );
        
        // Add to images if successful
        if (isSuccess) {
          const newImage: AdminImage = {
            id: `img-${Date.now()}`,
            src: URL.createObjectURL(file),
            alt: file.name,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: `Uploaded: ${new Date().toLocaleDateString()}`,
            date: new Date().toISOString().split('T')[0],
            category: 'main',
            tags: ['uploaded', 'new'],
            width: 800,
            height: 600,
            size: Math.round(file.size / 1024), // Convert to KB
            uploadedBy: 'Admin User',
            uploadedAt: new Date().toISOString(),
            status: 'pending',
            featured: false,
            views: 0,
            downloads: 0,
          };
          
          setImages(prev => [newImage, ...prev]);
        }
      }
    }, 200);
  };

  // Handle bulk actions
  const handleBulkAction = (action: 'publish' | 'archive' | 'delete' | 'feature' | 'unfeature') => {
    switch (action) {
      case 'delete':
        setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
        break;
      case 'publish':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) 
              ? { ...img, status: 'published' as const }
              : img
          )
        );
        break;
      case 'archive':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) 
              ? { ...img, status: 'archived' as const }
              : img
          )
        );
        break;
      case 'feature':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) 
              ? { ...img, featured: true }
              : img
          )
        );
        break;
      case 'unfeature':
        setImages(prev => 
          prev.map(img => 
            selectedImages.includes(img.id) 
              ? { ...img, featured: false }
              : img
          )
        );
        break;
    }
    setSelectedImages([]);
    setIsBulkEditing(false);
  };

  // Handle image deletion
  const deleteImage = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  // Handle status change
  const updateImageStatus = (id: string, status: AdminImage['status']) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, status } : img
      )
    );
  };

  // Handle featured toggle
  const toggleFeatured = (id: string) => {
    setImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, featured: !img.featured } : img
      )
    );
  };

  // Filter images based on search and filters
  const filteredImages = images.filter(img => {
    const matchesSearch = searchQuery === '' || 
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || img.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || img.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Clear all uploads
  const clearCompletedUploads = () => {
    setUploadProgress(prev => prev.filter(upload => upload.status === 'uploading'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gallery Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Upload, organize, and manage church gallery content</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('upload')}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Upload className="h-4 w-4" />
                Upload Images
              </button>
              
              <button className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" /> },
              { id: 'manage', label: 'Manage Images', icon: <ImageIcon className="h-4 w-4" />, count: images.length },
              { id: 'categories', label: 'Categories', icon: <Layers className="h-4 w-4" /> },
              { id: 'departments', label: 'Departments', icon: <Users className="h-4 w-4" /> },
              { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
              { id: 'pastors', label: 'Pastors', icon: <Church className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-green-600 dark:border-emerald-500 text-green-700 dark:text-emerald-400 bg-green-50 dark:bg-emerald-900/20'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count && (
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Images</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalImages}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-emerald-400">↑ {stats.publishedImages} Published</span>
                    <span className="text-gray-600 dark:text-gray-400">{stats.pendingImages} Pending</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Storage Used</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.storageUsed.toFixed(1)} MB</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-400">Last 30 days: +2.4MB</span>
                    <button className="text-green-600 dark:text-emerald-400 hover:underline">Optimize</button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-green-600 dark:text-emerald-400">↑ 12% from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalDownloads}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <Download className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Most downloaded: Christmas Concert
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-800 rounded-lg hover:bg-green-100 dark:hover:bg-emerald-900/30 transition"
                  >
                    <Upload className="h-8 w-8 text-green-600 dark:text-emerald-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Upload New</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                  >
                    <FolderPlus className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Category</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('manage')}
                    className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                  >
                    <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bulk Edit</span>
                  </button>
                  
                  <button className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
                    <Cloud className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Storage</span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {images.slice(0, 3).map((image) => (
                    <div key={image.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {image.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            image.status === 'published' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : image.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                          }`}>
                            {image.status === 'published' ? 'Published' : 
                             image.status === 'pending' ? 'Pending' : 'Archived'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(image.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Storage Overview</h3>
                <button className="text-sm text-green-600 dark:text-emerald-400 hover:underline">
                  View Details
                </button>
              </div>
              
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryImages = images.filter(img => img.category === category.slug);
                  const categorySize = categoryImages.reduce((sum, img) => sum + img.size, 0);
                  const percentage = (categorySize / stats.storageUsed) * 100;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {category.name}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {categoryImages.length} images • {(categorySize / 1024).toFixed(1)} MB
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${category.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.storageUsed.toFixed(1)} MB / 10 GB
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">
                      {(10240 - stats.storageUsed).toFixed(1)} GB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-green-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="h-10 w-10 text-green-600 dark:text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Upload Images
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Drag and drop your images here, or click to browse
                </p>
                
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />
                
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition"
                >
                  <Upload className="h-5 w-5" />
                  Select Images
                </label>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Supports JPG, PNG, WebP up to 10MB each
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Upload Progress ({uploadProgress.filter(u => u.status === 'uploading').length} active)
                  </h3>
                  <button
                    onClick={clearCompletedUploads}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  >
                    Clear completed
                  </button>
                </div>
                
                <div className="space-y-4">
                  {uploadProgress.map((upload) => (
                    <div key={upload.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                              {upload.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-32">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  upload.status === 'success' ? 'bg-green-500' :
                                  upload.status === 'error' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${upload.progress}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="w-20 text-right">
                            {upload.status === 'uploading' && (
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                {upload.progress}%
                              </span>
                            )}
                            {upload.status === 'success' && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {upload.status === 'error' && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {upload.status === 'error' && upload.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 pl-13">
                          {upload.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Image Details
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter image title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="main">Main Gallery</option>
                    <option value="department">Department</option>
                    <option value="event">Event</option>
                    <option value="pastorate">Pastorate</option>
                    <option value="screens">Screens</option>
                  </select>
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter image description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
                    placeholder="worship, sunday, congregation"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      checked={uploadForm.featured}
                      onChange={(e) => setUploadForm({...uploadForm, featured: e.target.checked})}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    Mark as Featured
                  </label>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setUploadForm({
                      title: '',
                      description: '',
                      category: 'main',
                      department: '',
                      event: '',
                      pastor: '',
                      tags: '',
                      featured: false,
                    })}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Reset Form
                  </button>
                  <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">
                    <Save className="h-4 w-4" />
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Images Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {selectedImages.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedImages.length} selected
                      </span>
                      <select
                        onChange={(e) => handleBulkAction(e.target.value as any)}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                      >
                        <option value="">Bulk Actions</option>
                        <option value="publish">Publish</option>
                        <option value="archive">Archive</option>
                        <option value="feature">Feature</option>
                        <option value="unfeature">Unfeature</option>
                        <option value="delete">Delete</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bulk Edit Bar */}
            {isBulkEditing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Bulk Edit Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Editing {selectedImages.length} images
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsBulkEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Images Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden border ${
                      selectedImages.includes(image.id)
                        ? 'border-green-500 dark:border-emerald-500 ring-2 ring-green-500/20 dark:ring-emerald-500/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => toggleFeatured(image.id)}
                              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            >
                              <Star className={`h-4 w-4 ${
                                image.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                              }`} />
                            </button>
                            <button
                              onClick={() => window.open(image.src, '_blank')}
                              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-3 left-3">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedImages([...selectedImages, image.id]);
                            } else {
                              setSelectedImages(selectedImages.filter(id => id !== image.id));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          image.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : image.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                        }`}>
                          {image.status.charAt(0).toUpperCase() + image.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                        {image.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
                        {image.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(image.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {/* Edit functionality */}}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <Edit className="h-3 w-3 text-gray-400" />
                          </button>
                          <button
                            onClick={() => deleteImage(image.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedImages(filteredImages.map(img => img.id));
                            } else {
                              setSelectedImages([]);
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Image</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Title</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Views</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredImages.map((image) => (
                      <tr key={image.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedImages([...selectedImages, image.id]);
                              } else {
                                setSelectedImages(selectedImages.filter(id => id !== image.id));
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{image.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {image.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {image.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={image.status}
                            onChange={(e) => updateImageStatus(image.id, e.target.value as AdminImage['status'])}
                            className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {image.views.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFeatured(image.id)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title={image.featured ? 'Unfeature' : 'Feature'}
                            >
                              <Star className={`h-4 w-4 ${
                                image.featured ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                              }`} />
                            </button>
                            <button
                              onClick={() => window.open(image.src, '_blank')}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => deleteImage(image.id)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No images found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setFilterStatus('all');
                  }}
                  className="inline-flex items-center gap-2 text-green-600 dark:text-emerald-400 hover:underline"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
                <p className="text-gray-600 dark:text-gray-400">Organize images into categories</p>
              </div>
              <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                        <FolderPlus className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Images</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category.imageCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Slug</span>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                        {category.slug}
                      </code>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <button className="flex-1 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                          Edit
                        </button>
                        <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg text-sm">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Departments</h3>
                  <p className="text-gray-600 dark:text-gray-400">Manage ministry department galleries</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium">
                  <Plus className="h-4 w-4" />
                  Add Department
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Department</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Slug</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Images</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">{dept.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {dept.imageCount} images
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 text-sm">
                            {dept.slug}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {dept.imageCount}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {dept.lastUpdated}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                        <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {event.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                      {event.imageCount} images
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <button className="flex-1 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                        Edit Event
                      </button>
                      <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg text-sm">
                        Manage Photos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pastors Tab */}
        {activeTab === 'pastors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastors.map((pastor) => (
                <div
                  key={pastor.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80"
                      alt={pastor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {pastor.name}
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {pastor.imageCount} photos
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Edit className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Backend Integration:</strong> This admin panel uses dummy data. 
                Connect to your backend by replacing API calls in the component with real endpoints.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                  Cloud Storage: Cloudinary/AWS S3
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                  Database: PostgreSQL/MongoDB
                </span>
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded">
                  API: REST/GraphQL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}