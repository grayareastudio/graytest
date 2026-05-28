// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth-actions";
import { getUserTestHistory } from "@/lib/actions/result-actions";
import { getUserProfile } from "@/lib/actions/profile-actions";
import { DashboardClient } from "./DashboardClient";

function calculateStats(
  results: Awaited<ReturnType<typeof getUserTestHistory>>,
) {
  const totalTests = results.length;

  const numericScores = results
    .map((r) => r.score)
    .filter((s): s is number => s !== null);

  const averageScore =
    numericScores.length > 0
      ? numericScores.reduce((a, b) => a + b, 0) / numericScores.length
      : null;

  const bestScore =
    numericScores.length > 0 ? Math.max(...numericScores) : null;

  const totalTime = results
    .map((r) => r.duration_seconds || 0)
    .reduce((a, b) => a + b, 0);

  return { totalTests, averageScore, bestScore, totalTime };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [results, profile] = await Promise.all([
    getUserTestHistory(user.id).catch(() => []),
    getUserProfile().catch(() => null),
  ]);
  const stats = calculateStats(results);

  return <DashboardClient initialResults={results} stats={stats} profile={profile} />;
}
