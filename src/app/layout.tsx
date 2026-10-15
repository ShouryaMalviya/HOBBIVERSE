import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCF7" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1418" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Hobbiverse — Discover, Practice, and Cherish Creative Hobbies",
    template: "%s | Hobbiverse Atelier",
  },
  description:
    "A welcoming digital space to explore beginner hobbies, build gentle creative routines, reflect privately, and connect with encouraging kindred circles.",
  keywords: [
    "creative hobbies",
    "beginner watercolor",
    "sourdough baking",
    "fingerstyle guitar",
    "gentle productivity",
    "non-shaming consistency",
    "private journaling",
    "mindful craft",
  ],
  authors: [{ name: "Hobbiverse Atelier" }],
  openGraph: {
    title: "Hobbiverse — Discover, Practice, and Cherish Creative Hobbies",
    description:
      "A welcoming digital space to explore beginner hobbies, build gentle creative routines, reflect privately, and connect with encouraging kindred circles.",
    type: "website",
    siteName: "Hobbiverse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
