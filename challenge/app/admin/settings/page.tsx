"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();

  const [currentEmail, setCurrentEmail] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Constructed here (browser only) so an env-less SSR prerender never builds it.
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const e = data.user?.email ?? "";
      setCurrentEmail(e);
      setEmail(e);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    const payload: { email?: string; password?: string } = {};
    if (email && email !== currentEmail) payload.email = email;
    if (password) payload.password = password;

    if (!payload.email && !payload.password) {
      setSaving(false);
      setMsg({ ok: false, text: "Nothing to update." });
      return;
    }

    const { error } = await createClient().auth.updateUser(payload);
    setSaving(false);
    if (error) {
      setMsg({ ok: false, text: error.message });
      return;
    }
    setPassword("");
    setMsg({
      ok: true,
      text: payload.email
        ? "Saved. Check your inbox to confirm the new email."
        : "Password updated.",
    });
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-serif text-3xl font-500 text-ink-light">Settings</h1>

      <form onSubmit={save} className="surface mt-6 bg-card-light p-6 shadow-card">
        <h2 className="font-sans text-lg font-700 text-ink-heading">
          Admin account
        </h2>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-600 text-ink-body">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm font-600 text-ink-body">
              New password
            </span>
            <input
              type="password"
              value={password}
              placeholder="Leave blank to keep current"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            />
          </label>
        </div>

        {msg && (
          <p
            className={`mt-4 text-sm font-600 ${
              msg.ok ? "text-[#4F7A46]" : "text-accent"
            }`}
          >
            {msg.text}
          </p>
        )}

        <button className="btn-cta mt-6" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <button
        onClick={signOut}
        className="btn-ghost mt-6 !text-ink-light/80"
      >
        Sign out
      </button>
    </div>
  );
}
