import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SEED_EVENTS } from "@/services/seedData";
import { EventDetailView } from "./EventDetailView";

export function generateStaticParams() {
  return SEED_EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = SEED_EVENTS.find((e) => e.slug === slug);

  if (!event) {
    return {
      title: "Event Not Found | Hobbiverse Atelier",
      description: "The requested gathering could not be found in our studio schedule.",
    };
  }

  return {
    title: `${event.title} | Studio Gatherings | Hobbiverse`,
    description: event.description,
    openGraph: {
      title: `${event.title} | Hobbiverse Studio Gatherings`,
      description: event.description,
      type: "article",
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = SEED_EVENTS.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: "2026-10-18T18:00:00Z",
    endDate: "2026-10-18T19:00:00Z",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      event.format === "online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    location:
      event.format === "online"
        ? {
            "@type": "VirtualLocation",
            url: `https://hobbiverse.atelier/events/${event.slug}`,
          }
        : {
            "@type": "Place",
            name: "Hobbiverse Atelier Workshop",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Community Studio",
            },
          },
    organizer: {
      "@type": "Organization",
      name: "Hobbiverse Atelier",
      url: "https://hobbiverse.atelier",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <EventDetailView initialEvent={event} />
    </>
  );
}
