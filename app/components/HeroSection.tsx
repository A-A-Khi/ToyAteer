"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { siteFile } from "@/app/lib/publicAssets";

const SLIDE_FILENAMES = [
  "WhatsApp Image 2026-04-18 at 9.00.43 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 9.00.43 PM (1).jpeg",
  "WhatsApp Image 2026-04-18 at 9.00.43 PM (2).jpeg",
  "WhatsApp Image 2026-04-18 at 9.00.43 PM (3).jpeg",
  "WhatsApp Image 2026-04-18 at 9.00.43 PM (4).jpeg",
  "WhatsApp Image 2026-04-18 at 3.52.17 PM.jpeg",
] as const;

export function HeroSection() {
  const slides = useMemo(
    () =>
      SLIDE_FILENAMES.map((name) => siteFile(["الموقع", "الرئيسية"], name)),
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <section
      id="hero"
      className="relative min-h-[78vh] overflow-hidden bg-school-black pt-24 pb-16 md:min-h-[85vh] md:pt-28 md:pb-24"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        <div
          className="absolute inset-0 bg-school-black/65"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col px-4 md:px-6">
        <div className="js-reveal">
          <h1
            id="hero-title"
            className="text-3xl font-bold leading-tight text-school-white md:text-5xl md:leading-tight"
          >
            مدرسة طوي أعتير بنين{" "}
            <span className="text-school-gold">للتعليم الأساسي</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-school-muted md:text-xl">
            نحو تعليم نوعي يعزز الإبداع والتميز، ويؤهل أبناءنا ليكونوا فاعلين في
            بناء مستقبل وطنهم بثقة ومعرفة.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#domains"
              className="inline-flex items-center justify-center rounded border-2 border-school-gold bg-school-gold px-8 py-3 text-center text-sm font-semibold text-school-black transition hover:bg-transparent hover:text-school-gold"
            >
              استعراض تقويم الأداء
            </a>
            <Link
              href="/#home-docs"
              className="inline-flex items-center justify-center rounded border-2 border-school-gold bg-transparent px-8 py-3 text-center text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
            >
              الخطة المدرسية
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
