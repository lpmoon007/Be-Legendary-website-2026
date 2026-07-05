"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client for client components (admin login, settings, inline edits).
// Session lives in cookies so the Next.js middleware can read it.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
