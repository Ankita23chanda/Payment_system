/**
 * API Client Service
 *
 * Automatically sends:
 * 1. Authorization: Bearer <ACCESS_TOKEN>
 * 2. X-Session-Key for guest cart/session continuity
 */

const API_BASE_URL = "/api";

/**
 * Get or create a persistent anonymous session key.
 *
 * This is separate from JWT authentication.
 * It is useful for maintaining guest cart/session continuity.
 */
export const getSessionKey = () => {
  let key = localStorage.getItem("agri_session_key");

  if (!key) {
    key =
      "sess_" +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36);

    localStorage.setItem("agri_session_key", key);
  }

  return key;
};

/**
 * Main API request function.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",

    // Keep session key for guest cart/session continuity.
    "X-Session-Key": getSessionKey(),

    // Allow individual requests to provide their own headers.
    ...(options.headers || {}),
  };

  /**
   * Add JWT access token automatically.
   *
   * After successful OTP verification, AuthContext stores
   * the JWT in localStorage as "agri_access_token".
   */
  const token = localStorage.getItem("agri_access_token");

  if (
    token &&
    token !== "<JWT_ACCESS_TOKEN>" &&
    !headers.Authorization
  ) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  /**
   * Automatically convert JavaScript objects into JSON.
   */
  if (
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData)
  ) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");

    let data = null;

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    /**
     * Handle HTTP errors.
     */
    if (!response.ok) {
      if (response.status === 401 && token) {
        localStorage.removeItem("agri_access_token");
        // For GET requests, auto-retry without stale authorization header
        if ((!options.method || options.method.toUpperCase() === 'GET') && !options._retriedWithoutAuth) {
          const retryHeaders = { ...(options.headers || {}) };
          delete retryHeaders.Authorization;
          return apiRequest(endpoint, {
            ...options,
            _retriedWithoutAuth: true,
            headers: retryHeaders,
          });
        }
      }

      let errorMsg = `Request failed with status ${response.status}`;

      if (data && typeof data === "object") {
        errorMsg =
          data.detail ||
          data.message ||
          data.error ||
          Object.values(data)[0] ||
          errorMsg;
      } else if (typeof data === "string" && data.trim()) {
        errorMsg = data;
      }

      const error = new Error(
        typeof errorMsg === "string"
          ? errorMsg
          : JSON.stringify(errorMsg)
      );

      error.status = response.status;
      error.data = data;

      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * API helper methods.
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, {
      method: "GET",
      ...options,
    }),

  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      method: "POST",
      body,
      ...options,
    }),

  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, {
      method: "PUT",
      body,
      ...options,
    }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, {
      method: "DELETE",
      ...options,
    }),
};