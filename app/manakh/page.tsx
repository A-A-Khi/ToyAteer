import { ManakhPageContent } from "@/app/components/manakh/ManakhPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";
import {
  listRootPdfsAndSubfolderPdfs,
} from "@/app/lib/listPublicPdfs";
import {
  listStorageFilesForPrefix,
  mergeUniqueUrls,
  titleFromStorageFilename,
} from "@/app/lib/storageBucket";
import { siteFile } from "@/app/lib/publicAssets";

export const metadata = {
  title: "مجال مناخ المدرسة وبيئة التعلم — مدرسة طوي أعتير بنين",
  description:
    "وثائق ومعرض صور مجال مناخ المدرسة وبيئة التعلم — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

const BASE = ["الموقع", "مناخ المدرسة وبيئة التعلم"] as const;

const GALLERY_FILES = [
  "WhatsApp Image 2026-04-18 at 6.29.01 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 6.29.06 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 6.45.42 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 6.46.03 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.56 PM (2).jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.57 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.57 PM (1).jpeg",
  "صورة واتساب بتاريخ 1447-04-16 في 22.18.46_e4f91019.jpg",
] as const;

const REQUIRED_ROOT_PDF = "اسماء اللجان.pdf";

export default async function ManakhPage() {
  const galleryUrlsBase = GALLERY_FILES.map((name) => siteFile([...BASE], name));

  const { rootFiles: scannedRoot, subfolders } = listRootPdfsAndSubfolderPdfs(
    BASE
  );

  const rootSet = new Set<string>(scannedRoot);
  rootSet.add(REQUIRED_ROOT_PDF);
  const rootPdfFiles = [...rootSet].sort((a, b) =>
    a.localeCompare(b, "ar")
  );

  const storage = await listStorageFilesForPrefix("manakh");
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

  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <ManakhPageContent
            galleryUrls={galleryUrls}
            rootPdfFiles={rootPdfFiles}
            subfolders={subfolders}
            storagePdfs={storagePdfs}
          />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
