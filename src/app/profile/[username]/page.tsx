import * as React from "react";
import { Metadata } from "next";
import { demoRepository } from "@/services/repository";
import { ProfileView } from "./ProfileView";

export function generateStaticParams() {
  return [
    { username: "demo-user" },
    { username: "clara" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await demoRepository.getUserByUsername(username);

  const displayName = user?.displayName || username
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${displayName} (@${username}) | Member Profile | Hobbiverse`,
    description: user?.bio || `${displayName}'s beginner hobby bookshelf and creative practice.`,
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await demoRepository.getUserByUsername(username);

  // Determine fallback profile if not in repository
  const profile = user || {
    id: `user-${username}`,
    username,
    displayName: username
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    bio: "Taking beginner steps at a calm, unhurried pace.",
    joinedAt: "October 2026",
    isPublic: true,
    interests: ["art-craft", "mindful"],
    completedStepsCount: 3,
    sessionsLoggedCount: 2,
  };

  const isOwner = username === "demo-user";

  return <ProfileView initialProfile={profile} isOwner={isOwner} />;
}
