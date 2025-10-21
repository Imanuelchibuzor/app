import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  language: string;
  avatar?: { id?: string; url?: string } | null;
}

interface AuthContextType {
  server: string;
  decodeUser: () => User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const server = `${import.meta.env.VITE_SERVER}/auth`;

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
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch (e) {
      console.warn("Auth persist failed", e);
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

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    // setError(null);
    // localStorage cleanup will be handled by effect
  };

  const value: AuthContextType = {
    server,
    decodeUser,
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
