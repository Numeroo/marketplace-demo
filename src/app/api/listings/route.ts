import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

type ApiError = { error: string }

function supabaseUnavailable() {
  return NextResponse.json<ApiError>(
    { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
    { status: 503 },
  )
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseUnavailable()

  const supabase = getSupabaseClient()!
  const search = request.nextUrl.searchParams
  let query = supabase
    .from("listings")
    .select("*, listing_images(id, image_url, sort_order)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  const category = search.get("category")
  const searchTerm = search.get("search")
  const limit = Math.min(Number(search.get("limit") || "20"), 100)

  if (category) query = query.eq("category", category)
  if (searchTerm) query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  query = query.limit(limit)

  const { data, error } = await query
  if (error) return NextResponse.json<ApiError>({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseUnavailable()

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json<ApiError>({ error: "Authentication required." }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json<ApiError>({ error: "Invalid JSON body." }, { status: 400 })

  const { title, description, price, category, condition, location, seller_id, image_urls = [] } = body
  if (
    typeof title !== "string" || title.trim().length < 3 ||
    typeof description !== "string" || description.trim().length < 10 ||
    typeof price !== "number" || !Number.isFinite(price) || price < 0 ||
    typeof category !== "string" || !category.trim() ||
    typeof condition !== "string" || !condition.trim() ||
    typeof location !== "string" || !location.trim() ||
    typeof seller_id !== "string"
  ) {
    return NextResponse.json<ApiError>({ error: "Missing or invalid listing fields." }, { status: 400 })
  }

  const supabase = getSupabaseClient(token)!
  const { data: listing, error } = await supabase
    .from("listings")
    .insert({ title: title.trim(), description: description.trim(), price, category: category.trim(), condition: condition.trim(), location: location.trim(), seller_id })
    .select("*")
    .single()

  if (error) return NextResponse.json<ApiError>({ error: error.message }, { status: 400 })

  if (Array.isArray(image_urls) && image_urls.length) {
    const images = image_urls
      .filter((url: unknown) => typeof url === "string")
      .map((url: string, sort_order: number) => ({ listing_id: listing.id, image_url: url, sort_order }))
    if (images.length) {
      const { error: imageError } = await supabase.from("listing_images").insert(images)
      if (imageError) return NextResponse.json<ApiError>({ error: imageError.message }, { status: 400 })
    }
  }

  return NextResponse.json({ data: listing }, { status: 201 })
}
