import Image, { StaticImageData } from "next/image";
import { Button } from "../ui/Button";
import Link from "next/link";
interface TestCardProps {
  title: string;
  description: string;
  duration: string;
  price: string;
  imageBg: StaticImageData;
  badge?: string;
  onAssessment: () => void;
  onAbout: () => void;
}

export function TestCard({
  title,
  description,
  duration,
  price,
  imageBg,
  badge,
  onAssessment,
  onAbout,
}: TestCardProps) {
  return (
    <div className="relative text-center rounded-xl w-full aspect-9/16">
      {badge && (
        <span className="absolute -top-3 right-2.5 text-xs text-white font-semibold bg-[#0A0A0A]/20 border border-white px-2 py-1 rounded-full backdrop-blur-[10px]">
          {badge}
        </span>
      )}
      <Image src={imageBg} alt={title} className="w-full h-full rounded-xl" />

      <div className="p-10 space-y-4 bg-[#0A0A0A]/20 backdrop-blur-md absolute bottom-0 z-10 rounded-xl border border-white/10">
        <h3 className="font-serif text-[2.5rem]  text-[#D1D5DC] ">{title}</h3>
        <p className="text-[#E5E7EB]">{description}</p>
        <p className="text-sm text-[#E5E7EB]">
          {duration} · {price}
        </p>

        <Button variant="primary" size="sm" asChild>
          <Link href={`/test/${title.toLowerCase()}`} className="block">
            Start your Assessment
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAbout}
        >
          About the test
        </Button>
      </div>
    </div>
  );
}
