/**
 * يحوّل كل ملفات .xlsx تحت public/الموقع إلى .csv (نفس الاسم، نفس المجلد).
 * التشغيل من جذر المشروع: npm run convert:xlsx
 */
import XLSX from "xlsx";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname } from "path";

const baseDir = join(process.cwd(), "public", "الموقع");

function convertDir(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      convertDir(fullPath);
    } else if (extname(file).toLowerCase() === ".xlsx") {
      try {
        const wb = XLSX.readFile(fullPath);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(ws);
        const csvPath = fullPath.replace(/\.xlsx$/i, ".csv");
        writeFileSync(csvPath, csv, "utf8");
        console.log("✓ " + file);
      } catch (e) {
        console.log("✗ " + file + " - " + (e instanceof Error ? e.message : String(e)));
      }
    }
  }
}

try {
  convertDir(baseDir);
  console.log("تم التحويل!");
} catch (e) {
  console.error(
    "خطأ:",
    e instanceof Error ? e.message : e,
    "\nتأكد من وجود المجلد:",
    baseDir
  );
  process.exit(1);
}
