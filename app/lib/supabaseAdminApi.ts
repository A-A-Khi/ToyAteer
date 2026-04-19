import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * عميل Supabase للخادم فقط (مسارات API + Server Components).
 * يفضّل `SUPABASE_SERVICE_ROLE_KEY` لتجاوز RLS على Storage.
 * لا تضع مفتاح الخدمة في متغير يبدأ بـ NEXT_PUBLIC.
 */
export function createSupabaseForAdminApi(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return null;

  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceRole) {
    return createClient(url, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!anon) return null;

  return createClient(url, anon);
}
