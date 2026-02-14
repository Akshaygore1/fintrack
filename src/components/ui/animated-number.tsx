import { useEffect, useRef, useState } from "react";
import { formatCompactCurrency, formatCurrency } from "@/lib/transactionHelpers";
import { getCurrencySymbol, type Currency } from "@/lib/currencyConverter";
import { cn } from "@/lib/utils";
import { storage } from "@/lib/storage";

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
  const [display, setDisplay] = useState(format === "compact" ? formatCompactCurrency(0) : format === "full" ? formatCurrency(0) : "0");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();
    const startValue = 0;
    const endValue = value;
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const current = startValue + (endValue - startValue) * progress;

      if (format === "compact") {
        setDisplay(formatCompactCurrency(current));
      } else if (format === "full") {
        setDisplay(formatCurrency(current));
      } else {
        setDisplay(Math.round(current).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, format, duration, isVisible]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

interface AnimatedCurrencyProps {
  value: number;
  duration?: number;
  className?: string;
  showSign?: boolean;
  compact?: boolean;
  currency?: Currency;
}

export function AnimatedCurrency({
  value,
  duration = 1,
  className,
  showSign = false,
  compact = false,
  currency,
}: AnimatedCurrencyProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const previousValue = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Get currency from settings if not provided
  const activeCurrency = currency || storage.getSettings().currency;
  const currencySymbol = getCurrencySymbol(activeCurrency);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, isVisible]);

  const formatValue = (num: number) => {
    const absNum = Math.abs(num);
    
    if (compact) {
      if (absNum >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      }
      if (absNum >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toFixed(0);
    }
    
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absNum);
  };

  const sign = showSign && value !== 0 ? (value > 0 ? "+" : "-") : "";
  const prefix = value < 0 && !showSign ? "-" : "";

  return (
    <span ref={ref} className={cn("tabular-nums font-mono", className)}>
      {sign}{prefix}{currencySymbol}{formatValue(Math.abs(displayValue))}
    </span>
  );
}

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  className,
  formatter = (v) => v.toLocaleString(),
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const delayTimer = setTimeout(() => {
      setHasStarted(true);
    }, delay * 1000);

    return () => clearTimeout(delayTimer);
  }, [delay, isVisible]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = start + (end - start) * eased;
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, start, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums font-mono", className)}>
      {formatter(count)}
    </span>
  );
}
