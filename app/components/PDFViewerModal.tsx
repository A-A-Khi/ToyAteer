"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export function PDFViewerModal({
  open,
  url,
  title,
  onClose,
}: {
  open: boolean;
  url: string | null;
  title: string;
  onClose: () => void;
}) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewportW, setViewportW] = useState(320);
  const viewportRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setNumPages(0);
      setPageNumber(1);
      setLoadError(null);
    }
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setViewportW(Math.floor(w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const docOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  const goPrev = useCallback(() => {
    setPageNumber((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPageNumber((p) => Math.min(numPages || 1, p + 1));
  }, [numPages]);

  const downloadName = useMemo(() => {
    if (!url) return "document.pdf";
    try {
      const path = new URL(url, window.location.origin).pathname;
      const seg = path.split("/").filter(Boolean).pop();
      return seg ?? "document.pdf";
    } catch {
      return "document.pdf";
    }
  }, [url]);

  if (!open || !url) return null;

  const pageWidth = Math.min(Math.max(240, viewportW - 24), 980);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="إغلاق الطبقة"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[90vh] w-[90vw] max-w-[1200px] flex-col rounded-t-2xl border-t-4 border-school-gold bg-school-white shadow-2xl md:mx-4 md:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-200 px-4 py-3 md:px-5">
          <h2
            id="pdf-viewer-title"
            className="min-w-0 flex-1 text-base font-bold text-school-black md:text-lg"
          >
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              download={downloadName}
              className="rounded border border-school-gold px-3 py-1.5 text-xs font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black md:text-sm"
            >
              تحميل
            </a>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded border border-neutral-300 text-lg leading-none text-school-black transition hover:border-school-gold hover:text-school-gold"
              onClick={onClose}
              aria-label="إغلاق"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-neutral-100 px-3 py-2 md:justify-between md:px-4">
          <div className="text-sm tabular-nums text-school-black">
            صفحة{" "}
            <span className="font-semibold text-school-gold">{pageNumber}</span>{" "}
            من{" "}
            <span className="font-semibold text-school-gold">
              {numPages || "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="rounded border border-school-gold px-3 py-1 text-sm font-medium text-school-gold transition enabled:hover:bg-school-gold enabled:hover:text-school-black disabled:opacity-40"
            >
              السابق
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={numPages > 0 && pageNumber >= numPages}
              className="rounded border border-school-gold px-3 py-1 text-sm font-medium text-school-gold transition enabled:hover:bg-school-gold enabled:hover:text-school-black disabled:opacity-40"
            >
              التالي
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-neutral-100">
          {loadError ? (
            <p className="p-4 text-center text-red-700">{loadError}</p>
          ) : (
            <Document
              key={url}
              file={url}
              options={docOptions}
              loading={
                <p className="py-12 text-center text-school-muted">
                  جاري تحميل الملف…
                </p>
              }
              onLoadSuccess={({ numPages: n }) => {
                setNumPages(n);
                setPageNumber(1);
                setLoadError(null);
              }}
              onLoadError={(err) => {
                setLoadError(
                  err.message || "تعذّر تحميل ملف PDF. تأكد من وجود الملف."
                );
              }}
              className="flex h-full w-full"
            >
              <div className="hidden h-full w-[132px] shrink-0 border-e border-neutral-200 bg-school-white md:flex md:flex-col">
                <div className="border-b border-neutral-200 px-3 py-2 text-xs font-semibold text-school-black">
                  الصفحات
                </div>
                <div className="flex-1 overflow-auto p-2">
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPageNumber(n)}
                          className={`rounded border p-1 transition ${
                            n === pageNumber
                              ? "border-school-gold bg-school-gold/10"
                              : "border-neutral-200 bg-white hover:border-school-gold"
                          }`}
                          aria-label={`الانتقال إلى الصفحة ${n}`}
                        >
                          <div className="mx-auto w-[110px] overflow-hidden rounded bg-neutral-100">
                            <Page
                              pageNumber={n}
                              width={110}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </div>
                          <div className="mt-1 text-center text-[11px] font-medium text-school-black/80">
                            {n}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <div
                  ref={viewportRef}
                  className="min-h-0 flex-1 overflow-auto px-2 py-4"
                >
                  <div className="flex justify-center">
                    <Page
                      pageNumber={pageNumber}
                      width={pageWidth}
                      className="shadow-md"
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  </div>
                </div>
              </div>
            </Document>
          )}
        </div>
      </div>
    </div>
  );
}
