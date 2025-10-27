// components/ProtectedRoute.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

type Props = {
  children?: React.ReactNode;
  redirectTo?: string;
  showToast?: boolean;
  fallback?: React.ReactNode;
};

export default function ProtectedRoute({
  children,
  redirectTo = "/",
  showToast = true,
}: Props) {
  const { user, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // prevent multiple toasts / redirects on re-renders
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!authChecked) return; // still checking — do nothing

    if (!user) {
      // only notify once per mount
      if (showToast && !notifiedRef.current) {
        toast.info("Please sign in to continue");
        notifiedRef.current = true;
      }

      // preserve where the user was trying to go (optional)
      navigate(redirectTo, { replace: true, state: { from: location } });
    }
    // run when authChecked or user changes
  }, [authChecked, user, navigate, redirectTo, location, showToast]);

  // when auth checked and user exists, render children
  if (user) return <>{children}</>;

  // otherwise we are redirecting (useEffect will handle), return null to avoid rendering
  return null;
}
