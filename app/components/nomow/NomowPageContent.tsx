"use client";

import Link from "next/link";

import { ImageGallery } from "@/app/components/ImageGallery";
import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import { siteFile } from "@/app/lib/publicAssets";

const BASE = ["الموقع", "النمو الشخصي"] as const;

const PDF_OVERRIDES: Record<string, string> = {
  "اخصائي الانشطة سجل فعاليات.pdf": "أخصائي الأنشطة — سجل فعاليات",
  "برامج الانماء المهني.pdf": "برامج الإنماء المهني",
};

const PDF_FILES: { filename: string }[] = [
  { filename: "اخصائي الانشطة سجل فعاليات.pdf" },
  { filename: "برامج الانماء المهني.pdf" },
];

const DOCX_FILES: { filename: string; label: string }[] = [
  { filename: "اخصائي الانشطة.docx", label: "أخصائي الأنشطة" },
  { filename: "اسماء اللجان.docx", label: "أسماء اللجان" },
];

function pdfTitle(filename: string) {
  return PDF_OVERRIDES[filename] ?? filename.replace(/\.pdf$/i, "");
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
}

type NomowPageContentProps = {
  videoUrl: string;
  galleryUrls: readonly string[];
};

export function NomowPageContent({ videoUrl, galleryUrls }: NomowPageContentProps) {
  return (
    <>
      <header className="w-full bg-school-black">
        <div className="js-reveal mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
          <Link
            href="/"
            className="inline-flex rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
          >
            ← العودة للصفحة الرئيسية
          </Link>
          <p className="mt-10 text-lg font-semibold text-school-gold">05</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-school-white md:text-[2.75rem]">
            مجال النمو الشخصي
          </h1>
          <div
            className="js-section-line mt-8 h-0.5 w-24 bg-school-gold"
            aria-hidden
          />
        </div>
      </header>

      <section
        id="nomow-cyber"
        className="bg-school-black py-[var(--section-pad-y)]"
        aria-labelledby="nomow-cyber-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-12 text-center md:mb-16">
            <p className="js-section-eyebrow text-section-eyebrow text-school-gold/90">
              توعية
            </p>
            <h2
              id="nomow-cyber-heading"
              className="js-section-title mt-4 text-section-title text-school-white"
            >
              الأمن الإلكتروني
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>

          <div className="js-reveal mx-auto max-w-[800px]">
            <p className="mb-6 text-center text-lg font-semibold text-school-gold md:text-xl">
              فيديو توعوي - الأمن الإلكتروني
            </p>
            <div className="overflow-hidden rounded-sm border-2 border-school-gold bg-school-black shadow-[0_0_0_1px_rgba(201,168,76,0.15)]">
              <video
                className="aspect-video w-full bg-black object-contain"
                controls
                playsInline
                preload="metadata"
                src={videoUrl}
              >
                المتصفح لا يدعم تشغيل الفيديو.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section
        id="nomow-gallery"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="nomow-gallery-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">معرض الصور</p>
            <h2
              id="nomow-gallery-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              لقطات من المجال
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <div className="js-reveal">
            <ImageGallery
              images={galleryUrls}
              altPrefix="النمو الشخصي"
            />
          </div>
        </div>
      </section>

      <section
        id="nomow-docs"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="nomow-docs-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">وثائق</p>
            <h2
              id="nomow-docs-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              وثائق المجال
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>

          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {PDF_FILES.map((item, i) => {
              const url = siteFile([...BASE], item.filename);
              return (
                <li key={item.filename}>
                  <PDFHoverCard
                    title={pdfTitle(item.filename)}
                    url={url}
                    variant="row"
                    index={i + 1}
                  />
                </li>
              );
            })}
          </ul>

          <h3 className="js-reveal mb-6 mt-16 text-xl font-bold text-school-black md:text-2xl">
            ملفات Word (تحميل)
          </h3>
          <ul className="js-reveal flex flex-col gap-3">
            {DOCX_FILES.map((item) => {
              const href = siteFile([...BASE], item.filename);
              return (
                <li key={item.filename}>
                  <a
                    href={href}
                    download={item.filename}
                    className="flex w-full items-center justify-between gap-4 border border-neutral-200 bg-neutral-50 px-5 py-4 text-school-black transition hover:border-school-gold hover:bg-white"
                  >
                    <span className="min-w-0 break-words font-medium">
                      {item.label}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold">
                      <DownloadIcon className="h-5 w-5 text-school-gold" />
                      تحميل
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
