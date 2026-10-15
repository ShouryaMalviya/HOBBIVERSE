import { Event } from "@/types";

/**
 * Generates and triggers the download of an iCalendar (.ics) file
 * for an atelier gathering or gentle community meetup.
 */
export function downloadEventIcs(event: Event): void {
  if (typeof window === "undefined") return;

  // Formulate dates in iCal format (UTC representation for demo session)
  // Demo baseline: scheduled for the upcoming session period
  const startStamp = "20261018T180000Z";
  const endStamp = "20261018T190000Z";
  const nowStamp = "20261015T120000Z";

  const description = [
    event.description,
    "",
    `Format: ${event.format === "online" ? "Virtual Atelier Studio Room" : "Local Studio Meetup"}`,
    `Time: ${event.scheduledDate} · ${event.timeLabel}`,
    `Participation Prompt: ${event.participationPrompt}`,
    "",
    "Hosted with gentle encouragement in Hobbiverse Atelier.",
  ]
    .join("\\n")
    .replace(/,/g, "\\,");

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hobbiverse Atelier//Studio Gatherings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:event-${event.id}-${event.slug}@hobbiverse.atelier`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:Hobbiverse: ${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${event.format === "online" ? "Virtual Atelier Studio (Hobbiverse)" : "Atelier Workshop"}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Upcoming Hobbiverse Gathering",
    "TRIGGER:-PT30M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([icsLines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `hobbiverse-${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds a direct web URL to create an event in Google Calendar.
 */
export function getGoogleCalendarUrl(event: Event): string {
  const title = encodeURIComponent(`Hobbiverse: ${event.title}`);
  const details = encodeURIComponent(
    `${event.description}\n\nParticipation Prompt: ${event.participationPrompt}\nFormat: ${
      event.format === "online" ? "Virtual Atelier Studio" : "Local Workshop"
    }\n\nGentle Gathering hosted on Hobbiverse.`
  );
  const location = encodeURIComponent(
    event.format === "online" ? "Virtual Atelier Studio Room" : "Local Studio"
  );
  // Default to demo time window (2026-10-18 18:00 to 19:00 UTC)
  const dates = "20261018T180000Z/20261018T190000Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}
