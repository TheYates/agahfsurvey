"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

// Create a Supabase client for server actions
async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();
  return createServerActionClient<Database>({
    cookies: () => cookieStore,
  });
}

// Sign up action
export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "user";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// Sign in action
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

// Sign out action
export async function signOutAction() {
  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}

// Reset password action
export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Update password action
export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  const supabase = await createSupabaseServerActionClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/login");
}

// Get current user action
export async function getCurrentUserAction() {
  const supabase = await createSupabaseServerActionClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user, error: null };
}

// Check if user is authenticated
export async function checkAuthAction() {
  const supabase = await createSupabaseServerActionClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { authenticated: false, user: null, error: error.message };
  }

  return {
    authenticated: !!session,
    user: session?.user || null,
    error: null,
  };
}
