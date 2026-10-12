"use client";

import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { ShieldCheck, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const handleResetDemoData = () => {
    localStorage.removeItem("hobbiverse-demo-state");
    setToastMessage("Demo data restored to initial clean defaults.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Preferences"
        title="Settings &amp; Controls"
        description="Manage your privacy, reminders, accessibility options, and local demo state."
        breadcrumbs={[{ label: "Settings" }]}
      >
        <div className="flex flex-col gap-8 max-w-3xl text-left">
          {toastMessage && (
            <Toast
              type="success"
              title="Settings Updated"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          )}

          {/* Privacy & Visibility */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
                <span>Privacy &amp; Profile Visibility</span>
              </CardTitle>
              <CardDescription>
                Control what fellow members can see when viewing your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-[var(--ink-800)]">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--paper-200)]">
                <div>
                  <span className="font-semibold block">Public Profile Visibility</span>
                  <span className="text-xs text-[var(--stone-600)]">Allow other members to view your saved hobby categories</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 accent-[var(--wine-800)] cursor-pointer"
                  aria-label="Toggle public profile visibility"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--paper-200)]">
                <div>
                  <span className="font-semibold block">Private Journal Isolation</span>
                  <span className="text-xs text-[var(--stone-600)]">Enforced strictly: reflections are always private and never visible</span>
                </div>
                <span className="text-xs font-bold text-[var(--forest-700)]">Locked Private</span>
              </div>
            </CardContent>
          </Card>

          {/* Local Demo State Management */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-[var(--berry-700)]">
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo State</span>
              </CardTitle>
              <CardDescription>
                Clear local session logs and restore clean default hobby seeds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="danger" size="sm" onClick={handleResetDemoData}>
                Reset Local Demo Storage
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
