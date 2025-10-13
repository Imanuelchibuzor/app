import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useAuth } from "@/contexts/auth";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SignUpOtp from "./SignUpOtp";
import ForgotPassword from "./ForgotPassword";
import ResetPasswordOtp from "./ResetPasswordOtp";
import ResetPassword from "./ResetPassword";

const Auth = () => {
  const auth = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        {auth.mode === "sign-in" && <SignIn />}
        {auth.mode === "sign-up" && <SignUp />}
        {auth.mode === "sign-up-otp" && <SignUpOtp />}
        {auth.mode === "forgot-password" && <ForgotPassword />}
        {auth.mode === "reset-password-otp" && <ResetPasswordOtp />}
        {auth.mode === "reset-password" && <ResetPassword />}
      </DialogContent>
    </Dialog>
  );
};

export default Auth;
