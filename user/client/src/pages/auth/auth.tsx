import { useAuth } from "@/contexts/auth";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetPasswordOtp from "./ResetPasswordOtp";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignUpOtp from "./SignUpOtp";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Auth = () => {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false); // whether Auth is mounted
  const [visible, setVisible] = useState(false); // opacity toggle

  useEffect(() => {
    if (auth.showAuth) {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true))
      );
      return;
    }

    // start fade-out
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 500);
    return () => clearTimeout(t);
  }, [auth.showAuth]);

  if (!mounted) return null;

  return (
    <main className="absolute inset-0 z-10 pointer-events-none">
      {/* Fade wrapper controls the overlay AND content */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          visible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!visible}
      >
        <div className="absolute inset-0 bg-black/80" aria-hidden="true" />

        {/* content panel (centered); animate opacity + translate for nicer effect */}
        <div className="relative z-10 flex min-h-full items-start justify-center pt-12 px-4">
          <div
            // content box that fades+slides independently for a better effect
            className={`transform transition-all duration-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            } w-full max-w-lg`}
          >
            {/* Render the right auth component */}
            {auth.mode === "sign-in" && <SignIn />}
            {auth.mode === "sign-up" && <SignUp />}
            {auth.mode === "sign-up-otp" && <SignUpOtp />}
            {auth.mode === "forgot-password" && <ForgotPassword />}
            {auth.mode === "reset-password-otp" && <ResetPasswordOtp />}
            {auth.mode === "reset-password" && <ResetPassword />}

            <div className="flex justify-center">
              <Button onClick={() => auth.setShowAuth(false)}>Close</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
