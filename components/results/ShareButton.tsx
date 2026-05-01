// components/results/ShareButton.tsx
"use client";

import { Button } from "@/components/ui/Button";

export function ShareButton({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Button size="md" className="w-full sm:w-auto" onClick={handleShare}>
      Share Results
    </Button>
  );
}
