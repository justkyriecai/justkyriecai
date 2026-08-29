import { promises as fs } from "node:fs";
import path from "node:path";

import type { GoalId } from "./goals";

/** week number → the value actually reached that week */
export type Series = Record<number, number>;
export type Progress = Record<GoalId, Series>;

/**
 * The committed baseline. Everything an admin types lands in the JSON overlay
 * below and wins over these, so the seed stays a clean starting point.
 *
 * Trio's series is the one that will eventually be filled by the admin API
 * instead of by hand — see `readProgress`.
 */
const SEED: Progress = {
  trio: { 0: 10 },
  audience: { 0: 1000 },
  opensource: { 0: 0 },
};

const OVERLAY = path.join(process.cwd(), "data", "progress.json");

const EMPTY: Progress = { trio: {}, audience: {}, opensource: {} };

function merge(base: Progress, over: Partial<Progress>): Progress {
  return {
    trio: { ...base.trio, ...over.trio },
    audience: { ...base.audience, ...over.audience },
    opensource: { ...base.opensource, ...over.opensource },
  };
}

async function readOverlay(): Promise<Partial<Progress>> {
  try {
    return JSON.parse(await fs.readFile(OVERLAY, "utf8"));
  } catch {
    // no overlay yet (or unreadable) — the seed is the whole truth
    return {};
  }
}

export async function readProgress(): Promise<Progress> {
  // TODO: swap `trio` for a fetch against the Trio admin API once it is exposed.
  return merge(SEED, await readOverlay());
}

/** Write one week of one goal. Returns the stored value (null = cleared). */
export async function writeEntry(
  goal: GoalId,
  week: number,
  value: number | null,
): Promise<void> {
  const overlay = merge(EMPTY, await readOverlay());
  if (value === null) delete overlay[goal][week];
  else overlay[goal][week] = value;

  await fs.mkdir(path.dirname(OVERLAY), { recursive: true });
  await fs.writeFile(OVERLAY, `${JSON.stringify(overlay, null, 2)}\n`, "utf8");
}
