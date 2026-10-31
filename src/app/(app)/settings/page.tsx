"use client";

import * as React from "react";
import { Settings, Users, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Platform configuration and staff management</CardDescription>
      </CardHeader>
      <Tabs defaultValue="profile">
        <TabsList className="w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="staff">Staff Accounts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Coming in Milestone 6</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Admin settings panel coming in final polish.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Admin-only staff account management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Staff management coming in Milestone 6.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Password and session settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Security settings coming in Milestone 6.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
