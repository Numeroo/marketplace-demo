import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const listingId = request.nextUrl.searchParams.get("listing_id")
  if (!listingId) return NextResponse.json({ error: "listing_id is required." }, { status: 400 })

  const supabase = getSupabaseClient(token)!
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles(id, display_name, avatar_url)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })

  const { listing_id, sender_id, body: message } = body
  if (
    typeof listing_id !== "string" ||
    typeof sender_id !== "string" ||
    typeof message !== "string" ||
    message.trim().length < 1 ||
    message.trim().length > 2000
  ) {
    return NextResponse.json({ error: "Missing or invalid message fields." }, { status: 400 })
  }

  const supabase = getSupabaseClient(token)!
  const { data, error } = await supabase
    .from("messages")
    .insert({ listing_id, sender_id, body: message.trim() })
    .select("*, sender:profiles(id, display_name, avatar_url)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
