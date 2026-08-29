"use client";

/** The name, set in a serif display face and revealed one letter at a time —
 *  each arriving out of focus and settling, ~55ms apart — then a hairline
 *  draws out from the centre underneath. */
export default function Wordmark({ text }: { text: string }) {
  const letters = [...text];

  return (
    <div className="flex flex-col items-center">
      <h1
        aria-label={text}
        className="kc-wordmark text-[clamp(3.75rem,17vw,8.5rem)] leading-[1.02] font-normal tracking-[-0.012em]"
      >
        {letters.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            aria-hidden
            className="kc-focus-in inline-block"
            style={{ animationDelay: `${i * 55}ms` }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </h1>
      <span
        aria-hidden
        className="kc-rule mt-5 block h-px w-[min(20rem,64vw)] bg-gradient-to-r from-transparent via-[var(--fg-3)] to-transparent"
      />
    </div>
  );
}
