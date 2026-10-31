import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
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
    const status = searchParams.get("status") || "";

    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        status ? { status } : {},
      ],
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { subscriptions: true, invoices: true } } },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({ customers, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = customerSchema.parse(body);

    const existing = await prisma.customer.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

    const customer = await prisma.customer.create({
      data: { ...data, createdBy: user.id },
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
