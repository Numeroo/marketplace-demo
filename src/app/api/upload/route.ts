import { NextRequest, NextResponse } from "next/server"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 })
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 })

  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file field is required." }, { status: 400 })
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed." }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be no larger than 5 MB." }, { status: 400 })
  }

  const supabase = getSupabaseClient(token)!
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid or expired authentication." }, { status: 401 })
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const path = `${userData.user.id}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from("listing-images")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data } = supabase.storage.from("listing-images").getPublicUrl(path)
  return NextResponse.json({ data: { path, url: data.publicUrl } }, { status: 201 })
}
