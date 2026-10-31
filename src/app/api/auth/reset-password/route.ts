import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Dev-only: token format "dev-reset-token-<userId>"
    if (!data.token.startsWith("dev-reset-token-")) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }
    const userId = data.token.replace("dev-reset-token-", "");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword(data.password) },
    });

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
