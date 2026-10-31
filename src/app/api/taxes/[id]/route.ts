import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

const taxSchema = z.object({
  name: z.string().min(1).optional(),
  rate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tax = await prisma.tax.findUnique({ where: { id: (await params).id } });
    if (!tax) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ tax });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch tax" }, { status: 500 });
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
    const data = taxSchema.parse(body);

    const tax = await prisma.tax.update({
      where: { id: (await params).id },
      data: {
        name: data.name,
        rate: data.rate ? parseFloat(data.rate) : undefined,
        isActive: data.isActive,
      },
    });
    return NextResponse.json({ tax });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update tax" }, { status: 500 });
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

    await prisma.tax.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete tax" }, { status: 500 });
  }
}
