"use client";

import { useState, useTransition } from "react";
import {
  updateCommitment,
  toggleActive,
  sendCoachMessage,
} from "@/app/admin/actions";

export function MessageSender({ userId }: { userId: string }) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function send() {
    const text = value.trim();
    if (!text) return;
    setError(null);
    start(async () => {
      try {
        await sendCoachMessage(userId, text);
        setValue("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not send.");
      }
    });
  }

  return (
    <div>
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          rows={2}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
          }}
          placeholder="Write a message to send to this participant…"
          className="flex-1 rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-ink-body outline-none focus:border-accent"
        />
        <button
          onClick={send}
          disabled={pending || value.trim().length === 0}
          className="btn-cta !py-2.5"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-600 text-accent">{error}</p>}
      <p className="mt-1 text-xs text-ink-muted">
        Sends a real SMS now. ⌘/Ctrl+Enter to send.
      </p>
    </div>
  );
}

export function CommitmentEditor({
  userId,
  initial,
}: {
  userId: string;
  initial: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [pending, start] = useTransition();

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4">
        <p className="font-serif text-lg text-ink-heading">{value}</p>
        <button
          onClick={() => setEditing(true)}
          className="shrink-0 text-sm font-600 text-accent hover:underline"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-ink-body outline-none focus:border-accent"
      />
      <div className="mt-2 flex gap-2">
        <button
          disabled={pending}
          onClick={() =>
            start(async () => {
              await updateCommitment(userId, value);
              setEditing(false);
            })
          }
          className="btn-cta !py-2 !text-sm"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => {
            setValue(initial);
            setEditing(false);
          }}
          className="btn-ghost !py-2 !text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ActiveToggle({
  userId,
  active,
}: {
  userId: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => start(() => toggleActive(userId, !active))}
      className={`pill ${
        active
          ? "bg-[#4F7A46]/15 text-[#4F7A46]"
          : "bg-ink-muted/20 text-ink-muted"
      }`}
    >
      {pending ? "…" : active ? "● Active — click to pause" : "○ Inactive — click to activate"}
    </button>
  );
}
