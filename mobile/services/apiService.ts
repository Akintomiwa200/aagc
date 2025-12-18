const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async mobileOAuth(provider: 'google' | 'apple', token: string, email?: string, name?: string, picture?: string) {
    return this.request<{ token: string; user: any }>('/auth/oauth/mobile', {
      method: 'POST',
      body: JSON.stringify({ provider, token, email, name, picture }),
    });
  }

  // Prayers
  async getPrayers() {
    return this.request<any[]>('/prayers');
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

  // User Profile
  async getUserProfile(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUserProfile(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
}

export const apiService = new ApiService();

