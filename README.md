<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# সহজ কুরবানি — Sohoj Qurbani

A trusted, Shariah-compliant platform to find halal Qurbani partners and calculate costs for the Bangladeshi market.

## Tech stack

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS v4, Motion (Framer)
- **Backend:** Supabase (free plan) — Postgres + Auth (email magic link)
- **PDF:** jsPDF + html2canvas
- **Deploy:** Netlify (static SPA, free tier)

## Run locally

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000.

## Environment variables

Set these in `.env.local` for local dev, and in Netlify → Site settings → Environment variables for production:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase `anon` (publishable) key |

If the variables are missing, the app falls back to a built-in mock partner list so the UI still works.

## Supabase setup

1. Create a free project at https://supabase.com.
2. In **SQL Editor**, paste and run [`schema.sql`](./schema.sql) — it creates the `partners` table, enables RLS, adds a public-read policy, and seeds sample rows.
3. In **Authentication → Providers**, enable **Email** (magic link is on by default).
4. Copy the project URL and `anon` key into your env vars.

## Deploy to Netlify (free)

1. Push this repo to GitHub.
2. On Netlify, **Add new site → Import from Git** → pick this repo.
3. Build settings auto-detect from [`netlify.toml`](./netlify.toml) (`npm run build` → `dist`).
4. Add the two `VITE_SUPABASE_*` env vars in site settings.
5. Deploy.

## Project structure

```
src/
├── App.tsx                  # shell: nav, tabs, modals
├── main.tsx
├── index.css
├── types.ts                 # shared types (Partner, AuthMethod)
├── components/
│   ├── Card.tsx
│   ├── InputField.tsx
│   └── AnimatedFooter.tsx
├── features/
│   ├── halal/               # halal-income oath modal
│   ├── home/                # Eid countdown
│   ├── calculator/          # cost calculator + PDF invoice
│   ├── partners/            # partner search + request flow
│   ├── auth/                # Supabase magic-link login
│   └── pro/                 # pro upgrade modal
└── lib/
    ├── supabase.ts          # Supabase client
    ├── api.ts               # data access (Supabase → mock fallback)
    ├── mockData.ts          # offline partner fixtures
    └── format.ts            # currency formatting
```

## Roadmap

- WhatsApp OTP auth (currently a demo path)
- Real payment integration (SSL Commerz / bKash)
- Partner self-registration with NID verification
- Optional MongoDB Atlas backend (alternative to Supabase)
