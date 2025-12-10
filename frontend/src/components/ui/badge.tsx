'use client';

import React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90",
        className,
      )}
    >
      {children}
    </span>
  );
}

