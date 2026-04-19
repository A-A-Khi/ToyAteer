import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const STORAGE_BUCKET = "school-files" as const;

export type StorageDomainPrefix =
  | "home"
  | "manakh"
  | "idara"
  | "injaz"
  | "tadrees"
  | "nomow";

export type StorageFileKind = "image" | "pdf" | "docx" | "video" | "other";

export type StorageFileRef = {
  path: string;
  name: string;
  url: string;
  kind: StorageFileKind;
};

function classifyKind(filename: string): StorageFileKind {
  const n = filename.toLowerCase();
  if (/\.(jpe?g|png|gif|webp)$/i.test(n)) return "image";
  if (/\.pdf$/i.test(n)) return "pdf";
  if (/\.docx$/i.test(n)) return "docx";
  if (/\.(mp4|webm|mov)$/i.test(n)) return "video";
  return "other";
}

function hasEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

async function listAllFilePaths(
  supabase: SupabaseClient,
  rootPrefix: string
): Promise<string[]> {
  const out: string[] = [];

  const walk = async (prefix: string) => {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(prefix, {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });
    if (error || !data) return;

    for (const item of data) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      const isFile =
        item.metadata !== null &&
        typeof (item.metadata as { size?: number }).size === "number";

      if (isFile) {
        out.push(fullPath);
      } else {
        await walk(fullPath);
      }
    }
  };

  await walk(rootPrefix);
  return out;
}

export function titleFromStorageFilename(filename: string): string {
  const base = filename.replace(/^.*[/\\]/, "");
  return base.replace(/\.[^.]+$/, "");
}

/**
 * يقرأ كل الملفات تحت مجلد المجال في الـ bucket ويُرجع روابط عامة.
 * يُستخدم في صفحات الخادم (Server Components).
 */
export async function listStorageFilesForPrefix(
  prefix: StorageDomainPrefix
): Promise<StorageFileRef[]> {
  if (!hasEnv()) return [];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const paths = await listAllFilePaths(supabase, prefix);
  const refs: StorageFileRef[] = [];

  for (const path of paths) {
    const name = path.replace(/^.*\//, "");
    const kind = classifyKind(name);
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    refs.push({
      path,
      name,
      url: data.publicUrl,
      kind,
    });
  }

  refs.sort((a, b) => a.path.localeCompare(b.path, "ar"));
  return refs;
}

export function mergeUniqueUrls(
  local: readonly string[],
  extra: readonly string[]
): string[] {
  const seen = new Set(local);
  const out = [...local];
  for (const u of extra) {
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

/** لعرض الملفات المرفوعة (كل ما عدا الصور — الصور تُدمج في المعرض) */
export type UploadedDocumentItem = {
  title: string;
  url: string;
  fileKind: "pdf" | "docx" | "video" | "other";
};

export function splitStorageForDisplay(
  files: StorageFileRef[]
): { imageUrls: string[]; documents: UploadedDocumentItem[] } {
  const imageUrls = files
    .filter((f) => f.kind === "image")
    .map((f) => f.url);

  const documents: UploadedDocumentItem[] = files
    .filter((f) => f.kind !== "image")
    .map((f) => {
      let fileKind: UploadedDocumentItem["fileKind"] = "other";
      if (f.kind === "pdf") fileKind = "pdf";
      else if (f.kind === "docx") fileKind = "docx";
      else if (f.kind === "video") fileKind = "video";
      return {
        title: titleFromStorageFilename(f.name),
        url: f.url,
        fileKind,
      };
    });

  documents.sort((a, b) => a.title.localeCompare(b.title, "ar"));
  return { imageUrls, documents };
}
