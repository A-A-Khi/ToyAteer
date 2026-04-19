import { PdfViewerProvider } from "./components/PDFViewer";
import { SchoolShell } from "./components/SchoolShell";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { HomeDocumentsSection } from "./components/HomeDocumentsSection";
import { DomainsSection } from "./components/DomainsSection";
import { SchoolMessageSection } from "./components/SchoolMessageSection";
import { SchoolFooter } from "./components/SchoolFooter";
import {
  listStorageFilesForPrefix,
  titleFromStorageFilename,
} from "./lib/storageBucket";

export default async function Home() {
  const homeStorage = await listStorageFilesForPrefix("home");
  const storageDocs = homeStorage
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
          <HeroSection />
          <StatsSection />
          <HomeDocumentsSection storageDocs={storageDocs} />
          <DomainsSection />
          <SchoolMessageSection />
          <SchoolFooter />
        </main>
      </SchoolShell>
    </PdfViewerProvider>
  );
}
