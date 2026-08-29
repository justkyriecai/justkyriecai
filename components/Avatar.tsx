import { promises as fs } from "node:fs";
import path from "node:path";

import TiltedAvatar from "./TiltedAvatar";
import { SITE } from "@/lib/site";

const CANDIDATES = ["avatar.jpg", "avatar.jpeg", "avatar.png", "avatar.webp"];

/** Renders the portrait only if a file is actually sitting in `public/`, so a
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

  return <TiltedAvatar src={`/${file}`} alt={SITE.name} />;
}
