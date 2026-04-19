"use client";

import { useCallback, useEffect, useState } from "react";

import {
  STORAGE_BUCKET,
  type StorageDomainPrefix,
} from "@/app/lib/storageBucket";

const AUTH_KEY = "school-admin-session";
const BUCKET = STORAGE_BUCKET;

const DOMAIN_TABS: { key: StorageDomainPrefix; label: string }[] = [
  { key: "home", label: "الرئيسية" },
  { key: "manakh", label: "مناخ المدرسة" },
  { key: "idara", label: "الإدارة والقيادة" },
  { key: "injaz", label: "الإنجاز الدراسي" },
  { key: "tadrees", label: "التدريس والتقويم" },
  { key: "nomow", label: "النمو الشخصي" },
];

type ListedFile = {
  path: string;
  name: string;
  publicUrl: string;
};

function sanitizeStorageFileName(name: string): string {
  const base = name
    .replace(/^[/\\]+/, "")
    .replace(/[/\\?*:"<>|]/g, "-")
    .trim();
  if (!base) return `file-${Date.now()}`;
  return base;
}

function uploadWithProgress(
  file: File,
  path: string,
  onProgress: (pct: number) => void
): Promise<{ publicUrl: string; path: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);
    form.append("path", path);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && e.total > 0) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      const text = xhr.responseText?.trim() ?? "";
      if (xhr.status >= 200 && xhr.status < 300) {
        if (!text) {
          reject(new Error("استجابة فارغة من الخادم بعد الرفع."));
          return;
        }
        try {
          const json = JSON.parse(text) as {
            publicUrl?: string;
            path?: string;
            error?: string;
          };
          if (json.publicUrl && json.path) {
            resolve({ publicUrl: json.publicUrl, path: json.path });
            return;
          }
          reject(new Error(json.error ?? "فشل الرفع — لم تُرجع روابط الملف."));
        } catch {
          const hint = text.startsWith("<")
            ? "الخادم أرجع صفحة HTML بدل JSON (غالباً خطأ داخلي أو حجم طلب كبير جداً)."
            : text.slice(0, 200);
          reject(new Error(`استجابة غير صالحة: ${hint}`));
        }
      } else {
        try {
          const json = text ? (JSON.parse(text) as { error?: string }) : {};
          reject(
            new Error(
              json.error ??
                `رفض الخادم (${xhr.status}): ${text.slice(0, 160) || "—"}`
            )
          );
        } catch {
          reject(
            new Error(
              `خطأ ${xhr.status}: ${text.slice(0, 200) || "لا يوجد تفاصيل"}`
            )
          );
        }
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("تعذّر الاتصال بالخادم — تحقق من أن المشروع يعمل (npm run dev)."))
    );

    xhr.open("POST", "/api/admin/upload");
    xhr.send(form);
  });
}

export default function AdminPage() {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<StorageDomainPrefix>("home");
  const [files, setFiles] = useState<ListedFile[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadMsgIsError, setUploadMsgIsError] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(AUTH_KEY) === "1") {
        setAuthed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const loadFiles = useCallback(async (prefix: StorageDomainPrefix) => {
    setLoadingList(true);
    setListError(null);
    try {
      const res = await fetch(
        `/api/admin/list?prefix=${encodeURIComponent(prefix)}`
      );
      const text = await res.text();
      let json: { files?: ListedFile[]; error?: string };
      try {
        json = text ? (JSON.parse(text) as { files?: ListedFile[]; error?: string }) : {};
      } catch {
        throw new Error("استجابة غير صالحة من خادم القائمة.");
      }
      if (!res.ok) {
        throw new Error(json.error ?? `خطأ ${res.status}`);
      }
      setFiles(json.files ?? []);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "تعذّر جلب الملفات");
      setFiles([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !authed) return;
    void loadFiles(activeTab);
  }, [mounted, authed, activeTab, loadFiles]);

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!adminPassword) {
      setLoginError(
        "لم يُضبط كلمة مرور الإدارة. أنشئ ملف .env.local في جذر المشروع وأضف السطر: NEXT_PUBLIC_ADMIN_PASSWORD=كلمة_المرور ثم أعد تشغيل الخادم (أوقف npm run dev وشغّله من جديد)."
      );
      return;
    }
    if (passwordInput === adminPassword) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
      setPasswordInput("");
    } else {
      setLoginError("كلمة المرور غير صحيحة.");
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
  };

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const arr = Array.from(fileList);
      const allowed = arr.filter((f) => {
        const t = f.type.toLowerCase();
        const n = f.name.toLowerCase();
        return (
          t.startsWith("image/") ||
          t === "application/pdf" ||
          n.endsWith(".pdf") ||
          n.endsWith(".jpg") ||
          n.endsWith(".jpeg") ||
          n.endsWith(".png") ||
          n.endsWith(".webp") ||
          n.endsWith(".gif")
        );
      });

      if (allowed.length === 0) {
        setUploadMsgIsError(true);
        setUploadMsg("يرجى اختيار صور أو PDF فقط.");
        return;
      }

      setUploadBusy(true);
      setUploadMsg(null);
      setUploadMsgIsError(false);
      setUploadPct(0);

      try {
        for (let i = 0; i < allowed.length; i++) {
          const file = allowed[i];
          const safeName = sanitizeStorageFileName(file.name);
          const path = `${activeTab}/${safeName}`;
          await uploadWithProgress(file, path, (pct) => {
            const base = Math.round((i / allowed.length) * 100);
            const slice = pct / allowed.length;
            setUploadPct(Math.min(100, Math.round(base + slice)));
          });
        }
        setUploadPct(100);
        await loadFiles(activeTab);
        setUploadMsgIsError(false);
        setUploadMsg(
          `تم رفع ${allowed.length} ملفاً بنجاح. إذا لم يظهر في القائمة فوراً، اضغط «تحديث القائمة» أو راجع صلاحيات القراءة (list) في Supabase للـ bucket.`
        );
      } catch (err) {
        setUploadMsgIsError(true);
        setUploadMsg(err instanceof Error ? err.message : "فشل الرفع");
      } finally {
        setUploadBusy(false);
        setTimeout(() => setUploadPct(null), 1800);
      }
    },
    [activeTab, loadFiles]
  );

  const onDelete = async (path: string) => {
    if (!confirm("حذف هذا الملف من التخزين؟")) return;
    setDeletingPath(path);
    setListError(null);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(json.error ?? "فشل الحذف");
      }
      setFiles((prev) => prev.filter((f) => f.path !== path));
    } catch (e) {
      setListError(e instanceof Error ? e.message : "فشل الحذف");
    } finally {
      setDeletingPath(null);
    }
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (e.dataTransfer.files?.length) {
        void handleFiles(e.dataTransfer.files);
      }
    },
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-school-black text-school-white flex items-center justify-center">
        <p className="text-school-muted">جاري التحميل…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-school-black flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md border border-school-gold/40 bg-school-white/5 p-8 shadow-lg backdrop-blur-sm">
          <h1 className="text-center text-2xl font-bold text-school-gold">
            لوحة الإدارة
          </h1>
          <p className="mt-2 text-center text-sm text-school-muted">
            مدرسة طوي أعتير بنين — إدارة ملفات التخزين
          </p>
          <form onSubmit={onLogin} className="mt-8 flex flex-col gap-4">
            <label className="text-sm font-medium text-school-white">
              كلمة المرور
              <input
                type="password"
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="mt-2 w-full border border-neutral-600 bg-school-black px-4 py-3 text-school-white outline-none focus:border-school-gold"
              />
            </label>
            {loginError ? (
              <p className="text-sm text-red-400" role="alert">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              className="mt-2 w-full border-2 border-school-gold bg-school-gold py-3 font-semibold text-school-black transition hover:bg-transparent hover:text-school-gold"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-school-black text-school-white">
      <header className="border-b border-white/10 bg-school-black/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <h1 className="text-xl font-bold text-school-gold md:text-2xl">
              لوحة الإدارة
            </h1>
            <p className="text-sm text-school-muted">
              Bucket: {BUCKET}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded border border-school-gold px-4 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black"
          >
            خروج
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div
          className="mb-6 rounded-lg border border-school-gold/35 bg-school-gold/[0.07] px-4 py-4 text-sm leading-relaxed text-school-white/95"
          role="note"
        >
          <p className="font-semibold text-school-gold">
            ملفان نوعان — لا تخلط بينهما
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-school-muted">
            <li>
              <span className="text-school-white/90">
                الملفات التي ترفعها من هنا تُخزَّن في{" "}
                <strong className="text-school-gold">Supabase</strong> فقط —
                تظهر في القائمة أدناه ويمكنك{" "}
                <strong className="text-school-white">حذفها من هنا</strong>.
              </span>
            </li>
            <li>
              <span className="text-school-white/90">
                الصور وملفات PDF <strong>الأصلية المدمجة في الموقع</strong> (التي
                كانت موجودة قبل السحابة) تأتي من مجلد{" "}
                <code className="rounded bg-black/40 px-1.5 py-0.5 text-school-gold">
                  public/الموقع/…
                </code>{" "}
                داخل مشروع Next —{" "}
                <strong className="text-school-white">
                  لا تُحذف من لوحة الإدارة
                </strong>
                . لإزالتها من الموقع تحتاج حذف الملف من المشروع (أو تعديل الكود)
                ثم إعادة رفع الموقع.
              </span>
            </li>
          </ul>
        </div>

        <nav
          className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
          aria-label="مجالات الموقع"
        >
          {DOMAIN_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`rounded-t px-4 py-2 text-sm font-semibold transition md:text-base ${
                activeTab === t.key
                  ? "bg-school-gold text-school-black"
                  : "bg-white/5 text-school-white hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-school-gold">
            {DOMAIN_TABS.find((x) => x.key === activeTab)?.label}
            <span className="mr-2 text-sm font-normal text-school-muted">
              ({activeTab}/)
            </span>
          </h2>

          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-school-white">
                  الملفات الحالية
                </h3>
                <p className="mt-1 text-sm text-school-muted">
                  لكل ملف زر «حذف من التخزين» — يزيل الملف من Supabase وليس من
                  جهازك فقط.
                </p>
              </div>
              <button
                type="button"
                disabled={loadingList}
                onClick={() => void loadFiles(activeTab)}
                className="shrink-0 text-sm font-semibold text-school-gold hover:underline disabled:opacity-50"
              >
                تحديث القائمة
              </button>
            </div>

            {listError ? (
              <p className="mt-4 text-sm text-red-400" role="alert">
                {listError}
              </p>
            ) : null}

            {loadingList ? (
              <p className="mt-6 text-school-muted">جاري التحميل…</p>
            ) : files.length === 0 ? (
              <p className="mt-6 text-school-muted">
                لا توجد ملفات في هذا المسار بعد.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-white/10 border border-white/10">
                {files.map((f) => (
                  <li
                    key={f.path}
                    className="flex flex-col gap-3 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="break-all font-medium text-school-white">
                        {f.name}
                      </p>
                      <a
                        href={f.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block max-w-full break-all text-xs text-school-gold hover:underline"
                      >
                        معاينة الرابط
                      </a>
                    </div>
                    <button
                      type="button"
                      disabled={deletingPath === f.path}
                      onClick={() => void onDelete(f.path)}
                      title="حذف نهائي من bucket المدرسة"
                      className="w-full shrink-0 rounded border-2 border-red-500/70 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50 sm:w-auto"
                    >
                      {deletingPath === f.path ? "جاري الحذف…" : "حذف من التخزين"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            {...dropHandlers}
            className={`mt-10 flex min-h-[160px] cursor-pointer flex-col items-center justify-center border-2 border-dashed px-4 py-10 text-center transition ${
              dragOver
                ? "border-school-gold bg-school-gold/10"
                : "border-white/25 bg-white/[0.03] hover:border-school-gold/50"
            }`}
          >
            <p className="font-medium text-school-white">
              رفع ملفات جديدة — اسحب هنا أو اختر من الجهاز
            </p>
            <p className="mt-2 text-sm text-school-muted">
              صور (JPG, PNG, …) أو PDF — يُرفع إلى المسار{" "}
              <code className="rounded bg-white/10 px-2 py-0.5 text-school-gold">
                {activeTab}/
              </code>
            </p>
            <label className="mt-6 inline-flex cursor-pointer rounded border border-school-gold px-5 py-2 text-sm font-semibold text-school-gold transition hover:bg-school-gold hover:text-school-black">
              اختيار ملفات
              <input
                type="file"
                accept="image/*,application/pdf,.pdf"
                multiple
                className="sr-only"
                disabled={uploadBusy}
                onChange={(e) => {
                  if (e.target.files?.length) {
                    void handleFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </label>

            {uploadPct !== null ? (
              <div className="mt-6 w-full max-w-md">
                <div className="h-2 w-full overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full bg-school-gold transition-[width] duration-150"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-school-muted">{uploadPct}%</p>
              </div>
            ) : null}

            {uploadMsg ? (
              <p
                className={`mt-4 text-sm ${uploadMsgIsError ? "text-red-400" : "text-emerald-400/90"}`}
                role={uploadMsgIsError ? "alert" : "status"}
              >
                {uploadMsg}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
