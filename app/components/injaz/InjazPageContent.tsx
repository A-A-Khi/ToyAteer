"use client";

import Link from "next/link";

import { CsvCollapsibleTable } from "@/app/components/CsvCollapsibleTable";
import { ImageGallery } from "@/app/components/ImageGallery";
import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import { siteFile } from "@/app/lib/publicAssets";

const BASE = ["الموقع", "انجاز الطلبة"] as const;
const DETAIL_BASE = ["الموقع", "انجاز الطلبة", "انجاز الطلبة"] as const;

const MAIN_DOC_OVERRIDES: Record<string, string> = {
  // اسم الملف على القرص يتضمن مسافتين بين «النهائى» و«للفصل»
  "تحليل االإختبار النهائى  للفصل الدراسي الاول.pdf":
    "تحليل الاختبار النهائي للفصل الدراسي الأول",
  "طوي اعتير نسبة الاتقان .pdf": "طوي أعتير — نسبة الإتقان",
  "اسماء اللجان.pdf": "أسماء اللجان",
};

function pdfTitle(filename: string, overrides?: Record<string, string>) {
  return overrides?.[filename] ?? filename.replace(/\.pdf$/i, "");
}

const MAIN_DOCS: { filename: string }[] = [
  { filename: "تحليل االإختبار النهائى  للفصل الدراسي الاول.pdf" },
  { filename: "طوي اعتير نسبة الاتقان .pdf" },
  { filename: "اسماء اللجان.pdf" },
];

const CLASS_PDFS: { filename: string }[] = [
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (سابع 1) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (سابع 1) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - نسخة - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (سابع ثانى) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - نسخة - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (سادس) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (سادس) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - نسخة - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (عاشر) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  - نسخة - نسخة - نسخة.pdf",
  },
  {
    filename:
      "❇️مدرسة (طوى اعتير) تحليل صف (عاشر) ✳️ المعلم (أ-هانى ) ❇️ قسم العلوم  نسخة.pdf",
  },
];

const DETAIL_PDFS: { filename: string; title: string }[] = [
  { filename: "تحليل المستوى 11 متقدم .pdf", title: "تحليل المستوى 11 متقدم" },
  { filename: "تحليل المستوى 11اساسى .pdf", title: "تحليل المستوى 11 أساسى" },
  { filename: "علاجى 11 اساسى .pdf", title: "علاجى 11 أساسى" },
  { filename: "علاجى 11 متقدم .pdf", title: "علاجى 11 متقدم" },
  { filename: "اتقان حادى عشر.pdf", title: "إتقان حادي عشر" },
];

const DETAIL_CSVS: { filename: string; tableTitle: string }[] = [
  { filename: "تاسع.1.csv", tableTitle: "تحليل الصف التاسع أول" },
  { filename: "تاسع.2.csv", tableTitle: "تحليل الصف التاسع ثاني" },
  { filename: "ثامن.1.csv", tableTitle: "تحليل الصف الثامن أول" },
  { filename: "ثامن.2.csv", tableTitle: "تحليل الصف الثامن ثاني" },
  {
    filename: "حادي عشر تحليل - Copy.csv",
    tableTitle: "تحليل الصف الحادي عشر",
  },
  { filename: "تحليل سابع علوم.csv", tableTitle: "تحليل السابع علوم" },
  {
    filename: "RESULT ANALYSIS - TWAI ATIIR SCHOOL.csv",
    tableTitle: "تحليل النتائج الشامل",
  },
];

type InjazPageContentProps = {
  galleryUrls: readonly string[];
  docxFilenames: readonly string[];
  /** PDF من Supabase (مجلد injaz/) */
  storagePdfs?: readonly { title: string; url: string }[];
  /** ملفات Word من Supabase */
  storageDocx?: readonly { label: string; url: string }[];
};

export function InjazPageContent({
  galleryUrls,
  docxFilenames,
  storagePdfs = [],
  storageDocx = [],
}: InjazPageContentProps) {
  const masteryCsvUrl = siteFile(
    [...BASE],
    "تحليل نسبة الاتقان الفصل الاول 2025.csv"
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
          <p className="mt-10 text-lg font-semibold text-school-gold">03</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-tight text-school-white md:text-[2.75rem]">
            مجال الإنجاز الدراسي
          </h1>
          <div
            className="js-section-line mt-8 h-0.5 w-24 bg-school-gold"
            aria-hidden
          />
        </div>
      </header>

      <section
        id="injaz-gallery"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="injaz-gallery-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">معرض الصور</p>
            <h2
              id="injaz-gallery-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              إنجاز الطلبة
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <div className="js-reveal">
            <ImageGallery
              images={galleryUrls}
              altPrefix="إنجاز الطلبة"
            />
          </div>
        </div>
      </section>

      <section
        id="injaz-main-docs"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="injaz-main-docs-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">وثائق</p>
            <h2
              id="injaz-main-docs-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              وثائق الإنجاز
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {MAIN_DOCS.map((item, i) => {
              const url = siteFile([...BASE], item.filename);
              const title = pdfTitle(item.filename, MAIN_DOC_OVERRIDES);
              return (
                <li key={item.filename}>
                  <PDFHoverCard
                    title={title}
                    url={url}
                    variant="row"
                    index={i + 1}
                  />
                </li>
              );
            })}
            {storagePdfs.map((item, i) => (
              <li key={`storage-pdf:${item.url}`}>
                <PDFHoverCard
                  title={item.title}
                  url={item.url}
                  variant="row"
                  index={MAIN_DOCS.length + i + 1}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="injaz-classes"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="injaz-classes-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">الصفوف</p>
            <h2
              id="injaz-classes-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              تحليل أداء الصفوف
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <ul className="js-reveal divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {CLASS_PDFS.map((item, i) => {
              const url = siteFile([...BASE], item.filename);
              const title = pdfTitle(item.filename);
              return (
                <li key={item.filename}>
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
      </section>

      <section
        id="injaz-mastery"
        className="bg-section-soft py-[var(--section-pad-y)]"
        aria-labelledby="injaz-mastery-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">الإتقان</p>
            <h2
              id="injaz-mastery-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              تحليل نسب الإتقان
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>
          <div className="js-reveal">
            <CsvCollapsibleTable
              csvUrl={masteryCsvUrl}
              tableTitle="نسبة الإتقان الفصل الأول"
            />
          </div>
        </div>
      </section>

      <section
        id="injaz-detail"
        className="bg-school-white py-[var(--section-pad-y)]"
        aria-labelledby="injaz-detail-heading"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="js-section-head js-reveal mb-16 text-center md:mb-20">
            <p className="js-section-eyebrow text-section-eyebrow">تفصيلي</p>
            <h2
              id="injaz-detail-heading"
              className="js-section-title mt-4 text-section-title text-school-black"
            >
              تحليل تفصيلي
            </h2>
            <div
              className="js-section-line mx-auto mt-8 h-0.5 w-20 bg-school-gold"
              aria-hidden
            />
          </div>

          <h3 className="js-reveal mb-8 text-xl font-bold text-school-black md:text-2xl">
            ملفات PDF
          </h3>
          <ul className="js-reveal mb-20 divide-y divide-neutral-200 border-y border-neutral-200 bg-school-white">
            {DETAIL_PDFS.map((item, i) => {
              const url = siteFile([...DETAIL_BASE], item.filename);
              return (
                <li key={item.filename}>
                  <PDFHoverCard
                    title={item.title}
                    url={url}
                    variant="row"
                    index={i + 1}
                  />
                </li>
              );
            })}
          </ul>

          <h3 className="js-reveal mb-8 text-xl font-bold text-school-black md:text-2xl">
            جداول التحليل (CSV)
          </h3>
          <div className="flex flex-col gap-12">
            {DETAIL_CSVS.map((item) => (
              <div key={item.filename} className="js-reveal">
                <CsvCollapsibleTable
                  csvUrl={siteFile([...DETAIL_BASE], item.filename)}
                  tableTitle={item.tableTitle}
                />
              </div>
            ))}
          </div>

          <h3 className="js-reveal mb-8 mt-20 text-xl font-bold text-school-black md:text-2xl">
            ملفات Word (تحميل)
          </h3>
          {docxFilenames.length === 0 && storageDocx.length === 0 ? (
            <p className="js-reveal text-school-muted">
              لا توجد ملفات Word في المجلد حالياً.
            </p>
          ) : (
            <ul className="js-reveal flex flex-col gap-3">
              {docxFilenames.map((name) => {
                const href = siteFile([...DETAIL_BASE], name);
                return (
                  <li key={name}>
                    <a
                      href={href}
                      download={name}
                      className="flex w-full items-center justify-between gap-4 border border-neutral-200 bg-neutral-50 px-5 py-4 text-school-black transition hover:border-school-gold hover:bg-white"
                    >
                      <span className="min-w-0 break-words font-medium">
                        {name.replace(/\.docx$/i, "")}
                      </span>
                      <span className="shrink-0 rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold">
                        تحميل
                      </span>
                    </a>
                  </li>
                );
              })}
              {storageDocx.map((item) => (
                <li key={`storage-docx:${item.url}`}>
                  <a
                    href={item.url}
                    download
                    className="flex w-full items-center justify-between gap-4 border border-neutral-200 bg-neutral-50 px-5 py-4 text-school-black transition hover:border-school-gold hover:bg-white"
                  >
                    <span className="min-w-0 break-words font-medium">
                      {item.label}
                    </span>
                    <span className="shrink-0 rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold">
                      تحميل
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
