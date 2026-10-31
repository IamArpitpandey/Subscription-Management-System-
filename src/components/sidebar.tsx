"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  FileText,
  Clock,
  DollarSign,
  Receipt,
  Tag,
  Percent,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

type NavSection = {
  label: string;
  items: Array<{
    label: string;
    href: string;
    icon: React.ElementType;
    roles: ("ADMIN" | "STAFF" | "CUSTOMER")[];
  }>;
};

const NAV_SECTIONS: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "STAFF", "CUSTOMER"] },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Customers", href: "/customers", icon: Users, roles: ["ADMIN", "STAFF"] },
      { label: "Products", href: "/products", icon: Package, roles: ["ADMIN", "STAFF"] },
      { label: "Plans", href: "/plans", icon: CreditCard, roles: ["ADMIN", "STAFF"] },
      { label: "Quotations", href: "/quotations", icon: FileText, roles: ["ADMIN", "STAFF"] },
      { label: "Subscriptions", href: "/subscriptions", icon: Clock, roles: ["ADMIN", "STAFF"] },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { label: "Invoices", href: "/invoices", icon: Receipt, roles: ["ADMIN", "STAFF", "CUSTOMER"] },
      { label: "Payments", href: "/payments", icon: DollarSign, roles: ["ADMIN", "STAFF", "CUSTOMER"] },
      { label: "Discounts", href: "/discounts", icon: Percent, roles: ["ADMIN"] },
      { label: "Taxes", href: "/taxes", icon: Tag, roles: ["ADMIN"] },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3, roles: ["ADMIN", "STAFF"] },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Settings", href: "/settings", icon: Settings, roles: ["ADMIN"] },
    ],
  },
];

export function Sidebar() {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = (session?.role || "STAFF") as "ADMIN" | "STAFF" | "CUSTOMER";

  async function handleSignout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center font-bold text-base"
               style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)', color: 'white' }}>
            BL
          </div>
          <span className="font-bold text-lg text-sidebar-foreground tracking-tight">Brightloop</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-8">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label}>
              <div className="px-3 mb-3">
                <span className="text-xs font-semibold text-sidebar-foreground/50 tracking-wider">
                  {section.label}
                </span>
              </div>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-lg bg-sidebar-accent/50">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center font-semibold text-sm"
               style={{ background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)', color: 'white' }}>
            {session?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {session?.name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {session?.role?.toLowerCase() || "staff"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-150"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
