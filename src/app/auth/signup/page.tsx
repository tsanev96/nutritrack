"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import ErrorMessage from "@/components/ErrorMessage";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // signUp creates a new user in Supabase Auth.
    // Supabase will also send a confirmation email — but by default in development
    // you can disable email confirmation in: Supabase dashboard → Auth → Settings.
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, AuthProvider detects the new session and redirects to "/"
  }

  const inputFields = [
    {
      label: "Email",
      type: "email",
      value: email,
      onChange: setEmail,
      placeholder: "you@example.com",
    },
    {
      label: "Password",
      type: "password",
      value: password,
      onChange: setPassword,
      placeholder: "••••••••",
    },
    {
      label: "Confirm Password",
      type: "password",
      value: confirm,
      onChange: setConfirm,
      placeholder: "••••••••",
    },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Start tracking your calories
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {inputFields.map(({ label, type, value, onChange, placeholder }) => (
            <InputField
              key={label}
              label={label}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required
            />
          ))}

          <ErrorMessage message={error} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
