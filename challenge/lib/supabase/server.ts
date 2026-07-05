import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server client bound to the request's cookies — used by admin server components
// and server actions. Reads/writes run as the logged-in coach (authenticated
// role), which the RLS policies grant full access.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookie writes are handled by the
            // middleware's refreshed response instead. Safe to ignore.
          }
        },
      },
    }
  );
}
