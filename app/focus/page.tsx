import GoalBoard from "@/components/GoalBoard";
import { isAdmin } from "@/lib/auth";
import { weekOf } from "@/lib/goals";
import { readProgress } from "@/lib/progress";

// cookies() + the on-disk overlay are per-request state
export const dynamic = "force-dynamic";

export default async function FocusPage() {
  const [admin, progress] = await Promise.all([isAdmin(), readProgress()]);
  return (
    <main className="h-full">
      <GoalBoard
        progress={progress}
        admin={admin}
        thisWeek={weekOf(new Date())}
      />
    </main>
  );
}
