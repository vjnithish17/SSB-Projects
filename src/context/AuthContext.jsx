import { createContext, useContext, useEffect, useState } from "react";

import api from "../Services/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ==============================
  // GET CURRENT USER
  // ==============================

  const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      console.error("GET CURRENT USER ERROR:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGIN
  // ==============================

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      showToast(
        `Welcome back, ${user?.name || "User"}!`,
        "success"
      );

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          "Invalid email or password",
        "error"
      );

      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    }
  };

  // ==============================
  // REGISTER
  // ==============================

  const register = async (userData) => {
    try {
      const response = await api.post(
        "/auth/register",
        userData
      );

      const message =
        response.data.message ||
        "Registration successful";

      showToast(
        "Account created successfully",
        "success"
      );

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          "Registration failed",
        "error"
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ==============================
  // CHECK LOGIN
  // ==============================

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==============================
// CUSTOM HOOK
// ==============================

export const useAuth = () => {
  return useContext(AuthContext);
};
