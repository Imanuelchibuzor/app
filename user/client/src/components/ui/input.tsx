import * as React from "react";
import { Mail, Lock, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5 text-muted-foreground/80">
        {type === "name" && <User className="h-4 w-4" />}
        {type === "email" && <Mail className="h-4 w-4" />}
        {type === "password" && <Lock className="h-4 w-4" />}
        {type === "search" && <Search className="h-4 w-4" />}
      </div>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          {
            "pl-8":
              type === "name" ||
              type === "email" ||
              type === "password" ||
              type === "search",
          },
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
