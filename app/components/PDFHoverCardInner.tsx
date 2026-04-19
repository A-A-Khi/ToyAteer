"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { usePdfViewer } from "./PDFViewer";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Placement = "right" | "top";

function isDesktopHoverCapable() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(max-width: 767px)").matches
  );
}

export function PDFHoverCardInner({
  title,
  url,
  variant = "card",
  index = 0,
}: {
  title: string;
  url: string;
  variant?: "card" | "row";
  index?: number;
}) {
  const { openPdf } = usePdfViewer();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("right");
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setHoverEnabled(isDesktopHoverCapable());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const docOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 300);
  }, [clearCloseTimer]);

  const onEnter = useCallback(() => {
    if (!hoverEnabled) return;
    clearCloseTimer();
    setLoadError(null);
    setNumPages(null);
    setOpen(true);
  }, [clearCloseTimer, hoverEnabled]);

  const onLeave = useCallback(() => {
    if (!hoverEnabled) return;
    scheduleClose();
  }, [hoverEnabled, scheduleClose]);

  useEffect(() => {
    if (!open || !hoverEnabled) return;
    const el = rootRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const panelW = 320;
    const gap = 12;
    const vw = window.innerWidth;

    const fitsRight = r.right + gap + panelW <= vw - 12;
    setPlacement(fitsRight ? "right" : "top");
  }, [open, hoverEnabled]);

  const idxLabel = String(index).padStart(2, "0");

  const cardButtonClass =
    variant === "row"
      ? "group relative flex w-full cursor-pointer items-center gap-6 bg-transparent px-5 py-10 text-start transition-colors duration-200 after:absolute after:bottom-0 after:start-0 after:h-0.5 after:w-0 after:bg-school-gold after:transition-all after:duration-300 hover:bg-school-black/[0.02] group-hover:after:w-full md:px-10"
      : "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-school-white px-5 py-4 text-start text-school-black shadow-sm transition hover:border-school-gold hover:shadow-md";

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        onClick={() => openPdf({ url, title })}
        className={cardButtonClass}
      >
        {variant === "row" ? (
          <>
            <span className="w-12 shrink-0 text-center text-xl font-light tabular-nums text-school-gold md:text-2xl">
              {idxLabel}
            </span>
            <span className="min-w-0 flex-1 text-[17px] font-medium leading-[1.9] text-school-black">
              {title}
            </span>
            <span
              className="mx-4 hidden h-px min-w-[4rem] flex-1 bg-neutral-300 transition-colors group-hover:bg-school-gold/40 md:block"
              aria-hidden
            />
            <span
              className="shrink-0 text-lg text-school-gold transition-transform duration-300 group-hover:-translate-x-2"
              aria-hidden
            >
              ←
            </span>
          </>
        ) : (
          <>
            <span className="flex min-w-0 items-center gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded border border-school-gold/40 bg-school-gold/10 text-school-gold"
                aria-hidden
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3v5h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 13.5h7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 17h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{title}</span>
                <span className="mt-0.5 block text-xs text-school-muted">
                  PDF
                  {numPages ? ` • ${numPages} صفحات` : ""}
                </span>
              </span>
            </span>
            <span className="shrink-0 text-school-gold" aria-hidden>
              ←
            </span>
          </>
        )}
      </button>

      {hoverEnabled && open && (
        <div
          className={[
            "absolute z-[80] w-[320px] overflow-hidden rounded-xl bg-school-white shadow-lg",
            "border border-neutral-200",
            "border-t-2 border-t-school-gold",
            "opacity-0 animate-[pdfFade_150ms_ease-out_forwards]",
            placement === "right"
              ? "top-0 start-[calc(100%+12px)]"
              : "bottom-[calc(100%+12px)] end-0",
          ].join(" ")}
        >
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="line-clamp-2 text-sm font-bold text-school-black">
              {title}
            </p>
            <p className="mt-1 text-xs text-school-muted">
              {numPages ? `${numPages} صفحات` : "…"}
            </p>
          </div>

          <div className="bg-neutral-100 p-2">
            {loadError ? (
              <p className="p-3 text-center text-xs text-red-700">{loadError}</p>
            ) : (
              <Document
                file={url}
                options={docOptions}
                loading={
                  <p className="py-8 text-center text-xs text-school-muted">
                    جاري تحميل المعاينة…
                  </p>
                }
                onLoadSuccess={({ numPages: n }) => {
                  setNumPages(n);
                  setLoadError(null);
                }}
                onLoadError={(err) => {
                  setLoadError(
                    err.message || "تعذّر تحميل ملف PDF. تأكد من وجود الملف."
                  );
                }}
                className="flex justify-center"
              >
                <Page
                  pageNumber={1}
                  width={304}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            )}
          </div>

          <div className="px-4 py-3 text-center text-xs font-semibold text-school-black/70">
            اضغط للقراءة الكاملة
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pdfFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

