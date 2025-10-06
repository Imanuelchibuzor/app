import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import SignUp from "../pages/auth/SignUp";
import SignUpOtp from "@/pages/auth/SignUpOtp";
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPasswordOtp from "../pages/auth/ResetPasswordOtp";
import ResetPassword from "../pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "*", element: <NotFound /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/sign-up-otp", element: <SignUpOtp /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password-otp", element: <ResetPasswordOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
]);

export default router;
