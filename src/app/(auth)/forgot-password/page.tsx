"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Request failed");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg"
                 style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', color: 'white' }}>
              BL
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>Brightloop</span>
          </div>

          <Card className="border shadow-xl" style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}>
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
                   style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <CheckCircle className="h-8 w-8" style={{ color: '#10B981' }} />
              </div>
              <CardTitle className="text-2xl font-bold" style={{ color: '#111827' }}>
                Check your email
              </CardTitle>
              <CardDescription className="text-base" style={{ color: '#64748B' }}>
                If an account exists for that email, a password reset link has been sent.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                For development, the reset token is:
              </p>
              <div className="p-3 rounded-lg font-mono text-xs break-all"
                   style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                dev-reset-token-&lt;userId&gt;
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
              <Link href="/login" className="w-full">
                <Button className="w-full h-11 font-semibold rounded-xl" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sign in
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg"
               style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', color: 'white' }}>
            BL
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: '#111827' }}>Brightloop</span>
        </div>

        <Card className="border shadow-xl" style={{ borderColor: '#E2E8F0', backgroundColor: 'white' }}>
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight" style={{ color: '#111827' }}>
              Forgot password?
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#64748B' }}>
              No worries, we'll send you reset instructions
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
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
                style={{
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                  color: 'white'
                }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
            <Link href="/login" className="w-full">
              <Button className="w-full h-11 font-semibold rounded-xl" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
