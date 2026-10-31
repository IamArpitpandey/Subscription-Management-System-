"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const taxSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rate: z.string().min(1, "Rate required"),
  isActive: z.boolean(),
});

type Tax = {
  id: string;
  name: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
};

export default function TaxesPage() {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tax | null>(null);

  const form = useForm<z.infer<typeof taxSchema>>({
    resolver: zodResolver(taxSchema),
    defaultValues: { name: "", rate: "", isActive: true },
  });

  async function fetchTaxes() {
    setLoading(true);
    try {
      const res = await fetch("/api/taxes");
      const json = await res.json();
      setTaxes(json.taxes || []);
    } catch {
      toast.error("Failed to load taxes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTaxes();
  }, []);

  async function handleSubmit(data: z.infer<typeof taxSchema>) {
    try {
      const res = await fetch("/api/taxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      form.reset();
      setOpen(false);
      fetchTaxes();
      toast.success("Tax saved");
    } catch {
      toast.error("Failed to save tax");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tax?")) return;
    try {
      const res = await fetch(`/api/taxes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTaxes();
      toast.success("Tax deleted");
    } catch {
      toast.error("Failed to delete tax");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardHeader>
          <CardTitle>Tax Management</CardTitle>
          <CardDescription>Create and manage tax rates</CardDescription>
        </CardHeader>
        <div className="flex items-center gap-2">
          <Button onClick={() => { setEditing(null); form.reset(); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Tax
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxes.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="text-right text-sm">{t.rate}%</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={t.isActive ? "default" : "secondary"}>{t.isActive ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="outline" onClick={() => { setEditing(t); form.reset({ name: t.name, rate: String(t.rate), isActive: t.isActive }); setOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {taxes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No taxes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" size="sm" onClick={() => {}}>
            {editing ? "Edit Tax" : "Add Tax"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tax" : "Add Tax"}</DialogTitle>
            <DialogDescription>
              Configure tax rate details
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Tax Name</FormLabel>
                    <FormControl {...field} placeholder="e.g. GST 18%" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Rate (%)</FormLabel>
                    <FormControl {...field} type="number" step="0.01" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }: any) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl {...field} type="checkbox" />
                      <FormLabel>Active</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setOpen(false); form.reset(); }}>
                  Cancel
                </Button>
                <Button type="submit">{loading ? "Saving…" : "Save Tax"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
