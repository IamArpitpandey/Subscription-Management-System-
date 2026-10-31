import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const isAdmin = user.role === "ADMIN";
    const isCustomer = user.role === "CUSTOMER";

    // Build customer filter based on role
    let customerWhere: any = {};
    if (isCustomer) {
      // Customers see only their own record (matched by email)
      customerWhere = { email: user.email };
    }

    const [totalCustomers, subscriptions, invoices, payments] = await Promise.all([
      prisma.customer.count({ where: customerWhere }),
      prisma.subscription.findMany({
        where: isCustomer ? { customer: { email: user.email } } : {},
        include: { customer: true, plan: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.invoice.findMany({
        where: isCustomer ? { customer: { email: user.email } } : {},
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { customer: true },
      }),
      prisma.payment.findMany({
        where: isCustomer ? { invoice: { customer: { email: user.email } } } : {},
        orderBy: { paymentDate: "desc" },
        take: 50,
        include: { invoice: true },
      }),
    ]);

    const activeSubscriptionsList = subscriptions.filter(
      (s) => s.status === "ACTIVE" || s.status === "CONFIRMED"
    );
    const activeSubscriptions = activeSubscriptionsList.length;

    const mrr = activeSubscriptionsList.reduce(
      (acc: number, s: any) => acc + Number((s as any).plan?.price || 0) * ((s as any).quantity || 1),
      0
    );

    const totalRevenue = invoices.reduce(
      (acc, inv) => acc + Number(inv.grandTotal || 0),
      0
    );

    const outstandingPayments = invoices.reduce(
      (acc, inv) => acc + Math.max(0, Number(inv.grandTotal || 0) - Number(inv.paidAmount || 0)),
      0
    );

    const overdueInvoices = invoices.filter(
      (inv) => inv.status === "OVERDUE" || (inv.status === "CONFIRMED" && inv.dueDate && new Date(inv.dueDate) < new Date())
    );

    // Revenue trend (last 6 months) - group by month
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }

    const revenueByMonth = months.map((m) => {
      const start = new Date(m.getFullYear(), m.getMonth(), 1);
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      const monthInvoices = invoices.filter(
        (inv) => {
          const d = new Date(inv.createdAt);
          return d >= start && d < end;
        }
      );
      const total = monthInvoices.reduce((acc, inv) => acc + Number(inv.grandTotal || 0), 0);
      return { month: m.toLocaleString("default", { month: "short" }), total };
    });

    const subscriptionGrowth = months.map((m) => {
      const start = new Date(m.getFullYear(), m.getMonth(), 1);
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      const count = subscriptions.filter(
        (s) => {
          const d = new Date(s.createdAt);
          return d >= start && d < end;
        }
      ).length;
      return { month: m.toLocaleString("default", { month: "short" }), count };
    });

    const recentSubscriptions = subscriptions.slice(0, 5).map((s) => ({
      id: s.id,
      number: s.number,
      customer: s.customer?.name || "Unknown",
      plan: s.plan?.name || "Unknown",
      status: s.status,
      nextBillingDate: s.nextBillingDate,
    }));

    const recentInvoices = invoices.slice(0, 5).map((inv) => ({
      id: inv.id,
      number: inv.number,
      customer: inv.customer?.name || "Unknown",
      status: inv.status,
      grandTotal: Number(inv.grandTotal || 0),
      dueDate: inv.dueDate,
    }));

    const recentPayments = payments.slice(0, 5).map((p) => ({
      id: p.id,
      amount: Number(p.amount || 0),
      method: p.method,
      date: p.paymentDate,
      invoiceNumber: p.invoice?.number || "-",
    }));

    return NextResponse.json({
      totalCustomers,
      activeSubscriptions,
      mrr,
      totalRevenue,
      outstandingPayments,
      overdueInvoices: overdueInvoices.length,
      revenueByMonth,
      subscriptionGrowth,
      recentSubscriptions,
      recentInvoices,
      recentPayments,
      overdueInvoiceTable: overdueInvoices.slice(0, 10).map((inv) => ({
        id: inv.id,
        number: inv.number,
        customer: inv.customer?.name || "Unknown",
        dueDate: inv.dueDate,
        grandTotal: Number(inv.grandTotal || 0),
        paidAmount: Number(inv.paidAmount || 0),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch stats" }, { status: 500 });
  }
}
