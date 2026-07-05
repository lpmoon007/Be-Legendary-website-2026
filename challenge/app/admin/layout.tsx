import Link from "next/link";
import { SnailMark } from "@/components/Logo";

// Admin chrome. The middleware guarantees a session before any /admin page
// (except /admin/login) renders, so this shell is safe to show unconditionally.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111015]">
      <header className="border-b border-white/10 bg-[#17151b]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3 text-ink-light">
            <SnailMark className="h-6 w-8 text-accent-light" />
            <span className="font-serif text-lg">Be Legendary — Coach</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-600 text-ink-light/70">
            <Link href="/admin" className="hover:text-ink-light">
              Roster
            </Link>
            <Link href="/admin/users/new" className="hover:text-ink-light">
              Add user
            </Link>
            <Link href="/admin/settings" className="hover:text-ink-light">
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
