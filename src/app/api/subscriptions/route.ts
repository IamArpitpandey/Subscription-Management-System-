import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isStaffOrAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isStaffOrAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const subscriptions = await prisma.subscription.findMany({
      include: { customer: true, plan: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ subscriptions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch subscriptions" }, { status: 500 });
  }
}
