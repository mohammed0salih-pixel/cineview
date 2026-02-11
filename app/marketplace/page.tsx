"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter,
  ShoppingCart,
  ImageIcon,
  Video,
  Heart,
  Download,
  Upload,
  Star,
  User
} from "lucide-react"
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
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Stock Marketplace
              </h1>
              <p className="mt-2 text-muted-foreground">
                Buy and sell professional photos and videos
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cart.length})
              </Button>
              <Button asChild className="bg-primary text-background hover:bg-primary-dark">
                <Link href="/marketplace/sell">
                  <Upload className="mr-2 h-4 w-4" />
                  Sell Content
                </Link>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={contentType} onValueChange={setContentType} className="mb-8">
            <TabsList className="bg-secondary">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                All
              </TabsTrigger>
              <TabsTrigger value="photo" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                <ImageIcon className="mr-2 h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                <Video className="mr-2 h-4 w-4" />
                Videos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search stock content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px] border-border bg-secondary/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-foreground hover:bg-secondary">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={license} onValueChange={setLicense}>
                <SelectTrigger className="w-[140px] border-border bg-secondary/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  {licenses.map((lic) => (
                    <SelectItem key={lic.value} value={lic.value} className="text-foreground hover:bg-secondary">
                      {lic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[160px] border-border bg-secondary/50 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-foreground hover:bg-secondary">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-primary font-medium">{sortedItems.length}</span> results
            </p>
          </div>

          {/* Stock Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sortedItems.map((item) => (
              <Card key={item.id} className="group border-border bg-card overflow-hidden transition-all hover:border-primary/50">
                {/* Preview */}
                <div className="relative aspect-[4/3] bg-secondary/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {item.type === "photo" ? (
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    ) : (
                      <Video className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-background/80 text-foreground">
                      {item.type === "photo" ? <ImageIcon className="mr-1 h-3 w-3" /> : <Video className="mr-1 h-3 w-3" />}
                      {item.type}
                    </Badge>
                    {item.featured && (
                      <Badge className="bg-primary text-background">Featured</Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      favorites.includes(item.id)
                        ? "bg-primary text-background"
                        : "bg-background/80 text-foreground hover:bg-primary hover:text-background"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                  
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{item.author}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="border-border text-xs text-muted-foreground">
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-gold text-primary" />
                      <span className="text-foreground">{item.rating}</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Download className="h-3 w-3" />
                    <span>{item.downloads.toLocaleString()} downloads</span>
                    <span className="text-border">|</span>
                    <span>{item.license}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">${item.price}</div>
                  <Button
                    size="sm"
                    onClick={() => toggleCart(item.id)}
                    className={cart.includes(item.id) 
                      ? "bg-secondary text-foreground hover:bg-secondary/80" 
                      : "bg-primary text-background hover:bg-primary-dark"
                    }
                  >
                    {cart.includes(item.id) ? (
                      <>In Cart</>
                    ) : (
                      <>
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {sortedItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
            </div>
          )}

          {/* Load More */}
          {sortedItems.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" className="border-border text-foreground hover:bg-secondary hover:text-primary bg-transparent">
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
