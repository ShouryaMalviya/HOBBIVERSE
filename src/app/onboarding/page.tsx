"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { SEED_CATEGORIES } from "@/services/seedData";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { demoRepository } from "@/services/repository";
import { CategorySlug, UserPreferences } from "@/types";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 6;

  // State collected across steps
  const [selectedInterests, setSelectedInterests] = React.useState<CategorySlug[]>([
    "art-craft",
    "cooking",
  ]);
  const [preferredPace, setPreferredPace] = React.useState<"gentle" | "steady" | "flexible">("gentle");
  const [availableTimeMinutes, setAvailableTimeMinutes] = React.useState<number>(15);
  const [soloSocialPreference, setSoloSocialPreference] = React.useState<"solo" | "social" | "both">("both");
  const [budgetComfort, setBudgetComfort] = React.useState<"minimal" | "moderate" | "flexible">("minimal");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleInterest = (id: CategorySlug) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const prefs: UserPreferences = {
      interests: selectedInterests.length > 0 ? selectedInterests : ["art-craft", "cooking"],
      availableTimeMinutes,
      preferredPace,
      budgetComfort,
      soloSocialPreference,
      energyPreference: "calm",
    };

    await demoRepository.saveUserPreferences(prefs);
    setIsSubmitting(false);
    router.push("/home");
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] py-8 sm:py-12">
      <PageContainer maxWidth="md" breadcrumbs={[{ label: "Personalized Onboarding" }]}>
        {/* Progress Tracker */}
        <div className="flex flex-col gap-2 mb-2 text-left">
          <div className="flex items-center justify-between text-xs text-[var(--stone-600)]">
            <span className="font-bold uppercase tracking-wider text-[var(--wine-700)]">
              Step {currentStep} of {totalSteps}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-[var(--paper-200)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
            <div
              className="h-full bg-[var(--wine-700)] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Categories of Interest */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                What creative practices spark your curiosity?
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                Select one or more areas. We use these to curate your initial beginner pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEED_CATEGORIES.map((cat) => {
                const isSelected = selectedInterests.includes(cat.id);
                const theme = CATEGORY_THEMES[cat.id];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleInterest(cat.id)}
                    style={{
                      backgroundColor: isSelected ? theme.bgLight : theme.bgSubtle,
                      borderColor: isSelected ? theme.accent : theme.border,
                    }}
                    className="p-4 rounded-[var(--radius-xl)] border text-left flex items-center justify-between transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                  >
                    <div className="flex flex-col">
                      <span style={{ color: theme.textStrong }} className="font-bold text-sm">
                        {cat.name}
                      </span>
                      <span className="text-[11px] opacity-75 mt-0.5" style={{ color: theme.textStrong }}>
                        {theme.colorFamilyName}
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: isSelected ? theme.textStrong : "transparent",
                        borderColor: theme.textStrong,
                      }}
                      className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Preferred Pace */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                What pace feels most restorative to you?
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                Hobbiverse never imposes rigid daily streaks. Choose an encouraging rhythm.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  id: "gentle" as const,
                  title: "Gentle & Low-Pressure",
                  desc: "Take it slow. Zero expectations. Create whenever quiet inspiration strikes.",
                  badge: "Recommended for busy schedules",
                },
                {
                  id: "steady" as const,
                  title: "Steady Creative Rhythm",
                  desc: "A consistent 1 to 2 weekly sessions to build gradual muscle memory.",
                  badge: "Balanced flow",
                },
                {
                  id: "flexible" as const,
                  title: "Spontaneous Explorer",
                  desc: "Follow deep curiosity peaks with hands-on weekend creative sprints.",
                  badge: "Self-guided",
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreferredPace(opt.id)}
                  className={`p-5 rounded-[var(--radius-xl)] border text-left flex items-start justify-between transition-all cursor-pointer ${
                    preferredPace === opt.id
                      ? "bg-[var(--paper-100)] border-[var(--wine-700)] shadow-[var(--shadow-warm)] ring-2 ring-[var(--wine-700)]/15"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--paper-200)]"
                  }`}
                >
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="font-bold text-base text-[var(--wine-950)]">{opt.title}</span>
                    <p className="text-xs text-[var(--ink-700)]">{opt.desc}</p>
                    <span className="text-[10px] text-[var(--forest-700)] font-semibold mt-1">
                      {opt.badge}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      preferredPace === opt.id
                        ? "bg-[var(--wine-800)] border-[var(--wine-800)]"
                        : "border-[var(--sand-400)]"
                    }`}
                  >
                    {preferredPace === opt.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Available Time */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                How much time would you like for a session?
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                Even 15 minutes of uninterrupted focus creates a meaningful break.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { minutes: 15, label: "15 Minutes", sub: "Quick calming break" },
                { minutes: 30, label: "30 Minutes", sub: "Comfortable evening session" },
                { minutes: 45, label: "45+ Minutes", sub: "Deep immersive craft time" },
              ].map((item) => (
                <button
                  key={item.minutes}
                  type="button"
                  onClick={() => setAvailableTimeMinutes(item.minutes)}
                  className={`p-5 rounded-[var(--radius-xl)] border text-left flex flex-col justify-between min-h-[120px] transition-all cursor-pointer ${
                    availableTimeMinutes === item.minutes
                      ? "bg-[var(--brand-soft)] border-[var(--brand-anchor)] shadow-[var(--shadow-warm)]"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--paper-200)]"
                  }`}
                >
                  <Clock className="w-5 h-5 text-[var(--wine-700)]" />
                  <div>
                    <h4 className="font-bold text-base text-[var(--wine-950)]">{item.label}</h4>
                    <p className="text-xs text-[var(--stone-600)] mt-0.5">{item.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Social Style */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                How do you prefer to experience hobbies?
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                Every hobby includes suggestions for both quiet solitude and shared connection.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { id: "solo" as const, title: "Solo Sanctuary", desc: "Private, meditative time alone without social interaction." },
                { id: "social" as const, title: "Kindred Circles", desc: "Sharing process, swap tips, and enjoying gentle peer encouragement." },
                { id: "both" as const, title: "A Bit of Both", desc: "Practice alone most days, but join occasional friendly community challenges." },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSoloSocialPreference(style.id)}
                  className={`p-4 rounded-[var(--radius-xl)] border text-left flex items-center justify-between transition-all cursor-pointer ${
                    soloSocialPreference === style.id
                      ? "bg-[var(--paper-100)] border-[var(--wine-700)] shadow-[var(--shadow-subtle)]"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--paper-200)]"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-[var(--wine-950)]">{style.title}</h4>
                    <p className="text-xs text-[var(--stone-600)] mt-0.5">{style.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      soloSocialPreference === style.id
                        ? "bg-[var(--wine-800)] border-[var(--wine-800)]"
                        : "border-[var(--sand-400)]"
                    }`}
                  >
                    {soloSocialPreference === style.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Budget Comfort */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                What starter budget feels comfortable?
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                We emphasize accessible entry points and household materials before expensive gear.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { id: "minimal" as const, title: "Minimal & Free", desc: "Prefer using household items, found nature flora, and zero required purchases." },
                { id: "moderate" as const, title: "Modest Starter Supplies ($15–$35)", desc: "Happy to invest in a simple watercolor pan, bread flour, or guitar strings." },
                { id: "flexible" as const, title: "Open & Flexible", desc: "Interested in full starter kits and comprehensive craft materials." },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setBudgetComfort(tier.id)}
                  className={`p-4 rounded-[var(--radius-xl)] border text-left flex items-center justify-between transition-all cursor-pointer ${
                    budgetComfort === tier.id
                      ? "bg-[var(--paper-100)] border-[var(--wine-700)] shadow-[var(--shadow-subtle)]"
                      : "bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--paper-200)]"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-[var(--wine-950)]">{tier.title}</h4>
                    <p className="text-xs text-[var(--stone-600)] mt-0.5">{tier.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      budgetComfort === tier.id
                        ? "bg-[var(--wine-800)] border-[var(--wine-800)]"
                        : "border-[var(--sand-400)]"
                    }`}
                  >
                    {budgetComfort === tier.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Review & Finalize */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-6 text-left animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight">
                Your Atelier Preferences are Ready
              </h2>
              <p className="text-sm text-[var(--ink-700)] mt-1.5 leading-relaxed">
                Review your choices. These genuinely shape your personal dashboard and recommendations.
              </p>
            </div>

            <Card variant="editorial">
              <CardContent className="flex flex-col gap-4 pt-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--stone-600)] font-medium">Selected Interests</span>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
                    {selectedInterests.map((catId) => (
                      <Badge key={catId} variant={catId} size="sm">
                        {CATEGORY_THEMES[catId]?.name || catId}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-xs">
                  <span className="text-[var(--stone-600)] font-medium">Session Duration</span>
                  <span className="font-bold text-[var(--ink-950)]">{availableTimeMinutes} minutes</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-xs">
                  <span className="text-[var(--stone-600)] font-medium">Preferred Pace</span>
                  <span className="font-bold text-[var(--forest-700)] capitalize">{preferredPace} rhythm</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-xs">
                  <span className="text-[var(--stone-600)] font-medium">Social Style</span>
                  <span className="font-bold text-[var(--ink-950)] capitalize">{soloSocialPreference}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--stone-600)] font-medium">Starter Budget</span>
                  <span className="font-bold text-[var(--ink-950)] capitalize">{budgetComfort}</span>
                </div>
              </CardContent>
            </Card>

            <div className="p-3.5 rounded-lg bg-[var(--sage-100)] border border-[var(--sage-300)] text-xs text-[var(--forest-700)] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Stored in Demo Mode: your dashboard and &ldquo;next small step&rdquo; are configured.</span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)] mt-6">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(totalSteps)}
              className="text-xs text-[var(--stone-600)] hover:text-[var(--wine-700)] underline cursor-pointer"
            >
              Skip to default recommendations
            </button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleComplete}
              rightIcon={<Check className="w-4 h-4" />}
            >
              Save &amp; Enter My Dashboard
            </Button>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
