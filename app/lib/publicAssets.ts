/**
 * مسار ملف تحت `public/` مع ترميز كل مقطع مسار (مجلدات + اسم الملف)
 * لضمان طلبات متسقة من pdf.js ومتصفحات مختلفة.
 */
export function siteFile(
  dirs: readonly [string, ...string[]],
  filename: string
): string {
  const segments = [...dirs, filename].map((s) => encodeURIComponent(s));
  return `/${segments.join("/")}`;
}
