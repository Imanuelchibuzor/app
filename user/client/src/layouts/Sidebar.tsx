import { Link } from "react-router-dom";
import {
  Bell,
  ChartColumnIncreasing,
  CircleCheckBig,
  House,
  Library,
  Loader2,
  LogOut,
  Menu,
  Share2,
  ShoppingBag,
  SquarePen,
  Upload,
  User,
  Wallet,
  X,
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

const Sidebar = () => {
  const merchant = true;
  const user = {
    name: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
  };
  const image = false;
  const loading = false;
  const failed = false;
  const success = false;

  const navItems = [
    { path: "/", icon: <House className="size-5" />, label: "Home" },
    {
      path: "/library",
      icon: <Library className="size-5" />,
      label: "Library",
    },
    !merchant && {
      path: "/merchant",
      icon: <ChartColumnIncreasing className="size-5" />,
      label: "Become a Merchant",
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
      <SheetContent side="left" className="">
        <SheetHeader>
          <SheetTitle>{user.name}</SheetTitle>
        </SheetHeader>
        {user && (
          <>
            <div className="flex items-center justify-center p-1 gap-2 rounded-full">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 border rounded-full p-1" />
              )}
            </div>
            <div className="flex items-center justify-center text-muted-foreground">
              {!image && !loading && !failed && !success && (
                <Button variant="outline">
                  <SquarePen />
                </Button>
              )}
              {image && !loading && !failed && !success && (
                <Button variant="outline">
                  <Upload className="text-blue-500" />
                </Button>
              )}
              {image && loading && !failed && !success && (
                <Button variant="outline">
                  <Loader2 className="animate-spin" />
                </Button>
              )}
              {!image && !loading && failed && !success && (
                <Button variant="outline">
                  <X className="text-primary" />
                </Button>
              )}
              {!image && !loading && !failed && success && (
                <Button variant="outline">
                  <CircleCheckBig className="text-green-500" />
                </Button>
              )}
            </div>
          </>
        )}
        <Separator />

        <div className="grid flex-1 auto-rows-min gap-3 px-4">
          {navItems.map(({ path, icon, label }) => (
            <SheetClose
              asChild
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-primary/30"
            >
              <Link key={path} to={path}>
                {icon}
                <span>{label}</span>
              </Link>
            </SheetClose>
          ))}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">
              <LogOut /> Logout
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
