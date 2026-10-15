"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { Notification } from "@/types";
import {
  Check,
  Sparkles,
  Trophy,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Bell,
  BellOff,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isHydrated,
  } = useHobbiverseStore();

  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  // Toast state
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "info" | "warning";
    title: string;
    message?: string;
  } | null>(null);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setToastMessage({
      type: "success",
      title: "All Marked as Read",
      message: "Your notification center is all caught up.",
    });
  };

  const handleItemClick = async (notif: Notification) => {
    if (!notif.isRead) {
      await markNotificationRead(notif.id);
    }
  };

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === "unread") return !n.isRead;
      if (activeFilter === "milestone") return n.type === "milestone";
      if (activeFilter === "reminder") return n.type === "reminder";
      if (activeFilter === "community") return n.type === "community";
      return true;
    });
  }, [notifications, activeFilter]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "milestone":
        return (
          <div className="w-9 h-9 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case "reminder":
        return (
          <div className="w-9 h-9 rounded-full bg-[var(--sky-100)] text-[var(--ocean-700)] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case "community":
        return (
          <div className="w-9 h-9 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-[var(--butter-100)] text-[var(--ochre-700)] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Activity Center"
        title="Notifications &amp; Reminders"
        description="Gentle updates about your scheduled sessions, circle invitations, and quiet milestones."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Check className="w-4 h-4" />}
              onClick={handleMarkAllRead}
            >
              Mark All as Read ({unreadCount})
            </Button>
          ) : undefined
        }
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4">
            <Toast
              type={toastMessage.type}
              title={toastMessage.title}
              message={toastMessage.message}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        <div className="flex flex-col gap-6 max-w-3xl text-left">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--sand-400)]/70 pb-3">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
              }`}
            >
              All ({notifications.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "unread"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[var(--rose-700)] inline-block" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("milestone")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === "milestone"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
              }`}
            >
              Milestones
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("reminder")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === "reminder"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
              }`}
            >
              Reminders
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("community")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeFilter === "community"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
              }`}
            >
              Community
            </button>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--wine-950)]">
                All Caught Up
              </h3>
              <p className="text-xs sm:text-sm text-[var(--stone-600)] max-w-sm leading-relaxed">
                {activeFilter === "unread"
                  ? "You have read all your gentle atelier updates."
                  : "No notifications found for this category."}
              </p>
              <Link href="/explore">
                <Button size="sm" variant="secondary">
                  Explore New Hobbies
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-4 sm:p-5 rounded-[var(--radius-xl)] border transition-all text-left flex items-start gap-4 relative group cursor-pointer ${
                    notif.isRead
                      ? "bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-85 hover:opacity-100"
                      : "bg-[var(--paper-100)] border-[var(--sand-400)] shadow-xs"
                  }`}
                >
                  {/* Unread Accent Dot */}
                  {!notif.isRead && (
                    <span
                      className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--rose-700)]"
                      aria-label="Unread notification"
                    />
                  )}

                  {/* Icon */}
                  {getIcon(notif.type)}

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1 pr-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm ${
                          notif.isRead
                            ? "font-semibold text-[var(--ink-950)]"
                            : "font-bold text-[var(--wine-950)]"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[11px] text-[var(--stone-600)] shrink-0">
                        {notif.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--ink-800)] leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action link if present */}
                    {notif.href && (
                      <div className="pt-1.5">
                        <Link
                          href={notif.href}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-semibold text-[var(--wine-700)] hover:underline inline-flex items-center gap-1"
                        >
                          View in atelier <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
