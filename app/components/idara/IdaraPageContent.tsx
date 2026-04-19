"use client";

import Link from "next/link";

import { ImageGallery } from "@/app/components/ImageGallery";
import { PDFHoverCard } from "@/app/components/PDFHoverCard";
import { siteFile } from "@/app/lib/publicAssets";

const BASE = ["الموقع", "القيادة والحوكمة"] as const;
const MEETINGS_FOLDER = [
  "الموقع",
  "القيادة والحوكمة",
  "محاضر اجتماعات",
] as const;
const PLAN_FOLDER = ["الموقع", "القيادة والحوكمة", "الخطة المدرسية"] as const;

type MainDoc = { filename: string; title: string };

type IdaraPageContentProps = {
  galleryUrls: readonly string[];
  mainDocuments: readonly MainDoc[];
  teamGalleryUrls: readonly string[];
  visitTeamsGalleryUrls: readonly string[];
  supervisoryGalleryUrls: readonly string[];
  meetingFilenames: readonly string[];
  planFilenames: readonly string[];
};

function pdfTitleFromFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "");
}

function GallerySection({
  id,
  title,
  images,
  altPrefix,
  bgClass,
}: {
  id: string;
  title: string;
  images: readonly string[];
  altPrefix: string;
  bgClass: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${bgClass}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="js-reveal">
          <h2
            id={`${id}-heading`}
            className="mb-10 text-center text-2xl font-bold text-school-black md:text-3xl"
          >
            {title}
          </h2>
          <ImageGallery images={images} altPrefix={altPrefix} />
        </div>
      </div>
    </section>
  );
}

function PdfListSection({
  id,
  title,
  filenames,
  pathPrefix,
  bgClass,
}: {
  id: string;
  title: string;
  filenames: readonly string[];
  pathPrefix: readonly [string, ...string[]];
  bgClass: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${bgClass}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="js-reveal">
          <h2
            id={`${id}-heading`}
            className="mb-10 text-center text-2xl font-bold text-school-black md:text-3xl"
          >
            {title}
          </h2>
          {filenames.length === 0 ? (
            <p className="text-center text-school-muted">
              لا توجد ملفات PDF في هذا القسم حالياً.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {filenames.map((filename) => {
                const url = siteFile(pathPrefix, filename);
                const label = pdfTitleFromFilename(filename);
                return (
                  <li key={filename}>
                    <PDFHoverCard title={label} url={url} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function IdaraPageContent({
  galleryUrls,
  mainDocuments,
  teamGalleryUrls,
  visitTeamsGalleryUrls,
  supervisoryGalleryUrls,
  meetingFilenames,
  planFilenames,
}: IdaraPageContentProps) {
  return (
    <>
      <header className="border-b border-school-gold bg-school-black pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="js-reveal mx-auto max-w-6xl px-4 md:px-6">
          <Link
            href="/"
            className="inline-flex rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
          >
            ← العودة للصفحة الرئيسية
          </Link>
          <p className="mt-8 text-sm font-semibold text-school-gold">المجال 02</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-school-white md:text-4xl">
            مجال الإدارة والقيادة والحوكمة
          </h1>
        </div>
      </header>

      <section
        id="idara-gallery"
        className="bg-school-white py-16 md:py-24"
        aria-labelledby="idara-gallery-heading"
      >
        <div className="js-reveal mx-auto max-w-6xl px-4 md:px-6">
          <h2
            id="idara-gallery-heading"
            className="mb-10 text-center text-2xl font-bold text-school-black md:text-3xl"
          >
            معرض الصور
          </h2>
          <ImageGallery
            images={galleryUrls}
            altPrefix="مجال الإدارة والقيادة"
          />
        </div>
      </section>

      <section
        id="idara-main-docs"
        className="bg-stats-bg py-16 md:py-24"
        aria-labelledby="idara-main-docs-heading"
      >
        <div className="js-reveal mx-auto max-w-3xl px-4 md:px-6">
          <h2
            id="idara-main-docs-heading"
            className="mb-10 text-center text-2xl font-bold text-school-black md:text-3xl"
          >
            الوثائق الرئيسية
          </h2>
          <ul className="flex flex-col gap-4">
            {mainDocuments.map((item) => {
              const url = siteFile([...BASE], item.filename);
              return (
                <li key={item.filename}>
                  <PDFHoverCard title={item.title} url={url} />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <GallerySection
        id="idara-team-meetings-gallery"
        title="اجتماعات الفريق الإشرافي"
        images={teamGalleryUrls}
        altPrefix="اجتماعات الفريق الإشرافي"
        bgClass="bg-school-white"
      />

      <GallerySection
        id="idara-visit-teams-gallery"
        title="زيارة الفرق الإشرافية"
        images={visitTeamsGalleryUrls}
        altPrefix="زيارة الفرق الإشرافية"
        bgClass="bg-stats-bg"
      />

      <GallerySection
        id="idara-supervisory-visits-gallery"
        title="الزيارات الإشرافية"
        images={supervisoryGalleryUrls}
        altPrefix="الزيارات الإشرافية"
        bgClass="bg-school-white"
      />

      <PdfListSection
        id="idara-meetings"
        title="محاضر الاجتماعات"
        filenames={meetingFilenames}
        pathPrefix={MEETINGS_FOLDER}
        bgClass="bg-stats-bg"
      />

      <PdfListSection
        id="idara-plan"
        title="الخطة المدرسية التفصيلية"
        filenames={planFilenames}
        pathPrefix={PLAN_FOLDER}
        bgClass="bg-school-white"
      />
    </>
  );
}
