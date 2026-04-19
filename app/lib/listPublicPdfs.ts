import fs from "node:fs";
import path from "path";

/**
 * يقرأ أسماء ملفات PDF من مجلد تحت `public/` (للبناء/السيرفر فقط).
 */
export function listPdfFilenamesInPublicDir(
  segments: readonly [string, ...string[]]
): string[] {
  const dir = path.join(process.cwd(), "public", ...segments);
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".pdf"))
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, "ar"));
  } catch {
    return [];
  }
}

export type PublicSubfolderPdfGroup = {
  folderName: string;
  files: string[];
};

/**
 * ملفات PDF في جذر المجلد + قائمة بكل مجلد فرعي يحتوي PDF.
 */
export function listRootPdfsAndSubfolderPdfs(
  segments: readonly [string, ...string[]]
): { rootFiles: string[]; subfolders: PublicSubfolderPdfGroup[] } {
  const dir = path.join(process.cwd(), "public", ...segments);
  const rootFiles: string[] = [];
  const subfolders: PublicSubfolderPdfGroup[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile() && e.name.toLowerCase().endsWith(".pdf")) {
        rootFiles.push(e.name);
      } else if (e.isDirectory() && !e.name.startsWith(".")) {
        const subPath = path.join(dir, e.name);
        try {
          const pdfs = fs
            .readdirSync(subPath, { withFileTypes: true })
            .filter(
              (x) => x.isFile() && x.name.toLowerCase().endsWith(".pdf")
            )
            .map((x) => x.name)
            .sort((a, b) => a.localeCompare(b, "ar"));
          if (pdfs.length > 0) {
            subfolders.push({ folderName: e.name, files: pdfs });
          }
        } catch {
          /* skip unreadable subfolder */
        }
      }
    }
    rootFiles.sort((a, b) => a.localeCompare(b, "ar"));
    subfolders.sort((a, b) =>
      a.folderName.localeCompare(b.folderName, "ar")
    );
  } catch {
    return { rootFiles: [], subfolders: [] };
  }
  return { rootFiles, subfolders };
}

/**
 * أسماء الملفات بامتداد معيّن (مثل .docx) تحت مجلد في `public/`.
 */
export function listFilesByExtensionInPublicDir(
  segments: readonly [string, ...string[]],
  ext: string
): string[] {
  const dir = path.join(process.cwd(), "public", ...segments);
  const extNorm = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (d) => d.isFile() && d.name.toLowerCase().endsWith(extNorm)
      )
      .map((d) => d.name)
      .sort((a, b) => a.localeCompare(b, "ar"));
  } catch {
    return [];
  }
}
