import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "overflow-hidden text-sm group/card flex flex-col transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground ring-1 ring-border/50",
        glass: "bg-card/60 backdrop-blur-xl text-card-foreground ring-1 ring-white/5 shadow-xl",
        elevated: "bg-card text-card-foreground shadow-lg shadow-black/10 ring-1 ring-border/30",
        ghost: "bg-transparent text-card-foreground",
        income: "bg-income-muted text-card-foreground ring-1 ring-income/20",
        expense: "bg-expense-muted text-card-foreground ring-1 ring-expense/20",
      },
      size: {
        default: "gap-4 py-4 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
        sm: "gap-3 py-3 has-data-[slot=card-footer]:pb-0",
        lg: "gap-6 py-6 has-data-[slot=card-footer]:pb-0",
        none: "",
      },
      rounded: {
        default: "rounded-xl",
        sm: "rounded-lg",
        lg: "rounded-2xl",
        none: "rounded-none",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20",
        glow: "hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      hover: "none",
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({
  className,
  variant,
  size,
  rounded,
  hover,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ variant, size, rounded, hover }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "gap-1.5 px-5 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-6 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3 flex flex-col",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-snug font-semibold tracking-tight group-data-[size=sm]/card:text-sm group-data-[size=lg]/card:text-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-5 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-6",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "bg-muted/30 border-t border-border/50 p-4 group-data-[size=sm]/card:p-3 group-data-[size=lg]/card:p-5 flex items-center",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
