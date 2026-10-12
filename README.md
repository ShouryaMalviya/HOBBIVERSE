# Hobbiverse

A welcoming digital space where people discover hobbies, make time for creative routines, reflect privately, join positive communities, and participate in friendly challenges.

---

## Getting Started

### Prerequisites
- Node.js >= 18.18 (Tested on v22.16.0)
- npm >= 9.x (Tested on 10.9.2)

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm run start
```

### Linting & Type Checking
```bash
npm run lint
npx tsc --noEmit
```

---

## Project Structure

```
hobbiverse/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI primitives and layout components
│   │   ├── layout/       # Shell, navigation, footer
│   │   ├── shared/       # Shared business components
│   │   └── ui/           # Design system primitives (buttons, inputs, cards)
│   ├── modules/          # Domain-specific feature modules
│   ├── services/         # Repository & data access layer (Local / Supabase)
│   ├── styles/           # Theme variables, tokens, and CSS art
│   ├── types/            # Typed domain models (single source of truth)
│   └── lib/              # Utility functions and shared helpers
├── public/               # Static assets
├── .env.example          # Safe environment variable template
├── tsconfig.json         # Strict TypeScript configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

---

## Demo Mode & Persistence

Hobbiverse operates completely and honestly without requiring any remote cloud services or AI API keys:
- **Default State**: In the absence of external environment variables, Hobbiverse operates in **Demo Mode**, utilizing resilient, locally-scoped state (`localStorage` on the client).
- **No Deceptive Fallbacks**: The application never simulates remote API successes. Features requiring external integration clearly display their local or demo status.
- **Connecting Supabase**: When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in `.env.local`, the repository layer connects to PostgreSQL and Auth. Private service keys must remain server-side only.
