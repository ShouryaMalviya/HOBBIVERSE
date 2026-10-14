"use client";

import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import { SEED_HOBBIES } from "@/services/seedData";
import { JournalEntry } from "@/types";
import {
  Lock,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
  Check,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

const GENTLE_PROMPTS = [
  "What texture, color, or sound caught your attention today?",
  "Did you notice any moment where your mind felt calm and absorbed?",
  "What small physical discovery surprised your hands during this craft?",
  "How did stepping away from screens and digital noise feel?",
  "What is one gentle intention you have for your next quiet practice?",
];

const SUPPORTIVE_MOODS = [
  "Calm & Centered",
  "Grounded",
  "Quiet Wonder",
  "Curious Focus",
  "Restorative",
  "Joyful",
  "Patient",
];

export default function JournalPage() {
  const { isDemo } = useAuth();
  const {
    journalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  } = useHobbiverseStore();

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Modal: Create or Edit Entry
  const [isEntryModalOpen, setIsEntryModalOpen] = React.useState(false);
  const [editingEntryId, setEditingEntryId] = React.useState<string | null>(null);
  const [entryTitle, setEntryTitle] = React.useState<string>("");
  const [entryContent, setEntryContent] = React.useState<string>("");
  const [entryMood, setEntryMood] = React.useState<string>("Calm & Centered");
  const [entryHobbySlug, setEntryHobbySlug] = React.useState<string>("none");
  const [entryDate, setEntryDate] = React.useState<string>("");
  const [entryError, setEntryError] = React.useState<string | null>(null);

  // Modal: Delete Confirmation
  const [deletingEntryId, setDeletingEntryId] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Create Modal
  const handleOpenCreateModal = (suggestedPrompt?: string) => {
    setEditingEntryId(null);
    setEntryTitle("");
    setEntryContent(suggestedPrompt ? `Prompt: ${suggestedPrompt}\n\n` : "");
    setEntryMood("Calm & Centered");
    setEntryHobbySlug("none");
    setEntryDate(new Date().toISOString().split("T")[0]);
    setEntryError(null);
    setIsEntryModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setEntryTitle(entry.title || "");
    setEntryContent(entry.content);
    setEntryMood(entry.moodLabel || "Calm & Centered");
    setEntryHobbySlug(entry.hobbySlug || "none");
    setEntryDate(entry.date);
    setEntryError(null);
    setIsEntryModalOpen(true);
  };

  // Save Entry (Create or Update)
  const handleSaveEntry = async () => {
    if (!entryContent.trim()) {
      setEntryError("Please write a few thoughts or observations before saving.");
      return;
    }

    const matchedHobby = SEED_HOBBIES.find((h) => h.slug === entryHobbySlug);
    const finalDate = entryDate || new Date().toISOString().split("T")[0];

    if (editingEntryId) {
      await updateJournalEntry(editingEntryId, {
        title: entryTitle.trim() || undefined,
        content: entryContent.trim(),
        date: finalDate,
        moodLabel: entryMood,
        hobbySlug: matchedHobby ? matchedHobby.slug : undefined,
        hobbyTitle: matchedHobby ? matchedHobby.title : undefined,
      });
      triggerToast("Reflection updated in your private sanctuary.");
    } else {
      await createJournalEntry({
        title: entryTitle.trim() || undefined,
        content: entryContent.trim(),
        date: finalDate,
        moodLabel: entryMood,
        hobbySlug: matchedHobby ? matchedHobby.slug : undefined,
        hobbyTitle: matchedHobby ? matchedHobby.title : undefined,
      });
      triggerToast("Private reflection recorded in your journal.");
    }

    setIsEntryModalOpen(false);
  };

  // Confirm Delete Entry
  const handleConfirmDelete = async () => {
    if (!deletingEntryId) return;
    await deleteJournalEntry(deletingEntryId);
    setDeletingEntryId(null);
    triggerToast("Reflection deleted from your private journal.");
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Private Sanctuary"
        title="Personal Reflection &amp; Craft Journal"
        description="A quiet, encrypted sanctuary to record how creative activities feel. Strictly private by design."
        breadcrumbs={[{ label: "Journal" }]}
        badge={
          <Badge variant="reading-writing" dot size="sm">
            Confidential &middot; Device Only
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenCreateModal()}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Private Reflection
          </Button>
        }
      >
        <div className="flex flex-col gap-8 text-left max-w-5xl">
          {/* Toast Notification Alert */}
          {toastMessage && (
            <div
              role="alert"
              className="flex items-center justify-between p-3.5 rounded-[var(--radius-lg)] bg-[var(--forest-100)] border border-[var(--sage-300)] text-[var(--forest-900)] text-sm animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-xs text-[var(--forest-700)] underline hover:text-[var(--forest-900)] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* EXPLICIT PRIVACY & LOCAL-DEMO GUARANTEE */}
          <div className="p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex items-start gap-3.5 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)] shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 text-xs text-[var(--ink-800)] leading-relaxed">
              <span className="font-bold text-sm text-[var(--wine-950)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
                Private Sanctuary Guarantee
              </span>
              <p>
                {isDemo
                  ? "Your journal is stored exclusively in your local browser sandbox. Text written here is strictly private and is never transmitted to cloud servers, community feeds, or public profiles."
                  : "Private thoughts are client-encrypted. Reflections are reserved for your personal contemplation."}
              </p>
              <span className="text-[11px] text-[var(--stone-600)] mt-0.5">
                Hobbiverse is not a diagnostic or clinical tool. This space is offered solely for creative reflection and personal presence.
              </span>
            </div>
          </div>

          {/* GENTLE INSPIRATION PROMPTS */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-200)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--wine-950)]">
              <Lightbulb className="w-4 h-4 text-[var(--wine-700)]" />
              <span>Gentle Inquiries (Click to start with a prompt):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {GENTLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOpenCreateModal(prompt)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--paper-100)] border border-[var(--sand-400)] hover:border-[var(--wine-700)]/50 text-xs text-[var(--ink-900)] hover:text-[var(--wine-800)] transition-colors text-left cursor-pointer shadow-2xs"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* MAIN JOURNAL ENTRIES LIST */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <h3 className="text-xl font-bold text-[var(--wine-950)]">
                Recorded Reflections
              </h3>
              <span className="text-xs text-[var(--stone-600)]">
                {journalEntries.length} {journalEntries.length === 1 ? "entry" : "entries"} in your sanctuary
              </span>
            </div>

            {journalEntries.length === 0 ? (
              <Card variant="editorial" className="p-8 sm:p-12 text-center text-left">
                <div className="max-w-md mx-auto flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--wine-950)]">
                    Your Private Sanctuary Awaits
                  </h4>
                  <p className="text-xs text-[var(--stone-600)] leading-relaxed">
                    You haven&apos;t written any reflections yet. Writing is completely optional — take a moment whenever your hands or thoughts need quiet grounding.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenCreateModal()}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Write First Reflection
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/80 hover:border-[var(--wine-700)]/40 transition-all shadow-[var(--shadow-subtle)] flex flex-col justify-between text-left"
                  >
                    <div>
                      {/* Meta Header */}
                      <div className="flex items-center justify-between text-xs text-[var(--stone-600)] mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--stone-700)]">
                            {entry.date}
                          </span>
                          {entry.moodLabel && (
                            <Badge size="sm" variant="mindful">
                              {entry.moodLabel}
                            </Badge>
                          )}
                        </div>

                        {/* Edit & Delete Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(entry)}
                            aria-label="Edit reflection"
                            title="Edit entry"
                            className="p-1 rounded-md text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-300)] transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingEntryId(entry.id)}
                            aria-label="Delete reflection"
                            title="Delete entry"
                            className="p-1 rounded-md text-[var(--stone-600)] hover:text-[var(--wine-700)] hover:bg-[var(--paper-300)] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title if present */}
                      {entry.title && (
                        <h4 className="font-bold text-base text-[var(--wine-950)] mb-2">
                          {entry.title}
                        </h4>
                      )}

                      {/* Content Quote */}
                      <blockquote className="text-sm italic font-serif text-[var(--ink-950)] leading-relaxed mb-4 whitespace-pre-line">
                        &ldquo;{entry.content}&rdquo;
                      </blockquote>
                    </div>

                    {/* Footer: Hobby Association & Privacy Icon */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
                      {entry.hobbyTitle ? (
                        <span className="font-semibold text-[var(--wine-700)] flex items-center gap-1 truncate">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{entry.hobbyTitle}</span>
                        </span>
                      ) : (
                        <span className="text-[var(--stone-500)] italic">
                          Quiet mindfulness
                        </span>
                      )}

                      <span className="text-[11px] text-[var(--stone-500)] flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL: CREATE OR EDIT JOURNAL ENTRY */}
        <Dialog
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          title={editingEntryId ? "Edit Private Reflection" : "Record a Quiet Reflection"}
          description="Strictly confidential to your local device. Share whatever your mind or hands felt."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsEntryModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEntry}>
                {editingEntryId ? "Update Reflection" : "Save to Sanctuary"}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 text-left py-2">
            {entryError && (
              <div className="p-3 rounded-lg bg-[var(--wine-100)] border border-[var(--wine-300)] text-xs text-[var(--wine-900)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--wine-700)] shrink-0" />
                <span>{entryError}</span>
              </div>
            )}

            {/* Title (Optional) */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1">
                Reflection Title (Optional)
              </label>
              <input
                type="text"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                placeholder="e.g. Lavender wash study, Sourdough aroma..."
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)]"
              />
            </div>

            {/* Associated Hobby */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1">
                Related Craft or Activity (Optional)
              </label>
              <select
                value={entryHobbySlug}
                onChange={(e) => setEntryHobbySlug(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="none">General Creative Reflection</option>
                {SEED_HOBBIES.map((h) => (
                  <option key={h.id} value={h.slug}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1">
                Date
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)]"
              />
            </div>

            {/* Mood Feeling Selector */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Supportive Mood Feeling
              </label>
              <div className="flex flex-wrap gap-2">
                {SUPPORTIVE_MOODS.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setEntryMood(mood)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      entryMood === mood
                        ? "bg-[var(--sage-200)] text-[var(--forest-900)] border border-[var(--forest-700)] font-bold"
                        : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)] border border-transparent"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Text */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1">
                What did your hands or senses experience?
              </label>
              <textarea
                value={entryContent}
                onChange={(e) => {
                  setEntryContent(e.target.value);
                  setEntryError(null);
                }}
                placeholder="Take your time. What surprised you? Was there quiet delight in the repetition? No need for polished writing..."
                rows={5}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] resize-none"
              />
            </div>
          </div>
        </Dialog>

        {/* MODAL: DELETE CONFIRMATION */}
        <Dialog
          isOpen={Boolean(deletingEntryId)}
          onClose={() => setDeletingEntryId(null)}
          title="Delete Private Reflection"
          description="Are you sure you want to permanently delete this journal entry from your device?"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setDeletingEntryId(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmDelete}>
                Yes, Delete Permanently
              </Button>
            </div>
          }
        >
          <div className="py-2 text-xs text-[var(--ink-800)] leading-relaxed">
            This action deletes the entry from your browser storage sandbox. This cannot be undone.
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
