# Hobbiverse — The Gentle Creative Atelier

> **A welcoming digital space to discover beginner hobbies, cultivate gentle creative routines, reflect privately, and connect with encouraging kindred circles.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-brightgreen)](https://turbo.build/pack)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase)](https://supabase.com/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1_AA_Compliant-success)](#accessibility--core-web-vitals)

---

## 🌿 Core Atelier Philosophy

Modern productivity tools often inflict guilt through unbroken streak counters, overwhelming catalogs, and commercial pressure. **Hobbiverse** is built on an entirely different premise: **gentle creative beginnings**.

1. **Anti-Streak Consistency:** Missing a day carries zero penalty. Creative habits are not a chore list or an athletic streak—they are an open door that waits patiently for you.
2. **5-Minute Micro-Steps:** Every hobby is broken down into structured, bite-sized starter milestones that fit into busy evenings or low-energy mornings.
3. **Strict Private Reflection Isolation:** Creative reflections, notes, and mood logs are confidential and client-isolated (`isPrivate: true`). They are never exposed to public feeds, social metrics, or community members.
4. **Non-Diagnostic Wellness Boundaries:** Hobbiverse offers gentle encouragement, sensory grounding, and creative pacing. It strictly avoids clinical or psychiatric claims.
5. **Zero Dead Buttons & Honest Demo Sandbox:** Every interaction works completely out of the box with zero configuration via `LocalDemoRepository`. Remote Supabase features degrade honestly without mock illusions.

---

## 🎨 Design System: *Burgundy Botanical Atelier*

Hobbiverse features a bespoke, hand-crafted design system inspired by botanical herbariums, archival paper textures, and deep wine/burgundy tones:

- **Neutral Foundations:** Deep wine (`#2A121A`, `#1C1418`) and warm parchment linen (`#FDFCF7`, `#F5F2EB`).
- **50 Centralized Design Tokens:** Standardized in [`globals.css`](file:///c:/Users/SHOURYA/HOBBIVERSE/src/app/globals.css) covering surfaces, borders, text contrast, interactive rings, and shadows.
- **8 Stable Category Accent Families:**
  - 🎨 **Art & Craft** (`art-craft`): Terracotta Amber
  - 🌿 **Outdoors & Nature** (`outdoors-nature`): Forest Moss
  - 🎵 **Music & Acoustic** (`music`): Indigo Slate
  - 🍞 **Cooking & Baking** (`cooking`): Warm Ochre
  - 🧘 **Movement & Wellbeing** (`movement`): Sage Pine
  - 🍵 **Mindful Moments** (`mindful`): Calming Plum
  - 📖 **Reading & Writing** (`reading-writing`): Vintage Ink
  - 🎲 **Social & Games** (`social-games`): Deep Coral
- **Inclusive Accessibility:**
  - `@media (prefers-reduced-motion: reduce)` built into all Framer Motion micro-animations.
  - Visible, high-contrast screen reader skip-to-content links (`#main-content`).
  - Mobile touch targets adhere to a minimum of 44px × 44px.

---

## 🗺️ Application Routes & Features Tour

Hobbiverse features **43 production-compiled routes** across public discovery, member workspaces, and administrative tools:

| Route | View Name | Description |
| :--- | :--- | :--- |
| `/` | **Editorial Atelier Landing** | Value proposition, try-in-15 quick start carousel, category grid, gentle testimonials, and FAQs. |
| `/explore` | **Discovery Engine** | Multi-dimensional filter bar (energy, time, cost, location, social type), sorting, and view switcher. |
| `/hobbies/[slug]` | **Hobby Detail Guide** | Beginner overview, supplies checklist, step progression toggles, adaptations, and `HowTo` JSON-LD. |
| `/my-hobbies` | **Member Bookshelf** | Saved hobby library, quick-launch practice links, step completion tracking, and category grouping. |
| `/home` | **Personal Dashboard** | Dynamic greeting, weekly participation rhythm, non-shaming consistency plan, and quick session logger. |
| `/planner` | **Activity Planner** | Routine scheduling, weekly calendar, reminder preferences, and completed session archiving. |
| `/journal` | **Private Journal** | Client-isolated reflections, mood selector, search/tag filtering, and zero-leakage privacy guarantees. |
| `/community` | **Community Discussions** | Warm discussion posts, threaded comment dialogues, post liking, author muting, and moderation reporting. |
| `/groups/[slug]` | **Kindred Circles** | Focused community circles (Botanical Artists, Sourdough Bakers, Acoustic Circle) with guidelines and discussions. |
| `/events` | **Studio Gatherings** | Virtual atelier events, interactive RSVP toggles, `.ics` calendar file downloads, and Google Calendar links. |
| `/events/[slug]` | **Event Detail Page** | Full studio session prompt, host details, participant count, and `Event` schema.org markup. |
| `/companion` | **AI Creative Companion** | Compassionate micro-step advisor with 5-minute suggestions, low-energy adaptation, and direct journal export. |
| `/profile/[username]`| **Member Profile** | Public/private bookshelf toggles, activity stats, member bio, and avatar personalization. |
| `/notifications` | **Notification Center** | Gentle milestone badges, studio reminders, community replies, and read state management. |
| `/settings` | **Atelier Preferences** | Energy preferences, session duration targets, reduced motion toggles, and data export/reset. |
| `/admin` | **Studio Console** | Content Health Auditor (100% target score), moderation report queue, and full JSON database backup/restore. |
| `/about` | **Our Philosophy** | In-depth atelier manifesto detailing slow discovery, non-shaming routines, and ethical community standards. |
| `/sign-in` & `/sign-up` | **Member Authentication** | Accessible authentication portal with instant local demo mode access. |
| `/onboarding` | **Gentle Onboarding** | 3-step intake questionnaire establishing preferred energy, session length, and starter interests. |
| `/sitemap.xml` | **Dynamic XML Sitemap** | Next.js Metadata Route indexing 24+ core routes, hobbies, circles, and events. |
| `/robots.txt` | **Crawler Directives** | Protects private client reflections (`/journal`, `/planner`, `/admin`) while indexing open catalogues. |
| `/manifest.webmanifest` | **Web App Manifest** | PWA standalone installation config with theme colors and brand icons. |

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prefetching, Cache Components)
- **Runtime:** [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with centralized CSS token palette
- **Icons:** [Lucide React](https://lucide.dev/) (Tree-shaken via `optimizePackageImports`)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) with reduced-motion support
- **Form Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Layer:** Hybrid Sync Engine ([`LocalDemoRepository`](file:///c:/Users/SHOURYA/HOBBIVERSE/src/services/repository.ts) fallback + [Supabase](https://supabase.com/) PostgreSQL with Row Level Security)

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js >= 18.18 (Tested on `v22.16.0`)
- npm >= 9.x (Tested on `10.9.2`)

### 1. Installation
```bash
git clone https://github.com/ShouryaMalviya/HOBBIVERSE.git
cd HOBBIVERSE
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to enter the atelier.

### 3. Run Automated Journey Verification Suite (33 Assertions)
```bash
npm run verify:journeys
```
Executes end-to-end stateful verification across all 7 core user journeys (discovery, session logging, private journal isolation, community discussions, studio RSVPs, companion pacing, and full database backup/restore).

### 4. Run Performance & Lighthouse Readiness Audit
```bash
npm run audit:performance
```
Verifies dynamic XML sitemaps, robots crawler privacy, PWA web manifest, Schema.org structured data (`WebApplication`, `HowTo`, `Event`), security headers, and accessibility skip links.

### 5. Production Compilation
```bash
npm run build
npm run start
```

---

## 🔒 Supabase Remote Database & Migrations

Hobbiverse runs completely in **Demo Mode** out of the box. To connect a live remote Supabase cloud backend:

1. Copy `.env.example` to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key-here
   ```
2. Apply the ordered SQL migrations in [`supabase/migrations/`](file:///c:/Users/SHOURYA/HOBBIVERSE/supabase/migrations/):
   - `20261019000000_create_hobbiverse_schema.sql` (Creates 22 relational tables, foreign keys, and indexes)
   - `20261019000001_row_level_security.sql` (Enforces 100% RLS table coverage with private reflection isolation)
   - `20261019000002_seed_data.sql` (Seeds 8 categories, 8 rich beginner hobbies, steps, groups, events, and challenges)
3. For comprehensive migration instructions via Supabase CLI or Dashboard, consult [`docs/supabase-setup-guide.md`](file:///c:/Users/SHOURYA/HOBBIVERSE/docs/supabase-setup-guide.md).

---

## 📁 Repository Directory Structure

```
HOBBIVERSE/
├── docs/
│   └── supabase-setup-guide.md # Comprehensive Supabase architecture & migration guide
├── public/                     # Static assets and icons
├── scripts/
│   ├── verify-journeys.ts      # 7-journey automated verification harness (33 assertions)
│   └── verify-performance.ts   # SEO, structured data, security, and vitals audit
├── src/
│   ├── app/                    # Next.js 16 App Router pages & metadata routes
│   │   ├── layout.tsx          # Root layout with fonts, JSON-LD, metadataBase, & skip link
│   │   ├── globals.css         # Burgundy Atelier token design system & accessibility rules
│   │   ├── manifest.ts         # PWA Web App Manifest
│   │   ├── robots.ts           # Search crawler directives
│   │   ├── sitemap.ts          # Dynamic XML sitemap
│   │   ├── (auth)/             # /sign-in, /sign-up, /onboarding
│   │   ├── (public)/           # /, /about, /explore, /hobbies/[slug], /events, /community
│   │   └── (workspace)/        # /home, /my-hobbies, /planner, /journal, /companion, /admin
│   ├── components/
│   │   ├── layout/             # WorkspaceShell, PublicHeader, PublicFooter, Brand
│   │   ├── shared/             # StatCard, EmptyState, SectionHeading, QuickSessionModal
│   │   └── ui/                 # Accessible primitives (Button, Input, Select, Badge, Card)
│   ├── lib/
│   │   ├── calendar.ts         # iCalendar (.ics) generation & Google Calendar URL formatter
│   │   ├── supabase/           # Browser & server Supabase clients with typed database schema
│   │   └── utils.ts            # Class merging & utility helpers
│   ├── services/
│   │   ├── repository.ts       # IHobbiverseRepository & LocalDemoRepository implementation
│   │   ├── supabaseRepository.ts # Live Supabase PostgreSQL repository implementation
│   │   ├── syncEngine.ts       # Hybrid runtime adapter & local-to-cloud migration engine
│   │   ├── contentHealth.ts    # Automated catalogue health & integrity auditor
│   │   ├── companionEngine.ts  # Compassionate AI creative advisor engine
│   │   └── seedData.ts         # Rich seed catalogue (8 categories, 8 hobbies, steps, groups)
│   └── types/
│       └── index.ts            # Typed domain models (single source of truth)
├── supabase/
│   ├── README.md               # Migrations overview
│   └── migrations/             # Versioned PostgreSQL schema & RLS migrations
├── next.config.ts              # Next.js 16 compiler rules, tree-shaking, & security headers
├── package.json                # Project dependencies and script definitions
└── tsconfig.json               # Strict TypeScript configuration
```

---

## 📄 License & Attribution

Crafted with care for creative beginners everywhere. Built with **Next.js 16**, **Tailwind CSS v4**, and **React 19**.
