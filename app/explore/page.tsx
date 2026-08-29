import ScrollPane from "@/components/ScrollPane";

export default function Explore() {
  return (
    <ScrollPane className="h-full">
      <div className="mx-auto w-full max-w-2xl px-5 pt-8 pb-32 sm:px-8">
        <header className="flex items-baseline justify-between gap-4">
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">
            Explore
          </h1>
          <p className="text-[12px] text-[var(--fg-3)]">where I have been</p>
        </header>

        <div className="kc-rise mt-10 border-t border-[var(--hair)] pt-8">
          <p className="text-[12px] text-[var(--fg-3)]">Nothing here yet.</p>
        </div>
      </div>
    </ScrollPane>
  );
}
