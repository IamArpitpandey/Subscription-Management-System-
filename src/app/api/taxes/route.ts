import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const taxSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const taxes = await prisma.tax.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ taxes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch taxes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data = taxSchema.parse(body);

    const tax = await prisma.tax.create({
      data: {
        name: data.name,
        rate: data.rate ? parseFloat(data.rate) : 0,
        isActive: data.isActive ?? true,
        createdBy: user.id,
      },
    });
    return NextResponse.json({ tax }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create tax" }, { status: 500 });
  }
}
