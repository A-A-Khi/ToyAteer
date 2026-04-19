/**
 * تحليل CSV بسيط يدعم الحقول بين علامتي اقتباس وأسطر متعددة جزئياً.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
        continue;
      }
      if (c === '"') {
        inQuotes = false;
        continue;
      }
      field += c;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (c === "\r") continue;
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += c;
  }
  row.push(field);
  if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
    rows.push(row);
  }
  return rows;
}
