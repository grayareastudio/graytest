"use client";
import { Button } from "@/components/ui/Button";
import Image, { StaticImageData } from "next/image";

type HeroProps = {
  title: string;
  description: string;
  buttonText: string;
  image: StaticImageData;
  bgImage?: StaticImageData;
};
export function Hero({
  title,
  description,
  buttonText,
  image,
  bgImage,
}: HeroProps) {
  return (
    <section className="relative h-screen flex items-center px-39 overflow-hidden bg-black">
      <Image
        src={image}
        alt={title}
        className="absolute right-39 top-1/2 -translate-y-1/2 w-1/2 object-cover h-auto z-1"
        priority
      />
      {bgImage && (
        <Image src={bgImage} alt={title} fill className="z-0" priority />
      )}

      <div className="relative z-10 max-w-201 space-y-13">
        <h1 className="font-serif text-7xl text-[#D4D4D4]">{title}</h1>

        <p className="text-2xl text-[#D4D4D4] font-light max-w-137">
          {description}
        </p>

        <Button
          onClick={() =>
            document
              .getElementById("tests")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
