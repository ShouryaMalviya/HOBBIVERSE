import * as React from "react";
import Link from "next/link";
import { HobbiverseBrand } from "./HobbiverseBrand";
import { BotanicalLeaf } from "@/components/ui/BotanicalOrnaments";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--paper-100)] text-[var(--ink-700)] transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 text-left">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <HobbiverseBrand size="md" showTagline />
            <p className="text-xs text-[var(--stone-600)] leading-relaxed mt-2">
              A welcoming digital space where people discover creative hobbies, build gentle routines, and reflect privately on everyday wellbeing.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--forest-700)] mt-2">
              <BotanicalLeaf className="w-4 h-4" />
              <span>Burgundy Botanical Atelier</span>
            </div>
          </div>

          {/* Discover Column */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-900)]">
              Discover
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-[var(--wine-700)] transition-colors">
                  Explore All Hobbies
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--wine-700)] transition-colors">
                  Product Philosophy
                </Link>
              </li>
              <li>
                <Link href="/companion" className="hover:text-[var(--wine-700)] transition-colors">
                  Hobby Companion (Demo)
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[var(--wine-700)] transition-colors">
                  Community Challenges
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspace Surfaces */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-900)]">
              Atelier Workspace
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/home" className="hover:text-[var(--wine-700)] transition-colors">
                  Personal Dashboard
                </Link>
              </li>
              <li>
                <Link href="/my-hobbies" className="hover:text-[var(--wine-700)] transition-colors">
                  My Saved Hobbies
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-[var(--wine-700)] transition-colors">
                  Activity Planner
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[var(--wine-700)] transition-colors">
                  Private Wellbeing Journal
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[var(--wine-700)] transition-colors">
                  Kindred Circles Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Essential Health & Wellbeing Notice */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-900)]">
              Supportive Intent
            </h4>
            <p className="text-xs text-[var(--stone-600)] leading-relaxed">
              Hobbiverse supports everyday wellbeing through creative exploration. It is <strong>not</strong> a medical, diagnostic, psychiatric, therapy, or emergency crisis service. Private journal reflections remain client-isolated by default.
            </p>
            <div className="pt-2 text-xs text-[var(--stone-600)]">
              <Link href="/settings" className="hover:text-[var(--wine-700)] underline">
                Privacy &amp; Accessibility Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--stone-600)] gap-4">
          <p>&copy; 2026 Hobbiverse. Handcrafted with Next.js App Router and TypeScript.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[var(--wine-700)] transition-colors">
              About
            </Link>
            <Link href="/settings" className="hover:text-[var(--wine-700)] transition-colors">
              Preferences
            </Link>
            <span className="text-[var(--sand-400)]">&middot;</span>
            <span className="text-[var(--forest-700)] font-medium">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
