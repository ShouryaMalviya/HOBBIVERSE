"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HobbiverseBrand } from "./HobbiverseBrand";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Sun, Moon, Menu, X, Compass, Info, Sparkles, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export const PublicHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const activeDark = document.documentElement.classList.contains("dark");
      setIsDark(activeDark);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("hobbiverse-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("hobbiverse-theme", "light");
      }
      return next;
    });
  };

  const navLinks = [
    { label: "Explore Hobbies", href: "/explore", icon: <Compass className="w-4 h-4" /> },
    { label: "Our Philosophy", href: "/about", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <HobbiverseBrand size="md" showTagline />

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors flex items-center gap-2",
                  isActive
                    ? "bg-[var(--brand-soft)] text-[var(--brand-soft-text)] font-semibold"
                    : "text-[var(--ink-700)] hover:text-[var(--wine-900)] hover:bg-[var(--paper-200)]"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            icon={isDark ? <Sun className="w-4 h-4 text-[var(--butter-300)]" /> : <Moon className="w-4 h-4 text-[var(--wine-700)]" />}
          />

          <Link href="/sign-in">
            <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
              Sign In
            </Button>
          </Link>

          <Link href="/home">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Enter Demo Mode
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            icon={isDark ? <Sun className="w-4 h-4 text-[var(--butter-300)]" /> : <Moon className="w-4 h-4 text-[var(--wine-700)]" />}
          />
          <IconButton
            variant="secondary"
            size="sm"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            icon={mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-5 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col gap-1 text-left">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-lg text-[var(--ink-800)] hover:bg-[var(--paper-200)] min-h-[44px]"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
            <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full min-h-[44px]">
                Sign In
              </Button>
            </Link>
            <Link href="/home" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="sm" className="w-full min-h-[44px]">
                Enter Demo Mode
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
