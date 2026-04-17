import { getTestConfig } from "@/lib/test/questions";
import { TestLayoutClient } from "./TestLayoutClient";

interface TestLayoutProps {
  children: React.ReactNode;
  params: Promise<{ type: string }>;
}

export default async function TestLayout({
  children,
  params,
}: TestLayoutProps) {
  const { type } = await params;
  const config = getTestConfig(type);

  return (
    <TestLayoutClient
      durationSeconds={config.duration}
      totalQuestions={config.questions.length}
    >
      {children}
    </TestLayoutClient>
  );
}
