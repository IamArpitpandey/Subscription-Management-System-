import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";

// Password: min 8, uppercase, lowercase, special character
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  role: z.enum(["ADMIN", "STAFF", "CUSTOMER"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
        role: data.role || "STAFF",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    await setSessionCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const first = (err as any).issues?.[0] ?? (err as any).errors?.[0];
      return NextResponse.json({ error: first?.message || "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
