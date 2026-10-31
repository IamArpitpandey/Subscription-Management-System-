"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ className, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full max-w-lg translate-y-[100%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
        side === "top" &&
          "translate-x-0 -translate-y-full data-[side=top]:translate-x-0 data-[side=bottom]:translate-x-0 data-[side=left]:translate-x-0 data-[side=right]:translate-x-0",
        side === "bottom" &&
          "translate-x-0 translate-y-full data-[side=top]:translate-x-0 data-[side=bottom]:translate-x-0 data-[side=left]:translate-x-0 data-[side=right]:translate-x-0",
        side === "left" &&
          "translate-x-[-100%] translate-y-0 data-[side=top]:translate-x-0 data-[side=bottom]:translate-x-0 data-[side=left]:translate-x-0 data-[side=right]:translate-x-0",
        side === "right" &&
          "translate-x-full translate-y-0 data-[side=top]:translate-x-0 data-[side=bottom]:translate-x-0 data-[side=left]:translate-x-0 data-[side=right]:translate-x-0",
        className
      )}
      {...props}
    />
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export { Sheet, SheetTrigger, SheetPortal, SheetOverlay, SheetContent };
