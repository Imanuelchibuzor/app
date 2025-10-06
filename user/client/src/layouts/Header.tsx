import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Logo from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./Sidebar";

const Header = () => {
  const user = {
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
  };

  // const user = null

  return (
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
                <div className="flex items-center p-1 rounded-full">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 border rounded-full p-1" />
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
  );
};

export default Header;
