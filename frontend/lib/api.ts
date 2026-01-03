const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            // Try to parse error message
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }

        return response.json();
    }

    private async multipartRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            // Fetch will automatically set the correct Content-Type with boundary for FormData
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }

        return response.json();
    }

    // Events
    async getEvents() {
        return this.request<any[]>('/events');
    }

    async getEvent(id: string) {
        return this.request<any>(`/events/${id}`);
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

    async createDevotional(data: any) {
        return this.request<any>('/devotionals', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateDevotional(id: string, data: any) {
        return this.request<any>(`/devotionals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDevotional(id: string) {
        return this.request<any>(`/devotionals/${id}`, {
            method: 'DELETE',
        });
    }

    async createDevotionalMultipart(formData: FormData) {
        return this.multipartRequest<any>('/devotionals', {
            method: 'POST',
            body: formData,
        });
    }

    async updateDevotionalMultipart(id: string, formData: FormData) {
        return this.multipartRequest<any>(`/devotionals/${id}`, {
            method: 'PUT',
            body: formData,
        });
    }

    // Prayers
    async getPrayers() {
        return this.request<any[]>('/prayers');
    }

    async createPrayer(data: any) {
        return this.request<any>('/prayers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Live Stream
    async getLiveStream() {
        return this.request<any>('/livestream');
    }

    // Contact / Join
    async submitConnectionCard(data: any) {
        return this.request<any>('/connection-cards', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Giving
    async getDonations(userId?: string) {
        const query = userId ? `?userId=${userId}` : '';
        return this.request<any[]>(`/donations${query}`);
    }

    async createDonation(data: any) {
        return this.request<any>('/donations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Admin Dashboard
    async getDashboardStats() {
        return this.request<any>('/admin/stats');
    }

    // Admin Events
    async createEvent(data: any) {
        return this.request<any>('/events', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateEvent(id: string, data: any) {
        return this.request<any>(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteEvent(id: string) {
        return this.request<any>(`/events/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Sermons
    async uploadSermon(data: FormData) {
        // FormData needs special handling, don't set Content-Type header manually
        const response = await fetch(`${API_BASE_URL}/sermons`, {
            method: 'POST',
            body: data,
            // headers: { 'Authorization': ... } // Handled by cookies?
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }
        return response.json();
    }

    async deleteSermon(id: string) {
        return this.request<any>(`/sermons/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Members
    async getMembers() {
        return this.request<any[]>('/users'); // Assuming users endpoint serves members
    }

    async addMember(data: any) {
        return this.request<any>('/users', { // Or /admin/members
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateMember(id: string, data: any) {
        return this.request<any>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteMember(id: string) {
        return this.request<any>(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Sermons
    async createSermon(data: any) {
        return this.request<any>('/sermons', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Admin Prayers
    async getPrayerStats() {
        return this.request<any>('/prayers/stats');
    }

    async deletePrayer(id: string) {
        return this.request<any>(`/prayers/${id}`, {
            method: 'DELETE',
        });
    }

    async updatePrayerStatus(id: string, status: string, answer?: string) {
        return this.request<any>(`/prayers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status, answer }),
        });
    }

    // Admin First Timers
    async getFirstTimers() {
        return this.request<any[]>('/first-timers');
    }

    async updateFirstTimerStatus(id: string, status: string, notes?: string) {
        return this.request<any>(`/first-timers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status, notes }),
        });
    }

    async deleteFirstTimer(id: string) {
        return this.request<any>(`/first-timers/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Messages
    async getMessages() {
        return this.request<any[]>('/contact-messages'); // Assuming endpoint is contact-messages
    }

    async replyToMessage(id: string, reply: string) {
        return this.request<any>(`/contact-messages/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply }),
        });
    }

    async markMessageAsRead(id: string) {
        return this.request<any>(`/contact-messages/${id}/read`, {
            method: 'PATCH',
        });
    }

    async deleteMessage(id: string) {
        return this.request<any>(`/contact-messages/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Notifications
    async getNotifications() {
        return this.request<any[]>('/notifications');
    }

    async createNotification(data: any) {
        return this.request<any>('/notifications', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteNotification(id: string) {
        return this.request<any>(`/notifications/${id}`, {
            method: 'DELETE',
        });
    }

    // Admin Website Settings
    async getWebsiteSettings() {
        return this.request<any>('/website-settings');
    }

    async updateWebsiteSettings(data: any) {
        return this.request<any>('/website-settings', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Admin Gallery
    async getGalleryImages(category?: string) {
        const query = category && category !== 'all' ? `?category=${category}` : '';
        return this.request<any[]>(`/gallery${query}`);
    }

    async uploadGalleryImage(data: FormData) {
        const response = await fetch(`${API_BASE_URL}/gallery`, {
            method: 'POST',
            body: data,
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `Request failed with status ${response.status}`);
        }
        return response.json();
    }

    async deleteGalleryImage(id: string) {
        return this.request<any>(`/gallery/${id}`, {
            method: 'DELETE',
        });
    }

    async updateGalleryImage(id: string, data: any) {
        return this.request<any>(`/gallery/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Admin Reports
    async generateReport(type: string, period: string, dateRange?: { start: string, end: string }) {
        return this.request<any>('/reports/generate', {
            method: 'POST',
            body: JSON.stringify({ type, period, dateRange }),
        });
    }

    async getReports() {
        return this.request<any[]>('/reports');
    }
}

export const apiService = new ApiService();
