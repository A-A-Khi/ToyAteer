import { InjazPageContent } from "@/app/components/injaz/InjazPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";
import { listFilesByExtensionInPublicDir } from "@/app/lib/listPublicPdfs";
import {
  listStorageFilesForPrefix,
  mergeUniqueUrls,
  titleFromStorageFilename,
} from "@/app/lib/storageBucket";
import { siteFile } from "@/app/lib/publicAssets";

export const metadata = {
  title: "مجال الإنجاز الدراسي — مدرسة طوي أعتير بنين",
  description:
    "معرض صور ووثائق PDF وجداول تحليل الإنجاز الدراسي — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

const BASE = ["الموقع", "انجاز الطلبة"] as const;
const DETAIL_FOLDER = ["الموقع", "انجاز الطلبة", "انجاز الطلبة"] as const;

const GALLERY_FILES = [
  "WhatsApp Image 2026-02-01 at 2.20.07 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.22.41 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.22 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (4).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (5).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (6).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (7).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (8).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (6).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (7).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (8).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (9).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.26 PM (1).jpeg",
] as const;

export default async function InjazPage() {
  const galleryUrlsBase = GALLERY_FILES.map((name) => siteFile([...BASE], name));

  const docxFilenames = listFilesByExtensionInPublicDir(DETAIL_FOLDER, "docx");

  const storage = await listStorageFilesForPrefix("injaz");
  const storageImages = storage
    .filter((f) => f.kind === "image")
    .map((f) => f.url);
  const galleryUrls = mergeUniqueUrls(galleryUrlsBase, storageImages);
  const storagePdfs = storage
    .filter((f) => f.kind === "pdf")
    .map((f) => ({
      title: titleFromStorageFilename(f.name),
      url: f.url,
    }));
  const storageDocx = storage
    .filter((f) => f.kind === "docx")
    .map((f) => ({
      label: titleFromStorageFilename(f.name),
      url: f.url,
    }));

  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <InjazPageContent
            galleryUrls={galleryUrls}
            docxFilenames={docxFilenames}
            storagePdfs={storagePdfs}
            storageDocx={storageDocx}
          />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
