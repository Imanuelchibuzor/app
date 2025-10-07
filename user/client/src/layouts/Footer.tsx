import { Link } from "react-router-dom";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import LanguageModal from "@/components/language-modal";

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
                  to={"/merchant"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Merchant
                </Link>
                <Link
                  to={"/about"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  to={"/contact"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to={"/terms"}
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
              <LanguageModal />
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} saerv. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
