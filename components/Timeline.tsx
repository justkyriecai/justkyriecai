"use client";

import { useEffect, useRef } from "react";

import type { Node, Year } from "@/lib/timeline";

const RAIL_X = 5; // centre of the rail, in px from the content edge
const GUTTER = 32; // the pl-8 the content sits behind

export default function Timeline({ years }: { years: Year[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // The rail fills down to the middle of the viewport, so the bright edge is
  // always level with whatever you are reading. Written straight to the DOM —
  // this runs on every scroll frame and has no business re-rendering React.
  useEffect(() => {
    const scroller = scrollRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    scroller.scrollTop = 0;

    const paint = () => {
      const reach = scroller.scrollTop + scroller.clientHeight * 0.42;
      const total = track.offsetHeight || 1;
      track.style.setProperty(
        "--fill",
        `${Math.min(100, Math.max(0, (reach / total) * 100)).toFixed(2)}%`,
      );
    };

    paint();
    scroller.addEventListener("scroll", paint, { passive: true });
    const ro = new ResizeObserver(paint);
    ro.observe(track);
    return () => {
      scroller.removeEventListener("scroll", paint);
      ro.disconnect();
    };
  }, []);

  // Rows arrive as they come into view rather than all at once on load.
  useEffect(() => {
    const rows = trackRef.current?.querySelectorAll("[data-row]");
    if (!rows?.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("kc-rise");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [years]);

  let row = 0;

  return (
    <div ref={scrollRef} className="scroll-quiet h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-32 sm:px-8">
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">
            Timeline
          </h1>
          <p className="text-[12px] text-[var(--fg-3)]">what is on the record</p>
        </header>

        <div ref={trackRef} className="relative mt-8 pl-8">
          {/* the rail: a hairline, and the lit length you have travelled */}
          <span
            aria-hidden
            className="absolute top-3 bottom-4 w-px bg-[var(--hair)]"
            style={{ left: RAIL_X }}
          />
          <span
            aria-hidden
            className="absolute top-3 w-px bg-[var(--fg-3)] transition-[height] duration-150 ease-out"
            style={{ left: RAIL_X, height: "var(--fill, 0%)" }}
          />

          {years.map((y, yi) => (
            <section key={y.year} className={yi === 0 ? "" : "mt-9"}>
              <h2
                data-row
                style={{ animationDelay: `${Math.min(row++, 8) * 45}ms` }}
                className="relative flex items-center gap-2.5 pb-1 opacity-0"
              >
                <Dot size={9} tone={y.now ? "accent" : "solid"} ping={y.now} />
                <span className="tnum text-[13px] font-semibold tracking-[-0.01em]">
                  {y.year}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-[var(--hair)]"
                  role="presentation"
                />
                {y.now && (
                  <span className="rounded-full bg-[var(--accent)] px-1.5 py-px text-[9px] font-medium text-white">
                    now
                  </span>
                )}
              </h2>

              <ol>
                {y.nodes.map((n) => (
                  <li
                    key={n.key}
                    data-row
                    style={{ animationDelay: `${Math.min(row++, 8) * 45}ms` }}
                    className="relative py-[7px] opacity-0"
                  >
                    <Dot size={5} tone="faint" top={15} />
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <Key node={n} />
                      <span className="text-[13px] text-[var(--fg-2)]">
                        {n.note}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** A node on the rail. Sits `GUTTER` back from the content edge, centred on the
 *  hairline, with a ring in the page colour so the rail appears to pass behind. */
function Dot({
  size,
  tone,
  ping,
  top,
}: {
  size: number;
  tone: "accent" | "solid" | "faint";
  ping?: boolean;
  top?: number;
}) {
  const fill =
    tone === "accent"
      ? "bg-[var(--accent)]"
      : tone === "solid"
        ? "bg-[var(--fg-2)]"
        : "bg-[var(--fg-4)]";

  const box: React.CSSProperties = {
    left: RAIL_X - GUTTER + 0.5,
    width: size,
    height: size,
    ...(top === undefined ? {} : { top }),
  };

  return (
    <>
      <span
        aria-hidden
        className={`absolute ${top === undefined ? "top-1/2 -translate-y-1/2" : ""} -translate-x-1/2 rounded-full ring-4 ring-[var(--bg)] ${fill}`}
        style={box}
      />
      {ping && (
        <span
          aria-hidden
          className={`absolute ${top === undefined ? "top-1/2 -translate-y-1/2" : ""} -translate-x-1/2 animate-ping rounded-full opacity-60 ${fill}`}
          style={{ ...box, animationDuration: "2.6s" }}
        />
      )}
    </>
  );
}

function Key({ node }: { node: Node }) {
  const label = (
    <span className="text-[15px] font-medium tracking-[-0.01em]">
      {node.key}
    </span>
  );

  if (!node.href) return label;

  return (
    <a
      href={node.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-[var(--fg-4)] decoration-1 underline-offset-[5px] transition-colors duration-300 hover:decoration-[var(--accent)]"
    >
      {label}
    </a>
  );
}
