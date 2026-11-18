export type MarketplaceItem = {
  id: string
  title: string
  price: number
  location: string
  category: string
  image: string
  description: string
  seller: string
  condition: string
  posted: string
}

export const marketplaceItems: MarketplaceItem[] = [
  { id: "1", title: "iPhone 15 Pro, 128GB", price: 785, location: "Quezon City", category: "electronics", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80", description: "Excellent condition iPhone 15 Pro. Includes charging cable and original box.", seller: "Miguel Santos", condition: "Used - like new", posted: "2 hours ago" },
  { id: "2", title: "Modern accent chair", price: 220, location: "Makati", category: "home", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80", description: "Comfortable accent chair in great condition. Minor signs of use.", seller: "Ana Reyes", condition: "Used - good", posted: "5 hours ago" },
  { id: "3", title: "Road bicycle", price: 450, location: "Pasig", category: "sports", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80", description: "Lightweight road bike, recently tuned and ready to ride.", seller: "Carlo Lim", condition: "Used - good", posted: "Yesterday" },
  { id: "4", title: "Sony wireless headphones", price: 180, location: "Manila", category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", description: "Noise cancelling headphones with carrying case.", seller: "Paolo Cruz", condition: "Used - like new", posted: "Yesterday" },
  { id: "5", title: "Minimal oak desk", price: 310, location: "Taguig", category: "home", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80", description: "Solid oak desk with two drawers. Pickup only.", seller: "Nina Gomez", condition: "Used - good", posted: "2 days ago" },
  { id: "6", title: "Vintage leather jacket", price: 95, location: "San Juan", category: "fashion", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80", description: "Genuine leather jacket, size medium.", seller: "Luis Fernandez", condition: "Used - good", posted: "3 days ago" },
  { id: "7", title: "Nintendo Switch OLED", price: 260, location: "Marikina", category: "electronics", image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80", description: "Switch OLED with dock and two Joy-Con controllers.", seller: "Rina Mendoza", condition: "Used - excellent", posted: "3 days ago" },
  { id: "8", title: "Indoor plant set", price: 55, location: "Caloocan", category: "home", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80", description: "Three healthy indoor plants in ceramic pots.", seller: "Jen Garcia", condition: "New", posted: "4 days ago" },
  { id: "9", title: "Digital camera kit", price: 520, location: "Paranaque", category: "electronics", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80", description: "Mirrorless camera with 24-70mm lens and accessories.", seller: "Marco Diaz", condition: "Used - good", posted: "5 days ago" },
  { id: "10", title: "Ceramic tableware set", price: 68, location: "Quezon City", category: "home", image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80", description: "Handmade ceramic plates and bowls for everyday use.", seller: "Ella Torres", condition: "New", posted: "1 week ago" },
]
