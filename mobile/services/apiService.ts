import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Constants.expoConfig?.extra?.apiUrl) {
    // If the config url is localhost and we are on Android, swap to 10.0.2.2
    if (Platform.OS === 'android' && Constants.expoConfig.extra.apiUrl.includes('localhost')) {
      return Constants.expoConfig.extra.apiUrl.replace('localhost', '10.0.2.2');
    }
    return Constants.expoConfig.extra.apiUrl;
  }

  // Fallback defaults
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

const BASE_URL = getBaseUrl();
const API_BASE_URL = `${BASE_URL}/api`;
class ApiService {
  private token: string | null = null;
  private readonly requestTimeoutMs = 15000;
  private readonly getRetryAttempts = 2;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isNetworkFailure(error: unknown) {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return (
      message.includes('network request failed') ||
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('socket hang up') ||
      message.includes('connection')
    );
  }

  private toUserFacingError(error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new Error('Request timed out. Please check your internet connection and try again.');
    }

    if (this.isNetworkFailure(error)) {
      return new Error('Unable to reach the server. Please verify your internet connection and try again.');
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('Unexpected network error. Please try again.');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const method = (options.method || 'GET').toUpperCase();
    const maxAttempts = method === 'GET' ? this.getRetryAttempts + 1 : 1;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);

      try {
        console.log(`[API] Requesting: ${API_BASE_URL}${endpoint} (attempt ${attempt}/${maxAttempts})`);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(error.message || 'Request failed');
        }

        // Handle empty responses (204 No Content, or empty body)
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type') || '';
        if (response.status === 204 || contentLength === '0' || !contentType.includes('json')) {
          return null as T;
        }

        // Safely parse JSON — guard against empty body
        const text = await response.text();
        if (!text || text.trim() === '') {
          return null as T;
        }

        try {
          return JSON.parse(text) as T;
        } catch {
          throw new Error(`Invalid JSON response from server`);
        }
      } catch (error) {
        lastError = error;
        const canRetry = method === 'GET' && attempt < maxAttempts && (this.isNetworkFailure(error) || (error instanceof Error && error.name === 'AbortError'));

        if (canRetry) {
          await this.sleep(300 * attempt);
          continue;
        }

        throw this.toUserFacingError(error);
      } finally {
        clearTimeout(timeoutId);
      }
    }

    throw this.toUserFacingError(lastError);
  }

  // Generic methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }



  async delete(endpoint: string): Promise<void> {
    return this.request<void>(endpoint, { method: 'DELETE' });
  }

  // Auth
  async login(email: string, password: string) { // Added
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      await this.setToken(response.token);
    }
    return response;
  }

  async register(name: string, email: string, password: string) { // Added
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (response.token) {
      await this.setToken(response.token);
    }
    return response;
  }

  async mobileOAuth(provider: 'google' | 'apple', token: string, email?: string, name?: string, picture?: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/oauth/mobile', {
      method: 'POST',
      body: JSON.stringify({ provider, token, email, name, picture }),
    });
    if (response.token) {
      await this.setToken(response.token);
    }
    return response;
  }

  // Prayers
  async getPrayers() {
    return this.request<any[]>('/prayers');
  }

  async getUserPrayers() {
    // Backend doesn't have a specific getUserPrayers yet, using getPrayers
    return this.getPrayers();
  }

  async createPrayer(data: { name: string; request: string; email?: string; phone?: string; isAnonymous?: boolean }) {
    return this.request<any>('/prayers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePrayerStatus(id: string, status: 'pending' | 'ongoing' | 'answered') {
    return this.request<any>(`/prayers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deletePrayer(id: string) {
    return this.request<void>(`/prayers/${id}`, {
      method: 'DELETE',
    });
  }

  async getPrayerStats() {
    return this.request<{ total: number; pending: number; ongoing: number; answered: number }>('/prayers/stats');
  }

  // Events
  async getEvents() {
    return this.request<any[]>('/events');
  }

  async getTodayEvents() {
    // Backend doesn't have today events specifically yet, using getEvents
    return this.getEvents();
  }

  async getEvent(id: string) {
    return this.request<any>(`/events/${id}`);
  }

  async createEvent(data: any) {
    return this.request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sermons
  async getSermons() {
    return this.request<any[]>('/sermons');
  }

  async getSermon(id: string) {
    return this.request<any>(`/sermons/${id}`);
  }

  // Devotionals
  async getDevotionals() {
    return this.request<any[]>('/devotionals');
  }

  async getTodayDevotional() {
    return this.request<any>('/devotionals/today');
  }

  // User Profile
  async getUserProfile(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async getMe() {
    return this.request<any>('/users/me');
  }

  async updateUserProfile(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePushToken(id: string, pushToken: string) {
    return this.request<any>(`/users/${id}/push-token`, {
      method: 'PUT',
      body: JSON.stringify({ pushToken }),
    });
  }

  // Donations/Giving
  async createDonation(data: { type: string; amount: number; userId: string }) {
    return this.request<any>('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDonations(userId: string) {
    return this.request<any[]>(`/donations?userId=${userId}`);
  }
  // Friend requests
  async getFriends() {
    return this.request<any[]>('/friends');
  }

  async getFriendRequests() {
    return this.request<any[]>('/friends/requests');
  }

  async getSuggestedFriends() {
    return this.request<any[]>('/friends/suggestions');
  }

  async sendFriendRequest(userId: string) {
    return this.request<any>('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async respondToFriendRequest(requestId: string, status: 'accepted' | 'rejected') {
    return this.request<any>(`/friends/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Notifications
  async getNotifications(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any[]>(`/notifications${query}`);
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  // First Timer / Connection Card
  async submitConnectionCard(data: any) {
    return this.request<any>('/connection-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Live Stream
  async getLiveStream() {
    return this.request<any>('/livestream');
  }

  // Gallery
  async getGalleryImages() {
    return this.request<any[]>('/gallery');
  }

  // Notes
  async getNotes(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any[]>(`/notes${query}`);
  }

  async createNote(data: { title: string; content: string; userId: string }) {
    return this.request<any>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNote(id: string, data: { title: string; content: string }) {
    return this.request<any>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: string) {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
