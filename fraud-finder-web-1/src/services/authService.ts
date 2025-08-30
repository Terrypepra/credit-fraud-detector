// TODO: Use environment variable for API_BASE_URL in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

class AuthService {
  private token: string | null = localStorage.getItem('authToken');
  private user: User | null = null;

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Get current user
  getUser(): User | null {
    return this.user;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Set authentication data
  setAuth(token: string, user: User): void {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear authentication data
  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Register new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    this.setAuth(result.access_token, result.user);
    return result;
  }

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const result = await response.json();
    this.setAuth(result.access_token, result.user);
    return result;
  }

  // Get user profile
  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    const user = await response.json();
    this.user = user;
    return user;
  }

  // Get headers for authenticated requests
  getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }
}

export const authService = new AuthService(); 