"use client";

import { useState } from "react";

// Demo-only progress views with placeholder data — shows enrollees what the
// participant and coach experiences look like.

const DEMO_SCORES = [7, 8, 6, 9, 8, 4, 7, 8, 9, 3, 6, 8, 9, 7, 8, 9, 8, 6, 9, 8, 7];
const CONSISTENCY = 78;

const ROSTER = [
  { name: "Maya R.", measure: "Say the risky thing", day: 21, consistency: 90, trend: "up" },
  { name: "Devin K.", measure: "Back a real swing", day: 21, consistency: 71, trend: "up" },
  { name: "Priya S.", measure: "Couldn't look bad", day: 19, consistency: 52, trend: "flat" },
  { name: "Tom B.", measure: "Say the risky thing", day: 14, consistency: 43, trend: "down" },
];

export function ProgressPreview() {
  const [view, setView] = useState<"participant" | "coach">("participant");

  return (
    <div className="surface bg-card-light p-6 shadow-card sm:p-8">
      <div className="inline-flex rounded-pill bg-ink-muted/15 p-1 text-sm font-600">
        {(["participant", "coach"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-pill px-4 py-1.5 capitalize transition-colors ${
              view === v ? "bg-accent text-ink-light" : "text-ink-muted"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "participant" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-[auto,1fr] sm:items-center">
          <ConsistencyRing pct={CONSISTENCY} />
          <div>
            <MomentumBars scores={DEMO_SCORES} />
            <div className="mt-4 rounded-btn border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-ink-body">
              You missed day 9 — that&apos;s recovery, not a broken streak.
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <Stat label="Avg consistency" value="64%" />
            <Stat label="At risk" value="2 clients" accent />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink-muted">
                <tr className="border-b border-ink-muted/20">
                  <th className="py-2 pr-4 font-600">Client</th>
                  <th className="py-2 pr-4 font-600">Lead measure</th>
                  <th className="py-2 pr-4 font-600">Day</th>
                  <th className="py-2 pr-4 font-600">Consistency</th>
                  <th className="py-2 font-600">Trend</th>
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((r) => (
                  <tr key={r.name} className="border-b border-ink-muted/10">
                    <td className="py-2.5 pr-4 font-600 text-ink-heading">
                      {r.name}
                    </td>
                    <td className="py-2.5 pr-4 text-ink-muted">{r.measure}</td>
                    <td className="py-2.5 pr-4">{r.day}/30</td>
                    <td className="py-2.5 pr-4">{r.consistency}%</td>
                    <td className="py-2.5">
                      <TrendGlyph trend={r.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsistencyRing({ pct }: { pct: number }) {
  return (
    <div
      className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#C04A26 ${pct * 3.6}deg, rgba(138,127,108,0.25) 0deg)`,
      }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-card-light">
        <span className="font-serif text-3xl font-500 text-ink-heading">
          {pct}%
        </span>
        <span className="text-xs text-ink-muted">consistency</span>
      </div>
    </div>
  );
}

function MomentumBars({ scores }: { scores: number[] }) {
  const max = 10;
  return (
    <div className="flex h-24 items-end gap-1">
      {scores.map((s, i) => (
        <div
          key={i}
          title={`Day ${i + 1}: ${s}`}
          className="flex-1 rounded-t"
          style={{
            height: `${(s / max) * 100}%`,
            background: s <= 4 ? "rgba(138,127,108,0.55)" : "#C04A26",
          }}
        />
      ))}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-btn border border-ink-muted/20 px-4 py-2">
      <div className="text-xs text-ink-muted">{label}</div>
      <div
        className={`font-serif text-lg font-500 ${
          accent ? "text-accent" : "text-ink-heading"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TrendGlyph({ trend }: { trend: string }) {
  if (trend === "up") return <span className="text-[#4F7A46]">▲ rising</span>;
  if (trend === "down") return <span className="text-accent">▼ slipping</span>;
  return <span className="text-ink-muted">— flat</span>;
}
