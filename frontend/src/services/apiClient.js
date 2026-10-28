const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'med_ecommerce_token';
const REFRESH_TOKEN_KEY = 'med_ecommerce_refresh_token';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getRoleScope() {
    const path = (typeof window !== 'undefined' && window.location.pathname) || '';
    if (path.startsWith('/superadmin')) return 'superadmin';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/seller')) return 'seller';
    return 'user';
  }

  getToken() {
    const role = this.getRoleScope();
    return localStorage.getItem(`med_token_${role}`) || localStorage.getItem(TOKEN_KEY);
  }

  setTokens(accessToken, refreshToken, role = null) {
    const targetRole = role || this.getRoleScope();
    if (accessToken) {
      localStorage.setItem(`med_token_${targetRole}`, accessToken);
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(`med_refresh_token_${targetRole}`, refreshToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  clearTokens(role = null) {
    if (role) {
      localStorage.removeItem(`med_token_${role}`);
      localStorage.removeItem(`med_refresh_token_${role}`);
    } else {
      ['user', 'seller', 'admin', 'superadmin'].forEach((r) => {
        localStorage.removeItem(`med_token_${r}`);
        localStorage.removeItem(`med_refresh_token_${r}`);
      });
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.error?.message || data?.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.code = data?.error?.code || 'API_ERROR';
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (err) {
      // Re-throw structured error
      throw err;
    }
  }

  get(endpoint, params = null) {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value);
        }
      });
      const queryString = searchParams.toString();
      if (queryString) url += `?${queryString}`;
    }
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
