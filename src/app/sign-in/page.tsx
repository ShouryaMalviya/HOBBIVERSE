"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HobbiverseBrand } from "@/components/layout/HobbiverseBrand";
import { useAuth } from "@/services/auth";
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address (e.g. you@example.com)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signInDemo, isConfigured } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "explorer@hobbiverse.local",
      password: "password123",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setAuthError(null);

    // Simulate authentic network resolution
    setTimeout(() => {
      setIsLoading(false);
      signInDemo(data.email, "Demo Explorer");
      router.push("/home");
    }, 600);
  };

  const handleInstantDemo = () => {
    signInDemo();
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[var(--paper-100)] border border-[var(--sand-400)] rounded-[var(--radius-2xl)] p-6 sm:p-8 shadow-[var(--shadow-warm)] text-left flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <HobbiverseBrand size="md" />
            <h1 className="text-2xl font-extrabold text-[var(--wine-950)] mt-2">
              Welcome Back
            </h1>
            <p className="text-xs text-[var(--stone-600)]">
              Continue your creative routine in the atelier
            </p>
          </div>

          {/* Explicit Demo Mode Callout */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--brand-soft)] border border-[var(--rose-300)] flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-soft-text)]">
              <Sparkles className="w-4 h-4 text-[var(--wine-700)]" aria-hidden="true" />
              <span>Instant Local Demo Mode</span>
            </div>
            <p className="text-xs text-[var(--ink-700)] leading-relaxed">
              {!isConfigured
                ? "No remote cloud database is connected. You can use full features right now with local storage."
                : "Explore Hobbiverse immediately with preloaded seed data."}
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstantDemo}
              className="w-full shadow-xs"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter Atelier Demo Workspace
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--stone-600)]">
              Or Sign In With Email
            </span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-[var(--coral-100)] border border-[var(--coral-300)] text-xs text-[var(--berry-700)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--stone-600)] hover:text-[var(--ink-950)] p-1 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In (Demo Auth Adapter)
            </Button>
          </form>

          <div className="text-center text-xs text-[var(--stone-600)] pt-2 border-t border-[var(--border-subtle)]">
            Don&apos;t have an account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--wine-800)] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
