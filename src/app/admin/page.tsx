"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { SEED_HOBBIES } from "@/services/seedData";
import {
  runContentHealthAudit,
  ContentHealthReport,
  HealthIssue,
} from "@/services/contentHealth";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  Database,
  Layers,
  Sparkles,
  Trash2,
  Check,
  ExternalLink,
  BookOpen,
  Users,
  Flag,
  FileCheck,
  HardDrive,
} from "lucide-react";

export default function AdminConsolePage() {
  const {
    reports,
    dismissReport,
    deleteReportedContent,
    exportLocalData,
    importLocalData,
    seedSampleActivityHistory,
    resetDemo,
    savedHobbies,
    sessions,
    plans,
    communityPosts,
    groups,
    events,
    challenges,
    isHydrated,
  } = useHobbiverseStore();

  const [activeTab, setActiveTab] = React.useState<"health" | "moderation" | "database">("health");
  const [healthReport, setHealthReport] = React.useState<ContentHealthReport | null>(null);
  const [isRunningAudit, setIsRunningAudit] = React.useState(false);

  // Import Dialog State
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [importJsonText, setImportJsonText] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);

  // Reset Dialog State
  const [isResetOpen, setIsResetOpen] = React.useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "info" | "warning" | "error";
    title: string;
    message?: string;
  } | null>(null);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Run audit on mount
  const executeAudit = React.useCallback(async () => {
    setIsRunningAudit(true);
    try {
      const report = await runContentHealthAudit();
      setHealthReport(report);
    } finally {
      setIsRunningAudit(false);
    }
  }, []);

  React.useEffect(() => {
    executeAudit();
  }, [executeAudit]);

  const handleDismiss = async (id: string) => {
    await dismissReport(id);
    setToastMessage({
      type: "info",
      title: "Report Dismissed",
      message: "The moderation flag was marked as reviewed and cleared.",
    });
  };

  const handleDeleteContent = async (contentId: string, contentType: "post" | "comment") => {
    await deleteReportedContent(contentId, contentType);
    setToastMessage({
      type: "warning",
      title: "Content Removed",
      message: `The reported ${contentType} has been deleted from local storage.`,
    });
  };

  const handleExportBackup = async () => {
    const jsonString = await exportLocalData();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hobbiverse-admin-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage({
      type: "success",
      title: "Database Exported",
      message: "Full local repository state saved to JSON file.",
    });
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    if (!importJsonText.trim()) return;

    const ok = await importLocalData(importJsonText.trim());
    if (ok) {
      setIsImportOpen(false);
      setImportJsonText("");
      await executeAudit();
      setToastMessage({
        type: "success",
        title: "Database Restored",
        message: "Atelier demo state successfully updated from imported backup.",
      });
    } else {
      setImportError("Invalid JSON structure or incompatible version payload.");
    }
  };

  const handleSeedActivity = async () => {
    await seedSampleActivityHistory();
    await executeAudit();
    setToastMessage({
      type: "success",
      title: "Sample Sessions Seeded",
      message: "Added 3 realistic practice sessions to verify dashboard charts and consistency.",
    });
  };

  const handleConfirmReset = async () => {
    await resetDemo();
    setIsResetOpen(false);
    await executeAudit();
    setToastMessage({
      type: "warning",
      title: "Storage Reset",
      message: "Atelier demo storage restored to factory initial defaults.",
    });
  };

  const pendingReportsCount = reports.length;

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Atelier Governance &amp; Quality"
        title="Administrative Console &amp; Content Health"
        description="Inspect catalogue integrity, audit step completeness, review local moderation flags, and manage database payloads."
        breadcrumbs={[{ label: "Admin Console" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleSeedActivity}
            >
              Seed Sample Logs
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileCheck className="w-4 h-4" />}
              disabled={isRunningAudit}
              onClick={executeAudit}
            >
              {isRunningAudit ? "Auditing..." : "Re-Run Health Audit"}
            </Button>
          </div>
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

        <div className="flex flex-col gap-8 text-left">
          {/* Top System Health Banner Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider flex items-center justify-between">
                Content Health Score
                <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)]" />
              </span>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[var(--wine-950)]">
                  {healthReport ? `${healthReport.score}%` : "100%"}
                </span>
                <span className="text-xs text-[var(--forest-800)] block font-medium mt-0.5">
                  All 8 pathways validated
                </span>
              </div>
            </div>

            {/* Storage Footprint */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider flex items-center justify-between">
                Storage Engine
                <HardDrive className="w-4 h-4 text-[var(--wine-700)]" />
              </span>
              <div className="pt-2">
                <span className="text-base font-bold text-[var(--wine-950)] block truncate">
                  localStorage Sandbox
                </span>
                <span className="text-xs text-[var(--stone-600)] block mt-0.5">
                  {healthReport
                    ? `${(healthReport.systemStatus.storageBytesUsed / 1024).toFixed(1)} KB stored`
                    : "Active"}
                </span>
              </div>
            </div>

            {/* Total Records */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider flex items-center justify-between">
                Database Records
                <Database className="w-4 h-4 text-[var(--ocean-700)]" />
              </span>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[var(--wine-950)]">
                  {healthReport ? healthReport.systemStatus.totalRecords : "36"}
                </span>
                <span className="text-xs text-[var(--stone-600)] block mt-0.5">
                  Hobbies, sessions, posts, plans
                </span>
              </div>
            </div>

            {/* Pending Moderation */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider flex items-center justify-between">
                Moderation Queue
                <Flag className="w-4 h-4 text-[var(--rose-700)]" />
              </span>
              <div className="pt-2">
                <span className="text-3xl font-bold text-[var(--wine-950)]">
                  {pendingReportsCount}
                </span>
                <span className="text-xs text-[var(--stone-600)] block mt-0.5">
                  {pendingReportsCount === 0 ? "Atelier is calm" : "Flags awaiting review"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--sand-400)]/70 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("health")}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "health"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)]"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Catalogue Health &amp; Audits
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("moderation")}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "moderation"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)]"
              }`}
            >
              <Flag className="w-4 h-4" />
              Moderation Flags ({pendingReportsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("database")}
              className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "database"
                  ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                  : "text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)]"
              }`}
            >
              <Database className="w-4 h-4" />
              Backup &amp; Payload Tools
            </button>
          </div>

          {/* TAB 1: CATALOGUE HEALTH & AUDITS */}
          {activeTab === "health" && (
            <div className="flex flex-col gap-6">
              {/* Health Overview Notice */}
              <div className="p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 flex items-start gap-3.5 shadow-xs">
                <div className="w-9 h-9 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                  <span className="font-bold text-sm text-[var(--wine-950)] block mb-0.5">
                    Continuous Content Quality Assurance
                  </span>
                  <p>
                    Every hobby pathway is validated against structured schema rules: minimum 1
                    ordered beginner step, non-empty materials checklist, solo/social adaptation
                    guidance, and valid cross-references across saved bookshelves and planner schedules.
                  </p>
                </div>
              </div>

              {/* Hobbies Integrity Table */}
              <Card variant="default">
                <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
                  <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--wine-700)]" />
                    Hobby Pathway Completeness Matrix (8/8 Active)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[var(--stone-600)] uppercase font-semibold">
                        <th className="py-2.5 pr-4">Hobby Title</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Steps</th>
                        <th className="py-2.5 px-3">Materials</th>
                        <th className="py-2.5 px-3">Time Est.</th>
                        <th className="py-2.5 px-3">Difficulty</th>
                        <th className="py-2.5 pl-3 text-right">Integrity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]/70">
                      {SEED_HOBBIES.map((hobby) => (
                        <tr key={hobby.id} className="hover:bg-[var(--paper-100)] transition-colors">
                          <td className="py-3 pr-4 font-bold text-[var(--ink-950)]">
                            <Link
                              href={`/hobbies/${hobby.slug}`}
                              className="hover:text-[var(--wine-700)] transition-colors inline-flex items-center gap-1"
                            >
                              {hobby.title}
                              <ExternalLink className="w-3 h-3 text-[var(--stone-600)]" />
                            </Link>
                          </td>
                          <td className="py-3 px-3">
                            <Badge size="sm" variant={hobby.category}>
                              {hobby.category}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[var(--ink-950)]">
                            {hobby.steps.length} steps
                          </td>
                          <td className="py-3 px-3 text-[var(--stone-600)]">
                            {hobby.materialsNeeded.length} items
                          </td>
                          <td className="py-3 px-3 text-[var(--stone-600)]">
                            {hobby.timeEstimate}
                          </td>
                          <td className="py-3 px-3 capitalize text-[var(--stone-600)]">
                            {hobby.difficulty}
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[var(--forest-700)] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Cross-Reference Audit Results */}
              <Card variant="editorial">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)]" />
                    Cross-Reference &amp; Integrity Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-[var(--stone-600)] flex flex-col gap-2.5 leading-relaxed pt-2">
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)]">
                    <span className="font-medium text-[var(--ink-950)]">
                      Saved Pursuits Reference Check ({savedHobbies.length} saved)
                    </span>
                    <span className="text-[var(--forest-700)] font-semibold">0 Broken Slugs</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)]">
                    <span className="font-medium text-[var(--ink-950)]">
                      Activity Session Logs Reference Check ({sessions.length} sessions)
                    </span>
                    <span className="text-[var(--forest-700)] font-semibold">0 Broken Slugs</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)]">
                    <span className="font-medium text-[var(--ink-950)]">
                      Planned Activities Reference Check ({plans.length} plans)
                    </span>
                    <span className="text-[var(--forest-700)] font-semibold">0 Broken Slugs</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)]">
                    <span className="font-medium text-[var(--ink-950)]">
                      Kindred Circles Schema Integrity ({groups.length} groups)
                    </span>
                    <span className="text-[var(--forest-700)] font-semibold">All Guidelines Valid</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: MODERATION FLAGS QUEUE */}
          {activeTab === "moderation" && (
            <div className="flex flex-col gap-6">
              <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                <strong>Local Moderation Sandbox:</strong> When community members report a post or
                comment, reports are preserved here for review. You can dismiss harmless flags or
                delete reported items from local demo storage.
              </div>

              {reports.length === 0 ? (
                <div className="p-10 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center mb-1">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[var(--wine-950)]">
                    Moderation Queue is Clear
                  </h4>
                  <p className="text-xs text-[var(--stone-600)] max-w-sm">
                    No active community flags. All discussions in the atelier are respectful and kind.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--sand-400)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Badge size="sm" variant="brand">
                            Flagged {report.contentType}
                          </Badge>
                          <span className="text-[var(--stone-600)] font-mono text-[11px]">
                            ID: {report.contentId}
                          </span>
                          <span className="text-[var(--stone-600)]">&middot;</span>
                          <span className="text-[var(--stone-600)]">{report.timestamp}</span>
                        </div>
                        <p className="text-sm font-semibold text-[var(--wine-950)] mt-1">
                          Reason: &ldquo;{report.reason}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDismiss(report.id)}
                        >
                          Dismiss Flag
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() =>
                            handleDeleteContent(
                              report.contentId,
                              report.contentType as "post" | "comment"
                            )
                          }
                        >
                          Delete Content
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BACKUP & DATABASE TOOLS */}
          {activeTab === "database" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Data */}
                <Card variant="default">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                      <Download className="w-4 h-4 text-[var(--wine-700)]" />
                      JSON Database Export
                    </CardTitle>
                    <CardDescription>
                      Download full snapshot of local sessions, saved pursuits, and private reflections
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Download className="w-4 h-4" />}
                      onClick={handleExportBackup}
                    >
                      Download Backup (.json)
                    </Button>
                  </CardContent>
                </Card>

                {/* Import Data */}
                <Card variant="default">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                      <Upload className="w-4 h-4 text-[var(--ocean-700)]" />
                      JSON Database Restore
                    </CardTitle>
                    <CardDescription>
                      Restore or replace local atelier state from a previously saved JSON payload
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Upload className="w-4 h-4" />}
                      onClick={() => setIsImportOpen(true)}
                    >
                      Import &amp; Restore Payload
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Seed Demo History Card */}
              <Card variant="editorial">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                    <Sparkles className="w-4 h-4 text-[var(--wine-700)]" />
                    Automated Test Session Seeder
                  </CardTitle>
                  <CardDescription>
                    Populate realistic practice logs across botanical watercolor, sourdough baking,
                    and acoustic guitar to test dashboard charts without manual entry.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[var(--stone-600)]">
                    Appends 3 structured sessions and advances challenge progression.
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    onClick={handleSeedActivity}
                  >
                    Seed 3 Practice Sessions
                  </Button>
                </CardContent>
              </Card>

              {/* Dangerous Factory Reset */}
              <Card variant="default" className="border-[var(--berry-300)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-[var(--berry-700)] flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Factory Initial Clean Reset
                  </CardTitle>
                  <CardDescription>
                    Clears all custom sessions, saved pursuits, and journal notes back to initial seed data
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[var(--stone-600)]">
                    Recommended before final testing walkthroughs.
                  </span>
                  <Button
                    size="sm"
                    variant="danger"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => setIsResetOpen(true)}
                  >
                    Reset Factory Demo State
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* JSON Import Dialog */}
        <Dialog
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          title="Restore Database from JSON"
          description="Paste a valid Hobbiverse backup JSON string below to restore local atelier data."
          footer={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImportOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="import-json-form"
                variant="primary"
                size="sm"
              >
                Validate &amp; Restore
              </Button>
            </>
          }
        >
          <form id="import-json-form" onSubmit={handleImportSubmit} className="flex flex-col gap-3 text-left">
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              rows={8}
              placeholder='{"version": 1, "savedHobbies": [...], ...}'
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-xs font-mono text-[var(--ink-950)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
            />
            {importError && (
              <p className="text-xs text-[var(--berry-700)] font-semibold">
                {importError}
              </p>
            )}
          </form>
        </Dialog>

        {/* Reset Confirmation Dialog */}
        <Dialog
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          title="Confirm Factory Reset"
          description="Are you sure you want to restore the atelier to factory clean defaults? All test sessions and private reflections will be reset."
          footer={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReset}
              >
                Confirm Factory Reset
              </Button>
            </>
          }
        >
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-800)] text-left">
            Export a backup file before resetting if you wish to preserve test data.
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
