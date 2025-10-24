import { Link } from "react-router-dom";
import {
  Bell,
  House,
  Library,
  LogOut,
  Menu,
  Share2,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const {user, signOut} = useAuth();
  const merchant = user?.plan;

  const navItems = [
    { path: "/", icon: <House className="size-5" />, label: "Home" },
    {
      path: "/library",
      icon: <Library className="size-5" />,
      label: "Library",
    },
    merchant && {
      path: "/notification",
      icon: <Bell className="size-5" />,
      label: "Notification",
    },
    merchant && {
      path: "/vendor",
      icon: <ShoppingBag className="size-5" />,
      label: "Vendor",
    },
    merchant && {
      path: "/affiliate",
      icon: <Share2 className="size-5" />,
      label: "Affiliate",
    },
    merchant && {
      path: "/wallet",
      icon: <Wallet className="size-5" />,
      label: "Wallet",
    },
  ].filter((item) => typeof item === "object" && item !== null);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{user?.email}</SheetTitle>
        </SheetHeader>
        {user && (
          <>
            <div className="flex items-center justify-center p-1 gap-2 rounded-full">
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-20 w-20 border rounded-full p-1" />
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="font-medium">Hi, {user.name}!</span>
              {user.plan && (
                <Badge variant="outline" className="text-primary/80">
                  {user.plan}
                </Badge>
              )}
            </div>
          </>
        )}
        <Separator />

        <div className="grid flex-1 auto-rows-min gap-3 px-4">
          {navItems.map(({ path, icon, label }) => (
            <SheetClose
              asChild
              key={path}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-primary/30"
            >
              <Link to={path}>
                {icon}
                <span>{label}</span>
              </Link>
            </SheetClose>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" onClick={signOut}>
              <LogOut /> Logout
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
