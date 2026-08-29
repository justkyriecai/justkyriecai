import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "kc_admin";

/**
 * The cookie carries a digest, never the password. With no `ADMIN_PASSWORD` in
 * the environment there is no admin at all — the site is read-only for
 * everyone, which is the right default for a public box.
 */
function digest(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHash("sha256").update(`kyriecai.me:${secret}`).digest("hex");
}

function sameDigest(a: string | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function adminEnabled(): boolean {
  return digest() !== null;
}

export function tokenFor(password: string): string | null {
  const expected = digest();
  if (!expected) return null;
  const attempt = createHash("sha256")
    .update(`kyriecai.me:${password}`)
    .digest("hex");
  return sameDigest(attempt, expected) ? expected : null;
}

export async function isAdmin(): Promise<boolean> {
  const expected = digest();
  if (!expected) return false;
  const jar = await cookies();
  return sameDigest(jar.get(ADMIN_COOKIE)?.value, expected);
}
