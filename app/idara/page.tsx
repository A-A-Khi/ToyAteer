import { IdaraPageContent } from "@/app/components/idara/IdaraPageContent";
import { Navbar } from "@/app/components/Navbar";
import { PdfViewerProvider } from "@/app/components/PDFViewer";
import { SchoolFooter } from "@/app/components/SchoolFooter";
import { SchoolShell } from "@/app/components/SchoolShell";
import {
  listStorageFilesForPrefix,
  mergeUniqueUrls,
  titleFromStorageFilename,
} from "@/app/lib/storageBucket";
import { siteFile } from "@/app/lib/publicAssets";

export const metadata = {
  title: "مجال الإدارة والقيادة والحوكمة — مدرسة طوي أعتير بنين",
  description:
    "وثائق ومعرض صور مجال الإدارة والقيادة والحوكمة — مدرسة طوي أعتير بنين للتعليم الأساسي (5-12).",
};

const BASE = ["الموقع", "القيادة والحوكمة"] as const;
const TEAM_SEG = ["الموقع", "القيادة والحوكمة", "اجتماعات الفريق الاشرافي"] as const;
const VISIT_TEAMS_SEG = [
  "الموقع",
  "القيادة والحوكمة",
  "اجتماعات الفريق الاشرافي",
  "زيارة الفرق الاشرافية",
] as const;
const SUPERVISORY_SEG = [
  "الموقع",
  "القيادة والحوكمة",
  "زيارات اشرافية",
] as const;

const GALLERY_FILES = [
  "WhatsApp Image 2026-04-18 at 4.26.00 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 4.26.00 PM (1).jpeg",
  "WhatsApp Image 2026-04-18 at 4.30.42 PM.jpeg",
  "WhatsApp Image 2026-04-18 at 4.30.42 PM (1).jpeg",
  "WhatsApp Image 2026-04-18 at 4.30.44 PM.jpeg",
  "لقطة شاشة 2026-04-18 161803.png",
  "لقطة شاشة 2026-04-18 161832.png",
  "لقطة شاشة 2026-04-18 161851.png",
  "لقطة شاشة 2026-04-18 161928.png",
  "لقطة شاشة 2026-04-18 161953.png",
] as const;

const TEAM_GALLERY_FILES = [
  "WhatsApp Image 2026-02-01 at 2.22.42 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.22.42 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 2.22.42 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 2.22.43 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 2.44.44 PM.jpeg",
] as const;

const VISIT_TEAMS_GALLERY_FILES = [
  "WhatsApp Image 2026-02-01 at 9.26.22 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.23 PM (4).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (4).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (5).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (6).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (7).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.24 PM (8).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (1).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (4).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (5).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (6).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (7).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (8).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.25 PM (9).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.26 PM (1).jpeg",
] as const;

const SUPERVISORY_GALLERY_FILES = [
  "WhatsApp Image 2026-02-01 at 9.26.26 PM.jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.26 PM (2).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.26 PM (3).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.26 PM (4).jpeg",
  "WhatsApp Image 2026-02-01 at 9.26.27 PM.jpeg",
] as const;

const MEETING_PDF_FILES = [
  "لجنة مدرسية.pdf",
  "هيئة تدريسية اجتماعات.pdf",
  "هيئة تدريسية.pdf",
  "اجتماعات هيئة تدريسية.pdf",
  "الاباء والامهات.pdf",
  "اللجنة المدرسية اجتماعات.pdf",
  "اللجنة المدرسية.pdf",
] as const;

const PLAN_PDF_FILES = ["خطة مجلس الاباء.pdf", "اهداف الخطة المدرسية.pdf"] as const;

const MAIN_DOCUMENTS = [
  { filename: "الخطة المدرسية.pdf", title: "الخطة المدرسية الكاملة" },
  { filename: "اهداف الخطة المدرسية.pdf", title: "أهداف الخطة" },
  { filename: "اللجان المدرسية.pdf", title: "اللجان المدرسية" },
  { filename: "سجل اللجان العام.pdf", title: "سجل اللجان" },
  {
    filename: "لجنة مجلس الاباء والامهات.pdf",
    title: "مجلس الآباء والأمهات",
  },
  {
    filename: "تشكيل مجلس الاباء والامهات.pdf",
    title: "تشكيل المجلس",
  },
  {
    filename: "الزيارات الاشرافية المدير.pdf",
    title: "الزيارات الإشرافية",
  },
  { filename: "برامج الانماء المهني.pdf", title: "برامج الإنماء المهني" },
] as const;

export default async function IdaraPage() {
  const galleryUrlsBase = GALLERY_FILES.map((name) => siteFile([...BASE], name));
  const teamGalleryUrls = TEAM_GALLERY_FILES.map((name) =>
    siteFile([...TEAM_SEG], name)
  );
  const visitTeamsGalleryUrls = VISIT_TEAMS_GALLERY_FILES.map((name) =>
    siteFile([...VISIT_TEAMS_SEG], name)
  );
  const supervisoryGalleryUrls = SUPERVISORY_GALLERY_FILES.map((name) =>
    siteFile([...SUPERVISORY_SEG], name)
  );

  const storage = await listStorageFilesForPrefix("idara");
  const storageImages = storage
    .filter((f) => f.kind === "image")
    .map((f) => f.url);
  const galleryUrls = mergeUniqueUrls(galleryUrlsBase, storageImages);
  const extraMainDocumentsFromStorage = storage
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
          <IdaraPageContent
            galleryUrls={galleryUrls}
            mainDocuments={MAIN_DOCUMENTS}
            teamGalleryUrls={teamGalleryUrls}
            visitTeamsGalleryUrls={visitTeamsGalleryUrls}
            supervisoryGalleryUrls={supervisoryGalleryUrls}
            meetingFilenames={MEETING_PDF_FILES}
            planFilenames={PLAN_PDF_FILES}
            extraMainDocumentsFromStorage={extraMainDocumentsFromStorage}
          />
        </main>
        <SchoolFooter />
      </SchoolShell>
    </PdfViewerProvider>
  );
}
