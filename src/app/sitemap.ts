import { MetadataRoute } from "next";
import { SEED_HOBBIES, SEED_GROUPS, SEED_EVENTS } from "@/services/seedData";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hobbiverse.atelier";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/companion`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sign-in`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sign-up`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/onboarding`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Hobby Guides
  const hobbyRoutes: MetadataRoute.Sitemap = SEED_HOBBIES.map((hobby) => ({
    url: `${BASE_URL}/hobbies/${hobby.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic Kindred Circles (Groups)
  const groupRoutes: MetadataRoute.Sitemap = SEED_GROUPS.map((group) => ({
    url: `${BASE_URL}/groups/${group.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic Atelier Gatherings (Events)
  const eventRoutes: MetadataRoute.Sitemap = SEED_EVENTS.map((event) => ({
    url: `${BASE_URL}/events/${event.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...hobbyRoutes, ...groupRoutes, ...eventRoutes];
}
