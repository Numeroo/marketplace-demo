import { NextResponse } from "next/server"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    )
  }

  const { id } = await context.params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 })
  }

  const supabase = getSupabaseClient()!
  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(id, image_url, sort_order), seller:profiles(id, display_name, avatar_url)")
    .eq("id", id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: "Listing not found." }, { status: 404 })
  return NextResponse.json({
    data: {
      ...data,
      image_url: data.image_url || data.listing_images?.[0]?.image_url || null,
      seller_email: data.seller_email || null,
    },
  })
}
