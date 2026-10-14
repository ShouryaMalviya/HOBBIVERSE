import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SEED_GROUPS } from "@/services/seedData";
import { GroupDetailView } from "./GroupDetailView";

export function generateStaticParams() {
  return SEED_GROUPS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = SEED_GROUPS.find((g) => g.slug === slug);

  if (!group) {
    return {
      title: "Circle Not Found | Hobbiverse Atelier",
      description: "The requested kindred circle could not be found.",
    };
  }

  return {
    title: `${group.name} | Kindred Circles | Hobbiverse`,
    description: group.description,
  };
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = SEED_GROUPS.find((g) => g.slug === slug);

  if (!group) {
    notFound();
  }

  return <GroupDetailView initialGroup={group} />;
}
