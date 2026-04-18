// app/test/layout.tsx
import { getTestConfig } from "@/lib/test/questions";
import { TestLayoutClient } from "./TestLayoutClient";

export default async function TestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = getTestConfig(type);

  return (
    <TestLayoutClient
      durationSeconds={config.duration}
      totalQuestions={config.questions.length}
      testType={type}
    >
      {children}
    </TestLayoutClient>
  );
}
