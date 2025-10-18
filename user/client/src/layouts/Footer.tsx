import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

import Logo from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
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
                  to={"/about"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  to={"/merchant"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Merchant
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
                  Terms & Conditions
                </Link>
                <Link
                  to={"/privacy"}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-primary">Socials</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Link
                    to="https://www.youtube.com/@saerv_app"
                    target="_blank"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaYoutube className="text-primary" />
                  </Link>
                  <span className="block text-sm text-muted-foreground">
                    Youtube
                  </span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Link
                    to="https://www.instagram.com/saerv_app"
                    target="_blank"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaInstagram className="text-pink-400" />
                  </Link>
                  <span className="block text-sm text-muted-foreground">
                    Instagram
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Link
                    to="https://www.tiktok.com/@_saerv"
                    target="_blank"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <FaTiktok />
                  </Link>
                  <span className="block text-sm ">Tiktok</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Language */}
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Language</h3>
                <LanguageModal />
              </div>

              {/* Mail */}
              <div className="space-y-1">
                <h3 className="font-semibold text-primary">Email</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Link
                    to="mailto:emmanuel@saerv.com"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                  <span className="text-sm">emmanuel@saerv.com</span>
                </div>
              </div>
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
