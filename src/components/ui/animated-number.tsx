import { useEffect, useRef, useState } from "react";
import { useSpring, useInView } from "framer-motion";
import { formatCompactCurrency, formatCurrency } from "@/lib/transactionHelpers";

interface AnimatedNumberProps {
  value: number;
  format?: "compact" | "full" | "none";
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  format = "compact",
  className,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const [display, setDisplay] = useState(format === "compact" ? formatCompactCurrency(0) : format === "full" ? formatCurrency(0) : "0");

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [spring, value, isInView]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (format === "compact") {
        setDisplay(formatCompactCurrency(latest));
      } else if (format === "full") {
        setDisplay(formatCurrency(latest));
      } else {
        setDisplay(Math.round(latest).toString());
      }
    });
    return unsubscribe;
  }, [spring, format]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
