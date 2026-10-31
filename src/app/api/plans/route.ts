import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
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

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const where: any = {
      AND: [
        search
          ? { name: { contains: search, mode: "insensitive" } }
          : {},
      ],
    };

    const [plans, total] = await Promise.all([
      prisma.plan.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { planProducts: { include: { product: true } } },
      }),
      prisma.plan.count({ where }),
    ]);

    return NextResponse.json({ plans, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = planSchema.parse(body);

    const plan = await prisma.plan.create({
      data: {
        name: data.name,
        billingCycle: data.billingCycle || "MONTHLY",
        price: data.price ? parseFloat(data.price) : 0,
        minQuantity: data.minQuantity || 1,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        availabilityFrom: data.availabilityFrom ? new Date(data.availabilityFrom) : null,
        availabilityTo: data.availabilityTo ? new Date(data.availabilityTo) : null,
        autoClose: data.autoClose || false,
        status: data.status || "ACTIVE",
        description: data.description,
        createdBy: user.id,
      },
      include: { planProducts: { include: { product: true } } },
    });
    return NextResponse.json({ plan }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
