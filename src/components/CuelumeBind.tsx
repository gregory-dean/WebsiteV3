"use client";

import { useEffect } from "react";

export function CuelumeBind() {
  useEffect(() => {
    let cancelled = false;
    import("cuelume").then(({ bind }) => {
      if (!cancelled) bind();
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
