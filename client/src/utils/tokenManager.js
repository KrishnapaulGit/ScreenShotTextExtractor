/**
 * Token management utility for Bearer token authentication
 */

const TOKEN_KEY = 'ocr_api_token';
const TOKEN_EXPIRY_KEY = 'ocr_api_token_expiry';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Generate a new token from the API
 * @param {string} userId - User ID for token generation
 * @param {string} email - User email for token generation
 * @param {string} apiKey - API key for authorization (required)
 * @returns {Promise<string>} - The generated Bearer token
 */
export const generateToken = async (userId = 'frontend-user', email = 'user@example.com', apiKey) => {
  try {
    if (!apiKey) {
      throw new Error('API Key is required to generate tokens');
    }

    const response = await fetch(`${API_BASE_URL}/api/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ userId, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate token');
    }

    const data = await response.json();
    const token = data.token;

    // Store token
    localStorage.setItem(TOKEN_KEY, token);
    
    // Store expiry if token has an expiration (lifetime tokens won't have expiry)
    if (data.expiresIn && !data.expiresIn.toLowerCase().includes('lifetime')) {
      const expiryTime = new Date();
      expiryTime.setDate(expiryTime.getDate() + 7); // Default 7 days
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toISOString());
    } else {
      // Lifetime token - set expiry to year 9999
      const lifetimeExpiry = new Date('9999-12-31');
      localStorage.setItem(TOKEN_EXPIRY_KEY, lifetimeExpiry.toISOString());
    }

    return token;
  } catch (error) {
    console.error('Token generation error:', error);
    throw error;
  }
};

/**
 * Get the stored Bearer token
 * @returns {string|null} - The token or null if not found/expired
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !expiry) {
    return null;
  }

  // Check if token is expired
  if (new Date() > new Date(expiry)) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }

  return token;
};

/**
 * Check if user has a valid token
 * @returns {boolean} - True if token exists and is valid
 */
export const hasValidToken = () => {
  return getToken() !== null;
};

/**
 * Clear the stored token
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Get authorization header with Bearer token
 * @returns {object|null} - Authorization header or null if no token
 */
export const getAuthHeader = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  return {
    'Authorization': `Bearer ${token}`
  };
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error('No valid token found. Please generate a token first.');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
