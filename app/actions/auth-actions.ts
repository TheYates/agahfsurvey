"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Cookie expiration time in seconds (30 minutes)
const COOKIE_EXPIRATION = 30 * 60;

// Login action to verify credentials against the database
export async function loginUser(username: string, password: string) {
  try {
    // Get the user from the database
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      console.error("User not found:", error);
      return { success: false, message: "Invalid username or password" };
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (isValid) {
      // Set session cookie with expiration time (30 minutes)
      (await cookies()).set("authToken", "admin-authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_EXPIRATION,
        sameSite: "strict",
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    }

    return { success: false, message: "Invalid username or password" };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "An error occurred during login" };
  }
}

// Logout action
export async function logoutUser() {
  (await cookies()).delete("authToken");
  return { success: true };
}

// Check if user is authenticated
export async function checkAuth() {
  const authToken = (await cookies()).get("authToken");

  if (authToken?.value === "admin-authenticated") {
    return {
      authenticated: true,
      user: {
        id: "admin",
        username: "admin",
        role: "admin",
      },
    };
  }

  return { authenticated: false };
}
