import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/app/lib/storageBucket";
import { createSupabaseForAdminApi } from "@/app/lib/supabaseAdminApi";

export async function POST(request: Request) {
  const supabase = createSupabaseForAdminApi();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase غير مُعرّف. أضف NEXT_PUBLIC_SUPABASE_URL وإما SUPABASE_SERVICE_ROLE_KEY (مُفضّل لتجاوز RLS) أو NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const raw = form.get("file");
  const pathRaw = form.get("path");

  /** في مسارات Next.js قد يكون المرفق Blob وليس File — كان يرفض الرفع بالكامل */
  if (!(raw instanceof Blob) || raw.size === 0) {
    return NextResponse.json({ error: "لم يُرفع ملف أو الملف فارغ." }, { status: 400 });
  }
  if (typeof pathRaw !== "string" || !pathRaw.trim()) {
    return NextResponse.json({ error: "مسار التخزين مطلوب." }, { status: 400 });
  }

  const path = pathRaw.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!path || path.includes("..")) {
    return NextResponse.json({ error: "مسار غير صالح." }, { status: 400 });
  }

  const buffer = Buffer.from(await raw.arrayBuffer());

  const contentType =
    raw instanceof File && raw.type
      ? raw.type
      : "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    let msg = uploadError.message ?? "فشل الرفع.";
    if (/row-level security|RLS|policy/i.test(msg)) {
      msg +=
        " أضف في .env.local المتغير السري SUPABASE_SERVICE_ROLE_KEY (من Supabase → Settings → API → service_role) وأعد تشغيل الخادم — لا تضعه في NEXT_PUBLIC.";
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    publicUrl: data.publicUrl,
    path,
  });
}
