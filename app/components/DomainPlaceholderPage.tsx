import Link from "next/link";
import { Navbar } from "./Navbar";
import { SchoolFooter } from "./SchoolFooter";

type DomainPlaceholderPageProps = {
  title: string;
  description?: string;
};

export function DomainPlaceholderPage({
  title,
  description = "سيتم إكمال محتوى هذه الصفحة لاحقاً.",
}: DomainPlaceholderPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-school-white">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 pb-16 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-school-black md:text-3xl">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-school-muted">
            {description}
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex rounded border-2 border-school-gold px-6 py-2.5 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
          >
            العودة للرئيسية
          </Link>
        </div>
      </main>
      <SchoolFooter />
    </div>
  );
}
