import { NomowPageContent } from "@/app/components/nomow/NomowPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";
import {
  listStorageFilesForPrefix,
  mergeUniqueUrls,
  titleFromStorageFilename,
  type UploadedDocumentItem,
} from "@/app/lib/storageBucket";
import { siteFile } from "@/app/lib/publicAssets";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مجال النمو الشخصي — مدرسة طوي أعتير بنين",
  description:
    "فيديو توعوي للأمن الإلكتروني، معرض صور، ووثائق مجال النمو الشخصي — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

const BASE = ["الموقع", "النمو الشخصي"] as const;

const VIDEO_FILE = "فيديو مهم الامن الالكتروني.mp4";

const GALLERY_FILES = [
  "طابور.jpg",
  "22.jpg",
  "33.jpg",
  "44.jpg",
  "66.jpg",
  "78.jpg",
  "666.jpg",
  "WhatsApp Image 2026-02-01 at 2.22.40 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.22.41 PM (1).jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.56 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.56 PM (1).jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.56 PM (2).jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.57 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 10.41.57 PM (1).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.15 AM.jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.15 AM (1).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.15 AM (2).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.16 AM.jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.16 AM (1).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.16 AM (2).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.17 AM.jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.17 AM (1).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.17 AM (2).jpeg",
  "WhatsApp Image 2026-04-19 at 12.07.17 AM (3).jpeg",
] as const;

export default async function NomowPage() {
  const videoUrl = siteFile([...BASE], VIDEO_FILE);
  const galleryUrlsBase = GALLERY_FILES.map((name) => siteFile([...BASE], name));

  const storage = await listStorageFilesForPrefix("nomow");
  const imageUrls = storage
    .filter((f) => f.kind === "image")
    .map((f) => f.url);
  const galleryUrls = mergeUniqueUrls(galleryUrlsBase, imageUrls);
  const extraVideoUrls = storage
    .filter((f) => f.kind === "video")
    .map((f) => f.url);
  const uploadedDocuments: UploadedDocumentItem[] = storage
    .filter((f) => f.kind !== "image" && f.kind !== "video")
    .map((f) => {
      let fileKind: UploadedDocumentItem["fileKind"] = "other";
      if (f.kind === "pdf") fileKind = "pdf";
      else if (f.kind === "docx") fileKind = "docx";
      return {
        title: titleFromStorageFilename(f.name),
        url: f.url,
        fileKind,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ar"));

  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <NomowPageContent
            videoUrl={videoUrl}
            galleryUrls={galleryUrls}
            extraVideoUrls={extraVideoUrls}
            uploadedDocuments={uploadedDocuments}
          />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
