import { Button } from "@/components/ui/Button";
import Image, { StaticImageData } from "next/image";
import { TypingText } from "../ui/TypingText";
import Link from "next/link";
import { FingerprintPattern } from "lucide-react";

type HeroProps = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  videoSrc: string;
  videoPoster?: string;
  videoClassName?: string;
  bgImage?: StaticImageData;
};

export function Hero({
  title,
  description,
  href,
  buttonText,
  videoSrc,
  videoPoster,
  videoClassName,
  bgImage,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-39 overflow-hidden">
      <video
        key={videoSrc}
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`
          hidden md:block md:absolute 
          ${videoClassName || ""}
        `}
      />

      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          fill
          sizes="(max-width: 2000px) 100vw, (max-width: 1024px) 75vw, 50vw"
          className="-z-1 object-cover"
          priority
        />
      )}

      <div className="relative z-10 max-w-201 w-full space-y-8 md:space-y-10 lg:space-y-13">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl">
          <TypingText text={title || ""} gradient />
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-[#D4D4D4] font-light max-w-137">
          {description}
        </p>
        <Link
          href={href}
          className="group flex items-center gap-3 bg-[#0A0A0A] border-2 border-[#C6BCAA]/30 rounded-full sm:py-4 sm:px-8 py-2 px-4 w-max shadow-[0_0_30px_rgba(198,188,170,0.3)] hover:shadow-[0_0_40px_rgba(198,188,170,0.5)] hover:bg-[#111] hover:border-[#C6BCAA]/50 transition-all duration-300"
        >
          <FingerprintPattern className="sm:w-6 sm:h-6 h-4 w-4" />
          <span className="font-serif sm:text-lg text-md text-white font-light tracking-wide">
            {buttonText}
          </span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
