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

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })

  const { listing_id, buyer_email, message } = body
  if (
    typeof listing_id !== "string" ||
    typeof buyer_email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer_email) ||
    typeof message !== "string" ||
    message.trim().length < 1 ||
    message.trim().length > 2000
  ) {
    return NextResponse.json({ error: "Missing or invalid message fields." }, { status: 400 })
  }

  const supabase = getSupabaseClient()!
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, title, seller_email")
    .eq("id", listing_id)
    .maybeSingle()

  if (listingError) return NextResponse.json({ error: listingError.message }, { status: 500 })
  if (!listing || !listing.seller_email) {
    return NextResponse.json({ error: "Listing or seller email not found." }, { status: 404 })
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      listing_id,
      sender_id: null,
      buyer_email: buyer_email.trim().toLowerCase(),
      seller_email: listing.seller_email,
      body: message.trim(),
      message: message.trim(),
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const savedMessage = { listing_id, buyer_email: buyer_email.trim().toLowerCase(), message: message.trim() }
  const emailApiKey = process.env.RESEND_API_KEY
  const emailFrom = process.env.RESEND_FROM_EMAIL
  if (!emailApiKey || !emailFrom) {
    return NextResponse.json({
      data: savedMessage,
      email: { sent: false, reason: "Email delivery is not configured." },
    }, { status: 201 })
  }

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [listing.seller_email],
        reply_to: buyer_email.trim(),
        subject: `New message about ${listing.title}`,
        text: `A buyer (${buyer_email.trim()}) sent you a message about "${listing.title}":\n\n${message.trim()}`,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error("Seller notification email failed:", emailResponse.status, errorText)
      return NextResponse.json({
        data: savedMessage,
        email: { sent: false, reason: "Message saved, but seller email delivery failed." },
      }, { status: 201 })
    }
  } catch (emailError) {
    console.error("Seller notification email request failed:", emailError)
    return NextResponse.json({
      data: savedMessage,
      email: { sent: false, reason: "Message saved, but seller email service was unreachable." },
    }, { status: 201 })
  }

  return NextResponse.json({ data: savedMessage, email: { sent: true } }, { status: 201 })
}
