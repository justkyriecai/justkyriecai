"use client";

import { useEffect, useRef } from "react";

/** Scrolling lives on an inner element, not the document, so neither Next's
 *  scroll restoration nor the browser's puts a fresh view back at the top.
 *  This does. The extra frame covers Chrome restoring a position after mount. */
export default function ScrollPane({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = 0;
    const raf = requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className={`scroll-quiet overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
