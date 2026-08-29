import type { Metadata } from "next";
import Link from "next/link";

import { signOut } from "@/app/actions";
import SignInForm from "@/components/SignInForm";
import { adminEnabled, isAdmin } from "@/lib/auth";

// cookies() + the on-disk overlay are per-request state
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Kyrie Cai",
  robots: { index: false, follow: false },
};

export default async function Admin() {
  const [admin, enabled] = [await isAdmin(), adminEnabled()];

  return (
    <main className="flex h-full items-center justify-center px-6 pb-24">
      <div className="w-full max-w-[300px]">
        <h1 className="text-center text-[17px] font-semibold tracking-[-0.01em]">
          Admin
        </h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-[var(--fg-2)]">
          {admin
            ? "You are signed in. Goal numbers are editable."
            : enabled
              ? "Sign in to edit the weekly numbers."
              : "Admin is off on this deployment — set ADMIN_PASSWORD to turn it on."}
        </p>

        {admin ? (
          <div className="mt-7 flex flex-col gap-3">
            <Link
              href="/focus"
              className="flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Go to goals
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[var(--fill)] text-[15px] font-medium transition-opacity hover:opacity-80"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : enabled ? (
          <SignInForm />
        ) : null}
      </div>
    </main>
  );
}
