"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HobbiverseBrand } from "./HobbiverseBrand";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import {
  Home,
  Compass,
  Bookmark,
  Calendar,
  BookOpen,
  Users,
  Trophy,
  Bot,
  Bell,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/services/auth";

export interface WorkspaceShellProps {
  children: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, isDemo, signOut } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
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
      if (e.key === "Escape" && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileDrawerOpen]);

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

  const navItems = [
    { label: "Dashboard", href: "/home", icon: Home },
    { label: "Explore Hobbies", href: "/explore", icon: Compass },
    { label: "My Hobbies", href: "/my-hobbies", icon: Bookmark },
    { label: "Activity Planner", href: "/planner", icon: Calendar },
    { label: "Private Journal", href: "/journal", icon: BookOpen, badge: "Private" },
    { label: "Community Feed", href: "/community", icon: Users },
    { label: "Challenges & Events", href: "/events", icon: Trophy },
    { label: "Hobby Companion", href: "/companion", icon: Bot, badge: "Demo" },
  ];

  const secondaryItems = [
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Moderation Queue", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-page)] text-[var(--text-body)] transition-colors">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--wine-900)] focus:text-[var(--paper-50)] focus:rounded-[var(--radius-md)] focus:shadow-[var(--shadow-elevated)] focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <aside
        aria-label="Workspace Navigation"
        className="hidden md:flex flex-col w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0 sticky top-0 h-screen overflow-y-auto"
      >
        {/* Brand Area */}
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <HobbiverseBrand size="md" />
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 p-3 flex flex-col gap-1 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] px-3 py-1.5">
            Atelier Workspace
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors select-none",
                  isActive
                    ? "bg-[var(--brand-anchor)] text-[var(--paper-50)] shadow-[var(--shadow-subtle)]"
                    : "text-[var(--ink-700)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[var(--paper-50)]" : "text-[var(--stone-600)]")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-[var(--wine-900)] text-[var(--rose-100)]"
                        : "bg-[var(--paper-300)] text-[var(--ink-700)]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] px-3 py-1.5">
              Preferences &amp; Safety
            </span>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors select-none",
                    isActive
                      ? "bg-[var(--paper-300)] text-[var(--wine-950)] font-semibold"
                      : "text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
                  )}
                >
                  <Icon className="w-4 h-4 text-[var(--stone-600)]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--paper-100)] flex items-center justify-between gap-2">
          <Link
            href={user ? `/profile/${user.username}` : "/sign-in"}
            className="flex-1 flex items-center gap-2.5 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--paper-200)] transition-colors select-none min-w-0"
          >
            <Avatar name={user?.displayName || "Demo Explorer"} size="sm" status="online" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-[var(--ink-950)] truncate">
                {user?.displayName || "Demo Explorer"}
              </span>
              <span className="text-[10px] text-[var(--forest-700)] font-medium truncate">
                {isDemo ? "Local Mode" : "Connected"}
              </span>
            </div>
          </Link>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={signOut}
            aria-label="Sign out"
            icon={<LogOut className="w-4 h-4 text-[var(--stone-600)] hover:text-[var(--wine-700)]" />}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Topbar */}
        <header className="sticky top-0 z-30 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <IconButton
                variant="ghost"
                size="sm"
                aria-label={mobileDrawerOpen ? "Close navigation" : "Open navigation"}
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                icon={mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              />
            </div>

            {/* Quick Search trigger */}
            <Link
              href="/explore"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--paper-200)] hover:bg-[var(--paper-300)] border border-[var(--border-subtle)] text-xs text-[var(--stone-600)] transition-colors"
            >
              <Search className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Search hobbies, circles, challenges...</span>
              <span className="sm:hidden">Search...</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--sage-100)] text-[var(--forest-700)] text-xs font-semibold border border-[var(--sage-300)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forest-700)] animate-pulse" />
              <span>Demo Mode</span>
            </div>

            {/* Notifications Shortcut */}
            <Link href="/notifications">
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="View notifications"
                icon={<Bell className="w-4 h-4 text-[var(--ink-700)]" />}
              />
            </Link>

            {/* Theme Toggle */}
            <IconButton
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              icon={isDark ? <Sun className="w-4 h-4 text-[var(--butter-300)]" /> : <Moon className="w-4 h-4 text-[var(--wine-700)]" />}
            />

            {/* Profile Avatar */}
            <Link href={user ? `/profile/${user.username}` : "/sign-in"} aria-label="View user profile">
              <Avatar name={user?.displayName || "Demo Explorer"} size="sm" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div
            className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
            role="dialog"
            aria-label="Mobile Workspace Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px]",
                    isActive
                      ? "bg-[var(--brand-anchor)] text-[var(--paper-50)]"
                      : "text-[var(--ink-800)] hover:bg-[var(--paper-200)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[var(--ink-800)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex flex-col gap-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 text-sm text-[var(--stone-600)] min-h-[44px]"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-3.5 py-2 text-sm text-[var(--wine-700)] hover:bg-[var(--paper-200)] rounded-md transition-colors text-left min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          aria-label="Mobile quick navigation"
          className="md:hidden sticky bottom-0 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 py-1 flex items-center justify-around"
        >
          <Link
            href="/home"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium rounded-lg min-h-[48px]",
              pathname === "/home" ? "text-[var(--wine-700)] font-bold" : "text-[var(--stone-600)]"
            )}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </Link>
          <Link
            href="/explore"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium rounded-lg min-h-[48px]",
              pathname === "/explore" ? "text-[var(--wine-700)] font-bold" : "text-[var(--stone-600)]"
            )}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Explore</span>
          </Link>
          <Link
            href="/planner"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium rounded-lg min-h-[48px]",
              pathname === "/planner" ? "text-[var(--wine-700)] font-bold" : "text-[var(--stone-600)]"
            )}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Planner</span>
          </Link>
          <Link
            href="/journal"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium rounded-lg min-h-[48px]",
              pathname === "/journal" ? "text-[var(--wine-700)] font-bold" : "text-[var(--stone-600)]"
            )}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Journal</span>
          </Link>
          <Link
            href="/community"
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium rounded-lg min-h-[48px]",
              pathname === "/community" ? "text-[var(--wine-700)] font-bold" : "text-[var(--stone-600)]"
            )}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>Circles</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};
