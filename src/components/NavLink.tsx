import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  animate?: boolean; // New prop to toggle animation
}

// --- ANIMATION VARIANTS (Stranger Things Style) ---
const letterVariants = {
  hidden: { opacity: 0, textShadow: "0 0 0px rgba(220,38,38,0)" },
  visible: { 
    opacity: 1,
    textShadow: [
      "0 0 5px rgba(220,38,38,0.6)", 
      "0 0 10px rgba(220,38,38,0)", 
      "0 0 5px rgba(220,38,38,0.6)"
    ],
    transition: { duration: 0.1, repeat: Infinity, repeatDelay: 3, repeatType: "reverse" as const }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
  }
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, children, animate = true, ...props }, ref) => {
    
    // Check if children is a simple string to apply text animation
    const isStringChild = typeof children === "string";

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            "relative group overflow-hidden transition-all duration-300", // Base styles
            className,
            isActive && activeClassName,
            isPending && pendingClassName,
            isActive && "text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" // Active state neon glow
          )
        }
        {...props}
      >
        {({ isActive, isPending }) => (
          <>
            {/* Animated Text Content */}
            {isStringChild && animate ? (
              <motion.span
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {children.split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            ) : (
              // Fallback for non-string children (icons etc)
              children
            )}

            {/* Hover Line Effect (Glitchy Underline) */}
            <span className={cn(
              "absolute bottom-0 left-0 w-full h-[2px] bg-red-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
              isActive && "scale-x-100 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
            )} />
          </>
        )}
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };