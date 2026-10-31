import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const quotations = await prisma.quotation.findMany({
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ quotations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch quotations" }, { status: 500 });
  }
}
