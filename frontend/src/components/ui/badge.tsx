import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-100 text-white [a&]:hover:bg-brand-500", // Softer brand, white text
        secondary:
          "border-transparent bg-gray-200 text-gray-800 [a&]:hover:bg-gray-300", // Lighter gray, darker text
        destructive:
          "border-transparent bg-red-50/60 border border-red-500 text-red-700 [a&]:hover:bg-red-500 focus-visible:ring-red-400/20 dark:focus-visible:ring-red-400/40 dark:bg-red-400/60", // Muted red, white text
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", // Unchanged
        success:
          "border-transparent bg-green-50/60 border border-green-500 text-green-700 [a&]:hover:bg-brand-500", // Softer brand, white text
        pending:
          "border-transparent bg-yellow-50/60 border border-yellow-500 text-yellow-600 [a&]:hover:bg-yellow-600", // Slightly softer brand, white text
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }