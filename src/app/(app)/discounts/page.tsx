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

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchDiscounts() {
    setLoading(true);
    try {
      const res = await fetch("/api/discounts");
      const json = await res.json();
      setDiscounts(json.discounts || []);
    } catch {
      toast.error("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardHeader>
          <CardTitle>Discounts</CardTitle>
          <CardDescription>Manage discount rules and coupons</CardDescription>
        </CardHeader>
        <Button onClick={() => toast.info("Discount creation coming in Milestone 4")}>
          <Plus className="h-4 w-4 mr-2" /> Create Discount
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{d.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm">₹{Number(d.value || 0)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={d.isActive ? "default" : "secondary"}>{d.isActive ? "Yes" : "No"}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{d.usageCount || 0} / {d.usageLimit || "∞"}</TableCell>
                  </TableRow>
                ))}
                {discounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No discounts found
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
