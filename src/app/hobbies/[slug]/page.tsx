import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SEED_HOBBIES } from "@/services/seedData";
import { HobbyDetailView } from "./HobbyDetailView";

export function generateStaticParams() {
  return SEED_HOBBIES.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hobby = SEED_HOBBIES.find((h) => h.slug === slug);

  if (!hobby) {
    return {
      title: "Hobby Not Found | Hobbiverse Atelier",
      description: "The requested hobby pathway could not be found in our atelier collection.",
    };
  }

  return {
    title: `${hobby.title} | Beginner Learning Path | Hobbiverse`,
    description: hobby.summary,
  };
}

export default async function HobbyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hobby = SEED_HOBBIES.find((h) => h.slug === slug);

  if (!hobby) {
    notFound();
  }

  // Related hobbies: matching category or tags, excluding current
  const relatedHobbies = SEED_HOBBIES.filter(
    (h) =>
      h.slug !== hobby.slug &&
      (h.category === hobby.category || h.tags.some((t) => hobby.tags.includes(t)))
  ).slice(0, 3);

  return <HobbyDetailView hobby={hobby} relatedHobbies={relatedHobbies} />;
}
