import { PdfViewerProvider } from "./components/PDFViewer";
import { SchoolShell } from "./components/SchoolShell";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { HomeDocumentsSection } from "./components/HomeDocumentsSection";
import { DomainsSection } from "./components/DomainsSection";
import { SchoolMessageSection } from "./components/SchoolMessageSection";
import { ImageGallery } from "./components/ImageGallery";
import { SchoolFooter } from "./components/SchoolFooter";
import {
  listStorageFilesForPrefix,
  splitStorageForDisplay,
} from "./lib/storageBucket";

export const dynamic = "force-dynamic";

export default async function Home() {
  const homeStorage = await listStorageFilesForPrefix("home");
  const { imageUrls, documents: uploadedItems } =
    splitStorageForDisplay(homeStorage);

  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <HeroSection />
          <StatsSection />
          {imageUrls.length > 0 ? (
            <section
              id="home-uploaded-gallery"
              className="bg-school-white py-12 md:py-16"
              aria-labelledby="home-uploaded-gallery-heading"
            >
              <div className="js-reveal mx-auto max-w-6xl px-4 md:px-6">
                <h2
                  id="home-uploaded-gallery-heading"
                  className="mb-8 text-center text-xl font-bold text-school-black md:text-2xl"
                >
                  صور مرفوعة
                </h2>
                <ImageGallery images={imageUrls} altPrefix="الصفحة الرئيسية" />
              </div>
            </section>
          ) : null}
          <HomeDocumentsSection uploadedItems={uploadedItems} />
          <DomainsSection />
          <SchoolMessageSection />
          <SchoolFooter />
        </main>
      </SchoolShell>
    </PdfViewerProvider>
  );
}
