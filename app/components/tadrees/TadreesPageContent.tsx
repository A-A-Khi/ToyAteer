"use client";

import Link from "next/link";

import { ImageGallery } from "@/app/components/ImageGallery";
import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import { UploadedFromAdminSection } from "@/app/components/UploadedFromAdminSection";
import {
  mergeUniqueUrls,
  type UploadedDocumentItem,
} from "@/app/lib/storageBucket";
import { siteFile } from "@/app/lib/publicAssets";

const BASE = ["الموقع", "التدريس و التقويم"] as const;
const STRATEGY = ["الموقع", "التدريس و التقويم", "استراتيجيات مهمة"] as const;
const SCIENCE = ["الموقع", "التدريس و التقويم", "العلوم"] as const;
const INITIATIVES = ["الموقع", "التدريس و التقويم", "المبادرات"] as const;
const WORKSHEETS = ["الموقع", "التدريس و التقويم", "اوراق عمل"] as const;

const MAIN_GALLERY_FILES = [
  "WhatsApp Image 2026-01-29 at 1.13.56 PM (1).jpeg",
  "WhatsApp Image 2026-01-29 at 1.13.57 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.20.07 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.20.08 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.46.56 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.46.56 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 4.46.57 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.46.57 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 4.50.41 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.50.44 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.50.46 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (7).jpeg",
  "لقطة شاشة 2026-01-29 132321.png",
  "لقطة شاشة 2026-01-29 132406.png",
  "لقطة شاشة 2026-01-29 132450.png",
  "لقطة شاشة 2026-01-29 132524.png",
  "لقطة شاشة 2026-01-29 132603.png",
  "لقطة شاشة 2026-01-29 132634.png",
  "لقطة شاشة 2026-01-29 132702.png",
  "لقطة شاشة 2026-01-29 132729.png",
  "لقطة شاشة 2026-01-29 132804.png",
  "لقطة شاشة 2026-01-29 132832.png",
  "لقطة شاشة 2026-01-29 132901.png",
  "لقطة شاشة 2026-01-29 132929.png",
  "لقطة شاشة 2026-01-29 133038.png",
  "لقطة شاشة 2026-01-29 133116.png",
] as const;

const STRATEGY_PDFS: { filename: string; title: string }[] = [
  { filename: "11.pdf", title: "الاستراتيجية الأولى" },
  { filename: "22.pdf", title: "الاستراتيجية الثانية" },
  { filename: "33.pdf", title: "الاستراتيجية الثالثة" },
  { filename: "44.pdf", title: "الاستراتيجية الرابعة" },
  { filename: "55.pdf", title: "الاستراتيجية الخامسة" },
];

const SCIENCE_GALLERY_FILES = [
  "WhatsApp Image 2026-02-01 at 2.44.44 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.44.44 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.44.45 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.44.45 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.53.24 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.53.24 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.55.40 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.55.40 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 4.10.52 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 4.10.53 PM.jpeg",
] as const;

const INITIATIVE_PDFS: { filename: string }[] = [
  { filename: "ملف الاستراتيجات.pdf" },
  { filename: "منصه نور.pdf" },
  { filename: "896.pdf" },
  { filename: "المبرمج_الصغير_بناء_جيل_المستقبل.pdf" },
  { filename: "كتيب المسابقة.pdf" },
  { filename: "كتيب المسابقة (1).pdf" },
  {
    filename:
      "كشف الطلاب المشاركين في مبادرة انا اشرح..انا اتعلم.pdf",
  },
  { filename: "كشف الطلاب مبادرة (منصتي طريق تفوقي).pdf" },
  { filename: "مبادرة اتقان الاختبارات النهائية.pdf" },
  { filename: "مبادرة تعلم بلا حدود.pdf" },
  { filename: "مسابقة قمة التحدي.pdf" },
];

const INITIATIVE_TITLE_OVERRIDES: Record<string, string> = {
  "ملف الاستراتيجات.pdf": "ملف الاستراتيجات",
  "منصه نور.pdf": "منصة نور",
  "896.pdf": "مستند مسح ضوئي",
  "كتيب المسابقة.pdf": "كتيب المسابقة",
  "كتيب المسابقة (1).pdf": "كتيب المسابقة (نسخة إضافية)",
  "كشف الطلاب المشاركين في مبادرة انا اشرح..انا اتعلم.pdf":
    "كشف الطلاب — مبادرة «أنا أشرح.. أنا أتعلم»",
  "كشف الطلاب مبادرة (منصتي طريق تفوقي).pdf":
    "كشف الطلاب — مبادرة «منصتي طريق تفوقي»",
  "مبادرة اتقان الاختبارات النهائية.pdf": "مبادرة إتقان الاختبارات النهائية",
  "مبادرة تعلم بلا حدود.pdf": "مبادرة تعلّم بلا حدود",
  "مسابقة قمة التحدي.pdf": "مسابقة قمّة التحدي",
  "المبرمج_الصغير_بناء_جيل_المستقبل.pdf":
    "المبرمج الصغير — بناء جيل المستقبل",
};

const WORKSHEET_PDFS: { filename: string }[] = [
  { filename: "ورقة عمل ا احمد طرق التدريس الحديثة (1).pdf" },
  { filename: "بطاقة_توثيق_نقل_المعرفة_يناير_2024[1].pdf" },
];

const DOCX_DOWNLOADS: { filename: string; label: string }[] = [
  { filename: "اسماء اللجان.docx", label: "أسماء اللجان" },
  { filename: "ورقة عمل.docx", label: "ورقة عمل" },
];

function initiativeTitle(filename: string) {
  return INITIATIVE_TITLE_OVERRIDES[filename] ?? filename.replace(/\.pdf$/i, "");
}

function worksheetTitle(filename: string) {
  if (filename === "بطاقة_توثيق_نقل_المعرفة_يناير_2024[1].pdf") {
    return "بطاقة توثيق نقل المعرفة — يناير 2024";
  }
  return filename.replace(/\.pdf$/i, "");
}

export type TadreesPageExtraProps = {
  mainGalleryExtraUrls?: readonly string[];
  scienceGalleryExtraUrls?: readonly string[];
  uploadedDocuments?: readonly UploadedDocumentItem[];
};

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

export function TadreesPageContent({
  mainGalleryExtraUrls = [],
  scienceGalleryExtraUrls = [],
  uploadedDocuments = [],
}: TadreesPageExtraProps = {}) {
  const mainGalleryUrls = mergeUniqueUrls(
    MAIN_GALLERY_FILES.map((name) => siteFile([...BASE], name)),
    mainGalleryExtraUrls
  );
  const scienceGalleryUrls = mergeUniqueUrls(
    SCIENCE_GALLERY_FILES.map((name) => siteFile([...SCIENCE], name)),
    scienceGalleryExtraUrls
  );

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
          <p className="mt-10 text-lg font-semibold text-school-gold">04</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-school-white md:text-[2.75rem]">
            مجال التدريس والتقويم
          </h1>
          <div
            className="js-section-line mt-8 h-0.5 w-24 bg-school-gold"
            aria-hidden
          />
        </div>
      </header>

      <section
        id="tadrees-gallery"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="tadrees-gallery-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">معرض الصور</p>
            <h2
              id="tadrees-gallery-heading"
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
              images={mainGalleryUrls}
              altPrefix="التدريس والتقويم"
            />
          </div>
        </div>
      </section>

      <section
        id="tadrees-strategies"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="tadrees-strategies-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">استراتيجيات</p>
            <h2
              id="tadrees-strategies-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              الاستراتيجيات التدريسية
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {STRATEGY_PDFS.map((item, i) => (
              <li key={item.filename}>
                <PDFHoverCard
                  title={item.title}
                  url={siteFile([...STRATEGY], item.filename)}
                  variant="row"
                  index={i + 1}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="tadrees-science"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="tadrees-science-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">العلوم</p>
            <h2
              id="tadrees-science-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              أنشطة العلوم
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <div className="js-reveal">
            <ImageGallery
              images={scienceGalleryUrls}
              altPrefix="أنشطة العلوم"
            />
          </div>
        </div>
      </section>

      <section
        id="tadrees-initiatives"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="tadrees-initiatives-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">مبادرات</p>
            <h2
              id="tadrees-initiatives-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              المبادرات التعليمية
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {INITIATIVE_PDFS.map((item, i) => (
              <li key={item.filename}>
                <PDFHoverCard
                  title={initiativeTitle(item.filename)}
                  url={siteFile([...INITIATIVES], item.filename)}
                  variant="row"
                  index={i + 1}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="tadrees-worksheets"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="tadrees-worksheets-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">مواد</p>
            <h2
              id="tadrees-worksheets-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              أوراق العمل
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>

          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {WORKSHEET_PDFS.map((item, i) => (
              <li key={item.filename}>
                <PDFHoverCard
                  title={worksheetTitle(item.filename)}
                  url={siteFile([...WORKSHEETS], item.filename)}
                  variant="row"
                  index={i + 1}
                />
              </li>
            ))}
          </ul>

          <h3 className="js-reveal mb-6 mt-16 text-xl font-bold text-school-black md:text-2xl">
            ملفات Word (تحميل)
          </h3>
          <ul className="js-reveal flex flex-col gap-3">
            {DOCX_DOWNLOADS.map((item) => {
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

      {uploadedDocuments.length > 0 ? (
        <section
          id="tadrees-uploaded"
          className="bg-section-soft py-[var(--section-pad-y)]"
          aria-label="الملفات المرفوعة"
        >
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="js-reveal">
              <UploadedFromAdminSection
                id="tadrees-uploaded-block"
                items={uploadedDocuments}
                pdfCardVariant="row"
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
