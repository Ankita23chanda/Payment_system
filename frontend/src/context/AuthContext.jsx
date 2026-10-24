import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "agri_access_token";
const REFRESH_TOKEN_KEY = "agri_refresh_token";
const USER_KEY = "agri_user";
const REMEMBERED_EMAIL_KEY = "agri_remembered_email";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!(
      localStorage.getItem(ACCESS_TOKEN_KEY) &&
      localStorage.getItem(USER_KEY)
    );
  });

  const [loading, setLoading] = useState(false);

  const saveAuthSession = (data, rememberEmail = null) => {
    const access = data.access;
    const refresh = data.refresh;
    const userData = data.user;

    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    if (rememberEmail) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, rememberEmail);
    } else if (rememberEmail === false) {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
  };

  /**
   * Log in with Email & Password
   */
  const login = async (email, password, remember = false) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      saveAuthSession(response, remember ? email : false);
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register with Email, Password, Name, Location, Address, Phone
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      saveAuthSession(response, userData.email);
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear tokens
   */
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const getRememberedEmail = () => {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || "";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        refreshToken,
        loading,
        login,
        register,
        logout,
        getRememberedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};