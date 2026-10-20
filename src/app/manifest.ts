import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hobbiverse Atelier — Discover, Practice, and Cherish Creative Hobbies",
    short_name: "Hobbiverse",
    description:
      "A welcoming digital space to explore beginner hobbies, build gentle creative routines, reflect privately, and connect with encouraging kindred circles.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFCF7",
    theme_color: "#1C1418",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
