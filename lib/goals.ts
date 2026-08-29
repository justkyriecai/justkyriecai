/**
 * The 2026–27 run: three goals, one 48-week compounding schedule.
 *
 * Week 0 is the baseline on the start date; week 48 is the finish line, and the
 * published targets are exactly `floor(start * rate ** 48)` — so the numbers on
 * the wall and the numbers in the table are the same numbers.
 */

export const START_ISO = "2026-08-27";
export const WEEKS = 48;

export type GoalId = "trio" | "audience" | "opensource";

export type Goal = {
  id: GoalId;
  tab: string;
  name: string;
  blurb: string;
  unit: string;
  /** week-0 baseline */
  start: number;
  /** weekly multiplier; null for a goal that grows in a straight line */
  rate: number | null;
  /** week-48 finish line */
  target: number;
  formula: string;
  href?: string;
  /** true once the number comes from a live source rather than a hand entry */
  live?: boolean;
};

const compounded = (start: number, rate: number) =>
  Math.floor(start * rate ** WEEKS);

export const GOALS: Goal[] = [
  {
    id: "trio",
    tab: "Trio",
    name: "Trio",
    blurb: "Grow trio.town to three million people.",
    unit: "users",
    start: 10,
    rate: 1.3,
    target: compounded(10, 1.3),
    formula: "10 × 1.3⁴⁸",
    href: "https://trio.town",
  },
  {
    id: "audience",
    tab: "Audience",
    name: "Audience",
    blurb: "Followers across every platform, counted as one.",
    unit: "followers",
    start: 1_000,
    rate: 1.2,
    target: compounded(1_000, 1.2),
    formula: "1,000 × 1.2⁴⁸",
  },
  {
    id: "opensource",
    tab: "Open source",
    name: "Open source",
    blurb: "A hundred pull requests worth merging.",
    unit: "PRs",
    start: 0,
    rate: null,
    target: 100,
    formula: "100 PRs · ~2 / week",
  },
];

export const GOALS_BY_ID = Object.fromEntries(
  GOALS.map((g) => [g.id, g]),
) as Record<GoalId, Goal>;

/** Where a goal is meant to be at the end of week `w`. */
export function targetAt(goal: Goal, w: number): number {
  if (goal.rate === null) {
    return Math.round(goal.start + ((goal.target - goal.start) * w) / WEEKS);
  }
  return Math.floor(goal.start * goal.rate ** w);
}

/** The Sunday that closes week `w`, as a UTC date. */
export function dateAt(w: number): Date {
  const d = new Date(`${START_ISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + w * 7);
  return d;
}

/** Whole weeks elapsed since the start date, clamped into the run. */
export function weekOf(now: Date): number {
  const start = new Date(`${START_ISO}T00:00:00Z`).getTime();
  const weeks = Math.floor((now.getTime() - start) / (7 * 86_400_000));
  return Math.min(WEEKS, Math.max(0, weeks));
}

export const FINISH_ISO = dateAt(WEEKS).toISOString().slice(0, 10);

const FMT = new Intl.NumberFormat("en-US");
export const num = (n: number) => FMT.format(n);

/** 2,946,326 → "2.9M". Big targets deserve a short badge. */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 2 : 1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
  return FMT.format(n);
}

export function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function longDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
