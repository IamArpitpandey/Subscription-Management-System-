import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const SESSION_COOKIE = "brightloop_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: { id: string; email: string; role: string }): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: SESSION_MAX_AGE });
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return null;
    return jwt.verify(token, secret) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function isAdmin(role: string): boolean {
  return role === "ADMIN";
}

export function isStaffOrAdmin(role: string): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function isCustomer(role: string): boolean {
  return role === "CUSTOMER";
}
