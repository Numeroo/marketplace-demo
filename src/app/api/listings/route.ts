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
  const requestedLimit = Number(search.get("limit") || "60")
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 60

  if (category) query = query.eq("category", category)
  if (searchTerm) {
    const term = searchTerm.replace(/[,%()]/g, " ").trim().slice(0, 100)
    if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
  }
  query = query.limit(limit)

  const { data, error } = await query
  if (error) return NextResponse.json<ApiError>({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return supabaseUnavailable()

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json<ApiError>({ error: "Invalid JSON body." }, { status: 400 })

  const { title, description, price, category, condition = "Used - good", location, seller_email, image_url } = body
  if (
    typeof title !== "string" || title.trim().length < 3 ||
    typeof description !== "string" || description.trim().length < 10 ||
    typeof price !== "number" || !Number.isFinite(price) || price < 0 ||
    typeof category !== "string" || !category.trim() ||
    typeof condition !== "string" || !condition.trim() ||
    typeof location !== "string" || !location.trim() ||
    typeof seller_email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(seller_email) ||
    (image_url !== undefined && image_url !== null && typeof image_url !== "string")
  ) {
    return NextResponse.json<ApiError>({ error: "Missing or invalid listing fields." }, { status: 400 })
  }

  const supabase = getSupabaseClient()!
  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      title: title.trim(),
      description: description.trim(),
      price,
      category: category.trim().toLowerCase(),
      condition: condition.trim(),
      location: location.trim(),
      seller_email: seller_email.trim().toLowerCase(),
      image_url: image_url || null,
      seller_id: null,
    })
    .select("*")
    .single()

  if (error) return NextResponse.json<ApiError>({ error: error.message }, { status: 400 })

  return NextResponse.json({ data: listing }, { status: 201 })
}
