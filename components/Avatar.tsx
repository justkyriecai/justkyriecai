import { promises as fs } from "node:fs";
import path from "node:path";

const CANDIDATES = ["avatar.jpg", "avatar.jpeg", "avatar.png", "avatar.webp"];

/** Renders the avatar only if a file is actually sitting in `public/`, so a
 *  missing one is nothing rather than a broken image. Drop any of
 *  `avatar.{jpg,jpeg,png,webp}` in there and it appears. */
export default async function Avatar() {
  let file: string | null = null;
  for (const name of CANDIDATES) {
    try {
      await fs.access(path.join(process.cwd(), "public", name));
      file = name;
      break;
    } catch {
      // keep looking
    }
  }
  if (!file) return null;

  return (
    <span
      className="kc-pop block h-24 w-24 overflow-hidden rounded-full ring-1 ring-[var(--hair)] sm:h-28 sm:w-28"
      style={{ animationDelay: "40ms" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/${file}`}
        alt="Kyrie Cai"
        width={112}
        height={112}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
