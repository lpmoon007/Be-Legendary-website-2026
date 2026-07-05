"use client";

import { useState, useTransition } from "react";
import {
  updateCommitment,
  updateSendTimes,
  toggleActive,
  sendCoachMessage,
} from "@/app/admin/actions";

export function SendTimesEditor({
  userId,
  morning,
  afternoon,
}: {
  userId: string;
  morning: string; // HH:MM
  afternoon: string; // HH:MM
}) {
  const [editing, setEditing] = useState(false);
  const [m, setM] = useState(morning);
  const [a, setA] = useState(afternoon);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="font-serif text-lg text-ink-heading">
          {fmt12(morning)} <span className="text-ink-muted">·</span>{" "}
          {fmt12(afternoon)}
        </p>
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
      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="text-xs font-600 text-ink-muted">Morning</span>
          <input
            type="time"
            value={m}
            onChange={(e) => setM(e.target.value)}
            className="mt-1 block rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-ink-body outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-xs font-600 text-ink-muted">Afternoon</span>
          <input
            type="time"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1 block rounded-btn border border-ink-muted/40 bg-white px-3 py-2 text-ink-body outline-none focus:border-accent"
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm font-600 text-accent">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          disabled={pending}
          onClick={() => {
            setError(null);
            start(async () => {
              try {
                await updateSendTimes(userId, m, a);
                setEditing(false);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Could not save.");
              }
            });
          }}
          className="btn-cta !py-2 !text-sm"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          onClick={() => {
            setM(morning);
            setA(afternoon);
            setError(null);
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

// "07:00" → "7:00 AM"
function fmt12(hhmm: string): string {
  const [h, min] = hhmm.split(":").map((n) => parseInt(n, 10));
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${period}`;
}

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
