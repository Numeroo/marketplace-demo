create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Marketplace user'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 4000),
  price numeric(12,2) not null check (price >= 0),
  category text not null,
  condition text not null,
  location text not null,
  status text not null default 'active' check (status in ('active', 'sold', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_status_created_idx on public.listings(status, created_at desc);
create index if not exists messages_listing_created_idx on public.messages(listing_id, created_at);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.messages enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.listings, public.listing_images to anon, authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant insert, update, delete on public.profiles to authenticated;
grant insert, update, delete on public.listings, public.listing_images to authenticated;

create policy "Profiles are public"
  on public.profiles for select using (true);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Active listings are public"
  on public.listings for select using (status = 'active' or auth.uid() = seller_id);
create policy "Authenticated users can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);
create policy "Sellers can update listings"
  on public.listings for update using (auth.uid() = seller_id);
create policy "Sellers can delete listings"
  on public.listings for delete using (auth.uid() = seller_id);

create policy "Listing images are public"
  on public.listing_images for select using (true);
create policy "Sellers can manage listing images"
  on public.listing_images for all
  using (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()))
  with check (exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid()));

create policy "Participants can read messages"
  on public.messages for select
  using (
    auth.uid() = sender_id
    or exists (
      select 1 from public.listings l
      where l.id = listing_id and l.seller_id = auth.uid()
    )
  );
create policy "Authenticated users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Listing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-images');
create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.uid() is not null);
create policy "Users can delete their uploaded listing images"
  on storage.objects for delete
  using (bucket_id = 'listing-images' and owner_id = auth.uid()::text);
