"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, AlertCircle, Eye, EyeOff, TrendingUp, Users, DollarSign, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Invalid email or password");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Premium Branding */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden" style={{ backgroundColor: '#0F172A' }}>
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" 
             style={{ background: 'radial-gradient(circle, #2563EB 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl" 
             style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center font-bold text-lg shadow-xl"
                   style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', color: 'white' }}>
                BL
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Brightloop</span>
            </div>
            
            {/* Hero Content */}
            <div className="max-w-xl">
              <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Subscriptions,<br />simplified.
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-12">
                The complete subscription management platform for modern B2B businesses. 
                Manage customers, plans, billing, and revenue—all in one place.
              </p>
            </div>

            {/* Dashboard Preview Card */}
            <div className="max-w-xl">
              <div className="rounded-2xl p-6 backdrop-blur-sm border shadow-2xl"
                   style={{ 
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                     borderColor: 'rgba(255,255,255,0.1)'
                   }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-1">Monthly Recurring Revenue</div>
                    <div className="text-3xl font-bold text-white">₹2,847,293</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
                       style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                    <TrendingUp className="h-4 w-4" />
                    <span>+23.8%</span>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mb-6 h-24 flex items-end gap-1.5">
                  {[65, 72, 68, 80, 75, 88, 92, 85, 95, 100, 96, 98].map((height, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all"
                         style={{ 
                           height: `${height}%`,
                           background: i === 11 
                             ? 'linear-gradient(180deg, #2563EB 0%, #7C3AED 100%)'
                             : 'rgba(255,255,255,0.2)'
                         }} />
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                           style={{ background: 'rgba(37, 99, 235, 0.2)' }}>
                        <Users className="h-4 w-4" style={{ color: '#2563EB' }} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Active</span>
                    </div>
                    <div className="text-2xl font-bold text-white">2,847</div>
                    <div className="text-xs text-slate-400 mt-1">subscriptions</div>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                           style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                        <CreditCard className="h-4 w-4" style={{ color: '#7C3AED' }} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Invoices</span>
                    </div>
                    <div className="text-2xl font-bold text-white">12,438</div>
                    <div className="text-xs text-slate-400 mt-1">this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-400">
            Everything your subscription business needs.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg"
                 style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', color: 'white' }}>
              BL
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>Brightloop</span>
          </div>

          <Card className="border shadow-xl" style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}>
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-3xl font-bold tracking-tight" style={{ color: '#111827' }}>
                Welcome back
              </CardTitle>
              <CardDescription className="text-base" style={{ color: '#64748B' }}>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              {error && (
                <div className="mb-6 p-4 rounded-xl border flex items-start gap-3"
                     style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                  <span className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-sm font-semibold" style={{ color: '#111827' }}>
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#94A3B8' }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      {...register("email")}
                      className={cn(
                        "pl-11 h-12 text-base rounded-xl border-2 transition-all",
                        errors.email 
                          ? "border-red-300 focus-visible:ring-red-200" 
                          : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100"
                      )}
                      style={{ backgroundColor: 'white', color: '#111827' }}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-sm font-semibold" style={{ color: '#111827' }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#94A3B8' }} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={cn(
                        "pl-11 pr-12 h-12 text-base rounded-xl border-2 transition-all",
                        errors.password 
                          ? "border-red-300 focus-visible:ring-red-200" 
                          : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100"
                      )}
                      style={{ backgroundColor: 'white', color: '#111827' }}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#94A3B8' }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{errors.password.message}</p>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 transition-colors"
                      style={{ 
                        borderColor: '#CBD5E1',
                        accentColor: '#2563EB'
                      }}
                    />
                    <span className="font-medium transition-colors" style={{ color: '#64748B' }}>
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-semibold hover:underline transition-colors"
                    style={{ color: '#2563EB' }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                  style={{
                    background: loading ? '#94A3B8' : 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                    color: 'white'
                  }}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-center text-sm font-medium" style={{ color: '#64748B' }}>
                Don&rsquo;t have an account?{" "}
                <Link href="/register" className="font-bold hover:underline transition-colors" style={{ color: '#2563EB' }}>
                  Create one now
                </Link>
              </div>
              <details className="text-center">
                <summary className="text-xs cursor-pointer inline-block" style={{ color: '#94A3B8' }}>
                  Demo credentials
                </summary>
                <div className="text-xs mt-2 font-mono" style={{ color: '#94A3B8' }}>
                  admin@brightloop.com / Admin@123<br />
                  staff@brightloop.com / Staff@123
                </div>
              </details>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
