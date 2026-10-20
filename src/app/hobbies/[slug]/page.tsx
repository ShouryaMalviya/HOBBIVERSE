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
    openGraph: {
      title: `${hobby.title} | Hobbiverse Atelier`,
      description: hobby.summary,
      type: "article",
    },
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

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: hobby.title,
    description: hobby.description,
    totalTime: `PT${hobby.estimatedMinutes}M`,
    supply: hobby.materialsNeeded.map((m) => ({
      "@type": "HowToSupply",
      name: m,
    })),
    step: hobby.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.description,
      itemListElement: s.instructions.map((inst, i) => ({
        "@type": "HowToDirection",
        position: i + 1,
        text: inst,
      })),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <HobbyDetailView hobby={hobby} relatedHobbies={relatedHobbies} />
    </>
  );
}
