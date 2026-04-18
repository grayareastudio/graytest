// app/test/[type]/layout.tsx
import { createClient } from "@/lib/supabase/client";
import { TestLayoutClient } from "./TestLayoutClient";

async function getTestMetadata(testType: string) {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("test_type", testType)
    .eq("is_active", true);

  if (error) {
    return { duration: 0, totalQuestions: 10 };
  }

  const duration = testType === "iq" ? 1200 : 0;

  return {
    duration,
    totalQuestions: count || 10,
  };
}

export default async function TestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  const { duration, totalQuestions } = await getTestMetadata(type);

  return (
    <TestLayoutClient
      durationSeconds={duration}
      totalQuestions={totalQuestions}
      testType={type}
    >
      {children}
    </TestLayoutClient>
  );
}
