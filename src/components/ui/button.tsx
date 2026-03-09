import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? "span" : "button"

        // Simplistic variant/size mapping for the Wizard Theme
        const variants = {
            default: "bg-[#d4af37] text-black hover:bg-[#b08d20]",
            destructive: "bg-red-900 text-white hover:bg-red-800",
            outline: "border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10",
            secondary: "bg-[#008080] text-white hover:bg-[#006666]",
            ghost: "hover:bg-[#d4af37]/10 text-[#008080]",
            link: "text-[#d4af37] underline-offset-4 hover:underline",
        }
        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
