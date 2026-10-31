"use client";

import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function useSession() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setSession(data?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { session, loading };
}
