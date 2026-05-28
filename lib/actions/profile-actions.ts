"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth-actions";

export interface UserProfile {
  id: string;
  display_name: string | null;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  education: string | null;
  onboarded_at: string | null;
}

/** Returns the current user's profile, or null if not logged in */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("id, display_name, age, gender, occupation, education, onboarded_at")
    .eq("id", user.id)
    .single();

  return (data as UserProfile) ?? null;
}

/** Returns true if the user has completed onboarding */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;
  return !!profile.onboarded_at;
}

/** Save onboarding data */
export async function saveOnboardingProfile(
  _: { error?: string },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return { error: "Not authenticated" };

  const age = Number(formData.get("age"));
  const gender = formData.get("gender") as string;
  const occupation = (formData.get("occupation") as string)?.trim() || null;
  const education = formData.get("education") as string;

  if (!age || age < 10 || age > 120) {
    return { error: "Please enter a valid age (10–120)" };
  }
  if (!gender) {
    return { error: "Please select a gender" };
  }
  if (!education) {
    return { error: "Please select your education level" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({
      age,
      gender,
      occupation,
      education,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
