"use client";

import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import type { UploadedDocumentItem } from "@/app/lib/storageBucket";

function DownloadRow({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-between gap-4 border border-neutral-200 bg-neutral-50 px-5 py-4 text-school-black transition hover:border-school-gold hover:bg-white"
    >
      <span className="min-w-0 break-words font-medium">{title}</span>
      <span className="shrink-0 rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold">
        تحميل
      </span>
    </a>
  );
}

type UploadedFromAdminSectionProps = {
  id: string;
  items: readonly UploadedDocumentItem[];
  /** معرض الصور: استخدم row؛ الرئيسية: card */
  pdfCardVariant?: "row" | "card";
  className?: string;
};

export function UploadedFromAdminSection({
  id,
  items,
  pdfCardVariant = "row",
  className = "",
}: UploadedFromAdminSectionProps) {
  if (items.length === 0) return null;

  return (
    <div
      id={id}
      className={`rounded-xl border-2 border-school-gold/35 bg-school-gold/[0.06] p-6 md:p-8 ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-school-gold">
          من لوحة الإدارة
        </p>
        <h2
          id={`${id}-heading`}
          className="mt-2 text-xl font-bold text-school-black md:text-2xl"
        >
          الملفات المرفوعة
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-school-muted">
          وثائق وملفات تُحدَّث من التخزين السحابي للمدرسة وتظهر هنا بعد الرفع مباشرة
          (دون إعادة نشر الموقع).
        </p>
        <div
          className="mx-auto mt-6 h-0.5 w-16 bg-school-gold"
          aria-hidden
        />
      </div>

      <ul
        className={
          pdfCardVariant === "row"
            ? "flex flex-col gap-0 divide-y divide-neutral-200 border border-neutral-200 bg-school-white"
            : "flex flex-col gap-4"
        }
      >
        {items.map((item, i) => (
          <li key={item.url}>
            {item.fileKind === "pdf" ? (
              <PDFHoverCard
                title={item.title}
                url={item.url}
                variant={pdfCardVariant}
                index={pdfCardVariant === "row" ? i + 1 : undefined}
              />
            ) : (
              <DownloadRow title={item.title} url={item.url} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
