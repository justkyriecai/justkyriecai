"use client";

import DecryptedText from "./DecryptedText";

/** The line resolves itself once on arrival, and again on hover. Scrambling
 *  draws only from the line's own letters, so the words hold their width
 *  instead of twitching while they settle. */
export default function Tagline({ text }: { text: string }) {
  return (
    <DecryptedText
      text={text}
      animateOn="inViewHover"
      sequential
      revealDirection="start"
      useOriginalCharsOnly
      speed={38}
      className="text-[var(--fg-2)]"
      encryptedClassName="text-[var(--fg-4)]"
      parentClassName="text-[17px]"
    />
  );
}
