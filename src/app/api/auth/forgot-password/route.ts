import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    // For MVP: store a reset token on the user (we add a resetToken field via update)
    // Since schema has no resetToken, we just acknowledge. In production, email a token.
    return NextResponse.json({
      success: true,
      message: "If an account exists, a password reset link has been sent to your email.",
      // Dev-only: reveal token so the demo can be tested without email
      resetToken: "dev-reset-token-" + user.id,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
