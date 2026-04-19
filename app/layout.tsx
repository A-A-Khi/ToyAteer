import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مدرسة طوي أعتير بنين للتعليم الأساسي",
  description:
    "الموقع الرسمي لمدرسة طوي أعتير بنين للتعليم الأساسي (5–12) — مجالات التقويم، رسالة المدرسة، وثائق الخطة المدرسية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-school-white text-school-black"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
