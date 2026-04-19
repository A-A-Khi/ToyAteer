"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const PDFViewerModal = dynamic(
  () =>
    import("./PDFViewerModal").then((m) => ({
      default: m.PDFViewerModal,
    })),
  { ssr: false }
);

export type OpenPdfOptions = {
  url: string;
  title: string;
};

type PdfViewerContextValue = {
  openPdf: (opts: OpenPdfOptions) => void;
  closePdf: () => void;
};

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export function usePdfViewer(): PdfViewerContextValue {
  const ctx = useContext(PdfViewerContext);
  if (!ctx) {
    throw new Error("usePdfViewer يجب استخدامه داخل PdfViewerProvider");
  }
  return ctx;
}

export function PdfViewerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const openPdf = useCallback((opts: OpenPdfOptions) => {
    setUrl(opts.url);
    setTitle(opts.title);
    setOpen(true);
  }, []);

  const closePdf = useCallback(() => {
    setOpen(false);
    setUrl(null);
    setTitle("");
  }, []);

  const value = useMemo(
    () => ({ openPdf, closePdf }),
    [openPdf, closePdf]
  );

  return (
    <PdfViewerContext.Provider value={value}>
      {children}
      <PDFViewerModal
        open={open}
        url={url}
        title={title}
        onClose={closePdf}
      />
    </PdfViewerContext.Provider>
  );
}
