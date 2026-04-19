"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ImageGalleryProps = {
  images: readonly string[];
  altPrefix?: string;
};

function unlockBodyScroll(scrollY: number) {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  window.scrollTo(0, scrollY);
}

export function ImageGallery({ images, altPrefix = "صورة" }: ImageGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => setLightbox(null), []);

  const go = useCallback(
    (delta: number) => {
      setLightbox((idx) => {
        if (idx === null || images.length === 0) return idx;
        const next = (idx + delta + images.length) % images.length;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (lightbox === null) return undefined;

    const scrollY = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      unlockBodyScroll(scrollY);
    };
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, go]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, []);

  if (images.length === 0) return null;

  const lightboxNode =
    lightbox !== null ? (
      <div
        className="fixed inset-0 z-[100000] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="معرض الصور"
        style={{
          width: "100vw",
          height: "100dvh",
          maxHeight: "100dvh",
        }}
      >
        {/* طبقة الخلفية — تغطي كل الشاشة بما فيها الـ Navbar */}
        <button
          type="button"
          className="absolute inset-0 z-0 bg-black/88"
          aria-label="إغلاق"
          onClick={close}
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col bg-transparent">
          <header
            className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 bg-school-black/80 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:px-6"
            style={{ paddingInlineStart: "max(1rem, env(safe-area-inset-left))", paddingInlineEnd: "max(1rem, env(safe-area-inset-right))" }}
          >
            <p className="text-sm font-medium tabular-nums text-school-white">
              {lightbox + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded border-2 border-school-gold bg-school-black px-4 text-school-gold transition hover:bg-school-gold hover:text-school-black"
              aria-label="إغلاق معرض الصور"
            >
              <span className="text-2xl font-light leading-none">×</span>
              <span className="hidden text-sm font-semibold sm:inline">
                إغلاق
              </span>
            </button>
          </header>

          {/* تمرير داخلي — الصفحة نفسها مقفلة لكن المحتوى هنا يتحرك */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div
              className="flex min-h-[min(100dvh,100%)] flex-col items-center justify-center gap-6 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <div className="relative mx-auto flex w-full max-w-[90vw] items-center justify-center">
                <div
                  className="relative w-full max-w-[90vw]"
                  style={{
                    height: "min(90dvh, calc(100dvh - 12rem))",
                    minHeight: "200px",
                  }}
                >
                  <Image
                    src={images[lightbox] ?? ""}
                    alt={`${altPrefix} ${lightbox + 1}`}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
                >
                  السابق
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightbox(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 text-start shadow-sm transition hover:border-school-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school-gold"
          >
            <Image
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {mounted && lightboxNode !== null
        ? createPortal(lightboxNode, document.body)
        : null}
    </>
  );
}
