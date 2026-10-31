"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Plus, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      const json = await res.json();
      setPayments(json.payments || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>Record and track payments</CardDescription>
        </CardHeader>
        <Button onClick={() => toast.info("Payment recording coming in Milestone 5")}>
          <Plus className="h-4 w-4 mr-2" /> Record Payment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Method</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.invoice?.number || "—"}</TableCell>
                    <TableCell className="text-right text-sm">₹{Number(p.amount || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-center text-sm">{p.method}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{p.reference || "—"}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
