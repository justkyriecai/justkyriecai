import { FaStar } from "react-icons/fa6";

import ScrollPane from "@/components/ScrollPane";
import { ACTIVITY, BUILDING, OPEN_SOURCE, type Project } from "@/lib/projects";

function Row({ p, delay }: { p: Project; delay: number }) {
  return (
    <li className="border-t border-[var(--hair)]">
      <a
        href={p.href}
        target="_blank"
        rel="noopener noreferrer"
        className="kc-rise group flex items-baseline gap-4 py-4"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="min-w-0 flex-1">
          <h3 className="flex items-baseline gap-2 text-[17px] font-medium tracking-[-0.015em]">
            <span className="underline decoration-[var(--fg-4)] decoration-1 underline-offset-[5px] transition-colors duration-300 group-hover:decoration-[var(--accent)]">
              {p.name}
            </span>
            {p.stars ? (
              <span className="tnum inline-flex items-center gap-1 text-[11px] font-normal text-[var(--fg-3)]">
                <FaStar className="h-[9px] w-[9px]" />
                {p.stars}
              </span>
            ) : null}
          </h3>
          <p className="mt-1 max-w-prose text-[14px] leading-relaxed text-[var(--fg-2)]">
            {p.blurb}
          </p>
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] text-[var(--fg-3)] sm:block">
          {p.label}
        </span>
      </a>
    </li>
  );
}

export default function Build() {
  return (
    <ScrollPane className="h-full">
      <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-32 sm:px-8">
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Build</h1>
          <p className="text-[12px] text-[var(--fg-3)]">
            things that exist because I made them
          </p>
        </header>

        <h2 className="mt-8 mb-1 text-[11px] font-medium tracking-[0.08em] text-[var(--fg-3)] uppercase">
          Now
        </h2>
        <ul>
          {BUILDING.map((p, i) => (
            <Row key={p.name} p={p} delay={i * 60} />
          ))}
        </ul>

        <h2 className="mt-10 mb-1 text-[11px] font-medium tracking-[0.08em] text-[var(--fg-3)] uppercase">
          Activity
        </h2>
        <ul>
          {ACTIVITY.map((p, i) => (
            <Row key={p.name} p={p} delay={100 + i * 60} />
          ))}
        </ul>

        <h2 className="mt-10 mb-1 text-[11px] font-medium tracking-[0.08em] text-[var(--fg-3)] uppercase">
          Open source
        </h2>
        <ul>
          {OPEN_SOURCE.map((p, i) => (
            <Row key={p.name} p={p} delay={180 + i * 60} />
          ))}
        </ul>
      </div>
    </ScrollPane>
  );
}
