"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = String(latest);
      }
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span ref={ref} className="tabular-nums">
      {value}
    </motion.span>
  );
}

export function StatCard({
  label,
  value,
  color,
  icon,
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2">
        <Skeleton className="h-4 w-4 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2">
      {icon && (
        <span style={{ color }} className="shrink-0">
          {icon}
        </span>
      )}
      <div className="flex flex-col">
        <span
          className="text-sm font-bold leading-none text-foreground"
          style={color ? { color } : undefined}
        >
          <AnimatedNumber value={value} />
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
}
