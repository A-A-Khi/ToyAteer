import { NextResponse } from "next/server";

import {
  STORAGE_BUCKET,
  listAllStorageObjectPaths,
  type StorageDomainPrefix,
} from "@/app/lib/storageBucket";
import { createSupabaseForAdminApi } from "@/app/lib/supabaseAdminApi";

const ALLOWED: StorageDomainPrefix[] = [
  "home",
  "manakh",
  "idara",
  "injaz",
  "tadrees",
  "nomow",
];

export async function GET(request: Request) {
  const supabase = createSupabaseForAdminApi();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase غير مُعرّف في البيئة." },
      { status: 500 }
    );
  }

  const prefix = new URL(request.url).searchParams.get("prefix");
  if (!prefix || !ALLOWED.includes(prefix as StorageDomainPrefix)) {
    return NextResponse.json({ error: "بادئة غير صالحة." }, { status: 400 });
  }

  const paths = await listAllStorageObjectPaths(supabase, prefix);
  const files = paths.map((path) => {
    const name = path.replace(/^.*\//, "");
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return { path, name, publicUrl: data.publicUrl };
  });
  files.sort((a, b) => a.path.localeCompare(b.path, "ar"));

  return NextResponse.json({ files });
}
