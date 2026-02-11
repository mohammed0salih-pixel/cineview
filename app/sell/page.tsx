"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  ImageIcon,
  Video,
  DollarSign,
  Tag,
  Plus,
  X,
  Check,
  TrendingUp,
  Eye,
  ShoppingCart,
  ArrowRight,
  Info,
  Camera,
  Film,
} from "lucide-react"

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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Sell Your Content
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Upload your photos and videos to our marketplace. Set your prices, reach global buyers, 
              and keep 85% of every sale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Upload Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Content Type Selection */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Content Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setUploadType("photo")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        uploadType === "photo"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <Camera className="h-8 w-8 mb-3 mx-auto" />
                      <p className="font-medium">Photo</p>
                      <p className="text-sm text-muted-foreground mt-1">JPG, PNG, RAW</p>
                    </button>
                    <button
                      onClick={() => setUploadType("video")}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        uploadType === "video"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <Film className="h-8 w-8 mb-3 mx-auto" />
                      <p className="font-medium">Video</p>
                      <p className="text-sm text-muted-foreground mt-1">MP4, MOV, ProRes</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Zone */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Upload {uploadType === "photo" ? "Photos" : "Videos"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => setDragActive(false)}
                  >
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-2">Drag and drop your files here</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      {uploadType === "photo" 
                        ? "Minimum 4MP resolution. JPG, PNG, or RAW formats."
                        : "Minimum 1080p resolution. MP4, MOV, or ProRes formats."
                      }
                    </p>
                    <Button variant="outline" className="bg-transparent">
                      <Plus className="h-4 w-4 mr-2" /> Browse files
                    </Button>
                  </div>

                  {/* Preview area */}
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center">
                        {uploadType === "photo" ? (
                          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                        ) : (
                          <Video className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>
                    ))}
                    <button className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-muted-foreground/50 flex items-center justify-center transition-colors">
                      <Plus className="h-6 w-6 text-muted-foreground/50" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Details Form */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Content Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                      className="mt-2 bg-background border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your content, including location, subject, and any relevant details..."
                      className="mt-2 min-h-[100px] bg-background border-border"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {categories.slice(0, 6).map((category) => (
                        <button
                          key={category}
                          className="px-3 py-2 text-sm rounded-lg border border-border hover:border-foreground/50 transition-colors text-left"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                    <Button variant="link" className="mt-2 p-0 h-auto text-muted-foreground">
                      Show all categories
                    </Button>
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-2 mb-3">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="ml-2">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                        placeholder="Add a tag"
                        className="bg-background border-border"
                      />
                      <Button onClick={addTag} variant="outline" className="bg-transparent">
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" /> Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="basePrice">Base Price (USD)</Label>
                    <div className="mt-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="basePrice"
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="pl-7 bg-background border-border"
                      />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You receive 85% (${(Number(basePrice) * 0.85).toFixed(2)}) per standard license sale
                    </p>
                  </div>

                  <div>
                    <Label className="mb-3 block">License Tiers</Label>
                    <div className="space-y-3">
                      {pricingTiers.map((tier) => (
                        <div
                          key={tier.name}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-background"
                        >
                          <div>
                            <p className="font-medium">{tier.name}</p>
                            <p className="text-sm text-muted-foreground">{tier.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(Number(basePrice) * tier.multiplier).toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">
                              You get ${(Number(basePrice) * tier.multiplier * 0.85).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 bg-transparent border-border">
                  Save as draft
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-red">
                  Submit for review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="font-semibold">127</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                        <p className="font-semibold">$3,245</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="font-semibold">45.2K</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p className="font-semibold">2.8%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" /> Selling Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Use descriptive, keyword-rich titles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Add at least 10 relevant tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Upload highest resolution available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Include model/property releases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Competitive pricing increases sales</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Revenue Calculator */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <p className="text-sm text-muted-foreground mb-1">If you sell 10 standard licenses</p>
                      <p className="text-2xl font-bold">${(Number(basePrice) * 10 * 0.85).toFixed(0)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background border border-border">
                      <p className="text-sm text-muted-foreground mb-1">If you sell 100 standard licenses</p>
                      <p className="text-2xl font-bold">${(Number(basePrice) * 100 * 0.85).toFixed(0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
