"use client";

import { useCallback, useEffect, useState } from "react";

import { parseCsv } from "@/app/lib/csvParse";

type CsvCollapsibleTableProps = {
  csvUrl: string;
  tableTitle: string;
};

export function CsvCollapsibleTable({
  csvUrl,
  tableTitle,
}: CsvCollapsibleTableProps) {
  const [open, setOpen] = useState(true);
  const [rows, setRows] = useState<string[][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(csvUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const parsed = parseCsv(text.trimEnd());
      setRows(parsed.length ? parsed : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تحميل الملف");
      setRows(null);
    } finally {
      setLoading(false);
    }
  }, [csvUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  const normalized =
    rows && rows.length > 0
      ? (() => {
          const maxCols = Math.max(...rows.map((r) => r.length), 0);
          return rows.map((r) => {
            const next = [...r];
            while (next.length < maxCols) next.push("");
            return next.slice(0, maxCols);
          });
        })()
      : null;

  const headerRow = normalized?.[0];
  const bodyRows =
    normalized && normalized.length > 1 ? normalized.slice(1) : [];

  return (
    <div className="w-full border border-[#e5e5e5] bg-school-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e5] bg-neutral-50 px-4 py-3">
        <h3 className="text-lg font-bold text-school-black">{tableTitle}</h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
        >
          {open ? "إخفاء الجدول" : "عرض الجدول"}
        </button>
      </div>

      {open && (
        <div className="overflow-x-auto">
          {loading && (
            <p className="p-6 text-center text-school-muted">جاري التحميل…</p>
          )}
          {error && (
            <p className="p-6 text-center text-red-700">{error}</p>
          )}
          {!loading && !error && rows && rows.length > 0 && (
            <table className="w-full min-w-[640px] border-collapse text-[15px] leading-relaxed">
              <thead>
                <tr>
                  {(headerRow ?? []).map((cell, j) => (
                    <th
                      key={j}
                      className="border-[0.5px] border-[#e5e5e5] bg-school-black px-3 py-3 text-start font-semibold text-school-gold"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((line, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-school-white" : "bg-[#f9f9f9]"}
                  >
                    {line.map((cell, j) => (
                      <td
                        key={j}
                        className={`border-[0.5px] border-[#e5e5e5] px-3 py-2.5 text-school-black ${
                          j === 0 ? "font-bold" : ""
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && !error && (!rows || rows.length === 0) && (
            <p className="p-6 text-center text-school-muted">
              لا توجد بيانات في الملف.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
