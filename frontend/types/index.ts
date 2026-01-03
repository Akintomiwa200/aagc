/**
 * First Timer Form Data
 */
export interface FirstTimerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  visitDate: string;
  howDidYouHear: string;
  ageGroup: string;
  attendingWith: string[];
  prayerRequest: string;
  interests: string[];
  wantFollowUp: boolean;
}

/**
 * Event Interface
 */
export interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  detail: string;
  category: 'Worship' | 'Outreach' | 'Training' | 'Conference' | 'Other';
  image?: string;
  registrationLink?: string;
  capacity?: number;
  registered?: number;
}

/**
 * Sermon Interface
 */
export interface Sermon {
  id?: string;
  title: string;
  preacher: string;
  date: string;
  series: string;
  duration: string;
  description: string;
  plays: string;
  image?: string;
  videoUrl?: string;
  audioUrl?: string;
  downloadUrl?: string;
  transcript?: string;
}

/**
 * Navigation Link
 */
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Statistics Card
 */
export interface StatCard {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

/**
 * Ministry Interest
 */
export interface MinistryInterest {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

/**
 * Contact Information
 */
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

/**
 * Social Media Links
 */
export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

/**
 * Church Information
 */
export interface ChurchInfo {
  name: string;
  shortName: string;
  description: string;
  logo?: string;
  contact: ContactInfo;
  social: SocialLinks;
  servicesTimes?: ServiceTime[];
}

/**
 * Service Time
 */
export interface ServiceTime {
  day: string;
  time: string;
  type: string;
  description?: string;
}

/**
 * Form Validation Error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

/**
 * User (for future authentication)
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'member' | 'guest';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Prayer Request
 */
export interface PrayerRequest {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  isUrgent?: boolean;
  isAnonymous?: boolean;
  status?: 'pending' | 'praying' | 'answered';
  createdAt?: string;
}

/**
 * Announcement
 */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Donation
 */
export interface Donation {
  id?: string;
  amount: number;
  currency: string;
  type: 'tithe' | 'offering' | 'building' | 'missions' | 'other';
  isRecurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}