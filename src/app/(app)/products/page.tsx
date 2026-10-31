"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Tag, Package, Box, DollarSign, TrendingUp, Download, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["SERVICE", "GOODS", "LICENSE"]),
  salesPrice: z.string().min(1, "Price required"),
  costPrice: z.string().min(1, "Cost required"),
  notes: z.string().optional(),
  isActive: z.boolean(),
});

type Product = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  salesPrice: number;
  costPrice: number;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  _count?: { variants: number };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", description: "", type: "SERVICE", salesPrice: "", costPrice: "", notes: "", isActive: true },
  });

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      const json = await res.json();
      setProducts(json.products || []);
      setTotal(json.total || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  async function handleSubmit(data: z.infer<typeof productSchema>) {
    try {
      const url = editing ? `/api/products/${editing.id}` : "/api/products";
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
      fetchProducts();
      toast.success(editing ? "Product updated successfully" : "Product created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      fetchProducts();
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    }
  }

  function handleEdit(product: Product) {
    setEditing(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      type: product.type as "SERVICE" | "GOODS" | "LICENSE",
      salesPrice: String(product.salesPrice),
      costPrice: String(product.costPrice),
      notes: product.notes || "",
      isActive: product.isActive,
    });
    setOpen(true);
  }

  function handleAdd() {
    setEditing(null);
    form.reset({ name: "", description: "", type: "SERVICE", salesPrice: "", costPrice: "", notes: "", isActive: true });
    setOpen(true);
  }

  const activeCount = products.filter(p => p.isActive).length;
  const totalPages = Math.ceil(total / limit);
  const filteredProducts = typeFilter ? products.filter(p => p.type === typeFilter) : products;

  const typeIcon = (type: string) => {
    switch (type) {
      case "SERVICE": return <Tag className="h-4 w-4" />;
      case "GOODS": return <Package className="h-4 w-4" />;
      case "LICENSE": return <Box className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "SERVICE": return "bg-blue-50 text-blue-700 border-blue-200";
      case "GOODS": return "bg-green-50 text-green-700 border-green-200";
      case "LICENSE": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your product catalog, pricing, and variants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Products</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Products</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{activeCount}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <Tag className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Sales Price</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">
                  ₹{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.salesPrice, 0) / products.length).toLocaleString() : 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Variants</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">
                  {products.reduce((sum, p) => sum + (p._count?.variants || 0), 0)}
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
                placeholder="Search products by name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="SERVICE">Service</option>
                <option value="GOODS">Goods</option>
                <option value="LICENSE">License</option>
              </select>
              <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-sm text-slate-600 mb-6">
                {search || typeFilter
                  ? "Try adjusting your filters"
                  : "Get started by creating your first product"}
              </p>
              {!search && !typeFilter && (
                <Button onClick={handleAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const margin = product.salesPrice - product.costPrice;
              const marginPercent = product.salesPrice > 0 ? (margin / product.salesPrice * 100).toFixed(1) : 0;

              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeColor(product.type)}>
                            <span className="flex items-center gap-1">
                              {typeIcon(product.type)}
                              {product.type}
                            </span>
                          </Badge>
                          {!product.isActive && (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Sales Price</span>
                        <span className="font-semibold text-slate-900">₹{product.salesPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Cost Price</span>
                        <span className="text-sm text-slate-600">₹{product.costPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-700">Margin</span>
                        <span className="text-sm font-semibold text-green-600">
                          ₹{margin.toLocaleString()} ({marginPercent}%)
                        </span>
                      </div>
                      {product._count && product._count.variants > 0 && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Box className="h-4 w-4" />
                          <span>{product._count.variants} variant{product._count.variants > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        className="flex-1 gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(product.id)}
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
                    <span className="font-medium text-slate-900">{total}</span> products
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
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Sales Price</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Cost Price</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Margin</th>
                    <th className="text-center py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const margin = product.salesPrice - product.costPrice;
                    const marginPercent = product.salesPrice > 0 ? (margin / product.salesPrice * 100).toFixed(1) : 0;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className={typeColor(product.type)}>
                            <span className="flex items-center gap-1">
                              {typeIcon(product.type)}
                              {product.type}
                            </span>
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-900">
                          ₹{product.salesPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right text-slate-600">
                          ₹{product.costPrice.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="text-green-600 font-medium">
                            ₹{margin.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">{marginPercent}%</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                            className={product.isActive 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-slate-100 text-slate-600 border-slate-200"
                            }
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(product)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(product.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-medium text-slate-900">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium text-slate-900">{Math.min(page * limit, total)}</span> of{" "}
                  <span className="font-medium text-slate-900">{total}</span> products
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
            )}
          </CardContent>
        </Card>
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
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update product information and pricing" : "Create a new product in your catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Product Name *</label>
              <Input
                {...form.register("name")}
                placeholder="e.g., Odoo ERP Base License"
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
                placeholder="Brief description of the product..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type *</label>
                <select
                  {...form.register("type")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SERVICE">Service</option>
                  <option value="GOODS">Goods</option>
                  <option value="LICENSE">License</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Sales Price (₹) *</label>
                <Input
                  {...form.register("salesPrice")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={form.formState.errors.salesPrice ? "border-red-500" : ""}
                />
                {form.formState.errors.salesPrice && (
                  <p className="text-sm text-red-600">{form.formState.errors.salesPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Cost Price (₹) *</label>
                <Input
                  {...form.register("costPrice")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={form.formState.errors.costPrice ? "border-red-500" : ""}
                />
                {form.formState.errors.costPrice && (
                  <p className="text-sm text-red-600">{form.formState.errors.costPrice.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                {...form.register("notes")}
                placeholder="Additional internal notes..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...form.register("isActive")}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-slate-700">Active Product</label>
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
                {form.formState.isSubmitting ? "Saving..." : editing ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
