import { demoRepository } from "../src/services/repository";
import { generateCompanionReply } from "../src/services/companionEngine";
import { runContentHealthAudit } from "../src/services/contentHealth";
import { generateEventIcsContent, getGoogleCalendarUrl } from "../src/lib/calendar";

interface JourneyResult {
  journey: string;
  passed: boolean;
  details: string;
  assertionsPassed: number;
}

const results: JourneyResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runJourney1(): Promise<JourneyResult> {
  const name = "Journey 1: Discovery, Filtering, Bookmarking, and Step Progression";
  let assertions = 0;

  // 1. Query hobbies with filters
  const filtered = await demoRepository.getHobbies({
    category: "art-craft",
    maxMinutes: 45,
  });
  assert(filtered.length > 0, "Expected at least 1 art-craft hobby within 45 minutes");
  assertions++;

  const watercolor = filtered.find((h) => h.slug === "botanical-watercolor");
  assert(!!watercolor, "Expected botanical-watercolor in query results");
  assertions++;

  // 2. Bookmark / Save hobby
  const wasSaved = await demoRepository.isHobbySaved(watercolor!.id);
  const newSavedState = await demoRepository.toggleSaveHobby(watercolor!);
  assert(newSavedState !== wasSaved, "Expected toggleSaveHobby to flip saved state");
  assertions++;

  const savedList = await demoRepository.getSavedHobbies();
  assert(
    savedList.some((s) => s.hobbyId === watercolor!.id) === newSavedState,
    "Saved list must reflect new saved state"
  );
  assertions++;

  // 3. Step completion
  const stepId = watercolor!.steps[0].id;
  const initialSteps = await demoRepository.getStepCompletion(watercolor!.id);
  const updatedSteps = await demoRepository.toggleCompleteStep(watercolor!.id, stepId);
  assert(
    updatedSteps.includes(stepId) !== initialSteps.includes(stepId),
    "Toggle step must toggle presence of stepId"
  );
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `Successfully verified discovery filtering, bookmark toggle, and step completion tracking (${filtered.length} matching hobbies inspected).`,
    assertionsPassed: assertions,
  };
}

async function runJourney2(): Promise<JourneyResult> {
  const name = "Journey 2: Activity Session Logging, Non-Shaming Rhythm, and Challenge Progression";
  let assertions = 0;

  // 1. Log activity session
  const initialSessions = await demoRepository.getActivitySessions();
  const initialCount = initialSessions.length;

  const newSession = await demoRepository.logActivitySession({
    hobbyId: "hobby-1",
    hobbySlug: "botanical-watercolor",
    hobbyTitle: "Botanical Watercolor Painting",
    category: "art-craft",
    date: "2026-10-15",
    durationMinutes: 15,
    notes: "Testing automated verification session logging.",
    reflectionMood: "Calm & Centered",
  });
  assert(!!newSession.id, "Session must have an assigned ID");
  assertions++;

  const currentSessions = await demoRepository.getActivitySessions();
  assert(
    currentSessions.length === initialCount + 1,
    `Activity sessions count should increment by 1 (was ${initialCount}, now ${currentSessions.length})`
  );
  assertions++;

  // 2. Challenge progression
  const challenges = await demoRepository.getChallenges();
  assert(challenges.length > 0, "Expected challenges to be present in seed data");
  assertions++;

  const targetChallenge = challenges.find((c) => !c.isCompleted && c.currentSessionsCount < c.targetSessionsCount) || challenges[0];
  const initialProgress = targetChallenge.currentSessionsCount;

  if (!targetChallenge.isJoined) {
    await demoRepository.toggleJoinChallenge(targetChallenge.id);
  }
  const progressed = await demoRepository.progressChallenge(targetChallenge.id);
  assert(!!progressed, "progressChallenge should return updated challenge");
  assert(
    progressed!.currentSessionsCount === initialProgress + 1,
    `Challenge currentSessionsCount should increment by 1 (was ${initialProgress}, now ${progressed?.currentSessionsCount})`
  );
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `Session logged successfully (${newSession.durationMinutes} min), challenge '${targetChallenge.title}' progressed to ${progressed?.currentSessionsCount}/${progressed?.targetSessionsCount} sessions.`,
    assertionsPassed: assertions,
  };
}

async function runJourney3(): Promise<JourneyResult> {
  const name = "Journey 3: Private Journal Isolation & Reflection Integrity";
  let assertions = 0;

  // 1. Create private journal reflection
  const initialEntries = await demoRepository.getJournalEntries();
  const initialCount = initialEntries.length;

  const created = await demoRepository.createJournalEntry({
    hobbySlug: "botanical-watercolor",
    hobbyTitle: "Botanical Watercolor Painting",
    moodLabel: "Restored & Centered",
    content: "Automated test reflection: Client-isolated private space for non-judgmental practice.",
    date: "2026-10-15",
  });

  assert(!!created.id, "Journal entry must have an assigned ID");
  assert(created.isPrivate === true, "Journal entry must strictly have isPrivate === true");
  assertions++;

  const entriesAfterCreate = await demoRepository.getJournalEntries();
  assert(
    entriesAfterCreate.length === initialCount + 1,
    "Journal entries count should increment by 1"
  );
  assertions++;

  // 2. Update journal reflection
  const updated = await demoRepository.updateJournalEntry(created.id, {
    content: "Updated private notes. Remains client-isolated.",
  });
  assert(!!updated && updated.content.includes("Updated private notes"), "Update journal entry failed");
  assert(updated!.isPrivate === true, "Updated journal entry must remain private");
  assertions++;

  // 3. Verify zero leakage to public community posts
  const publicPosts = await demoRepository.getCommunityPosts();
  const leakedInPosts = publicPosts.some((p) => p.content.includes("Automated test reflection"));
  assert(!leakedInPosts, "CRITICAL: Private journal content leaked into public community posts!");
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `Verified private journal isolation (isPrivate=true), note persistence, and zero leakage to public community channels.`,
    assertionsPassed: assertions,
  };
}

async function runJourney4(): Promise<JourneyResult> {
  const name = "Journey 4: Community Discussions, Threaded Comments, Reporting, and Muting";
  let assertions = 0;

  // 1. Create community post
  const newPost = await demoRepository.createCommunityPost({
    authorId: "usr-tester-1",
    authorName: "Atelier Tester",
    authorHandle: "tester_atelier",
    category: "art-craft",
    content: "Sharing an open question about pigment transparency on cold press paper.",
  });
  assert(!!newPost.id, "Community post must have an assigned ID");
  assertions++;

  // 2. Like post
  const liked = await demoRepository.toggleLikePost(newPost.id);
  assert(liked === true, "toggleLikePost should return true");
  assertions++;

  // 3. Add comment
  const comment = await demoRepository.createComment({
    postId: newPost.id,
    authorName: "Quiet Potter",
    authorHandle: "quiet_potter",
    content: "Cold press paper with 300gsm holds washes beautifully without buckling.",
  });
  assert(!!comment.id, "Comment must have an assigned ID");
  assertions++;

  const postComments = await demoRepository.getComments(newPost.id);
  assert(
    postComments.some((c) => c.id === comment.id),
    "Created comment must be retrievable for post"
  );
  assertions++;

  // 4. Mute user
  const initialMuted = await demoRepository.getMutedUsers();
  await demoRepository.toggleMuteUser("troublesome_user");
  const updatedMuted = await demoRepository.getMutedUsers();
  assert(
    updatedMuted.includes("troublesome_user") && !initialMuted.includes("troublesome_user"),
    "Muted users list must include newly muted handle"
  );
  assertions++;

  // 5. File moderation report and dismiss
  const initialReports = await demoRepository.getReports();
  await demoRepository.reportContent({
    contentId: newPost.id,
    contentType: "post",
    reason: "Verification test report entry",
  });
  const afterReport = await demoRepository.getReports();
  assert(afterReport.length === initialReports.length + 1, "Reports list should increment by 1");
  assertions++;

  const reportId = afterReport[0].id;
  await demoRepository.dismissReport(reportId);
  const afterDismiss = await demoRepository.getReports();
  assert(afterDismiss.length === initialReports.length, "Dismissed report should be removed");
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `Verified community post creation, likes, comments, user muting, and moderation report handling.`,
    assertionsPassed: assertions,
  };
}

async function runJourney5(): Promise<JourneyResult> {
  const name = "Journey 5: Studio Gathering RSVP and Calendar (.ics) Formatting";
  let assertions = 0;

  // 1. Fetch events & RSVP
  const events = await demoRepository.getEvents();
  assert(events.length > 0, "Expected events in seed data");
  assertions++;

  const targetEvent = events[0];
  const initialAttendees = targetEvent.participantsCount;
  const initialRsvp = Boolean(targetEvent.isRsvpd);

  const newRsvp = await demoRepository.toggleRsvpEvent(targetEvent.id);
  assert(newRsvp !== initialRsvp, "toggleRsvpEvent must toggle RSVP status");
  assertions++;

  const updatedEvents = await demoRepository.getEvents();
  const refreshed = updatedEvents.find((e) => e.id === targetEvent.id);
  assert(
    refreshed!.participantsCount === (newRsvp ? initialAttendees + 1 : initialAttendees - 1),
    "Participants count must accurately increment or decrement"
  );
  assertions++;

  // 2. Calendar .ics generation
  const ics = generateEventIcsContent(targetEvent);
  assert(ics.includes("BEGIN:VCALENDAR"), "ICS missing BEGIN:VCALENDAR");
  assert(ics.includes("VERSION:2.0"), "ICS missing VERSION:2.0");
  assert(ics.includes("BEGIN:VEVENT"), "ICS missing BEGIN:VEVENT");
  assert(ics.includes(`SUMMARY:Hobbiverse: ${targetEvent.title}`), "ICS missing valid SUMMARY");
  assert(ics.includes("END:VEVENT"), "ICS missing END:VEVENT");
  assert(ics.includes("END:VCALENDAR"), "ICS missing END:VCALENDAR");
  assertions++;

  // 3. Google Calendar URL generation
  const gcalUrl = getGoogleCalendarUrl(targetEvent);
  assert(gcalUrl.startsWith("https://calendar.google.com/calendar/render"), "Invalid Google Calendar URL base");
  assert(gcalUrl.includes(encodeURIComponent(targetEvent.title)), "Google Calendar URL missing encoded title");
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `RSVP toggle verified (participants: ${refreshed?.participantsCount}), valid RFC 5545 iCalendar content emitted, and Google Calendar link constructed.`,
    assertionsPassed: assertions,
  };
}

async function runJourney6(): Promise<JourneyResult> {
  const name = "Journey 6: AI Companion Pacing Suggestions and Content Health Audit Scoring";
  let assertions = 0;

  // 1. AI Companion Pacing Suggestions - Missed days / guilt prompt
  const reply1 = generateCompanionReply("I missed a few days and feel guilty about falling behind.");
  assert(
    reply1.text.toLowerCase().includes("no such thing") || reply1.text.toLowerCase().includes("patiently"),
    "Companion reply should provide non-shaming, compassionate re-entry"
  );
  assert(!!reply1.suggestedMicroStep, "Companion must suggest a concrete 5-minute micro-step");
  assertions++;

  // Low energy / tired prompt
  const reply2 = generateCompanionReply("I am really tired this evening, what can I do in 5 minutes?");
  assert(
    reply2.category === "mindful" || reply2.category === "reading-writing" || !!reply2.suggestedMicroStep,
    "Companion should adapt to low energy with calm micro-step"
  );
  assertions++;

  // 2. Content Health Audit
  const audit = await runContentHealthAudit();
  assert(audit.score >= 95, `Expected content health score >= 95, got ${audit.score}`);
  assert(audit.totalHobbies >= 8, `Expected at least 8 hobbies, got ${audit.totalHobbies}`);
  assert(audit.totalSteps >= 12, `Expected at least 12 steps, got ${audit.totalSteps}`);
  assert(audit.systemStatus.isHealthy === true, "Expected systemStatus.isHealthy to be true");
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `AI companion pacing verified with non-shaming guidance; Content Health audit score: ${audit.score}/100 across ${audit.totalHobbies} hobbies and ${audit.totalSteps} steps (0 critical errors).`,
    assertionsPassed: assertions,
  };
}

async function runJourney7(): Promise<JourneyResult> {
  const name = "Journey 7: Full JSON Database Export, Import Validation, and Factory Reset";
  let assertions = 0;

  // 1. Export current repository state
  const exported = await demoRepository.exportLocalData();
  assert(typeof exported === "string" && exported.length > 100, "Export data must return non-empty JSON string");
  const parsed = JSON.parse(exported);
  assert(parsed.version === 1, "Exported JSON must contain version 1");
  assert(Array.isArray(parsed.savedHobbies), "Exported JSON must contain savedHobbies array");
  assert(Array.isArray(parsed.activitySessions), "Exported JSON must contain activitySessions array");
  assertions++;

  // 2. Make a deliberate change
  const sessionBefore = (await demoRepository.getActivitySessions()).length;
  await demoRepository.logActivitySession({
    hobbyId: "hobby-export-test",
    hobbySlug: "botanical-watercolor",
    hobbyTitle: "Botanical Watercolor Painting",
    category: "art-craft",
    date: "2026-10-16",
    durationMinutes: 10,
    notes: "Session created specifically to test backup restoration.",
    reflectionMood: "Delightful",
  });
  const sessionAfterMod = (await demoRepository.getActivitySessions()).length;
  assert(sessionAfterMod === sessionBefore + 1, "Session count should increment before import test");
  assertions++;

  // 3. Import previous backup
  const importSuccess = await demoRepository.importLocalData(exported);
  assert(importSuccess === true, "importLocalData should return true for valid backup");
  const sessionAfterImport = (await demoRepository.getActivitySessions()).length;
  assert(sessionAfterImport === sessionBefore, "Importing previous backup should restore previous session count");
  assertions++;

  // 4. Test invalid backup rejection
  const invalidImport = await demoRepository.importLocalData('{"invalid": true}');
  assert(invalidImport === false, "importLocalData must reject JSON missing version: 1");
  assertions++;

  // 5. Factory reset
  await demoRepository.resetDemoData();
  const resetSessions = await demoRepository.getActivitySessions();
  assert(resetSessions.length >= 3, "Factory reset should restore clean initial seed sessions");
  assertions++;

  return {
    journey: name,
    passed: true,
    details: `Verified complete JSON backup export (${exported.length} bytes), mutation recovery via import, invalid payload rejection, and clean factory reset.`,
    assertionsPassed: assertions,
  };
}

async function main() {
  console.log("==================================================================");
  console.log("HOBBIVERSE: AUTOMATED VERIFICATION OF 7 CORE USER JOURNEYS (PART 17)");
  console.log("==================================================================\n");

  const journeys = [
    runJourney1,
    runJourney2,
    runJourney3,
    runJourney4,
    runJourney5,
    runJourney6,
    runJourney7,
  ];

  let totalAssertions = 0;

  for (let i = 0; i < journeys.length; i++) {
    const fn = journeys[i];
    try {
      const res = await fn();
      results.push(res);
      totalAssertions += res.assertionsPassed;
      console.log(`[PASS] ${res.journey}`);
      console.log(`       Assertions Passed: ${res.assertionsPassed}`);
      console.log(`       Details: ${res.details}\n`);
    } catch (err: any) {
      console.error(`[FAIL] Journey ${i + 1} Error:`, err.message);
      results.push({
        journey: `Journey ${i + 1}`,
        passed: false,
        details: err.message,
        assertionsPassed: 0,
      });
      process.exit(1);
    }
  }

  const allPassed = results.every((r) => r.passed);
  console.log("------------------------------------------------------------------");
  console.log(`SUMMARY: ${results.filter((r) => r.passed).length}/${results.length} Journeys Passed (${totalAssertions} Total Assertions Passed)`);
  console.log("------------------------------------------------------------------");

  if (!allPassed) {
    console.error("FAILED: One or more journeys failed verification.");
    process.exit(1);
  } else {
    console.log("SUCCESS: All 7 core user journeys verified cleanly and reliably.");
  }
}

main().catch((err) => {
  console.error("Unhandled verification exception:", err);
  process.exit(1);
});
