"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "real-estate", label: "Real Estate" },
  { value: "fashion", label: "Fashion" },
  { value: "advertising", label: "Advertising" },
  { value: "product", label: "Product" },
  { value: "portrait", label: "Portrait" },
  { value: "nature", label: "Nature" },
  { value: "architecture", label: "Architecture" },
]

const licenses = [
  { value: "all", label: "All Licenses" },
  { value: "standard", label: "Standard" },
  { value: "extended", label: "Extended" },
  { value: "editorial", label: "Editorial" },
]

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
]

const stockItems = [
  {
    id: 1,
    type: "photo",
    title: "Luxury Interior Living Room",
    category: "Real Estate",
    author: "Ahmed K.",
    price: 29,
    downloads: 1234,
    rating: 4.8,
    license: "Standard",
    featured: true,
  },
  {
    id: 2,
    type: "video",
    title: "Fashion Model Walking",
    category: "Fashion",
    author: "Sara M.",
    price: 79,
    downloads: 567,
    rating: 4.9,
    license: "Extended",
    featured: true,
  },
  {
    id: 3,
    type: "photo",
    title: "Product Photography Setup",
    category: "Product",
    author: "Omar H.",
    price: 19,
    downloads: 2341,
    rating: 4.7,
    license: "Standard",
    featured: false,
  },
  {
    id: 4,
    type: "photo",
    title: "Professional Portrait",
    category: "Portrait",
    author: "Fatima A.",
    price: 24,
    downloads: 892,
    rating: 4.6,
    license: "Standard",
    featured: false,
  },
  {
    id: 5,
    type: "video",
    title: "Commercial Brand Story",
    category: "Advertising",
    author: "Khalid R.",
    price: 149,
    downloads: 234,
    rating: 5.0,
    license: "Extended",
    featured: true,
  },
  {
    id: 6,
    type: "photo",
    title: "Modern Architecture",
    category: "Architecture",
    author: "Nora S.",
    price: 34,
    downloads: 1567,
    rating: 4.8,
    license: "Standard",
    featured: false,
  },
  {
    id: 7,
    type: "photo",
    title: "Desert Landscape",
    category: "Nature",
    author: "Mohammed Y.",
    price: 15,
    downloads: 3421,
    rating: 4.5,
    license: "Editorial",
    featured: false,
  },
  {
    id: 8,
    type: "video",
    title: "Real Estate Walkthrough",
    category: "Real Estate",
    author: "Layla K.",
    price: 99,
    downloads: 456,
    rating: 4.9,
    license: "Extended",
    featured: false,
  },
]

export default function MarketplacePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")
  const [category, setCategory] = useState(searchParams?.get("category") || "all")
  const [license, setLicense] = useState(searchParams?.get("license") || "all")
  const [sort, setSort] = useState(searchParams?.get("sort") || "popular")
  const [contentType, setContentType] = useState(searchParams?.get("type") || "all")
  const [cart, setCart] = useState<number[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleCart = (id: number) => {
    setCart(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filteredItems = stockItems.filter(item => {
    if (contentType !== "all" && item.type !== contentType) return false
    if (category !== "all" && item.category.toLowerCase().replace(" ", "-") !== category) return false
    if (license !== "all" && item.license.toLowerCase() !== license) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sort) {
      case "newest": return b.id - a.id
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      default: return b.downloads - a.downloads
    }
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl font-display">
                Stock Marketplace
              </h1>
              <p className="mt-2 text-white/60">
                Buy and sell professional photos and videos
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent text-white/70 rounded-full">
                Cart ({cart.length})
              </Button>
              <Button asChild className="bg-white text-black hover:bg-white/80 rounded-full">
                <Link href="/marketplace/sell">
                  Sell Content
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={contentType} onValueChange={setContentType} className="mb-8">
            <TabsList className="inline-flex flex-wrap gap-4 bg-transparent p-0">
              <TabsTrigger value="all" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger value="photo" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Photos
              </TabsTrigger>
              <TabsTrigger value="video" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search stock content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-0 bg-transparent border-0 text-white/80 placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>Filters:</span>
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white/80">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={license} onValueChange={setLicense}>
                <SelectTrigger className="w-[140px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {licenses.map((lic) => (
                    <SelectItem key={lic.value} value={lic.value} className="text-white/80">
                      {lic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[160px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-white/80">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-white/50">
              Showing <span className="text-white font-medium">{sortedItems.length}</span> results
            </p>
          </div>

          {/* Stock Grid */}
          <div className="space-y-8">
            {sortedItems.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-white/10 via-black/30 to-black/70" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                    <span>{item.type}{item.featured ? " · Featured" : ""}</span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="text-white/50 hover:text-white"
                    >
                      {favorites.includes(item.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                  <h3 className="font-semibold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.author}</p>
                  <p className="text-xs text-white/50">
                    {item.category} · {item.license} · {item.downloads.toLocaleString()} downloads · {item.rating}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">${item.price}</div>
                  <Button
                    size="sm"
                    onClick={() => toggleCart(item.id)}
                    className={cart.includes(item.id)
                      ? "bg-transparent text-white/70 hover:text-white"
                      : "bg-white text-black hover:bg-white/80"
                    }
                  >
                    {cart.includes(item.id) ? "In Cart" : "Add"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {sortedItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/50">No results found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Load More */}
          {sortedItems.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" className="bg-transparent text-white/70 rounded-full">
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
