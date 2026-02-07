"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const pricingTiers = [
  { name: "Standard", description: "Web use, social media", multiplier: 1 },
  { name: "Extended", description: "Print, commercial use", multiplier: 2.5 },
  { name: "Exclusive", description: "Full rights transfer", multiplier: 10 },
]

const categories = [
  "Nature & Landscapes",
  "People & Portraits",
  "Architecture",
  "Food & Drink",
  "Travel",
  "Business",
  "Technology",
  "Abstract",
  "Animals",
  "Sports",
  "Fashion",
  "Events",
]

export default function SellPage() {
  const [uploadType, setUploadType] = useState<"photo" | "video">("photo")
  const [tags, setTags] = useState<string[]>(["cinematic", "professional"])
  const [tagInput, setTagInput] = useState("")
  const [basePrice, setBasePrice] = useState("25")
  const [dragActive, setDragActive] = useState(false)

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-foreground font-display">
              Sell Your Content
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Upload your photos and videos to our marketplace. Set your prices, reach global buyers, 
              and keep 85% of every sale.
            </p>
          </div>

          <div className="space-y-16">
            {/* Main Upload Section */}
            <div className="space-y-8">
              {/* Content Type Selection */}
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Content Type</p>
                <div className="space-y-4">
                  <button
                    onClick={() => setUploadType("photo")}
                    className={`w-full text-left transition-colors ${
                      uploadType === "photo"
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <p className="text-lg font-semibold">Photo</p>
                    <p className="text-sm text-white/50 mt-1">JPG, PNG, RAW</p>
                  </button>
                  <button
                    onClick={() => setUploadType("video")}
                    className={`w-full text-left transition-colors ${
                      uploadType === "video"
                        ? "text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    <p className="text-lg font-semibold">Video</p>
                    <p className="text-sm text-white/50 mt-1">MP4, MOV, ProRes</p>
                  </button>
                </div>
              </section>

              {/* Upload Zone */}
              <section className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Upload {uploadType === "photo" ? "Photos" : "Videos"}
                </p>
                <div
                  className={`rounded-2xl p-12 text-center transition-colors ${
                    dragActive ? "bg-black/50" : "bg-black/40"
                  }`}
                  onDragEnter={() => setDragActive(true)}
                  onDragLeave={() => setDragActive(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => setDragActive(false)}
                >
                  <p className="font-medium mb-2 text-white">Drag and drop your files here</p>
                  <p className="text-sm text-white/50 mb-6">
                    {uploadType === "photo"
                      ? "Minimum 4MP resolution. JPG, PNG, or RAW formats."
                      : "Minimum 1080p resolution. MP4, MOV, or ProRes formats."
                    }
                  </p>
                  <Button variant="outline" className="bg-transparent text-white/70 rounded-full">
                    Browse files
                  </Button>
                </div>

                {/* Preview area */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-2xl bg-black/40" />
                  ))}
                  <button className="h-16 rounded-2xl bg-black/40 flex items-center justify-center transition-colors text-white/50">
                    +
                  </button>
                </div>
              </section>

              {/* Details Form */}
              <section className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Content Details</p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white/70">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                      className="mt-2 bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white/70">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your content, including location, subject, and any relevant details..."
                      className="mt-2 min-h-[120px] bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label className="text-white/70">Category</Label>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/50">
                      {categories.slice(0, 6).map((category) => (
                        <button
                          key={category}
                          className="transition-colors text-left hover:text-white"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <Button variant="link" className="mt-2 p-0 h-auto text-white/50">
                      Show all categories
                    </Button>
                  </div>

                  <div>
                    <Label className="text-white/70">Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-3 mb-3 text-sm text-white/70">
                      {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-2 text-white/70">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="text-white/40">
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                        placeholder="Add a tag"
                        className="bg-transparent border-0 px-0 text-white/80 placeholder:text-white/40"
                      />
                      <Button onClick={addTag} variant="outline" className="bg-transparent text-white/70">
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section className="space-y-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Pricing</p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="basePrice" className="text-white/70">Base Price (USD)</Label>
                    <div className="mt-2 relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      <Input
                        id="basePrice"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="pl-4 bg-transparent border-0 text-white/80"
                      />
                    </div>
                    <p className="mt-2 text-sm text-white/50">
                      You receive 85% (${(Number(basePrice) * 0.85).toFixed(2)}) per standard license sale
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="block text-white/70">License Tiers</Label>
                    {pricingTiers.map((tier) => (
                      <div key={tier.name} className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{tier.name}</p>
                          <p className="text-sm text-white/50">{tier.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">${(Number(basePrice) * tier.multiplier).toFixed(0)}</p>
                          <p className="text-xs text-white/50">
                            You get ${(Number(basePrice) * tier.multiplier * 0.85).toFixed(0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Submit */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent text-foreground/70 rounded-full">
                  Save as draft
                </Button>
                <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full">
                  Submit for review
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-10">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Your Stats</p>
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Total Sales</span>
                    <span className="text-white">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Earnings</span>
                    <span className="text-white">$3,245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Views</span>
                    <span className="text-white">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversion</span>
                    <span className="text-white">2.8%</span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Selling Tips</p>
                <div className="space-y-2 text-sm text-white/70">
                  <p>Use descriptive, keyword-rich titles</p>
                  <p>Add at least 10 relevant tags</p>
                  <p>Upload highest resolution available</p>
                  <p>Include model/property releases</p>
                  <p>Competitive pricing increases sales</p>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Revenue Calculator</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">If you sell 10 standard licenses</p>
                    <p className="text-2xl font-semibold text-white">${(Number(basePrice) * 10 * 0.85).toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">If you sell 100 standard licenses</p>
                    <p className="text-2xl font-semibold text-white">${(Number(basePrice) * 100 * 0.85).toFixed(0)}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
