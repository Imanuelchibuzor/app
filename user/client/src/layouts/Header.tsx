import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Sidebar from "./Sidebar";
import Logo from "@/components/logo";
import { useAuth } from "@/contexts/auth";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

const Header = () => {
  const auth = useAuth();
  const user = auth.user;

  return (
    <>
      <div className="sticky bg-background z-10 top-0 inset-x-0 h-16">
        <header className="relative sm:px-2 md:px-5">
          <div className="flex h-16 items-center mx-3">
            <div className="flex">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            <div className="ml-auto flex items-center">
              <div className="flex flex-1 items-center justify-end space-x-3 md:space-x-6">
                {user ? (
                  <div className="flex items-center p-1 border rounded-full">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt="avatar"
                        className="h-8 w-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="h-8 w-8  rounded-full p-1" />
                    )}
                  </div>
                ) : (
                  <Link
                    to={"/sign-in"}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Sign in
                  </Link>
                )}

                <span className="h-6 w-px bg-gray-200" area-hidden="true" />

                <ModeToggle />

                {user && (
                  <span className="h-6 w-px bg-gray-200" area-hidden="true" />
                )}

                {user && <Sidebar />}
              </div>
            </div>
          </div>
          <Separator />
        </header>
      </div>
      {/* {auth.showAuth && <Auth />} */}
    </>
  );
};

export default Header;
