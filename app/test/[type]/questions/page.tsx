import { TestContent } from "./TestContent";

export default async function TestPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  return <TestContent type={type} />;
}
