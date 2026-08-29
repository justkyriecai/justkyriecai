"use client";

import { useEffect, useRef, useState } from "react";

import {
  WEEKS,
  compact,
  dateAt,
  targetAt,
  type Goal,
} from "@/lib/goals";

const PAD = { top: 16, right: 14, bottom: 24, left: 42 };
const X_TICKS = [0, 10, 20, 30, 40, 48];
const X_TICKS_TIGHT = [0, 16, 32, 48];

export type Scale = "linear" | "log";

/** Where a value sits on the value axis, 0 at the floor and 1 at the finish.
 *
 *  Linear is the honest shape — a 1.3×/week plan really is a hockey stick that
 *  spends eleven months looking like nothing. Log measures the run in doublings
 *  instead, which straightens the plan into a line you can be above or below;
 *  that is the view worth having in month three, when linear shows a flat zero
 *  either way. */
export function normalise(goal: Goal, value: number, scale: Scale): number {
  if (scale === "linear" || goal.rate === null || goal.start <= 0) {
    return Math.min(1, Math.max(0, value / goal.target));
  }
  const clamped = Math.max(value, goal.start);
  return Math.min(
    1,
    Math.max(
      0,
      Math.log(clamped / goal.start) / Math.log(goal.target / goal.start),
    ),
  );
}

function yTicks(goal: Goal, scale: Scale): number[] {
  if (scale === "log" && goal.rate !== null && goal.start > 0) {
    const ticks: number[] = [goal.start];
    for (let p = 1; p <= 12; p++) {
      const v = 10 ** p;
      if (v > goal.start && v < goal.target) ticks.push(v);
    }
    ticks.push(goal.target);
    return ticks;
  }
  return [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(goal.target * f));
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}

export default function GrowthChart({
  goal,
  actuals,
  thisWeek,
  selected,
  onSelect,
  tone,
  scale,
}: {
  goal: Goal;
  actuals: Record<number, number>;
  thisWeek: number;
  selected: number;
  onSelect: (week: number | null, pinned: boolean) => void;
  tone: string;
  scale: Scale;
}) {
  const [box, size] = useSize<HTMLDivElement>();
  const ready = size.w > 0 && size.h > 0;

  const innerW = Math.max(0, size.w - PAD.left - PAD.right);
  const innerH = Math.max(0, size.h - PAD.top - PAD.bottom);

  const x = (week: number) => PAD.left + (week / WEEKS) * innerW;
  const y = (value: number) =>
    PAD.top + (1 - normalise(goal, value, scale)) * innerH;

  const plan = Array.from(
    { length: WEEKS + 1 },
    (_, w) => `${x(w)},${y(targetAt(goal, w))}`,
  ).join(" ");

  const marks = Object.keys(actuals)
    .map(Number)
    .filter((w) => w >= 0 && w <= WEEKS && Number.isFinite(actuals[w]))
    .sort((a, b) => a - b);
  const trail = marks.map((w) => `${x(w)},${y(actuals[w])}`).join(" ");

  const xTicks = innerW < 380 ? X_TICKS_TIGHT : X_TICKS;

  const weekFromX = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || innerW <= 0) return null;
    const ratio = (clientX - rect.left - PAD.left) / innerW;
    return Math.min(WEEKS, Math.max(0, Math.round(ratio * WEEKS)));
  };

  return (
    <div ref={box} className="relative min-h-0 w-full flex-1">
      {ready && (
        // remounting per goal replays the whole reveal, in order
        <svg
          key={`${goal.id}:${scale}`}
          width={size.w}
          height={size.h}
          className="block touch-none overflow-visible select-none"
          onPointerMove={(e) => onSelect(weekFromX(e.clientX), false)}
          onPointerLeave={() => onSelect(null, false)}
          onPointerDown={(e) => onSelect(weekFromX(e.clientX), true)}
        >
          <defs>
            <linearGradient id={`fill-${goal.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tone} stopOpacity="0.16" />
              <stop offset="100%" stopColor={tone} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* horizontal rules, labelled on the value axis */}
          {yTicks(goal, scale).map((v, i) => (
            <g
              key={v}
              className="kc-fade"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <line
                x1={PAD.left}
                x2={PAD.left + innerW}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--hair)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={y(v)}
                dy="0.32em"
                textAnchor="end"
                className="tnum fill-[var(--fg-3)] text-[10px]"
              >
                {compact(v)}
              </text>
            </g>
          ))}

          {/* time axis */}
          {xTicks.map((w, i) => (
            <text
              key={w}
              x={x(w)}
              y={size.h - 6}
              textAnchor={
                i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"
              }
              className="kc-fade tnum fill-[var(--fg-3)] text-[10px]"
              style={{ animationDelay: `${120 + i * 30}ms` }}
            >
              {dateAt(w).toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
              })}
              {i === 0 || i === xTicks.length - 1
                ? ` ’${String(dateAt(w).getUTCFullYear()).slice(2)}`
                : ""}
            </text>
          ))}

          {/* the plan: a straight line, because the axis is the growth rate */}
          <polygon
            className="kc-fade"
            style={{ animationDelay: "420ms" }}
            points={`${PAD.left},${PAD.top + innerH} ${plan} ${PAD.left + innerW},${PAD.top + innerH}`}
            fill={`url(#fill-${goal.id})`}
          />
          <polyline
            className="kc-draw"
            style={{ animationDelay: "90ms" }}
            points={plan}
            fill="none"
            stroke="var(--fg-2)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
          />

          {/* where the week actually landed */}
          {marks.length > 1 && (
            <polyline
              className="kc-draw"
              style={{ animationDelay: "500ms" }}
              points={trail}
              fill="none"
              stroke={tone}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
            />
          )}
          {marks.map((w, i) => (
            <circle
              key={w}
              className="kc-pop"
              style={{ animationDelay: `${560 + i * 45}ms` }}
              cx={x(w)}
              cy={y(actuals[w])}
              r={w === selected ? 4.5 : 3}
              fill="var(--bg)"
              stroke={tone}
              strokeWidth="2"
            />
          ))}

          {/* now, and whatever week the pointer is interrogating */}
          <line
            className="kc-fade"
            style={{ animationDelay: "700ms" }}
            x1={x(thisWeek)}
            x2={x(thisWeek)}
            y1={PAD.top}
            y2={PAD.top + innerH}
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.55"
          />
          {selected !== thisWeek && (
            <line
              x1={x(selected)}
              x2={x(selected)}
              y1={PAD.top}
              y2={PAD.top + innerH}
              stroke="var(--fg-3)"
              strokeWidth="1"
            />
          )}
          <circle
            cx={x(selected)}
            cy={y(targetAt(goal, selected))}
            r="3"
            fill="var(--fg-2)"
            className="kc-fade"
            style={{ animationDelay: "760ms" }}
          />
        </svg>
      )}
    </div>
  );
}
