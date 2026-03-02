const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
    private readonly requestTimeoutMs = 15000;
    private readonly getRetryAttempts = 1;

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

        return new Error('Unexpected error. Please try again.');
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type') || '';

        if (response.status === 204 || contentLength === '0' || !contentType.includes('json')) {
            return null as T;
        }

        const text = await response.text();
        if (!text || text.trim() === '') {
            return null as T;
        }

        try {
            return JSON.parse(text) as T;
        } catch {
            throw new Error('Invalid JSON response from server');
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        const method = (options.method || 'GET').toUpperCase();
        const maxAttempts = method === 'GET' ? this.getRetryAttempts + 1 : 1;
        let lastError: unknown = null;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    ...options,
                    headers,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({}));
                    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
                }

                return this.parseResponse<T>(response);
            } catch (error) {
                lastError = error;
                const canRetry = method === 'GET' && attempt < maxAttempts && (this.isNetworkFailure(error) || (error instanceof Error && error.name === 'AbortError'));
                if (canRetry) {
                    await this.sleep(250 * attempt);
                    continue;
                }
                throw this.toUserFacingError(error);
            } finally {
                clearTimeout(timeoutId);
            }
        }

        throw this.toUserFacingError(lastError);
    }

    private async multipartRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeoutMs);
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                signal: controller.signal,
                // Fetch will automatically set the correct Content-Type with boundary for FormData
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                throw new Error(errorBody.message || `Request failed with status ${response.status}`);
            }

            return this.parseResponse<T>(response);
        } catch (error) {
            throw this.toUserFacingError(error);
        } finally {
            clearTimeout(timeoutId);
        }
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
        return this.multipartRequest<any>('/sermons', {
            method: 'POST',
            body: data,
        });
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
        return this.multipartRequest<any>('/gallery', {
            method: 'POST',
            body: data,
        });
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
