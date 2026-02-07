"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { generatePreproductionRecommendations } from "@/lib/preproduction"

const projectTypes = [
  { value: "advertising", label: "Advertising Campaign" },
  { value: "real-estate", label: "Real Estate" },
  { value: "fashion", label: "Fashion Editorial" },
  { value: "product", label: "Product Photography" },
  { value: "portrait", label: "Portrait Session" },
  { value: "cinema", label: "Cinema / Film" },
]

const moodOptions = [
  { value: "dramatic", label: "Dramatic" },
  { value: "minimal", label: "Minimal" },
  { value: "luxury", label: "Luxury" },
  { value: "warm", label: "Warm & Cozy" },
  { value: "cool", label: "Cool & Modern" },
  { value: "cinematic", label: "Cinematic" },
]

const locationOptions = [
  { value: "studio", label: "Studio" },
  { value: "outdoor", label: "Outdoor" },
  { value: "interior", label: "Interior" },
  { value: "urban", label: "Urban" },
  { value: "nature", label: "Nature" },
]

const defaultRecommendations = generatePreproductionRecommendations({
  projectType: "cinema",
  mood: "cinematic",
  location: "studio",
  description: "",
})

export default function AssistantPage() {
  const [projectType, setProjectType] = useState("")
  const [mood, setMood] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState(defaultRecommendations)

  const handleGenerate = () => {
    setIsGenerating(true)
    const result = generatePreproductionRecommendations({
      projectType,
      mood,
      location,
      description,
    })
    setTimeout(() => {
      setRecommendations(result)
      setIsGenerating(false)
      setShowResults(true)
    }, 400)
  }

  const canGenerate = projectType && mood && location

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl font-display">
              Pre-Production Assistant
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-powered planning for your next shoot: lighting, art direction, moodboards, and technical recommendations
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Input Form */}
            <div className="space-y-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    Project Brief
                  </CardTitle>
                  <CardDescription>Tell us about your shoot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="project-type" className="text-foreground">Project Type</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type" className="bg-transparent text-foreground">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-foreground hover:bg-secondary">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mood */}
                  <div className="space-y-2">
                    <Label htmlFor="mood" className="text-foreground">Desired Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood" className="bg-transparent text-foreground">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-secondary">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground">Location Type</Label>
                    <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="bg-transparent text-foreground">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {locationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-secondary">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">Additional Details (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your vision, subject matter, or any specific requirements..."
                      className="min-h-[100px] bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full bg-white text-black hover:bg-white/80 disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Generate Recommendations"}
                  </Button>
                </CardContent>
              </Card>

              {showResults && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full bg-transparent text-foreground/70 hover:text-foreground">
                      Export as PDF
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent text-foreground/70 hover:text-foreground">
                      Save to Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {!showResults ? (
                <Card className="bg-card h-full flex items-center justify-center min-h-[500px]">
                  <CardContent className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">Ready to Plan Your Shoot</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Fill in the project brief and click generate to receive AI-powered lighting, art direction, and technical recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="lighting" className="w-full">
                  <TabsList className="flex flex-wrap gap-4 bg-transparent p-0">
                    <TabsTrigger value="lighting" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] data-[state=active]:text-foreground text-foreground/60">
                      Lighting
                    </TabsTrigger>
                    <TabsTrigger value="direction" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] data-[state=active]:text-foreground text-foreground/60">
                      Art Direction
                    </TabsTrigger>
                    <TabsTrigger value="moodboard" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] data-[state=active]:text-foreground text-foreground/60">
                      Moodboard
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] data-[state=active]:text-foreground text-foreground/60">
                      Technical
                    </TabsTrigger>
                  </TabsList>

                  {/* Lighting Tab */}
                  <TabsContent value="lighting" className="mt-6">
                    <Card className="bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          Lighting Setup
                        </CardTitle>
                        <CardDescription>Recommended lighting configuration for your shoot</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <h4 className="font-semibold text-foreground mb-2">{recommendations.lighting.primary}</h4>
                          <div className="space-y-2 text-sm text-foreground">
                            <p><span className="text-muted-foreground">Key Light:</span> {recommendations.lighting.keyLight}</p>
                            <p><span className="text-muted-foreground">Fill Light:</span> {recommendations.lighting.fillLight}</p>
                            <p><span className="text-muted-foreground">Back Light:</span> {recommendations.lighting.backLight}</p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Light Ratio</p>
                            <p className="text-lg font-semibold text-foreground">{recommendations.lighting.ratio}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Color Temperature</p>
                            <p className="text-lg font-semibold text-foreground">{recommendations.lighting.colorTemp}</p>
                          </div>
                        </div>

                          <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Recommended Modifiers</p>
                          <p className="text-sm text-foreground/80">
                            {recommendations.lighting.modifiers.join(" · ")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Art Direction Tab */}
                  <TabsContent value="direction" className="mt-6">
                    <Card className="bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          Art Direction
                        </CardTitle>
                        <CardDescription>Visual style and composition guidelines</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground">Recommended Style</p>
                          <p className="text-lg font-semibold text-foreground">{recommendations.artDirection.style}</p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Color Palette</p>
                          <p className="text-sm text-foreground/80">
                            {recommendations.artDirection.colorPalette.join(" · ")}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Composition</p>
                            <p className="text-foreground">{recommendations.artDirection.composition}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Depth of Field</p>
                            <p className="text-foreground">{recommendations.artDirection.depth}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Suggested Props</p>
                          <p className="text-sm text-foreground/80">
                            {recommendations.artDirection.props.join(" · ")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Moodboard Tab */}
                  <TabsContent value="moodboard" className="mt-6">
                    <Card className="bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          Moodboard
                        </CardTitle>
                        <CardDescription>Visual references for your shoot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {recommendations.moodboard.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg bg-secondary/30">
                              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">Preview</span>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-foreground">{item.title}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Technical Tab */}
                  <TabsContent value="technical" className="mt-6">
                    <Card className="bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          Technical Recommendations
                        </CardTitle>
                        <CardDescription>Camera settings and equipment suggestions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Camera</p>
                            <p className="font-semibold text-foreground">{recommendations.technical.camera}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Lens</p>
                            <p className="font-semibold text-foreground">{recommendations.technical.lens}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">ISO</p>
                            <p className="font-semibold text-foreground">{recommendations.technical.iso}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <p className="text-sm text-muted-foreground">Aperture</p>
                            <p className="font-semibold text-foreground">{recommendations.technical.aperture}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 sm:col-span-2">
                            <p className="text-sm text-muted-foreground">Shutter Speed</p>
                            <p className="font-semibold text-foreground">{recommendations.technical.shutter}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
