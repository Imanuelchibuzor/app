import { useAuth } from "@/contexts/auth";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetPasswordOtp from "./ResetPasswordOtp";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignUpOtp from "./SignUpOtp";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const auth = useAuth();

  return (
    <main className="absolute  z-10 bg-black/80 w-full h-full pt-12">
      <div className="flex flex-col items-center justify-center animate-fade-in duration-500">
        {auth.mode === "sign-in" && <SignIn />}
        {auth.mode === "sign-up" && <SignUp />}
        {auth.mode === "sign-up-otp" && <SignUpOtp />}
        {auth.mode === "forgot-password" && <ForgotPassword />}
        {auth.mode === "reset-password-otp" && <ResetPasswordOtp />}
        {auth.mode === "reset-password" && <ResetPassword />}
        <Button onClick={() => auth.setShowAuth(false)}>Close</Button>
      </div>
    </main>
  );
};

export default Auth;
