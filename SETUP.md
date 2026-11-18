# Setup

## Requirements

- Node.js 20 or newer
- npm
- A Supabase project
- Optional: a Resend account and verified sending domain for seller email notifications

## Local configuration

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase **Project Settings → API**.
4. In the Supabase SQL Editor for that project, run [`supabase-schema.sql`](./supabase-schema.sql). The script is designed to apply the Marketplace tables, storage bucket, indexes, grants, and row-level security policies.
5. Start the development server:

   ```bash
   npm run dev
   ```

The Supabase URL and anon/publishable key are public client configuration. Never put a Supabase service-role key in a `NEXT_PUBLIC_*` variable or commit credentials.

## Email notifications (optional)

Set these server-only variables in `.env.local` and in Vercel’s Production, Preview, and Development environments:

- `RESEND_API_KEY`: Resend API key allowed to send email
- `RESEND_FROM_EMAIL`: sender address verified in Resend, for example `Marketplace <listings@example.com>`

Without both settings, messages are still saved in Supabase; the response and UI indicate that email delivery is not configured. Configure a verified sender before expecting seller notifications.

## Vercel deployment

The GitHub repository is connected to Vercel, so pushes to `main` trigger a production deployment. Ensure the Supabase variables above exist in Vercel before deploying. Add the optional Resend variables if email alerts are needed.

Check the deployment’s build logs in Vercel after pushing. The production URL is https://marketplace-demo-peach.vercel.app.

## Troubleshooting

- **503 from an API route:** Supabase URL or anon key is missing or invalid in the current environment.
- **Database table or column error:** Run the current `supabase-schema.sql` in the matching Supabase project.
- **Image upload error:** Confirm the public `listing-images` bucket exists and the storage insert policy is installed. Images are limited to JPEG, PNG, or WebP up to 5 MB.
- **Seller notification not sent:** Configure `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` in the server environment.
