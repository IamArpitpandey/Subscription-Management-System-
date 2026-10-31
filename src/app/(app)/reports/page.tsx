"use client";

import * as React from "react";
import { DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>Revenue, subscription and financial reports</CardDescription>
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Report</CardTitle>
            <CardDescription>Monthly recurring revenue and totals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Revenue reporting coming in Milestone 5.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View Revenue Report</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Report</CardTitle>
            <CardDescription>Active, paused, and cancelled subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Subscription reporting coming in Milestone 5.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">View Subscription Report</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
