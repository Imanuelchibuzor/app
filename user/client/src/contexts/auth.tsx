import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  language: string;
  avatar?: { id?: string; url?: string } | null;
  plan: string;
}

interface AuthContextType {
  axios: typeof axios;
  server: string;
  authChecked: boolean;
  decodeUser: () => User | null;
  checkUser: () => void;
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const server = `${import.meta.env.VITE_SERVER}`;

  // Configure axios
  axios.defaults.withCredentials = true; // ✅ send cookies by default
  axios.defaults.baseURL = server;

  // On mount, get user from local storage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.warn("Error fetching stored user", e);
    }
  }, []);

  // Persist user/token to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else localStorage.removeItem("user");
    } catch (e) {
      console.warn("Auth persist failed", e);
    } finally {
      setAuthChecked(true);
    }
  }, [user]);

  const decodeUser = (): User | null => {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith("user_preview="));
    if (!match) return null;
    try {
      const val = decodeURIComponent(match.split("=")[1]);
      const user = JSON.parse(val) as User;
      return user;
    } catch {
      return null;
    }
  };

  const checkUser = () => {
    if (!authChecked) return;

    if (!user) navigate("/");
  };

  const signOut = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post("auth/sign-out");
      if (data.success) {
        setUser(null);
        localStorage.removeItem("merchant");
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err instanceof AxiosError && err.response) {
        message = err.response.data.message || err.response.data.errors;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    axios,
    server,
    authChecked,
    decodeUser,
    checkUser,
    user,
    setUser,
    loading,
    setLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

/**
 * Hook for consuming the auth context
 * Usage: const auth = useAuth();
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
