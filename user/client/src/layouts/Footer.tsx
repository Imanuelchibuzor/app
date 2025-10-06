import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import { Languages } from "lucide-react";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-muted/50 border-t flex flex-1">
        <div className="container items-center justify-center max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 items-start md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-3">
              <Logo />
              <p className="text-sm text-muted-foreground">
                Your trusted marketplace for digital publications.
              </p>
            </div>

            {/* Navigation Links Column */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-primary">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link
                  to={"/"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  to={"/"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Merchant
                </Link>
                <Link
                  to={"/"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  to={"/"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to={"/"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-primary">Socials</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FaYoutube className="h-4 w-4 text-primary" />
                  </Button>
                  <span className="block text-sm text-muted-foreground">
                    Youtube
                  </span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Button variant="outline" size="sm">
                    <FaInstagram className="h-4 w-4 text-pink-400" />
                  </Button>
                  <span className="block text-sm text-muted-foreground">
                    Instagram
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FaTiktok className="h-4 w-4" />
                  </Button>
                  <span className="block text-sm text-muted-foreground">
                    Tiktok
                  </span>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Language</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Languages className="h-4 w-4" />
                </Button>
                <span className="block text-sm text-muted-foreground">
                  English
                </span>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 saerv. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* <footer className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-4">
            <div className="lg:col-span-2">
              <div className="font-semibold mb-4">
                <Logo />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your trusted marketplace for premium digital publications and
                creative content.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-x-4 text-sm">
                <Link to="/" className="text-gray-400 hover:text-yellow-500">
                  Home
                </Link>
                <Link
                  to="/services"
                  className="text-gray-400 hover:text-yellow-500"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-yellow-500"
                >
                  Merchant
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-yellow-500"
                >
                  Contact
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-yellow-500"
                >
                  Terms
                </Link>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="mb-4">English</span>
              <span className="mb-4">Socials</span>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-xs">
            <p>&copy;2025 Saerv. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
    </>
  );
};

export default Footer;
