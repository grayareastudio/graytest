// app/test/[type]/questions/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { TestLayoutClient } from "./TestLayoutClient";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/actions/auth-actions";

async function getTestMetadata(testType: string) {
  const supabase = await createClient();

  const { data: dimensions, error } = await supabase
    .from("dimensions")
    .select(
      `
      id,
      questions!inner (
        id
      )
    `,
    )
    .eq("test_type", testType)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching test metadata:", error);
    return { duration: 0, totalQuestions: 10 };
  }

  const totalQuestions =
    dimensions?.reduce((sum, dim) => {
      return sum + (dim.questions?.length || 0);
    }, 0) || 0;

  const duration = testType.toLowerCase() === "iq" ? 1200 : 0; // 20 menit

  return {
    duration,
    totalQuestions: totalQuestions || 10,
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
