"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, ChevronLeft, ImagePlus } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CreateItemPage() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Electronics")
  const [condition, setCondition] = useState("Used - good")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [photo, setPhoto] = useState("")

  function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/create" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1877F2] hover:underline"><ChevronLeft className="size-4" /> Listing type</Link>
        <h1 className="mb-5 text-[24px] font-bold tracking-tight">Create a listing</h1>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
          <form onSubmit={submit} className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
            <div className="border-b border-zinc-100 pb-4">
              <h2 className="font-semibold">Listing details</h2>
              <p className="mt-1 text-sm text-zinc-500">Tell buyers a little about what you&apos;re selling.</p>
            </div>
            <div className="mt-5 space-y-5">
              <div>
                <span className="block text-sm font-semibold">Photos</span>
                <label className="group relative mt-2 grid aspect-[16/6] cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-dashed border-zinc-300 bg-[#F7F8FA] transition hover:border-[#1877F2] hover:bg-[#F4F9FF]">
                  {photo ? <img src={photo} alt="Listing preview" className="absolute inset-0 h-full w-full object-contain" /> : <span className="text-center text-zinc-600"><span className="mx-auto mb-2 grid size-11 place-items-center rounded-full bg-[#E4E6EB] text-zinc-700 group-hover:text-[#1877F2]"><ImagePlus className="size-5" /></span><span className="block text-sm font-medium">Add photos</span><span className="mt-1 block text-xs text-zinc-500">Add at least one photo of your item</span></span>}
                  <input aria-label="Add listing photo" type="file" accept="image/*" className="sr-only" onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) setPhoto(URL.createObjectURL(file))
                  }} />
                </label>
              </div>
              <label className="block text-sm font-semibold">Title<Input className="mt-2 h-10" value={title} onChange={(e) => { setTitle(e.target.value); setSubmitted(false) }} placeholder="What are you selling?" required /></label>
              <label className="block text-sm font-semibold">Price<Input className="mt-2 h-10" type="number" min="0" value={price} onChange={(e) => { setPrice(e.target.value); setSubmitted(false) }} placeholder="0" required /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">Category<select className="mt-2 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" value={category} onChange={(e) => setCategory(e.target.value)}><option>Electronics</option><option>Home Goods</option><option>Fashion</option><option>Vehicles</option><option>Sports</option></select></label>
                <label className="text-sm font-semibold">Condition<select className="mt-2 h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-normal" value={condition} onChange={(e) => setCondition(e.target.value)}><option>New</option><option>Used - like new</option><option>Used - good</option><option>Used - fair</option></select></label>
              </div>
              <label className="block text-sm font-semibold">Description<Textarea className="mt-2 min-h-28" value={description} onChange={(e) => { setDescription(e.target.value); setSubmitted(false) }} placeholder="Describe the condition, features, and anything buyers should know." required /></label>
              <label className="block text-sm font-semibold">Location<Input className="mt-2 h-10" value={location} onChange={(e) => { setLocation(e.target.value); setSubmitted(false) }} placeholder="Enter your location" required /></label>
              <Button type="submit" className="h-10 w-full bg-[#1877F2] text-sm font-semibold text-white hover:bg-[#166FE5]">Publish listing</Button>
              {submitted && <p role="status" className="flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle2 className="size-4" /> Your listing is ready to publish.</p>}
            </div>
          </form>
          <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 lg:sticky lg:top-20">
            <h2 className="font-semibold">Preview</h2>
            <p className="mt-1 text-sm text-zinc-500">This is how your listing will look.</p>
            <article className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="aspect-square bg-[#F0F2F5]">{photo && <img src={photo} alt="" className="h-full w-full object-cover" />}</div>
              <div className="p-3">
                <p className="text-lg font-bold">{price ? `$${Number(price).toLocaleString()}` : "$0"}</p>
                <p className="mt-0.5 text-sm">{title || "Your listing title"}</p>
                <p className="mt-1 text-xs text-zinc-500">{location || "Location"} · {condition}</p>
                {description && <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-600">{description}</p>}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
