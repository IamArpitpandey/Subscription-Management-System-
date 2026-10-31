import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const planSchema = z.object({
  name: z.string().min(1).optional(),
  billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  price: z.string().optional(),
  minQuantity: z.coerce.number().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  availabilityFrom: z.string().optional().nullable(),
  availabilityTo: z.string().optional().nullable(),
  autoClose: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  description: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const plan = await prisma.plan.findUnique({
      where: { id: (await params).id },
      include: { planProducts: { include: { product: true } }, subscriptions: true },
    });
    if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ plan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch plan" }, { status: 500 });
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
    const data = planSchema.parse(body);

    const plan = await prisma.plan.update({
      where: { id: (await params).id },
      data: {
        name: data.name,
        billingCycle: data.billingCycle,
        price: data.price ? parseFloat(data.price) : undefined,
        minQuantity: data.minQuantity,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        availabilityFrom: data.availabilityFrom ? new Date(data.availabilityFrom) : null,
        availabilityTo: data.availabilityTo ? new Date(data.availabilityTo) : null,
        autoClose: data.autoClose,
        status: data.status,
        description: data.description,
      },
      include: { planProducts: { include: { product: true } } },
    });
    return NextResponse.json({ plan });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
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

    await prisma.plan.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete plan" }, { status: 500 });
  }
}
