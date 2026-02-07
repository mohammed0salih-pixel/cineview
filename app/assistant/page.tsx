"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
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

          <div className="space-y-16">
            <section className="space-y-8">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Project Brief</p>
                <h2 className="text-2xl font-semibold text-white">Tell us about your shoot</h2>
                <p className="text-sm text-white/60">Define intent, mood, and location to shape the pre-production plan.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-type" className="text-white/70">Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger id="project-type" className="bg-transparent text-white border-0 px-0">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                      {projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-white/80">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood" className="text-white/70">Desired Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood" className="bg-transparent text-white border-0 px-0">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                      {moodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white/80">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white/70">Location Type</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location" className="bg-transparent text-white border-0 px-0">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
                      {locationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white/80">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white/70">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your vision, subject matter, or any specific requirements..."
                    className="min-h-[120px] bg-transparent text-white/80 placeholder:text-white/40 border-0 px-0"
                  />
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="bg-white text-black hover:bg-white/80 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate Recommendations"}
              </Button>
            </section>

            {showResults && (
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quick Actions</p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="bg-transparent text-white/70 hover:text-white">
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="bg-transparent text-white/70 hover:text-white">
                    Save to Project
                  </Button>
                </div>
              </section>
            )}

            <section className="space-y-8">
              {!showResults ? (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Readiness</p>
                  <h3 className="text-2xl font-semibold text-white">Ready to Plan Your Shoot</h3>
                  <p className="text-sm text-white/60 max-w-2xl">
                    Fill in the project brief and click generate to receive AI-powered lighting, art direction, and technical recommendations.
                  </p>
                </div>
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
                  <TabsContent value="lighting" className="mt-6 space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Lighting Setup</p>
                      <h3 className="text-2xl font-semibold text-white">Recommended lighting configuration</h3>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <p className="text-lg font-semibold text-white">{recommendations.lighting.primary}</p>
                      <p>Key Light: {recommendations.lighting.keyLight}</p>
                      <p>Fill Light: {recommendations.lighting.fillLight}</p>
                      <p>Back Light: {recommendations.lighting.backLight}</p>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <p>Light Ratio: {recommendations.lighting.ratio}</p>
                      <p>Color Temperature: {recommendations.lighting.colorTemp}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/70">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Recommended Modifiers</p>
                      <p>{recommendations.lighting.modifiers.join(" · ")}</p>
                    </div>
                  </TabsContent>

                  {/* Art Direction Tab */}
                  <TabsContent value="direction" className="mt-6 space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Art Direction</p>
                      <h3 className="text-2xl font-semibold text-white">Visual style and composition</h3>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Recommended Style</p>
                      <p className="text-lg font-semibold text-white">{recommendations.artDirection.style}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/70">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color Palette</p>
                      <p>{recommendations.artDirection.colorPalette.join(" · ")}</p>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <p>Composition: {recommendations.artDirection.composition}</p>
                      <p>Depth of Field: {recommendations.artDirection.depth}</p>
                    </div>
                    <div className="space-y-2 text-sm text-white/70">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Suggested Props</p>
                      <p>{recommendations.artDirection.props.join(" · ")}</p>
                    </div>
                  </TabsContent>

                  {/* Moodboard Tab */}
                  <TabsContent value="moodboard" className="mt-6 space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Moodboard</p>
                      <h3 className="text-2xl font-semibold text-white">Visual references</h3>
                    </div>
                    <div className="space-y-8">
                      {recommendations.moodboard.map((item, index) => (
                        <div key={index} className="space-y-3">
                          <div className="aspect-video bg-black/40 flex items-center justify-center">
                            <span className="text-xs text-white/40">Preview</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-semibold text-white">{item.title}</p>
                            <p className="text-sm text-white/60">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Technical Tab */}
                  <TabsContent value="technical" className="mt-6 space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Technical Recommendations</p>
                      <h3 className="text-2xl font-semibold text-white">Camera settings and equipment</h3>
                    </div>
                    <div className="space-y-3 text-sm text-white/70">
                      <p>Camera: {recommendations.technical.camera}</p>
                      <p>Lens: {recommendations.technical.lens}</p>
                      <p>ISO: {recommendations.technical.iso}</p>
                      <p>Aperture: {recommendations.technical.aperture}</p>
                      <p>Shutter Speed: {recommendations.technical.shutter}</p>
                    </div>
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
