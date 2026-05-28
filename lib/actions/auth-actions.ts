// lib/actions/auth-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "../supabase/admin";

export async function signUp(_: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const { data: user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (user?.user) {
    await supabase.from("user_profiles").insert({
      id: user.user.id,
      display_name: displayName,
    });
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signIn(_: any, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function sendPasswordResetEmail(
  _: { error?: string; success?: boolean },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const adminClient = createAdminClient();
  const { data: userList, error: listError } =
    await adminClient.auth.admin.listUsers();

  if (listError) {
    console.error("Admin listUsers failed:", listError);
    return { error: "Something went wrong. Please try again." };
  }

  const userExists = userList.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!userExists) {
    return { error: "No account found with that email address." };
  }

  const supabase = await createClient();
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
    },
  );

  if (resetError) {
    return { error: resetError.message };
  }

  // Send branded email via Gmail SMTP
  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Graytest <noreply@graytest.app>",
      to: email,
      subject: "Reset your Graytest password",
      text: `You requested a password reset. Click the link below to set a new password. The link expires in 1 hour.\n\n${baseUrl}/reset-password\n\nIf you didn't request this, you can safely ignore this email.`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#ffffff;font-family:serif,sans-serif;padding:20px;margin:0;">
  <div style="max-width:600px;margin:0 auto;">
    <p style="font-size:24px;font-weight:500;color:#ffffff;margin-bottom:8px;">Reset your password</p>
    <p style="color:#d4d4d4;margin-bottom:24px;line-height:1.6;">
      We received a request to reset your Graytest password. Click the button below to choose a new one.
      This link expires in <strong style="color:#ffffff;">1 hour</strong>.
    </p>
    <a href="${baseUrl}/reset-password"
       style="display:inline-block;background:#d9d9d9;color:#000000;padding:12px 28px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:15px;">
      Reset Password
    </a>
    <p style="color:#888888;font-size:12px;margin-top:32px;line-height:1.4;">
      If you didn't request a password reset, you can safely ignore this email.<br>
      Graytest — For informational purposes only.
    </p>
  </div>
</body>
</html>
      `.trim(),
    });
  } catch (emailErr) {
    console.warn("Mailtrap send failed (Supabase email still sent):", emailErr);
  }

  return { success: true };
}

export async function updatePassword(_: any, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both fields are required" };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login");
}
