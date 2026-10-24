import { api } from "./api";

export const authService = {
  /**
   * Login user with email and password.
   */
  login: async ({ email, password }) => {
    return api.post("/auth/login/", {
      email,
      password,
    });
  },

  /**
   * Register a new user account with details.
   */
  register: async (userData) => {
    return api.post("/auth/register/", userData);
  },

  /**
   * Retrieve the currently authenticated user's profile.
   */
  getProfile: async () => {
    return api.get("/users/me/");
  },

  /**
   * Update the currently authenticated user's profile.
   */
  updateProfile: async (data) => {
    return api.put("/users/me/", data);
  },
};