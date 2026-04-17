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
    <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-39 overflow-hidden bg-black">
      {/* Image: Disembunyikan di mobile, muncul di tablet+ */}
      <Image
        src={image}
        alt={title}
        className="hidden md:block md:absolute md:right-39 md:top-1/2 md:-translate-y-1/2 md:w-1/2 md:object-cover md:h-auto md:z-1"
        priority
        quality={90}
      />
      {bgImage && (
        <Image
          src={bgImage}
          alt="bg"
          fill
          className="z-0 object-cover"
          priority
        />
      )}

      <div className="relative z-10 max-w-201 w-full space-y-8 md:space-y-10 lg:space-y-13">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#D4D4D4]">
          {title}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-[#D4D4D4] font-light max-w-137">
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
