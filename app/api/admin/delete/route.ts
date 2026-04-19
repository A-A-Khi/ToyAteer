import { NextResponse } from "next/server";

import { STORAGE_BUCKET } from "@/app/lib/storageBucket";
import { createSupabaseForAdminApi } from "@/app/lib/supabaseAdminApi";

export async function POST(request: Request) {
  const supabase = createSupabaseForAdminApi();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase غير مُعرّف. أضف NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY أو المفتاح العام.",
      },
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

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([normalized]);

  if (error) {
    let msg = error.message ?? "فشل الحذف.";
    if (/row-level security|RLS|policy/i.test(msg)) {
      msg +=
        " أضف SUPABASE_SERVICE_ROLE_KEY في بيئة الخادم (ليس NEXT_PUBLIC).";
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
