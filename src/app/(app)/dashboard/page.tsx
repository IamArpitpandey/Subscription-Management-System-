"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  Download,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MonthData = { month: string; total: number };
type GrowthData = { month: string; count: number };

interface StatsResponse {
  totalCustomers: number;
  activeSubscriptions: number;
  mrr: number;
  totalRevenue: number;
  outstandingPayments: number;
  overdueInvoices: number;
  revenueByMonth: MonthData[];
  subscriptionGrowth: GrowthData[];
  recentSubscriptions: Array<{ id: string; number: string; customer: string; plan: string; status: string; nextBillingDate: Date | null }>;
  recentInvoices: Array<{ id: string; number: string; customer: string; status: string; grandTotal: number; dueDate: Date | null }>;
  recentPayments: Array<{ id: string; amount: number; method: string; date: Date; invoiceNumber: string }>;
  overdueInvoiceTable: Array<{ id: string; number: string; customer: string; dueDate: Date | null; grandTotal: number; paidAmount: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data: StatsResponse) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-96" />
          <SkeletonCard className="h-96" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: CreditCard,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Monthly Recurring Revenue",
      value: formatCurrency(stats.mrr),
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      title: "Outstanding Payments",
      value: formatCurrency(stats.outstandingPayments),
      icon: AlertCircle,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "Overdue Invoices",
      value: stats.overdueInvoices,
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      alert: stats.overdueInvoices > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {stats.totalCustomers > 0 ? "Admin" : "there"}
          </h1>
          <p className="text-muted-foreground text-base">
            Here's what's happening with your subscription business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", card.iconBg)}>
                    <Icon className={cn("h-6 w-6", card.iconColor)} />
                  </div>
                  {card.alert && (
                    <Badge variant="destructive" className="text-xs">
                      Needs attention
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Performance */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Revenue Performance</CardTitle>
                <CardDescription className="mt-1">Monthly revenue over the last 6 months</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF", 
                      border: "1px solid #E2E8F0", 
                      borderRadius: "8px",
                      padding: "12px"
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Growth */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Subscription Growth</CardTitle>
                <CardDescription className="mt-1">New subscriptions by month</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.subscriptionGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF", 
                      border: "1px solid #E2E8F0", 
                      borderRadius: "8px",
                      padding: "12px"
                    }}
                    formatter={(value: number) => [value, "Subscriptions"]}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#2563EB" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Subscriptions */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Subscriptions</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Number</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Plan</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Next Billing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No subscriptions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentSubscriptions.slice(0, 5).map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{s.number}</TableCell>
                      <TableCell className="text-foreground">{s.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{s.plan}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={s.status === "ACTIVE" ? "default" : "secondary"}
                          className={cn(
                            s.status === "ACTIVE" && "bg-green-50 text-green-700 hover:bg-green-100"
                          )}
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString("en-IN") : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Overdue Invoices</CardTitle>
            {stats.overdueInvoiceTable.length > 0 && (
              <CardDescription className="text-destructive font-medium">
                {stats.overdueInvoiceTable.length} invoice{stats.overdueInvoiceTable.length > 1 ? "s" : ""} overdue
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.overdueInvoiceTable.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-green-600 font-medium">All caught up!</p>
                  <p className="text-sm mt-1">No overdue invoices</p>
                </div>
              ) : (
                stats.overdueInvoiceTable.slice(0, 5).map((inv) => (
                  <div key={inv.id} className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-foreground">{inv.number}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(inv.grandTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground truncate flex-1 mr-2">{inv.customer}</span>
                      <span className="text-destructive font-medium">
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SkeletonHeader() {
  return (
    <div className="space-y-3">
      <div className="h-10 bg-muted rounded-lg w-64 animate-pulse" />
      <div className="h-5 bg-muted rounded-lg w-96 animate-pulse" />
    </div>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-12 w-12 bg-muted rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="h-8 bg-muted rounded w-24 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
