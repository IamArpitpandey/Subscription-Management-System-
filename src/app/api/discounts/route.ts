import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!isAdmin(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const discounts = await prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ discounts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch discounts" }, { status: 500 });
  }
}
