"use client";

import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

type Mode = "signIn" | "signUp" | "confirm";

export function AuthModal(props: { open: boolean; onClose: () => void }) {
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [localError, setLocalError] = useState("");

  const error = useMemo(() => localError || auth.error, [auth.error, localError]);

  if (!props.open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setStatus("loading");
    try {
      if (mode === "signIn") {
        await auth.signIn({ username: email.trim(), password });
        props.onClose();
      } else if (mode === "signUp") {
        await auth.signUp({
          username: email.trim(),
          password,
          options: { userAttributes: { email: email.trim() } },
        });
        setMode("confirm");
      } else {
        await auth.confirmSignUp({ username: email.trim(), confirmationCode: code.trim() });
        await auth.signIn({ username: email.trim(), password });
        props.onClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setLocalError(message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Close"
        onClick={props.onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-[hsl(var(--border))] bg-white/95 p-6 shadow-xl shadow-black/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[hsl(var(--muted-foreground))]">
              BioVision
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[hsl(var(--foreground))]">
              {mode === "signIn"
                ? "Sign in"
                : mode === "signUp"
                  ? "Create account"
                  : "Confirm email"}
            </h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
              {mode === "confirm"
                ? "Enter the code sent to your email."
                : "Use email + password to continue."}
            </p>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-white/80 px-3 py-1 text-xs font-semibold text-[hsl(var(--foreground))] shadow-sm"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-xs font-semibold text-[hsl(var(--foreground))]">
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="h-11 rounded-2xl border border-[hsl(var(--border))] bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
              required
            />
          </label>

          {mode !== "confirm" && (
            <label className="grid gap-2 text-xs font-semibold text-[hsl(var(--foreground))]">
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                className="h-11 rounded-2xl border border-[hsl(var(--border))] bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
                required
              />
            </label>
          )}

          {mode === "confirm" && (
            <label className="grid gap-2 text-xs font-semibold text-[hsl(var(--foreground))]">
              Confirmation code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="h-11 rounded-2xl border border-[hsl(var(--border))] bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-black/10"
                required
              />
            </label>
          )}

          {error && (
            <div className="rounded-2xl border border-[hsl(var(--soft-destructive-border))] bg-[hsl(var(--soft-destructive-bg))] px-4 py-3 text-xs text-[hsl(var(--foreground))]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 inline-flex h-11 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-[hsl(var(--primary-foreground))] shadow-md shadow-black/10 transition hover:bg-[hsl(var(--primary-hover))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading"
              ? "Working..."
              : mode === "signIn"
                ? "Sign in"
                : mode === "signUp"
                  ? "Create account"
                  : "Confirm"}
          </button>

          {mode !== "confirm" && (
            <button
              type="button"
              onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
              className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              {mode === "signIn"
                ? "Need an account? Create one"
                : "Already have an account? Sign in"}
            </button>
          )}

          {mode === "confirm" && (
            <button
              type="button"
              onClick={() => setMode("signUp")}
              className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              Back to sign up
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

