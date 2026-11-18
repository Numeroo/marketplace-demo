"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MessageSeller({ seller }: { seller: string }) {
  const [message, setMessage] = useState("Hi, is this still available?")
  const [sent, setSent] = useState(false)

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (message.trim()) setSent(true)
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="font-bold">Message {seller}</h2>
      <p className="mt-1 text-sm text-zinc-500">Start a conversation about this listing.</p>
      <form className="mt-4" onSubmit={sendMessage}>
        <label htmlFor="seller-message" className="sr-only">Your message</label>
        <textarea
          id="seller-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            setSent(false)
          }}
          rows={3}
          className="w-full resize-y rounded-lg border border-zinc-200 bg-[#F7F8FA] px-3 py-2.5 text-sm leading-5 outline-none placeholder:text-zinc-400 focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/20"
          placeholder="Write a message..."
        />
        <Button type="submit" className="mt-3 h-10 w-full gap-2 bg-[#1877F2] font-semibold text-white hover:bg-[#166FE5]">
          {sent ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
          {sent ? "Message sent" : "Send message"}
        </Button>
        {sent && <p role="status" className="mt-2 flex items-center justify-center gap-1.5 text-xs text-green-700"><MessageCircle className="size-3.5" /> Your message to {seller} is ready.</p>}
      </form>
    </section>
  )
}
