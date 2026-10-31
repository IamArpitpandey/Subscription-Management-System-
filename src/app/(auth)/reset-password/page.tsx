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
import { Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { token },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Reset failed");
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Reset password
            </CardTitle>
            <CardDescription className="text-base" style={{ color: '#64748B' }}>
              Choose a new password for your account
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
                <Label htmlFor="password" className="text-sm font-semibold" style={{ color: '#111827' }}>
                  New password
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
                    autoFocus
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
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold" style={{ color: '#111827' }}>
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#94A3B8' }} />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={cn(
                      "pl-11 pr-12 h-12 text-base rounded-xl border-2 transition-all",
                      errors.confirmPassword 
                        ? "border-red-300 focus-visible:ring-red-200" 
                        : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100"
                    )}
                    style={{ backgroundColor: 'white', color: '#111827' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#94A3B8' }}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{errors.confirmPassword.message}</p>
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
                {loading ? "Resetting…" : "Reset password"}
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
