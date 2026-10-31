"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      const json = await res.json();
      setSubscriptions(json.subscriptions || []);
    } catch {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Manage subscription lifecycle</CardDescription>
        </CardHeader>
        <Button onClick={() => toast.info("Subscription creation coming in Milestone 3")}>
          <Plus className="h-4 w-4 mr-2" /> Create Subscription
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
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Start Date</TableHead>
                  <TableHead className="text-right">Next Billing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.number}</TableCell>
                    <TableCell>{s.customer?.name || "—"}</TableCell>
                    <TableCell>{s.plan?.name || "—"}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {s.startDate ? new Date(s.startDate).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString("en-IN") : "—"}
                    </TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                ))}
                {subscriptions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No subscriptions found
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
