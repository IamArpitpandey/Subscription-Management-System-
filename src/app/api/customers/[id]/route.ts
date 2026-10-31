import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const customerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const customer = await prisma.customer.findUnique({
      where: { id: (await params).id },
      include: {
        subscriptions: { include: { plan: true }, orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { createdAt: "desc" }, take: 10 },
        quotations: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ customer });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = customerSchema.parse(body);

    const customer = await prisma.customer.update({
      where: { id: (await params).id },
      data: { ...data, updatedBy: user.id },
    });
    return NextResponse.json({ customer });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.customer.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete customer" }, { status: 500 });
  }
}
