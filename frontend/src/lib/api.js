// frontend/src/lib/api.js
/**
 * API Client
 * Connects to backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Templates
  async getTemplates() {
    return this.request('/api/templates');
  }

  async getTemplate(templateId) {
    return this.request(`/api/templates/${templateId}`);
  }

  // Payment
  async createMockPayment(data) {
    return this.request('/api/payment/mock', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Build
  // frontend/src/lib/api.js
async createBuild(data) {
  console.log('📤 Sending build request:', data); // ADD THIS
  
  return this.request('/api/build/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

  // frontend/src/lib/api.js
async getBuildStatus(buildIdOrLicenseKey) {
  // Now this just returns license info
  return {
    license_key: buildIdOrLicenseKey,
    status: 'ready',
    user_email: 'user@example.com' // Get from payment
  };
}

  getDownloadUrl(buildId) {
    return `${this.baseURL}/api/build/${buildId}/download`;
  }

  // List builds
  async listBuilds(licenseKey, limit = 10) {
    return this.request(`/api/builds?license_key=${licenseKey}&limit=${limit}`);
  }

  // Add to frontend/src/lib/api.js

// OAuth with token
async createBuildWithToken(data) {
  console.log('📤 Creating build with OAuth token:', {
    ...data,
    oauth_token_data: '[REDACTED]'
  });
  
  return this.request('/api/build/create-with-token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Initialize OAuth
async initGoogleOAuth(returnUrl) {
  return this.request('/api/auth/google/init', {
    method: 'POST',
    body: JSON.stringify({ return_url: returnUrl }),
  });
}

// Validate OAuth token
async validateOAuthToken(tokenData) {
  return this.request('/api/auth/google/validate', {
    method: 'POST',
    body: JSON.stringify(tokenData),
  });
}
}

export const api = new APIClient();