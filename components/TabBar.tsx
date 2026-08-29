"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Liquid } from "liquid-gooey";

import GlassSurface from "./GlassSurface";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/focus", label: "Focus" },
  { href: "/timeline", label: "Timeline" },
  { href: "/build", label: "Build" },
  { href: "/explore", label: "Explore" },
] as const;

const TAB_H = 44;
const INSET = 4; // how far the liquid pill sits inside its tab
const PAD = 8; // .glass-surface__content's own 0.5rem padding

export default function TabBar() {
  const pathname = usePathname();
  const match = TABS.findIndex(
    (t) => t.href !== "/" && pathname.startsWith(t.href),
  );
  const active = match === -1 ? 0 : match;

  // Six tabs have to survive a 375px phone, so the cell width is measured
  // rather than assumed.
  const [tabW, setTabW] = useState(84);
  useEffect(() => {
    const fit = () => {
      const room = Math.min(document.documentElement.clientWidth - 24, 568);
      setTabW(
        Math.max(60, Math.min(96, Math.floor((room - PAD * 2) / TABS.length))),
      );
    };
    const ro = new ResizeObserver(fit);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(1.1rem,env(safe-area-inset-bottom))]"
    >
      <div className="rounded-full ring-1 ring-black/[0.04] dark:bg-white/[0.11] dark:ring-white/[0.09]">
        <GlassSurface
          width={TABS.length * tabW + PAD * 2}
          height={TAB_H + PAD * 2}
          borderRadius={(TAB_H + PAD * 2) / 2}
          backgroundOpacity={0.18}
          saturation={1.6}
          blur={14}
          displace={1.6}
          distortionScale={-96}
          greenOffset={5}
          blueOffset={10}
        >
          <div className="relative h-full w-full">
            {/* the liquid pill trails the active tab and settles like jelly */}
            <Liquid
              aria-hidden
              blur={9}
              contrast={24}
              fill="var(--thumb)"
              shadow="0 1px 2px rgba(0,0,0,.12), 0 6px 16px rgba(0,0,0,.10)"
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <Liquid.Item
                effect="move"
                move={{
                  springiness: 0.5,
                  wobble: 0.62,
                  stretch: 0.42,
                  trail: 0.5,
                }}
              >
                <div
                  style={{
                    width: tabW - INSET * 2,
                    height: TAB_H,
                    borderRadius: TAB_H / 2,
                    transform: `translateX(${active * tabW + INSET}px)`,
                    transition: "transform .46s var(--ease-travel)",
                  }}
                />
              </Liquid.Item>
            </Liquid>

            <div className="relative flex h-full">
              {TABS.map((tab, i) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={i === active ? "page" : undefined}
                  style={{ width: tabW }}
                  className={`flex h-full items-center justify-center rounded-full text-[12.5px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    i === active
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-2)] hover:text-[var(--fg)]"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </GlassSurface>
      </div>
    </nav>
  );
}
