"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE, adminEnabled, isAdmin, tokenFor } from "@/lib/auth";
import { GOALS_BY_ID, WEEKS, type GoalId } from "@/lib/goals";
import { writeEntry } from "@/lib/progress";

export type SignInState = { error?: string };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  if (!adminEnabled()) {
    return { error: "Admin is not configured on this deployment." };
  }

  const token = tokenFor(String(formData.get("password") ?? ""));
  if (!token) return { error: "Wrong password." };

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/focus");
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/focus");
}

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Record what a goal actually reached in a given week. Admin only. */
export async function saveEntry(
  goal: GoalId,
  week: number,
  value: number | null,
): Promise<SaveResult> {
  // Server Actions are reachable by direct POST, so re-check on every call.
  if (!(await isAdmin())) return { ok: false, error: "Not signed in." };

  if (!GOALS_BY_ID[goal]) return { ok: false, error: "Unknown goal." };
  if (!Number.isInteger(week) || week < 0 || week > WEEKS) {
    return { ok: false, error: "Week out of range." };
  }
  if (value !== null && (!Number.isFinite(value) || value < 0)) {
    return { ok: false, error: "Value must be zero or more." };
  }

  try {
    await writeEntry(goal, week, value === null ? null : Math.round(value));
  } catch {
    return { ok: false, error: "Could not write to disk." };
  }

  revalidatePath("/focus");
  return { ok: true };
}
