import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/app/lib/storageBucket";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json(
      { error: "Supabase غير مُعرّف في البيئة." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "جسم الطلب غير صالح." }, { status: 400 });
  }

  const path =
    typeof body === "object" &&
    body !== null &&
    "path" in body &&
    typeof (body as { path: unknown }).path === "string"
      ? (body as { path: string }).path
      : null;

  if (!path?.trim()) {
    return NextResponse.json({ error: "مسار الملف مطلوب." }, { status: 400 });
  }

  const normalized = path.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!normalized || normalized.includes("..")) {
    return NextResponse.json({ error: "مسار غير صالح." }, { status: 400 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([normalized]);

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "فشل الحذف." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
