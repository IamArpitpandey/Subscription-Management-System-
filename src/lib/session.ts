"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  signToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionUser,
} from "@/lib/auth";

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const { verifyToken } = await import("@/lib/auth");
  const payload = verifyToken(token);
  if (!payload) return null;
  return { id: payload.id, email: payload.email, name: "", role: payload.role };
}

export async function getCurrentUser() {
  const session = await getSessionUser();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.id } });
}
