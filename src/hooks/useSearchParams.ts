// hooks/useSafeSearchParams.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useSafeSearchParams() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null until component is mounted
  if (!mounted) {
    return null;
  }

  return searchParams;
}
