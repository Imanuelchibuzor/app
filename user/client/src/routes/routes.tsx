import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import NotFound from "../pages/public/NotFound";

// Public
import Home from "../pages/public/Home";
import ProductPage from "../pages/public/ProductPage";
import About from "../pages/public/About";
import Merchant from "../pages/public/Merchant";
import Contact from "../pages/public/Contact";
import Terms from "../pages/public/Terms";

// Auth
import SignUp from "../pages/auth/SignUp";
import SignUpOtp from "../pages/auth/SignUpOtp";
import SignIn from "../pages/auth/SignIn";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPasswordOtp from "../pages/auth/ResetPasswordOtp";
import ResetPassword from "../pages/auth/ResetPassword";

// Private
import Library from "../pages/private/Library";
import Notification from "../pages/private/Notifications";
import VendorDashboard from "../pages/private/Vendor";
import AffiliateDashboard from "../pages/private/Affiliate";
import Promote from "../pages/private/Promote";
import PromoteProduct from "../pages/private/PromoteProduct";
import Wallet from "../pages/private/Wallet";
import Accout from "../pages/private/AccountSetup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "*", element: <NotFound /> },
      { path: "/", element: <Home /> },
      { path: "/product/:id", element: <ProductPage /> },
      { path: "/about", element: <About /> },
      { path: "/merchant", element: <Merchant /> },
      { path: "/contact", element: <Contact /> },
      { path: "/terms", element: <Terms /> },

      { path: "/sign-up", element: <SignUp /> },
      { path: "/sign-up-otp", element: <SignUpOtp /> },
      { path: "/sign-in", element: <SignIn /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password-otp", element: <ResetPasswordOtp /> },
      { path: "/reset-password", element: <ResetPassword /> },

      { path: "/library", element: <Library /> },
      { path: "/notification", element: <Notification /> },
      { path: "/vendor", element: <VendorDashboard /> },
      { path: "/affiliate", element: <AffiliateDashboard /> },
      { path: "/promote", element: <Promote /> },
      { path: "/promote/:id", element: <PromoteProduct /> },
      { path: "/wallet", element: <Wallet /> },
      { path: "/account", element: <Accout /> },
    ],
  },
]);

export default router;
