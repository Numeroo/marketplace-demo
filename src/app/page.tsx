import { Sidebar } from "@/components/layout/sidebar"
import { MarketplaceBrowser } from "@/components/marketplace/marketplace-browser"

export default function Home() {
  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar />
      <MarketplaceBrowser />
    </div>
  )
}
