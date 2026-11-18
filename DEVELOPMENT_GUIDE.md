# Development Guide

## Project structure

```text
src/
  app/
    api/                 # Listing, upload, and message route handlers
    category/            # Category browsing routes
    create/              # Listing creation flow
    item/[id]/           # Dynamic listing detail
    error.tsx            # Route-level recovery UI
  components/
    layout/              # Header and category navigation
    marketplace/         # Browse grid and seller messaging
    ui/                  # Shared Shadcn components
  data/                  # Marketplace item types
  lib/                   # Supabase client and shared utilities
supabase-schema.sql      # Supabase database and storage setup
```

## Data flow

- The browse component fetches `/api/listings` with debounced search and category parameters.
- The create form uploads an image using `/api/upload`, then creates the listing through `POST /api/listings`.
- The detail route fetches `/api/listings/[id]` at runtime.
- The message form submits to `POST /api/messages`; the API saves the message before attempting an optional Resend email.
- Supabase RLS and storage policies are defined in `supabase-schema.sql`.

## Local workflow

```bash
npm install
npm run dev
npm run lint
npm run build
```

Use the same Supabase project for local environment variables and schema setup. Keep `.env.local` and all credentials out of Git.

## Next.js considerations

- This repository currently uses Next.js 16. In dynamic server routes, `params` is asynchronous; client components should handle runtime-only values inside Suspense boundaries where required by the build.
- Tailwind CSS 4 is configured via the project’s existing PostCSS/Turbopack setup. The project has not been downgraded to Tailwind 3.
- Remote listing images use regular image elements because URLs come from user uploads and need not be known at build time. ESLint may warn about image optimization; assess hosting and bandwidth requirements before changing the loader strategy.

## Production notes

- Vercel deploys from the connected GitHub repository.
- Set Supabase URL/key in every Vercel environment used.
- Configure Resend variables for email delivery.
- Public listing/message submissions are intentionally available without accounts in this demo. Add rate limiting, moderation, and a stronger identity/abuse model before treating it as a public production marketplace.
