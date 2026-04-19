"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { siteFile } from "@/app/lib/publicAssets";

const LOGO_SRC = siteFile(["الموقع"], "logo.jpeg");

const links = [
  { href: "/#hero", label: "الرئيسية" },
  { href: "/manakh", label: "مناخ المدرسة" },
  { href: "/idara", label: "الإدارة والقيادة" },
  { href: "/injaz", label: "الإنجاز الدراسي" },
  { href: "/tadrees", label: "التدريس والتقويم" },
  { href: "/nomow", label: "النمو الشخصي" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="js-navbar fixed inset-x-0 top-0 z-50 bg-school-black">
      <div className="js-navbar-inner border-b border-school-gold">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link
            href="/#hero"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-school-gold">
              <Image
                src={LOGO_SRC}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
                loading="lazy"
              />
            </span>
            <span className="max-w-[min(100%,16rem)] text-sm font-semibold leading-snug text-school-white md:max-w-none md:text-base">
              مدرسة طوي أعتير بنين للتعليم الأساسي (5-12)
            </span>
          </Link>

          <nav
            className="hidden items-center gap-5 lg:gap-6 md:flex"
            aria-label="التنقل الرئيسي"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-school-white/90 transition-colors hover:text-school-gold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="rounded border border-school-gold/60 px-3 py-1.5 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
              aria-label="لوحة إدارة الملفات — تسجيل الدخول"
            >
              تسجيل الدخول
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-school-gold/40 text-school-gold md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-5 bg-school-gold" />
            <span className="block h-0.5 w-5 bg-school-gold" />
            <span className="block h-0.5 w-5 bg-school-gold" />
            <span className="sr-only">قائمة التنقل</span>
          </button>
        </div>

        <div
          id="mobile-nav"
          className={`border-t border-school-gold/30 md:hidden ${open ? "block" : "hidden"}`}
        >
          <nav
            className="flex flex-col gap-1 px-4 py-3"
            aria-label="التنقل — موبايل"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded px-2 py-2 text-school-white/95 hover:bg-white/5 hover:text-school-gold"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="mt-1 rounded border border-school-gold/60 px-3 py-2 text-center text-sm font-semibold text-school-gold hover:bg-school-gold hover:text-school-black"
              onClick={() => setOpen(false)}
              aria-label="لوحة إدارة الملفات — تسجيل الدخول"
            >
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
