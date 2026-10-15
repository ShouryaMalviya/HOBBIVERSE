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

  return <EventDetailView initialEvent={event} />;
}
