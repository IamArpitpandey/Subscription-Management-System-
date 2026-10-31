"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Controller, useFormContext, type UseFormReturn } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-8", className)} {...props} />
  )
);
Form.displayName = "Form";

type FormFieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: React.ReactNode;
  description?: string;
  control?: any;
  name?: string;
  render?: any;
};

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, description, children, control, name, render, ...props }, ref) => {
    if (render) {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {label && <FormLabel>{label}</FormLabel>}
          <Controller control={control} name={name as string} render={render} />
          {description && <FormDescription>{description}</FormDescription>}
        </div>
      );
    }
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && <FormLabel>{label}</FormLabel>}
        {children}
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </div>
    );
  }
);
FormField.displayName = "FormField";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
FormLabel.displayName = LabelPrimitive.Root.displayName;

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
FormDescription.displayName = "FormDescription";

const FormControl = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn("w-4 h-4", className)} {...props} />
));
FormControl.displayName = CheckboxPrimitive.Root.displayName;

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props} />
));
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
};
