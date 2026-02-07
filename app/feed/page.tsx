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
import { useState } from "react"
import { useSearchParams } from "next/navigation"

const filterOptions = {
  type: [
    { value: "all", label: "All Types" },
    { value: "photo", label: "Photos" },
    { value: "video", label: "Videos" },
  ],
  lighting: [
    { value: "all", label: "All Lighting" },
    { value: "natural", label: "Natural" },
    { value: "studio", label: "Studio" },
    { value: "golden-hour", label: "Golden Hour" },
    { value: "dramatic", label: "Dramatic" },
  ],
  mood: [
    { value: "all", label: "All Moods" },
    { value: "cinematic", label: "Cinematic" },
    { value: "minimal", label: "Minimal" },
    { value: "luxury", label: "Luxury" },
    { value: "dramatic", label: "Dramatic" },
    { value: "warm", label: "Warm" },
  ],
  sector: [
    { value: "all", label: "All Sectors" },
    { value: "real-estate", label: "Real Estate" },
    { value: "fashion", label: "Fashion" },
    { value: "advertising", label: "Advertising" },
    { value: "product", label: "Product" },
    { value: "portrait", label: "Portrait" },
  ],
}

const feedItems = [
  {
    id: 1,
    type: "photo",
    title: "Luxury Interior",
    lighting: "Natural",
    mood: "Minimal",
    sector: "Real Estate",
    likes: 234,
    colors: ["#2d3748", "#d4a574", "#f7f3e9"],
  },
  {
    id: 2,
    type: "video",
    title: "Fashion Editorial",
    lighting: "Studio",
    mood: "Dramatic",
    sector: "Fashion",
    likes: 456,
    colors: ["#1a1a2e", "#e94560", "#f1f1f1"],
  },
  {
    id: 3,
    type: "photo",
    title: "Product Showcase",
    lighting: "Studio",
    mood: "Luxury",
    sector: "Product",
    likes: 189,
    colors: ["#0d1117", "#d4a574", "#ffffff"],
  },
  {
    id: 4,
    type: "photo",
    title: "Portrait Session",
    lighting: "Golden Hour",
    mood: "Warm",
    sector: "Portrait",
    likes: 567,
    colors: ["#4a3728", "#d4a574", "#ffecd2"],
  },
  {
    id: 5,
    type: "video",
    title: "Commercial Spot",
    lighting: "Dramatic",
    mood: "Cinematic",
    sector: "Advertising",
    likes: 892,
    colors: ["#1a1a1a", "#c9a227", "#3d3d3d"],
  },
  {
    id: 6,
    type: "photo",
    title: "Architecture Shot",
    lighting: "Natural",
    mood: "Minimal",
    sector: "Real Estate",
    likes: 345,
    colors: ["#e8e8e8", "#333333", "#666666"],
  },
  {
    id: 7,
    type: "photo",
    title: "Brand Campaign",
    lighting: "Studio",
    mood: "Luxury",
    sector: "Advertising",
    likes: 678,
    colors: ["#1a365d", "#d4a574", "#2d3748"],
  },
  {
    id: 8,
    type: "video",
    title: "Fashion Film",
    lighting: "Dramatic",
    mood: "Cinematic",
    sector: "Fashion",
    likes: 1023,
    colors: ["#0f0f0f", "#d4a574", "#4a4a4a"],
  },
  {
    id: 9,
    type: "photo",
    title: "Skincare Product",
    lighting: "Natural",
    mood: "Minimal",
    sector: "Product",
    likes: 412,
    colors: ["#f5f5f0", "#9caf88", "#ffffff"],
  },
]

export default function FeedPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    lighting: "all",
    mood: "all",
    sector: "all",
  })
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid")
  const [likedItems, setLikedItems] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredItems = feedItems.filter(item => {
    if (filters.type !== "all" && item.type !== filters.type) return false
    if (filters.lighting !== "all" && item.lighting.toLowerCase() !== filters.lighting) return false
    if (filters.mood !== "all" && item.mood.toLowerCase() !== filters.mood) return false
    if (filters.sector !== "all" && item.sector.toLowerCase().replace(" ", "-") !== filters.sector) return false
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl font-display">
              Visual Feed
            </h1>
            <p className="mt-4 text-lg text-white/60">
              Discover inspiration filtered by shooting type, lighting, mood, and sector
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search inspiration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-0 bg-transparent border-0 text-white/80 placeholder:text-white/40"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-white text-black" : "bg-transparent text-white/70"}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "masonry" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className={viewMode === "masonry" ? "bg-white text-black" : "bg-transparent text-white/70"}
                >
                  Masonry
                </Button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span>Filters:</span>
              </div>
              
              <Select value={filters.type} onValueChange={(v) => setFilters(prev => ({ ...prev, type: v }))}>
                <SelectTrigger className="w-[140px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {filterOptions.type.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/80">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.lighting} onValueChange={(v) => setFilters(prev => ({ ...prev, lighting: v }))}>
                <SelectTrigger className="w-[140px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {filterOptions.lighting.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/80">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.mood} onValueChange={(v) => setFilters(prev => ({ ...prev, mood: v }))}>
                <SelectTrigger className="w-[140px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {filterOptions.mood.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/80">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.sector} onValueChange={(v) => setFilters(prev => ({ ...prev, sector: v }))}>
                <SelectTrigger className="w-[140px] bg-transparent text-white border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                  {filterOptions.sector.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white/80">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filters.type !== "all" || filters.lighting !== "all" || filters.mood !== "all" || filters.sector !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFilters({ type: "all", lighting: "all", mood: "all", sector: "all" })}
                  className="text-white/50 hover:text-white"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-white/50">
              Showing <span className="text-white font-medium">{filteredItems.length}</span> results
            </p>
          </div>

          {/* Feed Grid */}
          <div className={viewMode === "grid" ? "space-y-6" : "space-y-10"}>
            {filteredItems.map((item, index) => (
              <div key={item.id} className="group space-y-3">
                {/* Image/Video Preview */}
                <div className={`relative bg-gradient-to-br from-white/10 via-black/30 to-black/70 ${viewMode === "grid" ? "aspect-[4/3]" : index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`bg-transparent ${likedItems.includes(item.id) ? "text-white" : "text-white/70 hover:text-white"}`}
                      onClick={() => toggleLike(item.id)}
                    >
                      Like
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent text-white/70 hover:text-white">
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.type}</p>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  
                  <p className="mt-2 text-xs text-white/50">
                    {item.lighting} · {item.mood} · {item.sector}
                  </p>

                  {/* Color Palette */}
                  <div className="text-xs text-white/50">
                    Colors: {item.colors.join(" · ")}
                  </div>

                  {/* Likes */}
                  <div className="text-sm text-white/50">
                    <span>{likedItems.includes(item.id) ? item.likes + 1 : item.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/50">No results found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Load More */}
          {filteredItems.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" className="bg-transparent text-white/70 hover:text-white">
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
