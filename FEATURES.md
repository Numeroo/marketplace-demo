# Features and API

## Create a listing

At `/create/item`, users choose a JPEG, PNG, or WebP image (maximum 5 MB), then provide title, description, price, email, category, condition, and location. The form shows a live preview, uploads the image to Supabase Storage, and saves the listing to Supabase. On success it opens the listing detail page.

## Browse, search, and filter

The homepage and category pages load active listings from Supabase. Search matches listing title and description. Category tabs filter by category, and listing cards link to detail pages. Loading, API error, and empty states are shown.

## Listing details

`/item/[id]` loads current listing data from the API and shows its image, price, description, category, condition, location, and seller email. Invalid or missing IDs show a not-found message.

## Messaging

The seller form collects the buyer’s email and message, stores them in Supabase, and attempts a seller notification through Resend when configured. Messages are stored even when email delivery is unavailable; the response identifies the email status. Replies use the buyer’s email as the email `reply_to` address.

## HTTP API

All API responses use JSON. Errors have an `error` field.

| Method and path | Behavior |
| --- | --- |
| `GET /api/listings?search=&category=&limit=` | Browse active listings; optional search/category filters; limit capped at 100 |
| `POST /api/listings` | Create listing from JSON fields `title`, `description`, `price`, `category`, `seller_email`, optional `condition`, `location`, and `image_url` |
| `GET /api/listings/[id]` | Return one listing with image and seller data |
| `POST /api/upload` | Upload multipart field `file` to the public `listing-images` bucket |
| `GET /api/messages?listing_id=` | Retrieve messages (requires a valid Supabase bearer token) |
| `POST /api/messages` | Save JSON `{ listing_id, buyer_email, message }` and attempt email notification |

Expected response codes include `200`, `201`, `400`, `401`, `404`, and `503`. Listing browse/detail responses use a short shared-cache lifetime.

## Database and storage

[`supabase-schema.sql`](./supabase-schema.sql) defines profiles, listings, listing images, messages, the `listing-images` bucket, indexes, timestamp trigger, grants, and RLS policies. Listing creation and messages currently support email-based use without sign-in; public submission policies mean production deployments should add rate limiting, abuse reporting, and identity verification before broad public use.
