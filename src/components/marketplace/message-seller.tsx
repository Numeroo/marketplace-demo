"use client"

import { FormEvent, useState } from "react"
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MessageSeller({ listingId }: { listingId: string }) {
  const [message, setMessage] = useState("Hi, is this still available?")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setError("")
    setStatus("")

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, buyer_email: buyerEmail, message }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Your message could not be sent.")
      setEmailSent(result.email?.sent === true)
      setStatus(result.email?.sent
        ? "Message saved and email sent to the seller."
        : result.email?.reason || "Message saved, but seller email delivery is unavailable.")
      setMessage("")
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Your message could not be sent.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="font-bold">Message seller</h2>
      <p className="mt-1 text-sm text-zinc-500">Start a conversation about this listing.</p>
      <form className="mt-4" onSubmit={sendMessage}>
        <label htmlFor="buyer-email" className="mb-2 block text-sm font-medium">Your email</label>
        <Input id="buyer-email" type="email" autoComplete="email" value={buyerEmail} onChange={(event) => setBuyerEmail(event.target.value)} placeholder="you@example.com" required />
        <label htmlFor="seller-message" className="sr-only">Your message</label>
        <textarea
          id="seller-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setStatus("")
          }}
          rows={3}
          maxLength={2000}
          required
          className="w-full resize-y rounded-lg border border-zinc-200 bg-[#F7F8FA] px-3 py-2.5 text-sm leading-5 outline-none placeholder:text-zinc-400 focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/20"
          placeholder="Write a message..."
        />
        <Button type="submit" disabled={sending} className="mt-3 h-10 w-full gap-2 bg-[#1877F2] font-semibold text-white hover:bg-[#166FE5]">
          {sending ? <LoaderCircle className="size-4 animate-spin" /> : status && emailSent ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
          {sending ? "Sending…" : "Message Seller"}
        </Button>
        {error && <p role="alert" className="mt-3 flex items-start gap-2 text-xs text-red-700"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}</p>}
        {status && <p role="status" className={`mt-3 flex items-start gap-2 text-xs ${emailSent ? "text-green-700" : "text-amber-700"}`}><CheckCircle2 className="mt-0.5 size-4 shrink-0" /> {status}</p>}
      </form>
    </section>
  )
}
