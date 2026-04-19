import Image from "next/image";

import { siteFile } from "@/app/lib/publicAssets";

const LOGO_SRC = siteFile(["الموقع"], "logo.jpeg");

export function SchoolFooter() {
  return (
    <footer
      id="footer"
      className="border-t-4 border-school-gold bg-school-black py-12 md:py-14"
    >
      <div className="js-reveal mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-school-gold">
            <Image
              src={LOGO_SRC}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
              loading="lazy"
            />
          </span>
          <div className="text-center md:text-start">
            <p className="font-semibold text-school-white">
              مدرسة طوي أعتير بنين للتعليم الأساسي (5-12)
            </p>
            <p className="mt-1 text-sm text-school-muted">الصفوف من 5 إلى 12</p>
          </div>
        </div>

        <div className="text-center md:text-start">
          <p className="mb-3 text-sm font-medium text-school-white">
            وسائل التواصل
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href="https://www.instagram.com/edugovdhf8303/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-school-gold underline-offset-4 hover:underline"
            >
              إنستغرام — edugovdhf8303
            </a>
            <a
              href="https://x.com/edugovdhf8303"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-school-gold underline-offset-4 hover:underline"
            >
              إكس — edugovdhf8303
            </a>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-school-muted/80">
        © {new Date().getFullYear()} مدرسة طوي أعتير بنين — جميع الحقوق محفوظة
      </p>
    </footer>
  );
}
