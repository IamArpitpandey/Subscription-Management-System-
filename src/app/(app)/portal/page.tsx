"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { CreditCard, FileText, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PortalPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPortalData() {
    setLoading(true);
    try {
      const [subRes, invRes] = await Promise.all([
        fetch("/api/subscriptions"),
        fetch("/api/invoices"),
      ]);
      const [subJson, invJson] = await Promise.all([subRes.json(), invRes.json()]);
      setSubscriptions(subJson.subscriptions || []);
      setInvoices(invJson.invoices || []);
    } catch {
      toast.error("Failed to load portal data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortalData();
  }, []);

  const outstanding = invoices.reduce(
    (acc, inv) => acc + Math.max(0, Number(inv.grandTotal || 0) - Number(inv.paidAmount || 0)),
    0
  );

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Customer Portal</CardTitle>
        <CardDescription>Your subscriptions, invoices and payments</CardDescription>
      </CardHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-semibold">{subscriptions.filter((s) => s.status === "ACTIVE").length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                <p className="text-2xl font-semibold">₹{outstanding.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-semibold">{invoices.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2 text-left">Plan</th>
                    <th className="pb-2 text-right">Status</th>
                    <th className="pb-2 text-right">Next Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="py-2">{s.plan?.name || "—"}</td>
                      <td className="py-2 text-right">
                        <span className={`px-2 py-1 rounded text-xs ${s.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">No subscriptions</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2 text-left">Number</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b">
                      <td className="py-2">{inv.number}</td>
                      <td className="py-2 text-right">₹{Number(inv.grandTotal || 0).toLocaleString()}</td>
                      <td className="py-2 text-right text-muted-foreground">{inv.status}</td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr><td colSpan={3} className="py-4 text-center text-muted-foreground">No invoices</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
