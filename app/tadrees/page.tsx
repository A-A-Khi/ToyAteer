import { TadreesPageContent } from "@/app/components/tadrees/TadreesPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";

export const metadata = {
  title: "مجال التدريس والتقويم — مدرسة طوي أعتير بنين",
  description:
    "معرض صور، استراتيجيات تدريسية، أنشطة علوم، مبادرات تعليمية، وأوراق عمل — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

export default function TadreesPage() {
  return (
    <PdfViewerProvider>
      <SchoolShell>
        <Navbar />
        <main className="flex flex-1 flex-col">
          <TadreesPageContent />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
