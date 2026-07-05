"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <div className="surface bg-card-light p-8 shadow-card">
        <h1 className="font-serif text-2xl font-500 text-ink-heading">
          Coach sign in
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Be Legendary Challenge admin</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-600 text-ink-body">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm font-600 text-ink-body">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            />
          </label>

          {error && <p className="text-sm font-600 text-accent">{error}</p>}

          <button className="btn-cta w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
