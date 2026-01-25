import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation constants
export const TRANSITIONS = {
  spring: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
  },
  stagger: 0.1,
};

// Animation variants
export const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: TRANSITIONS.spring },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: TRANSITIONS.spring },
  },
};
