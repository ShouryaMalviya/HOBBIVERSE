import { SEED_HOBBIES, SEED_GROUPS, SEED_EVENTS, SEED_CHALLENGES } from "./seedData";
import { demoRepository } from "./repository";

export interface HealthIssue {
  severity: "info" | "warning" | "error";
  category: "hobby" | "step" | "reference" | "storage";
  entityTitle: string;
  message: string;
}

export interface ContentHealthReport {
  score: number; // 0 to 100
  totalHobbies: number;
  totalSteps: number;
  totalGroups: number;
  totalEvents: number;
  totalChallenges: number;
  issues: HealthIssue[];
  systemStatus: {
    storageEngine: "localStorage Demo Sandbox" | "Supabase Remote DB";
    storageBytesUsed: number;
    totalRecords: number;
    isHealthy: boolean;
  };
}

export async function runContentHealthAudit(): Promise<ContentHealthReport> {
  const issues: HealthIssue[] = [];

  const hobbies = await demoRepository.getHobbies();
  const savedHobbies = await demoRepository.getSavedHobbies();
  const sessions = await demoRepository.getActivitySessions();
  const plans = await demoRepository.getPlannedActivities();
  const posts = await demoRepository.getCommunityPosts();
  const groups = await demoRepository.getGroups();
  const events = await demoRepository.getEvents();
  const challenges = await demoRepository.getChallenges();

  let totalSteps = 0;
  let validHobbies = 0;

  // 1. Audit Hobbies
  for (const h of hobbies) {
    let hobbyHasErrors = false;

    if (!h.title || !h.slug || !h.summary || !h.description) {
      issues.push({
        severity: "error",
        category: "hobby",
        entityTitle: h.title || h.slug || "Unknown Hobby",
        message: "Missing core metadata fields (title, slug, summary, or description).",
      });
      hobbyHasErrors = true;
    }

    if (!h.materialsNeeded || h.materialsNeeded.length === 0) {
      issues.push({
        severity: "warning",
        category: "hobby",
        entityTitle: h.title,
        message: "Materials checklist is empty.",
      });
    }

    if (!h.skillsPracticed || h.skillsPracticed.length === 0) {
      issues.push({
        severity: "info",
        category: "hobby",
        entityTitle: h.title,
        message: "No skills practiced listed.",
      });
    }

    if (!h.waysToAdapt?.solo || !h.waysToAdapt?.social) {
      issues.push({
        severity: "warning",
        category: "hobby",
        entityTitle: h.title,
        message: "Incomplete solo or social adaptation guidance.",
      });
    }

    if (!h.steps || h.steps.length === 0) {
      issues.push({
        severity: "error",
        category: "step",
        entityTitle: h.title,
        message: "Hobby has zero structured beginner steps.",
      });
      hobbyHasErrors = true;
    } else {
      totalSteps += h.steps.length;
      h.steps.forEach((st, idx) => {
        if (!st.title || !st.instructions || st.instructions.length === 0) {
          issues.push({
            severity: "error",
            category: "step",
            entityTitle: `${h.title} (Step ${idx + 1})`,
            message: "Step is missing title or step-by-step instructions.",
          });
          hobbyHasErrors = true;
        }
      });
    }

    if (!hobbyHasErrors) {
      validHobbies += 1;
    }
  }

  // 2. Audit Cross-References
  const hobbySlugs = new Set(hobbies.map((h) => h.slug));

  savedHobbies.forEach((sh) => {
    if (!hobbySlugs.has(sh.hobbySlug)) {
      issues.push({
        severity: "warning",
        category: "reference",
        entityTitle: `Saved Hobby: ${sh.hobbyTitle}`,
        message: `Referenced hobby slug "${sh.hobbySlug}" does not exist in active catalogue.`,
      });
    }
  });

  sessions.forEach((s) => {
    if (!hobbySlugs.has(s.hobbySlug)) {
      issues.push({
        severity: "info",
        category: "reference",
        entityTitle: `Session: ${s.hobbyTitle}`,
        message: `Session references hobby slug "${s.hobbySlug}" which is not currently featured.`,
      });
    }
  });

  plans.forEach((p) => {
    if (!hobbySlugs.has(p.hobbySlug)) {
      issues.push({
        severity: "warning",
        category: "reference",
        entityTitle: `Plan: ${p.hobbyTitle}`,
        message: `Planned activity references unmatched hobby slug "${p.hobbySlug}".`,
      });
    }
  });

  // Calculate storage size in localStorage
  let storageBytes = 0;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("hobbiverse_demo_state_v1") || "";
      storageBytes = new Blob([raw]).size;
    } catch {
      storageBytes = 0;
    }
  }

  const totalRecords =
    hobbies.length +
    savedHobbies.length +
    sessions.length +
    plans.length +
    posts.length +
    groups.length +
    events.length +
    challenges.length;

  // Calculate Health Score (100 minus errors * 10, warnings * 3)
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, Math.min(100, 100 - errorCount * 12 - warningCount * 3));

  return {
    score,
    totalHobbies: hobbies.length,
    totalSteps,
    totalGroups: groups.length,
    totalEvents: events.length,
    totalChallenges: challenges.length,
    issues,
    systemStatus: {
      storageEngine: "localStorage Demo Sandbox",
      storageBytesUsed: storageBytes,
      totalRecords,
      isHealthy: errorCount === 0,
    },
  };
}
