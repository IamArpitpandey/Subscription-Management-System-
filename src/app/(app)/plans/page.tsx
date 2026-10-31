"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, CreditCard, Clock, Download, Check, Calendar, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  price: z.string().min(1, "Price required"),
  minQuantity: z.coerce.number().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  autoClose: z.boolean(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  description: z.string().optional(),
});

type Plan = {
  id: string;
  name: string;
  billingCycle: string;
  price: number;
  minQuantity: number;
  startDate: string | null;
  endDate: string | null;
  autoClose: boolean;
  status: string;
  description: string | null;
  createdAt: string;
  _count?: { subscriptions: number };
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cycleFilter, setCycleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);

  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema as any),
    defaultValues: { 
      name: "", 
      billingCycle: "MONTHLY", 
      price: "", 
      minQuantity: 1, 
      startDate: "", 
      endDate: "", 
      autoClose: false, 
      status: "ACTIVE", 
      description: "" 
    },
  });

  async function fetchPlans() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/plans?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      const json = await res.json();
      setPlans(json.plans || []);
      setTotal(json.total || 0);
    } catch {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [page, search]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  async function handleSubmit(data: z.infer<typeof planSchema>) {
    try {
      const url = editing ? `/api/plans/${editing.id}` : "/api/plans";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      form.reset();
      setOpen(false);
      setEditing(null);
      fetchPlans();
      toast.success(editing ? "Plan updated successfully" : "Plan created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save plan");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchPlans();
      toast.success("Plan deleted successfully");
    } catch {
      toast.error("Failed to delete plan");
    }
  }

  function handleEdit(plan: Plan) {
    setEditing(plan);
    form.reset({
      name: plan.name,
      billingCycle: plan.billingCycle as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
      price: String(plan.price),
      minQuantity: plan.minQuantity,
      startDate: plan.startDate ? plan.startDate.split('T')[0] : "",
      endDate: plan.endDate ? plan.endDate.split('T')[0] : "",
      autoClose: plan.autoClose,
      status: plan.status as "ACTIVE" | "INACTIVE",
      description: plan.description || "",
    });
    setOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    form.reset({ 
      name: "", 
      billingCycle: "MONTHLY", 
      price: "", 
      minQuantity: 1, 
      startDate: "", 
      endDate: "", 
      autoClose: false, 
      status: "ACTIVE", 
      description: "" 
    });
    setOpen(true);
  }

  const activeCount = plans.filter(p => p.status === "ACTIVE").length;
  const totalPages = Math.ceil(total / limit);
  const filteredPlans = cycleFilter ? plans.filter(p => p.billingCycle === cycleFilter) : plans;
  const totalRevenue = plans.reduce((sum, p) => sum + (p.price * (p._count?.subscriptions || 0)), 0);

  const cycleIcon = (cycle: string) => {
    switch (cycle) {
      case "DAILY": return <Clock className="h-4 w-4" />;
      case "WEEKLY": return <Calendar className="h-4 w-4" />;
      case "MONTHLY": return <CreditCard className="h-4 w-4" />;
      case "YEARLY": return <Package className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const cycleColor = (cycle: string) => {
    switch (cycle) {
      case "DAILY": return "bg-orange-50 text-orange-700 border-orange-200";
      case "WEEKLY": return "bg-blue-50 text-blue-700 border-blue-200";
      case "MONTHLY": return "bg-purple-50 text-purple-700 border-purple-200";
      case "YEARLY": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const cycleSuffix = (cycle: string) => {
    switch (cycle) {
      case "DAILY": return "/day";
      case "WEEKLY": return "/week";
      case "MONTHLY": return "/month";
      case "YEARLY": return "/year";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage billing plans, pricing tiers, and subscription cycles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Plans</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Plans</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{activeCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Subscriptions</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">
                  {plans.reduce((sum, p) => sum + (p._count?.subscriptions || 0), 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Potential MRR</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search plans by name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Cycles</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No plans found</h3>
              <p className="text-sm text-slate-600 mb-6">
                {search || cycleFilter
                  ? "Try adjusting your filters"
                  : "Get started by creating your first subscription plan"}
              </p>
              {!search && !cycleFilter && (
                <Button onClick={handleAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => {
              const isPopular = (plan._count?.subscriptions || 0) > 5; // Adjust threshold as needed

              return (
                <Card 
                  key={plan.id} 
                  className={`hover:shadow-lg transition-all ${isPopular ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cycleColor(plan.billingCycle)}>
                            <span className="flex items-center gap-1">
                              {cycleIcon(plan.billingCycle)}
                              {plan.billingCycle}
                            </span>
                          </Badge>
                          {!plan.status || plan.status === "INACTIVE" && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                              Inactive
                            </Badge>
                          )}
                          {isPopular && (
                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">{plan.name}</h3>
                        {plan.description && (
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{plan.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
                        <span className="text-slate-600">{cycleSuffix(plan.billingCycle)}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Minimum quantity: {plan.minQuantity}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-slate-700">{plan.billingCycle.toLowerCase()} billing cycle</span>
                      </div>
                      {plan.autoClose && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-slate-700">Auto-closes on end date</span>
                        </div>
                      )}
                      {plan._count && plan._count.subscriptions > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-slate-700">{plan._count.subscriptions} active subscription{plan._count.subscriptions > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {plan.startDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="text-slate-700">
                            Starts: {new Date(plan.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {plan.endDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span className="text-slate-700">
                            Ends: {new Date(plan.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {total > limit && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Showing <span className="font-medium text-slate-900">{(page - 1) * limit + 1}</span> to{" "}
                    <span className="font-medium text-slate-900">{Math.min(page * limit, total)}</span> of{" "}
                    <span className="font-medium text-slate-900">{total}</span> plans
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setEditing(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Plan" : "Create New Plan"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update plan details and pricing" : "Create a new subscription plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Plan Name *</label>
              <Input
                {...form.register("name")}
                placeholder="e.g., Odoo Starter Monthly"
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                {...form.register("description")}
                placeholder="Brief description of this plan..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Billing Cycle *</label>
                <select
                  {...form.register("billingCycle")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Price (₹) *</label>
                <Input
                  {...form.register("price")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={form.formState.errors.price ? "border-red-500" : ""}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-red-600">{form.formState.errors.price.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Minimum Quantity *</label>
                <Input
                  {...form.register("minQuantity")}
                  type="number"
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  {...form.register("status")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Start Date</label>
                <Input
                  {...form.register("startDate")}
                  type="date"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">End Date</label>
                <Input
                  {...form.register("endDate")}
                  type="date"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("autoClose")}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-slate-700">Auto-close subscription on end date</label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : editing ? "Update Plan" : "Create Plan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
