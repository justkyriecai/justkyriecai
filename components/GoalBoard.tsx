"use client";

import { useEffect, useRef, useState } from "react";
import { Liquid } from "liquid-gooey";

import { saveEntry } from "@/app/actions";
import GrowthChart, { type Scale } from "@/components/GrowthChart";
import {
  FINISH_ISO,
  GOALS,
  START_ISO,
  WEEKS,
  dateAt,
  longDate,
  num,
  shortDate,
  targetAt,
  type Goal,
} from "@/lib/goals";
import type { Progress } from "@/lib/progress";

/** the segmented track's own padding, which the liquid thumb sits inside */
const RAIL = 3;

function paceTone(ratio: number): string {
  if (ratio >= 1) return "var(--green)";
  if (ratio >= 0.8) return "var(--accent)";
  return "var(--orange)";
}

export default function GoalBoard({
  progress,
  admin,
  thisWeek,
}: {
  progress: Progress;
  admin: boolean;
  thisWeek: number;
}) {
  const [goalIndex, setGoalIndex] = useState(0);
  const [series, setSeries] = useState(progress);
  const [error, setError] = useState<string | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [scale, setScale] = useState<Scale>("linear");

  const goal = GOALS[goalIndex];
  const actuals = series[goal.id];
  const selected = hover ?? pinned ?? thisWeek;

  const latestWeek = Object.keys(actuals)
    .map(Number)
    .filter((w) => Number.isFinite(actuals[w]))
    .reduce((a, b) => Math.max(a, b), 0);
  const current = actuals[latestWeek] ?? goal.start;
  const dueNow = targetAt(goal, thisWeek);
  const pace = dueNow > 0 ? current / dueNow : 1;
  const tone = paceTone(pace);

  function commit(week: number, value: number | null) {
    setSeries((prev) => {
      const next = { ...prev[goal.id] };
      if (value === null) delete next[week];
      else next[week] = value;
      return { ...prev, [goal.id]: next };
    });
    setError(null);
    saveEntry(goal.id, week, value).then((res) => {
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col px-5 pt-8 pb-28 sm:px-8">
      <header className="flex shrink-0 items-baseline justify-between gap-4">
        <h1 className="flex items-baseline gap-2 text-[17px] font-semibold tracking-[-0.01em]">
          Focus
          {admin && (
            <span className="rounded-full bg-[var(--accent)] px-1.5 py-px text-[10px] font-medium text-white">
              admin
            </span>
          )}
        </h1>
        <p className="tnum truncate text-[12px] text-[var(--fg-3)]">
          {error ? (
            <span className="text-[var(--red)]">{error}</span>
          ) : (
            <>
              {longDate(new Date(`${START_ISO}T00:00:00Z`))} —{" "}
              {longDate(new Date(`${FINISH_ISO}T00:00:00Z`))}
            </>
          )}
        </p>
      </header>

      <GoalSwitch
        active={goalIndex}
        onChange={(i) => {
          setGoalIndex(i);
          setPinned(null);
          setHover(null);
        }}
      />

      <Hero
        goal={goal}
        current={current}
        pace={pace}
        tone={tone}
        thisWeek={thisWeek}
        scale={scale}
        onScale={setScale}
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <GrowthChart
          goal={goal}
          actuals={actuals}
          thisWeek={thisWeek}
          selected={selected}
          tone={tone}
          scale={scale}
          onSelect={(week, pin) => {
            if (pin) setPinned(week);
            else setHover(week);
          }}
        />
      </div>

      <Readout
        goal={goal}
        week={selected}
        actual={actuals[selected]}
        admin={admin}
        onCommit={commit}
      />
    </div>
  );
}

/* ── goal picker ───────────────────────────────────────────────────────── */

function GoalSwitch({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [seg, setSeg] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setSeg((el.clientWidth - RAIL * 2) / GOALS.length);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={trackRef}
      role="tablist"
      aria-label="Goal"
      className="kc-rise relative mt-5 flex shrink-0 rounded-[11px] bg-[var(--fill-2)] p-[3px]"
    >
      {seg > 0 && (
        <Liquid
          aria-hidden
          blur={7}
          contrast={26}
          fill="var(--thumb)"
          shadow="0 1px 2px rgba(0,0,0,.10), 0 3px 8px rgba(0,0,0,.07)"
          style={{ position: "absolute", inset: RAIL, pointerEvents: "none" }}
        >
          <Liquid.Item
            effect="move"
            move={{ springiness: 0.56, wobble: 0.5, stretch: 0.3, trail: 0.4 }}
          >
            <div
              style={{
                width: seg,
                height: 28,
                borderRadius: 9,
                transform: `translateX(${active * seg}px)`,
                transition: "transform .4s var(--ease-travel)",
              }}
            />
          </Liquid.Item>
        </Liquid>
      )}

      {GOALS.map((g, i) => (
        <button
          key={g.id}
          type="button"
          role="tab"
          aria-selected={i === active}
          onClick={() => onChange(i)}
          className={`relative h-7 flex-1 rounded-[9px] text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
            i === active
              ? "text-[var(--fg)]"
              : "text-[var(--fg-2)] hover:text-[var(--fg)]"
          }`}
        >
          {g.tab}
        </button>
      ))}
    </div>
  );
}

/** Linear is the true shape of the plan; log is the one you can read in the
 *  months where linear is pinned to the floor. */
function ScaleToggle({
  scale,
  onChange,
}: {
  scale: Scale;
  onChange: (s: Scale) => void;
}) {
  return (
    <div className="flex gap-px rounded-full bg-[var(--fill-2)] p-px">
      {(["linear", "log"] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          aria-pressed={scale === s}
          className={`rounded-full px-2 py-[3px] text-[10px] font-medium tracking-wide transition-colors duration-300 ${
            scale === s
              ? "bg-[var(--thumb)] text-[var(--fg)] shadow-[0_1px_2px_rgba(0,0,0,.08)]"
              : "text-[var(--fg-3)] hover:text-[var(--fg-2)]"
          }`}
        >
          {s === "linear" ? "Curve" : "Log"}
        </button>
      ))}
    </div>
  );
}

/* ── headline numbers ──────────────────────────────────────────────────── */

/** Eases between two numbers so a goal switch reads as one value travelling,
 *  not as a hard cut between two unrelated ones. */
function useCountUp(value: number, ms = 620): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;

    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = instant ? 1 : Math.min(1, (t - t0) / ms);
      const eased = 1 - (1 - p) ** 3;
      setShown(Math.round(start + (value - start) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value, ms]);

  return shown;
}

function Hero({
  goal,
  current,
  pace,
  tone,
  thisWeek,
  scale,
  onScale,
}: {
  goal: Goal;
  current: number;
  pace: number;
  tone: string;
  thisWeek: number;
  scale: Scale;
  onScale: (s: Scale) => void;
}) {
  const shown = useCountUp(current);

  return (
    <section className="mt-6 flex shrink-0 items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="tnum kc-focus-in text-[40px] leading-none font-semibold tracking-[-0.03em] sm:text-[46px]">
          {num(shown)}
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 text-[13px] text-[var(--fg-2)]">
          <span>
            {goal.unit} · week {thisWeek} of {WEEKS}
          </span>
          <span className="tnum font-medium" style={{ color: tone }}>
            {Math.round(pace * 100)}% of pace
          </span>
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="tnum text-[17px] font-semibold tracking-[-0.01em]">
          {num(goal.target)}
        </p>
        <p className="mt-1 font-mono text-[11px] text-[var(--fg-3)]">
          {goal.formula}
        </p>
        {goal.rate !== null && (
          <div className="mt-2 flex justify-end">
            <ScaleToggle scale={scale} onChange={onScale} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ── the week under the crosshair ──────────────────────────────────────── */

function Readout({
  goal,
  week,
  actual,
  admin,
  onCommit,
}: {
  goal: Goal;
  week: number;
  actual: number | undefined;
  admin: boolean;
  onCommit: (week: number, value: number | null) => void;
}) {
  const plan = targetAt(goal, week);
  const ratio = actual === undefined ? null : plan > 0 ? actual / plan : 1;

  return (
    <div className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-[var(--hair)] pt-3 text-[12px]">
      <span className="tnum shrink-0 text-[var(--fg-2)]">
        Week {week}
        <span className="text-[var(--fg-3)]"> · {shortDate(dateAt(week))}</span>
      </span>

      <span className="tnum flex items-baseline gap-1 text-[var(--fg-3)]">
        plan
        <span className="font-medium text-[var(--fg)]">{num(plan)}</span>
      </span>

      <span className="tnum flex items-baseline gap-1 text-[var(--fg-3)]">
        actual
        {admin ? (
          <ActualField week={week} value={actual} onCommit={onCommit} />
        ) : (
          <span className="font-medium text-[var(--fg)]">
            {actual === undefined ? "—" : num(actual)}
          </span>
        )}
      </span>

      <span
        className="tnum w-10 shrink-0 text-right font-medium"
        style={{ color: ratio === null ? "var(--fg-4)" : paceTone(ratio) }}
      >
        {ratio === null ? "—" : `${Math.round(ratio * 100)}%`}
      </span>
    </div>
  );
}

function ActualField({
  week,
  value,
  onCommit,
}: {
  week: number;
  value: number | undefined;
  onCommit: (week: number, value: number | null) => void;
}) {
  const shown = value === undefined ? "" : num(value);

  const send = (el: HTMLInputElement) => {
    const digits = el.value.replace(/[^\d]/g, "");
    const next = digits === "" ? null : Number(digits);
    if (next === (value ?? null)) {
      el.value = shown;
      return;
    }
    onCommit(week, next);
  };

  return (
    <input
      // remount when the stored value changes, so the field never drifts
      key={`${week}:${shown}`}
      defaultValue={shown}
      inputMode="numeric"
      aria-label={`Actual for week ${week}`}
      placeholder="—"
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => send(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          e.currentTarget.value = shown;
          e.currentTarget.blur();
        }
      }}
      className="tnum w-20 rounded-md bg-[var(--fill-2)] px-1.5 py-0.5 text-right font-medium transition-colors placeholder:text-[var(--fg-4)] hover:bg-[var(--fill)] focus:bg-[var(--fill)] focus:outline-none"
    />
  );
}
