"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import {
  CompanionMessage,
  INITIAL_COMPANION_MESSAGES,
  generateCompanionReply,
} from "@/services/companionEngine";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Copy,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  Check,
  Feather,
  Clock,
  HeartHandshake,
} from "lucide-react";

const SUGGESTION_PROMPTS = [
  "I have 15 quiet minutes tonight—what should I try?",
  "I fell off my practice and feel guilty. How do I gently restart?",
  "Suggest a calming hands-on hobby that rests my eyes from screens.",
  "How can I try sourdough baking without expensive equipment?",
  "What is an easy acoustic music practice for a complete beginner?",
  "Suggest a low-cost outdoor nature hobby for this weekend.",
];

const COMPANION_STORAGE_KEY = "hobbiverse_companion_chat_v1";

export default function CompanionPage() {
  const { user } = useAuth();
  const { createJournalEntry, savedHobbies } = useHobbiverseStore();

  const [messages, setMessages] = React.useState<CompanionMessage[]>(INITIAL_COMPANION_MESSAGES);
  const [inputText, setInputText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "info" | "warning";
    title: string;
    message?: string;
  } | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load chat history from localStorage safely on client mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(COMPANION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore parse errors, fallback to default
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = (newMessages: CompanionMessage[]) => {
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(newMessages));
    } catch {
      // Storage unavailable or full
    }
  };

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: CompanionMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    saveChatHistory(updated);
    setInputText("");
    setIsTyping(true);

    // Simulate thoughtful companion reflection delay (600ms)
    setTimeout(() => {
      const replyData = generateCompanionReply(text, {
        savedHobbySlugs: savedHobbies.map((h) => h.hobbySlug),
      });

      const companionMsg: CompanionMessage = {
        ...replyData,
        id: `msg-companion-${Date.now()}`,
        timestamp: "Just now",
      };

      const finalMessages = [...updated, companionMsg];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      setIsTyping(false);
    }, 650);
  };

  const handleSaveToJournal = async (msg: CompanionMessage) => {
    if (!msg.suggestedHobbyTitle && !msg.text) return;

    const todayStr = new Date().toISOString().split("T")[0];
    const journalTitle = msg.suggestedHobbyTitle
      ? `Companion Note: ${msg.suggestedHobbyTitle}`
      : "Atelier Companion Insight";

    const content = `${msg.text}\n\nRecommended First Step:\n${
      msg.suggestedMicroStep || "Start with 5 quiet minutes of observational practice."
    }`;

    await createJournalEntry({
      title: journalTitle,
      content,
      date: todayStr,
      moodLabel: "Inspired & Gentle",
      hobbySlug: msg.suggestedHobbySlug,
      hobbyTitle: msg.suggestedHobbyTitle,
    });

    setToastMessage({
      type: "success",
      title: "Saved to Private Journal",
      message: "This companion recommendation was added to your private reflections.",
    });
  };

  const handleCopyText = (id: string, text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      setToastMessage({
        type: "info",
        title: "Copied to Clipboard",
        message: "Companion suggestion copied.",
      });
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_COMPANION_MESSAGES);
    try {
      localStorage.removeItem(COMPANION_STORAGE_KEY);
    } catch {}
    setToastMessage({
      type: "info",
      title: "Conversation Reset",
      message: "Your companion chat has been refreshed.",
    });
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Gentle Discovery &amp; Guidance"
        title="Atelier Hobby Companion"
        description="Thoughtful, non-clinical conversational assistance to help break hobbies into 5-minute steps, adapt practices to low energy, and overcome beginner paralysis."
        breadcrumbs={[{ label: "Companion" }]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetChat}
          >
            Reset Conversation
          </Button>
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

        <div className="max-w-4xl mx-auto flex flex-col gap-6 text-left">
          {/* Non-Diagnostic Clinical Boundaries Banner */}
          <div className="p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 flex items-start gap-3.5 shadow-[var(--shadow-subtle)]">
            <div className="w-9 h-9 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex-1 text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-[var(--wine-950)] text-sm sm:text-base">
                  Recreational Creative Guidance Only
                </span>
                <Badge size="sm" variant="brand">
                  Non-Clinical
                </Badge>
              </div>
              <p>
                The Atelier Companion is a creative sounding board designed to suggest beginner
                hobby steps, adapt supplies, and normalize pacing. It does not provide medical,
                psychiatric, diagnostic, or therapeutic counseling. Conversations remain client-side
                in your browser sandbox.
              </p>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--wine-700)]" />
              Gentle Pacing Starters
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTION_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  className="px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] text-xs text-[var(--ink-800)] hover:text-[var(--wine-950)] hover:bg-[var(--paper-100)] transition-all cursor-pointer shadow-xs disabled:opacity-50 text-left"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="p-4 sm:p-6 rounded-[var(--radius-2xl)] bg-[var(--paper-50)] border border-[var(--sand-400)] shadow-[var(--shadow-warm)] flex flex-col gap-5 min-h-[420px] max-h-[640px] overflow-y-auto">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "flex-row-reverse self-end max-w-xl" : "self-start max-w-2xl"
                  }`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {isUser ? (
                      <Avatar name={user?.displayName || "Elena Rostova"} size="sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--wine-900)] text-[var(--paper-50)] flex items-center justify-center shadow-xs">
                        <Feather className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col gap-2 p-4 sm:p-5 rounded-[var(--radius-xl)] text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? "bg-[var(--wine-900)] text-[var(--paper-50)] rounded-tr-xs"
                        : "bg-[var(--bg-surface)] text-[var(--ink-950)] border border-[var(--border-subtle)] rounded-tl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs opacity-75 mb-0.5">
                      <span className="font-semibold">
                        {isUser ? user?.displayName || "You" : "Atelier Companion"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Companion Suggested Hobby & Micro-Step Card */}
                    {!isUser && msg.suggestedHobbyTitle && (
                      <div className="mt-3 p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 flex flex-col gap-2.5 text-xs text-[var(--ink-950)]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-[var(--wine-950)]">
                            {msg.suggestedHobbyTitle}
                          </span>
                          {msg.category && (
                            <Badge size="sm" variant={msg.category}>
                              Pathway
                            </Badge>
                          )}
                        </div>

                        {msg.suggestedMicroStep && (
                          <div className="flex items-start gap-2 bg-[var(--bg-surface)] p-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
                            <Sparkles className="w-3.5 h-3.5 text-[var(--wine-700)] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block text-[var(--wine-950)]">
                                5-Minute Micro-Step:
                              </span>
                              <span className="text-[var(--stone-600)]">
                                {msg.suggestedMicroStep}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]">
                          <button
                            type="button"
                            onClick={() => handleSaveToJournal(msg)}
                            className="text-xs font-semibold text-[var(--wine-700)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Save to Private Journal
                          </button>

                          {msg.suggestedHobbySlug && (
                            <Link
                              href={`/hobbies/${msg.suggestedHobbySlug}`}
                              className="text-xs font-semibold text-[var(--wine-950)] hover:text-[var(--wine-700)] inline-flex items-center gap-1"
                            >
                              View Learning Path <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Copy action on companion bubble */}
                    {!isUser && (
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="text-[11px] text-[var(--stone-600)] hover:text-[var(--ink-950)] inline-flex items-center gap-1 transition-colors cursor-pointer"
                          aria-label="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[var(--forest-700)]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy advice</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3 self-start">
                <div className="w-8 h-8 rounded-full bg-[var(--wine-900)] text-[var(--paper-50)] flex items-center justify-center shrink-0 shadow-xs">
                  <Feather className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--stone-600)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--wine-700)] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--wine-700)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--wine-700)] animate-bounce [animation-delay:0.4s]" />
                  <span className="font-serif italic ml-1">Reflecting in the atelier...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--sand-400)] shadow-[var(--shadow-warm)] flex items-center gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about beginner steps, supply swaps, or low-energy hobbies..."
              aria-label="Ask the atelier companion"
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 rounded-[var(--radius-lg)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              disabled={isTyping || !inputText.trim()}
            >
              Ask Companion
            </Button>
          </form>

          {/* Supportive Footer Note */}
          <div className="text-center text-xs text-[var(--stone-600)] flex items-center justify-center gap-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[var(--wine-700)]" />
            <span>
              Take whatever suits you and leave the rest. The atelier is a space to explore, not perform.
            </span>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
