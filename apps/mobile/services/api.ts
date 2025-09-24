const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.29.76:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    dob: string;
    aadhaarLast4: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(data: { name?: string; phone?: string; address?: string }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(data: { address: string; paymentMethod?: string }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
