import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hobbiverse.atelier";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/explore",
        "/hobbies/",
        "/community",
        "/events/",
        "/groups/",
        "/companion",
        "/sign-in",
        "/sign-up",
        "/onboarding",
      ],
      disallow: [
        "/journal",
        "/journal/",
        "/planner",
        "/planner/",
        "/my-hobbies",
        "/my-hobbies/",
        "/notifications",
        "/notifications/",
        "/settings",
        "/settings/",
        "/admin",
        "/admin/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
