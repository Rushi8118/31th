import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          'bg-gradient-to-b from-primary via-primary to-primary/90 text-primary-foreground shadow-sm hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
        destructive:
          'bg-gradient-to-b from-destructive via-destructive to-destructive/90 text-white shadow-sm hover:shadow-lg hover:shadow-destructive/25 hover:-translate-y-0.5',
        outline:
          'border-2 border-border/60 bg-transparent hover:border-primary/40 hover:bg-primary/5 hover:text-primary shadow-sm hover:shadow-md',
        secondary:
          'bg-secondary/80 text-secondary-foreground hover:bg-secondary shadow-sm hover:shadow-md hover:-translate-y-0.5',
        ghost:
          'hover:bg-primary/8 hover:text-primary',
        link: 
          'text-primary underline-offset-4 hover:underline hover:text-primary/80',
      },
      size: {
        default: 'h-10 px-5 py-2.5 rounded-xl text-sm',
        sm: 'h-9 px-4 py-2 rounded-lg text-xs',
        lg: 'h-12 px-7 py-3 rounded-2xl text-base',
        xl: 'h-14 px-8 py-4 rounded-2xl text-lg',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends React.ComponentProps<'button'>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <motion.span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            aria-label="Loading"
          />
          <span className="opacity-70">Loading...</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
