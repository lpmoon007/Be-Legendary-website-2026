"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toE164, digitCount } from "@/lib/phone";
import { isValidTimezone } from "@/lib/timezone";

// All admin mutations run through the request-bound (authenticated) server
// client, which RLS grants full access. The middleware guarantees a session.

export async function createUser(formData: FormData) {
  const supabase = createClient();

  const name = String(formData.get("name") ?? "").trim();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();
  const commitment = String(formData.get("commitment") ?? "").trim();
  const morning_time = String(formData.get("morning_time") ?? "07:00");
  const afternoon_time = String(formData.get("afternoon_time") ?? "16:00");

  if (!name || !commitment) throw new Error("Name and commitment are required.");
  if (digitCount(rawPhone) < 10) throw new Error("Enter a valid phone number.");
  if (!isValidTimezone(timezone)) throw new Error("Choose a valid timezone.");

  const phone = toE164(rawPhone);
  if (!phone) throw new Error("Phone number could not be parsed to E.164.");

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      name,
      phone,
      timezone,
      commitment,
      morning_time,
      afternoon_time,
      active: true,
    })
    .select("id")
    .single();

  if (error || !user) {
    throw new Error(error?.message ?? "Could not create user.");
  }

  await supabase
    .from("conversation_state")
    .insert({ user_id: user.id, state: "idle" });

  revalidatePath("/admin");
  redirect(`/admin/users/${user.id}`);
}

export async function updateCommitment(userId: string, commitment: string) {
  const supabase = createClient();
  const value = commitment.trim();
  if (!value) throw new Error("Commitment cannot be empty.");
  const { error } = await supabase
    .from("users")
    .update({ commitment: value })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
}

export async function toggleActive(userId: string, active: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("users")
    .update({ active })
    .eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin");
}
