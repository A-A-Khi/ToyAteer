import { TadreesPageContent } from "@/app/components/tadrees/TadreesPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";
import {
  listStorageFilesForPrefix,
  titleFromStorageFilename,
} from "@/app/lib/storageBucket";

export const metadata = {
  title: "مجال التدريس والتقويم — مدرسة طوي أعتير بنين",
  description:
    "معرض صور، استراتيجيات تدريسية، أنشطة علوم، مبادرات تعليمية، وأوراق عمل — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

export default async function TadreesPage() {
  const storage = await listStorageFilesForPrefix("tadrees");
  const mainGalleryExtraUrls = storage
    .filter((f) => f.kind === "image")
    .map((f) => f.url);
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
          <TadreesPageContent
            mainGalleryExtraUrls={mainGalleryExtraUrls}
            storagePdfs={storagePdfs}
          />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
