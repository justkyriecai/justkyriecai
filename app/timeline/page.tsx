import Timeline from "@/components/Timeline";
import { YEARS } from "@/lib/timeline";

export default function TimelinePage() {
  return (
    <main className="h-full">
      <Timeline years={YEARS} />
    </main>
  );
}
