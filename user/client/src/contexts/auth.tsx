"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Auth context for application
 * - mode: 'sign in' | 'sign up' | 'forgot password'
 * - stores user info, token, and helper methods
 *
 * NOTE: replace the placeholder API calls (TODO) with real endpoints from your backend.
 */

export type AuthMode =
  | "sign-in"
  | "sign-up"
  | "sign-up-otp"
  | "forgot-password"
  | "reset-password-otp"
  | "reset-password";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  language: string;
  // ... add other user fields as needed
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name?: string;
  email: string;
  password: string;
}

export interface verifyEmailCredentials {
  email: string;
  otp: number;
}

interface AuthContextType {
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
  showAuth: boolean;
  setShowAuth: (s: boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  // error: string | null;
  // signIn: (creds: SignInCredentials) => Promise<void>;
  // signUp: (creds: SignUpCredentials) => Promise<void>;
  // verifyEmailOtp: (creds: verifyEmailCredentials) => Promise<void>;
  // sendPasswordResetOtp: (email: string) => Promise<void>;
  // VerifyPasswordResetOtp: (email: verifyEmailCredentials) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

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


  // const signIn = async (creds: SignInCredentials) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     await signIn(creds);
  //     const user = {
  //       id: "1",
  //       email: "johndoe@email.com",
  //       name: "John Doe",
  //       avatar:
  //         "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
  //       language: "en",
  //     };

  //     setTimeout(() => {
  //       setUser(user);
  //     }, 3000);
  //   } catch (err) {
  //     setError("Sign in failed");
  //     throw err; // rethrow so callers can react
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    // setError(null);
    setMode("sign-in");
    // localStorage cleanup will be handled by effect
  };

  const value: AuthContextType = {
    mode,
    setMode,
    showAuth,
    setShowAuth,
    user,
    setUser,
    loading,
    setLoading,
    // error,
    // signIn,
    // signUp,
    // verifyEmailOtp,
    // sendPasswordResetOtp,
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
