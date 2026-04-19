"use client";

import Link from "next/link";

import { ImageGallery } from "@/app/components/ImageGallery";
import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import { siteFile } from "@/app/lib/publicAssets";
import type { PublicSubfolderPdfGroup } from "@/app/lib/listPublicPdfs";

const BASE = ["الموقع", "مناخ المدرسة وبيئة التعلم"] as const;

const DOC_TITLE_OVERRIDES: Record<string, string> = {
  "اسماء اللجان.pdf": "أسماء اللجان",
};

function pdfDisplayTitle(filename: string): string {
  return DOC_TITLE_OVERRIDES[filename] ?? filename.replace(/\.pdf$/i, "");
}

type ManakhPageContentProps = {
  galleryUrls: readonly string[];
  rootPdfFiles: readonly string[];
  subfolders: readonly PublicSubfolderPdfGroup[];
};

export function ManakhPageContent({
  galleryUrls,
  rootPdfFiles,
  subfolders,
}: ManakhPageContentProps) {
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
          <p className="mt-10 text-lg font-semibold text-school-gold">01</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-school-white md:text-[2.75rem]">
            مجال مناخ المدرسة وبيئة التعلم
          </h1>
          <div
            className="js-section-line mt-8 h-0.5 w-24 bg-school-gold"
            aria-hidden
          />
        </div>
      </header>

      <section
        id="manakh-gallery"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="manakh-gallery-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">معرض الصور</p>
            <h2
              id="manakh-gallery-heading"
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
              altPrefix="مناخ المدرسة وبيئة التعلم"
            />
          </div>
        </div>
      </section>

      <section
        id="manakh-docs"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="manakh-docs-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">مكتبة الوثائق</p>
            <h2
              id="manakh-docs-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              وثائق المجال
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>

          {rootPdfFiles.length > 0 && (
            <div className="js-reveal">
              <ul className="divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
                {rootPdfFiles.map((filename, i) => {
                  const url = siteFile([...BASE], filename);
                  const title = pdfDisplayTitle(filename);
                  return (
                    <li key={filename}>
                      <PDFHoverCard
                        title={title}
                        url={url}
                        variant="row"
                        index={i + 1}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {subfolders.map((sub, idx) => (
            <div
              key={sub.folderName}
              className={`js-reveal ${idx === 0 && rootPdfFiles.length === 0 ? "" : "mt-16"}`}
            >
              <h3 className="mb-6 text-center text-xl font-bold text-school-black md:text-2xl">
                {sub.folderName}
              </h3>
              <ul className="divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
                {sub.files.map((filename, i) => {
                  const url = siteFile(
                    [...BASE, sub.folderName],
                    filename
                  );
                  const title = pdfDisplayTitle(filename);
                  return (
                    <li key={`${sub.folderName}/${filename}`}>
                      <PDFHoverCard
                        title={title}
                        url={url}
                        variant="row"
                        index={i + 1}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {rootPdfFiles.length === 0 && subfolders.length === 0 && (
            <p className="js-reveal text-center text-school-muted">
              لا توجد ملفات PDF في هذا المجلد حالياً.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
