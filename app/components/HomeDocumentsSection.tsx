"use client";

import { PDFHoverCard } from "./PDFHoverCard";
import { siteFile } from "@/app/lib/publicAssets";

const items: { title: string; filename: string }[] = [
  { title: "رسالة المدير ورؤية المدير", filename: "رسالة المدير ورؤية المدير.pdf" },
  { title: "البيانات الموظفين", filename: "البيانات الموظفين.pdf" },
  { title: "توزيع الشعب", filename: "توزيع الشعب.pdf" },
  {
    title:
      "تقرير فريق الإشراف التربوي 27 (غير المركزي) لمدرسة طوي اعتير بنين 5-12",
    filename:
      "تقرير فريق الإشراف التربوي 27 (غير المركزي) لمدرسة طوي اعتير بنين 5-12_1.pdf",
  },
];

type HomeDocumentsSectionProps = {
  /** وثائق إضافية من Supabase (مجلد home/) */
  storageDocs?: readonly { title: string; url: string }[];
};

export function HomeDocumentsSection({
  storageDocs = [],
}: HomeDocumentsSectionProps) {
  return (
    <section
      id="home-docs"
      className="bg-school-white py-16 md:py-24"
      aria-labelledby="home-docs-heading"
    >
      <div className="js-reveal mx-auto max-w-3xl px-4 md:px-6">
        <h2
          id="home-docs-heading"
          className="mb-10 text-center text-2xl font-bold text-school-black md:text-3xl"
        >
          وثائق الصفحة الرئيسية
        </h2>
        <ul className="flex flex-col gap-4">
          {items.map((item) => {
            const url = siteFile(["الموقع", "الرئيسية"], item.filename);
            return (
              <li key={item.filename}>
                <PDFHoverCard title={item.title} url={url} />
              </li>
            );
          })}
          {storageDocs.map((item) => (
            <li key={`storage:${item.url}`}>
              <PDFHoverCard title={item.title} url={item.url} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
