Starter Kit

A modern, batteries-included Next.js starter focused on speed-to-shipping, best practices, and a clean developer experience.

What you get
- Type-safe fullstack app with tRPC and Drizzle ORM on Postgres (Neon)
- Auth, subscriptions, email, and payments wired in out-of-the-box
- Beautiful UI primitives with Tailwind + shadcn + Motion
- Prod-ready DX: linting, formatting, env validation, SEO defaults, and more

Tech stack
- Next.js + TypeScript
- tRPC for end-to-end typesafe APIs
- Drizzle ORM + Neon Postgres
- Better Auth for authentication (passwordless + OAuth)
- Polar for payments/subscriptions
- Resend for transactional emails
- Tailwind CSS, shadcn/ui, Motion (Framer Motion), optional Spline
- Upstash Redis for rate limiting and caching
- Vercel AI SDK for AI features

Getting started
1) Clone and install
   - pnpm install (recommended) or npm/yarn

2) Create and populate .env
   - Duplicate .env.example to .env.local and fill values (see “Environment variables”)

3) Database setup (Neon + Drizzle)
   - Create a Neon Postgres database and set DATABASE_URL
   - Run migrations and generate types:
     - pnpm drizzle:generate
     - pnpm drizzle:push

4) Run the app
   - pnpm dev
   - Open http://localhost:3000

Environment variables
Copy .env.example to .env and fill:
- Core
  - DATABASE_URL=postgres://...
  - NODE_ENV=development
  - NEXT_PUBLIC_APP_URL=http://localhost:3000

- Auth (Better Auth)
  - AUTH_GOOGLE_ID=...
  - AUTH_GOOGLE_SECRET=...

- Resend (emails)
  - RESEND_API_KEY=...

- Polar (payments/subscriptions)
  - POLAR_WEBHOOK_SECRET=...
  - POLAR_ACCESS_TOKEN=...
  - NEXT_PUBLIC_STARTER_TIER=...
  - NEXT_PUBLIC_STARTER_SLUG=...
  - NEXT_PUBLIC_LIFETIME_TIER=...
  - NEXT_PUBLIC_LIFETIME_SLUG=...
  - POLAR_SUCCESS_URL=...

- Optional
  - UPSTASH_REDIS_REST_URL=...
  - UPSTASH_REDIS_REST_TOKEN=...

Project structure
- src/
  - app/              Next.js app router
  - lib/
    - auth.ts         Better Auth configuration and plugins (Polar, Resend, etc.)
    - subscription.ts Helpers for subscriptions
  - server/
    - api/
      - trpc.ts       tRPC init, context with db
      - root.ts       App router
      - routers/
        - user.ts     Example user router with getUser
    - db/
      - index.ts      Drizzle client (postgres-js)
      - schema.ts     Drizzle schema (user, session, account, verification, subscription)

Database and ORM
- Uses Drizzle ORM with postgres-js client
- Schema lives in src/server/db/schema.ts
- Connection created in src/server/db/index.ts and injected into tRPC context
- Typical query pattern:
  - ctx.db.query.table.findFirst({ where: (t, ops) => ops.eq(t.id, id) })

Auth
- Implemented with Better Auth + drizzleAdapter
- Social provider: Google (extendable)
- Magic link support via Resend
- Cookie caching and admin plugin configured

Payments and subscriptions
- Polar integrated via better-auth plugins in src/lib/auth.ts
- Webhooks handled to upsert subscription records in DB
- Configure product IDs and slugs via env vars

Emails
- Resend is used to send magic links and transactional messages
- Update sender domain/email as needed

Rate limiting and caching
- Upstash Redis ready (enable and wire where needed)

SEO and performance
- added robots.ts
- added sitemap.ts
- need to update the layout.ts of the app with metadata

Scripts
- pnpm dev           Start dev server
- pnpm build         Build production bundles
- pnpm start         Start production server
- pnpm lint          Run ESLint
- pnpm format        Run Prettier
- pnpm db:generate Generate SQL from schema
- pnpm db:migrate migtrate schema changes to the database
- pnpm db:push  Run migrations on the database
- pnpm db:studio  drizzle kit studio

Using the API (tRPC)
- Server usage example
```ts
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

const ctx = await createTRPCContext({ headers: new Headers() });
const trpc = createCaller(ctx);

// Fetch user by ID
const user = await trpc.userInfo.getUser({ id: "user_123" });
```

Conventions
- TypeScript everywhere, strict mode encouraged
- Co-locate server logic under src/server and UI under src/app/components
- Prefer tRPC for server communication; keep endpoints thin and typed
- Use Drizzle query API with schema-defined columns for safety

Troubleshooting
- Database connection issues
  - Verify DATABASE_URL and Neon IP allowlist/settings
- Auth callbacks failing
  - Check OAuth credentials and redirect/callback URLs
- Webhooks not received
  - Ensure POLAR_WEBHOOK_SECRET and endpoint configuration match
  - Log incoming payloads locally for debugging
- Emails not sending
  - Validate RESEND_API_KEY and domain setup

use freely, PRs welcome.
