import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import NotFound from "../pages/public/NotFound";

// Public
import Home from "../pages/public/Home";
import PublicationPage from "../pages/public/PublicationPage";
import About from "../pages/public/About";
import Merchant from "../pages/public/Merchant";
import Contact from "../pages/public/Contact";
import Terms from "../pages/public/Terms";
import Pricacy from "../pages/public/Privacy";

// Auth
import SignUp from "../pages/auth/SignUp";
import SignUpOtp from "../pages/auth/SignUpOtp";
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPasswordOtp from "../pages/auth/ResetPasswordOtp";
import ResetPassword from "../pages/auth/ResetPassword";

// Private
import ProtectedRoute from "@/components/protected-routes";
import Library from "../pages/private/Library";
// import Reader from "../pages/private/Reader"
import Notification from "../pages/private/Notifications";
import VendorDashboard from "../pages/private/Vendor";
import AffiliateDashboard from "../pages/private/Affiliate";
import Promote from "../pages/private/Promote";
import PromotePublication from "../pages/private/PromotePublication";
import Wallet from "../pages/private/Wallet";
import Account from "../pages/private/Account";
import Withdrawal from "../pages/private/Withdrawal";
import AddProductPage from "@/pages/private/Add";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "*", element: <NotFound /> },
      { path: "/", element: <Home /> },
      { path: "/pub/:id", element: <PublicationPage /> },
      { path: "/about", element: <About /> },
      { path: "/merchant", element: <Merchant /> },
      { path: "/contact", element: <Contact /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Pricacy /> },

      { path: "/sign-up", element: <SignUp /> },
      { path: "/verify-email", element: <SignUpOtp /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/verify-otp", element: <ResetPasswordOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },

      {
        path: "/library",
        element: (
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        ),
      },
      // { path: "/view", element: <Reader /> },

      {
        path: "/notification",
        element: (
          <ProtectedRoute>
            {" "}
            <Notification />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/vendor",
        element: (
          <ProtectedRoute>
            {" "}
            <VendorDashboard />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/add",
        element: (
          <ProtectedRoute>
            {" "}
            <AddProductPage />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/affiliate",
        element: (
          <ProtectedRoute>
            {" "}
            <AffiliateDashboard />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/promote",
        element: (
          <ProtectedRoute>
            {" "}
            <Promote />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/promote/:id",
        element: (
          <ProtectedRoute>
            {" "}
            <PromotePublication />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/wallet",
        element: (
          <ProtectedRoute>
            {" "}
            <Wallet />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            {" "}
            <Account />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "/withdraw",
        element: (
          <ProtectedRoute>
            {" "}
            <Withdrawal />{" "}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
