"use client";

import { Toaster as Sonner, toast } from "sonner";

export function Toaster() {
  return <Sonner position="bottom-right" richColors closeButton={true} duration={4000} />
}

export { Sonner, toast };
