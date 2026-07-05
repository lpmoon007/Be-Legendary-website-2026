import Link from "next/link";
import { createUser } from "@/app/admin/actions";
import { COMMON_TIMEZONES } from "@/lib/timezone";

export default function NewUserPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Link href="/admin" className="text-sm text-ink-light/60 hover:text-ink-light">
        ← Back to roster
      </Link>
      <h1 className="mt-3 font-serif text-3xl font-500 text-ink-light">
        Add a participant
      </h1>

      <form action={createUser} className="surface mt-6 bg-card-light p-6 shadow-card">
        <div className="space-y-4">
          <Field label="Name" name="name" placeholder="Jordan Ellis" required />
          <Field
            label="Phone (E.164 or US)"
            name="phone"
            placeholder="+13035551234"
            required
          />

          <label className="block">
            <span className="text-sm font-600 text-ink-body">Timezone</span>
            <select
              name="timezone"
              defaultValue="America/Denver"
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-600 text-ink-body">Commitment</span>
            <textarea
              name="commitment"
              required
              rows={2}
              placeholder="Each day, say the risky thing I'd normally soften."
              className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-600 text-ink-body">Morning time</span>
              <input
                type="time"
                name="morning_time"
                defaultValue="07:00"
                className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-sm font-600 text-ink-body">
                Afternoon time
              </span>
              <input
                type="time"
                name="afternoon_time"
                defaultValue="16:00"
                className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
              />
            </label>
          </div>
        </div>

        <button className="btn-cta mt-6 w-full">Create participant</button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-600 text-ink-body">{label}</span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-btn border border-ink-muted/40 bg-white px-4 py-3 text-ink-body outline-none focus:border-accent"
      />
    </label>
  );
}
