"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchQuotations() {
    setLoading(true);
    try {
      const res = await fetch("/api/quotations");
      const json = await res.json();
      setQuotations(json.quotations || []);
    } catch {
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
          <CardDescription>Create and manage customer quotations</CardDescription>
        </CardHeader>
        <Button onClick={() => toast.info("Quotation creation coming in Milestone 3")}>
          <Plus className="h-4 w-4 mr-2" /> Create Quotation
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.number}</TableCell>
                    <TableCell>{q.customer?.name || "—"}</TableCell>
                    <TableCell className="text-right text-sm">₹{Number(q.grandTotal || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{q.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {q.validUntil ? new Date(q.validUntil).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ))}
                {quotations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No quotations found
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
