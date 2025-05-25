const API_BASE_URL = 'http://localhost:8081/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

interface AuthResponse {
  token: string;
  id?: number;
  email: string;
  name: string;
  role: string;
}

interface Product {
  id: number;
  isim: string;
  fiyat: number;
  açıklama: string;
  resimUrl: string;
  stok: number;
  aktif: boolean;
  categoryId: number;
  categoryName: string;
}

interface ProductDTO {
  id?: number;
  isim: string;
  fiyat: number;
  açıklama: string;
  resimUrl: string;
  stok: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  aktif: boolean;
  createdAt: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('organikKoseToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('organikKoseToken', data.token);
    return data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('organikKoseToken', data.token);
    return data;
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to search products');
    }

    return response.json();
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }

    return response.json();
  }

  // Admin endpoints
  async createProduct(product: ProductDTO): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  async updateProduct(id: string, product: ProductDTO): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error('Failed to create category');
    }

    return response.json();
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error('Failed to update category');
    }

    return response.json();
  }

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
  }
}

export const apiService = new ApiService();
export type { AuthResponse, Category, LoginRequest, Product, ProductDTO, RegisterRequest };

