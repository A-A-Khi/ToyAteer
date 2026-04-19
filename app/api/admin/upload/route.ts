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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const file = form.get("file");
  const pathRaw = form.get("path");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يُرفع ملف." }, { status: 400 });
  }
  if (typeof pathRaw !== "string" || !pathRaw.trim()) {
    return NextResponse.json({ error: "مسار التخزين مطلوب." }, { status: 400 });
  }

  const path = pathRaw.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!path || path.includes("..")) {
    return NextResponse.json({ error: "مسار غير صالح." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createClient(url, key);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message ?? "فشل الرفع." },
      { status: 500 }
    );
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    publicUrl: data.publicUrl,
    path,
  });
}
