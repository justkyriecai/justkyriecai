"use client";

import { useActionState } from "react";

import { signIn, type SignInState } from "@/app/actions";

export default function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={action} className="mt-7 flex flex-col gap-3">
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        placeholder="Password"
        aria-label="Admin password"
        className="h-11 rounded-xl border border-[var(--hair)] bg-[var(--fill-2)] px-4 text-[15px] placeholder:text-[var(--fg-3)] focus:border-transparent focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-xl bg-[var(--accent)] text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
      {state.error && (
        <p className="text-center text-[13px] text-[var(--red)]">
          {state.error}
        </p>
      )}
    </form>
  );
}
