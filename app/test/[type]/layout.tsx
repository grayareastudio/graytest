// app/test/[type]/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { TestLayoutClient } from "./TestLayoutClient";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/actions/auth-actions";

async function getTestMetadata(testType: string) {
  const supabase = await createClient();

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
  const user = await getCurrentUser();

  return (
    <>
      <Header />

      <TestLayoutClient
        durationSeconds={duration}
        totalQuestions={totalQuestions}
        testType={type}
        userEmail={user?.email}
      >
        {children}
      </TestLayoutClient>
    </>
  );
}
