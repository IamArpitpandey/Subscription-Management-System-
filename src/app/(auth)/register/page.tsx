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
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "STAFF" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
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
                Join thousands<br />of businesses.
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-12">
                Start managing your subscriptions professionally. Get up and running 
                in minutes with our intuitive platform.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="max-w-xl space-y-4">
              <div className="rounded-xl p-5 backdrop-blur-sm border flex items-start gap-4"
                   style={{ 
                     background: 'rgba(255,255,255,0.05)',
                     borderColor: 'rgba(255,255,255,0.1)'
                   }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(37, 99, 235, 0.2)' }}>
                  <Zap className="h-5 w-5" style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Lightning Fast Setup</div>
                  <div className="text-sm text-slate-300">Create your account and start billing customers in under 5 minutes.</div>
                </div>
              </div>

              <div className="rounded-xl p-5 backdrop-blur-sm border flex items-start gap-4"
                   style={{ 
                     background: 'rgba(255,255,255,0.05)',
                     borderColor: 'rgba(255,255,255,0.1)'
                   }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
                  <Shield className="h-5 w-5" style={{ color: '#7C3AED' }} />
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Enterprise-Grade Security</div>
                  <div className="text-sm text-slate-300">Bank-level encryption and compliance built-in from day one.</div>
                </div>
              </div>

              <div className="rounded-xl p-5 backdrop-blur-sm border flex items-start gap-4"
                   style={{ 
                     background: 'rgba(255,255,255,0.05)',
                     borderColor: 'rgba(255,255,255,0.1)'
                   }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle className="h-5 w-5" style={{ color: '#10B981' }} />
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">No Credit Card Required</div>
                  <div className="text-sm text-slate-300">Start with our free trial. Upgrade anytime as you grow.</div>
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

      {/* Right Panel - Registration Form */}
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
                Create account
              </CardTitle>
              <CardDescription className="text-base" style={{ color: '#64748B' }}>
                Get started with Brightloop today
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
                  <Label htmlFor="name" className="text-sm font-semibold" style={{ color: '#111827' }}>
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#94A3B8' }} />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className={cn(
                        "pl-11 h-12 text-base rounded-xl border-2 transition-all",
                        errors.name 
                          ? "border-red-300 focus-visible:ring-red-200" 
                          : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100"
                      )}
                      style={{ backgroundColor: 'white', color: '#111827' }}
                      autoComplete="name"
                      autoFocus
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{errors.name.message}</p>
                  )}
                </div>
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
                      autoComplete="new-password"
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
                  <p className="text-xs font-medium" style={{ color: '#64748B' }}>
                    8+ characters with uppercase, lowercase & special character
                  </p>
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
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
              <div className="text-center text-sm font-medium" style={{ color: '#64748B' }}>
                Already have an account?{" "}
                <Link href="/login" className="font-bold hover:underline transition-colors" style={{ color: '#2563EB' }}>
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
