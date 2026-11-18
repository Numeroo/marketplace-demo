"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, MessageCircle, Plus, Search, Store } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[#1877F2]" aria-label="Marketplace home">
          <div className="grid size-10 place-items-center rounded-full bg-[#1877F2] text-white shadow-sm">
            <Store className="size-[21px]" strokeWidth={2.2} />
          </div>
          <span className="hidden text-[19px] font-bold tracking-tight sm:inline">Marketplace</span>
        </Link>
        <div className="mx-1 flex min-w-0 flex-1 items-center sm:mx-5">
          <div className="flex h-10 w-full max-w-[520px] items-center gap-2 rounded-full bg-[#F0F2F5] px-3.5 focus-within:ring-2 focus-within:ring-[#1877F2]/20 sm:px-4">
            <Search className="size-[18px] shrink-0 text-zinc-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500" placeholder="Search Marketplace" aria-label="Search Marketplace" />
          </div>
        </div>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Account navigation">
          <Link href="/create" className="hidden h-10 items-center gap-2 rounded-full bg-[#1877F2] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#166fe5] md:flex">
            <Plus className="size-4" /> Create listing
          </Link>
          <Link href="/create" className="grid size-10 place-items-center rounded-full bg-[#E4E6EB] text-zinc-800 transition-colors hover:bg-zinc-300 md:hidden" aria-label="Create listing"><Plus className="size-5" /></Link>
          <button className="hidden size-10 place-items-center rounded-full bg-[#E4E6EB] text-zinc-800 transition-colors hover:bg-zinc-300 sm:grid" aria-label="Messages"><MessageCircle className="size-[19px]" /></button>
          <button className="hidden size-10 place-items-center rounded-full bg-[#E4E6EB] text-zinc-800 transition-colors hover:bg-zinc-300 md:grid" aria-label="Notifications"><Bell className="size-[19px]" /></button>
          <Avatar size="lg" className="ml-1 ring-1 ring-zinc-200"><AvatarFallback>JS</AvatarFallback></Avatar>
        </nav>
      </div>
    </header>
  )
}
