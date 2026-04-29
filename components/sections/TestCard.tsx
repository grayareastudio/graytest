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
}

export function TestCard({
  title,
  description,
  duration,
  price,
  imageBg,
  badge,
}: TestCardProps) {
  return (
    <div className="relative text-center rounded-xl w-full aspect-9/16">
      {badge && (
        <span className="absolute -top-3 right-2.5 text-xs text-white font-semibold bg-[#0A0A0A]/20 border border-white px-2 py-1 rounded-full backdrop-blur-[10px] z-10">
          {badge}
        </span>
      )}
      <Image
        src={imageBg}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw,
                (max-width: 1024px) 50vw,
                25vw"
        className="object-cover rounded-xl"
      />

      <div className="px-6 pt-4 pb-8 space-y-8 md:space-y-3 max-h-3/5 min-h-3/12 w-full bg-[#0A0A0A]/20 backdrop-blur-md absolute bottom-0 z-10 rounded-xl border border-white/10">
        <h3 className="font-serif text-[clamp(30px,2.5vw,29px)] text-[#D1D5DC] ">
          {title}
        </h3>
        <p className="text-[#E5E7EB] text-[clamp(12px,1.5vw,11px)]">
          {description}
        </p>
        <p className="text-[clamp(12px,1.2vw,10px)] text-[#E5E7EB]">
          {duration} · {price}
        </p>

        <Button
          variant="primary"
          size="sm"
          className="text-[clamp(12px,1.2vw,10px)]"
        >
          <Link
            href={`/test/${title.toLowerCase()}/questions`}
            className="block"
          >
            Start your Assessment
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[clamp(12px,1.2vw,10px)]"
        >
          <Link href={`/${title.toLowerCase()}`} className="block">
            About the test
          </Link>
        </Button>
      </div>
    </div>
  );
}
