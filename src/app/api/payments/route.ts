import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const payments = await prisma.payment.findMany({
      include: { invoice: true },
      orderBy: { paymentDate: "desc" },
    });
    return NextResponse.json({ payments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch payments" }, { status: 500 });
  }
}
