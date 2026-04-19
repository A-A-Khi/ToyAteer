import { PdfViewerProvider } from "./components/PDFViewer";
import { SchoolShell } from "./components/SchoolShell";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { HomeDocumentsSection } from "./components/HomeDocumentsSection";
import { DomainsSection } from "./components/DomainsSection";
import { SchoolMessageSection } from "./components/SchoolMessageSection";
import { SchoolFooter } from "./components/SchoolFooter";

export default function Home() {
  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <HeroSection />
          <StatsSection />
          <HomeDocumentsSection />
          <DomainsSection />
          <SchoolMessageSection />
          <SchoolFooter />
        </main>
      </SchoolShell>
    </PdfViewerProvider>
  );
}
