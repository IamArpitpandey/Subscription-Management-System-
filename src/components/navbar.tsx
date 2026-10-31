"use client";

import * as React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { session } = useSession();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden text-foreground" aria-label="Toggle sidebar">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 max-w-md w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/20">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            type="search"
            placeholder="Search customers, invoices, subscriptions…"
            className="bg-transparent border-none outline-none w-full text-sm placeholder:text-muted-foreground"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" variant="outline" className="relative h-9 w-9 rounded-lg border-border hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
        </Button>
        {session && (
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{session.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{session.role.toLowerCase()}</p>
            </div>
            <div className="h-9 w-9 rounded-lg flex items-center justify-center font-semibold text-sm"
                 style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)', color: 'white' }}>
              {session.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
