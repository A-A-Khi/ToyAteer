"use client";

import dynamic from "next/dynamic";

const PDFHoverCardInner = dynamic(
  () =>
    import("./PDFHoverCardInner").then((m) => ({
      default: m.PDFHoverCardInner,
    })),
  { ssr: false }
);

export function PDFHoverCard(props: {
  title: string;
  url: string;
  variant?: "card" | "row";
  index?: number;
}) {
  return <PDFHoverCardInner {...props} />;
}

