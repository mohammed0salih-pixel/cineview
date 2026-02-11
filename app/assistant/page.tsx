"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Lightbulb, 
  Palette, 
  Camera, 
  Wand2,
  Download,
  Save,
  RefreshCw,
  Sun,
  Sparkles,
  Layout,
  ImageIcon
} from "lucide-react"
import { useState } from "react"

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

// Mock generated recommendations
const mockRecommendations = {
  lighting: {
    primary: "Three-point lighting setup",
    keyLight: "Softbox at 45° angle, camera left",
    fillLight: "Reflector at 30° angle, camera right",
    backLight: "Rim light for subject separation",
    ratio: "2:1 key to fill ratio",
    colorTemp: "5500K for neutral tones",
    modifiers: ["Large softbox", "Reflector", "Grid for backlight"],
  },
  artDirection: {
    style: "Cinematic Drama with Luxury Elements",
    colorPalette: ["#1a365d", "#d4a574", "#2d3748", "#f7f3e9"],
    props: ["Velvet textures", "Metallic accents", "Dark wood surfaces"],
    composition: "Rule of thirds with negative space on right",
    depth: "Shallow depth of field, f/2.8",
  },
  moodboard: [
    { title: "Key Reference", description: "Dark, moody atmosphere with gold highlights" },
    { title: "Color Tone", description: "Deep blues and warm gold accents" },
    { title: "Texture", description: "Soft fabrics, metallic surfaces" },
    { title: "Mood", description: "Sophisticated, elegant, mysterious" },
  ],
  technical: {
    camera: "Full-frame mirrorless recommended",
    lens: "85mm f/1.4 for portraits, 35mm f/1.8 for wider shots",
    iso: "ISO 100-400 for optimal quality",
    aperture: "f/2.8-f/4 for subject isolation",
    shutter: "1/125s minimum for sharp results",
  },
}

export default function AssistantPage() {
  const [projectType, setProjectType] = useState("")
  const [mood, setMood] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      setShowResults(true)
    }, 1500)
  }

  const canGenerate = projectType && mood && location

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pre-Production Assistant
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI-powered planning for your next shoot: lighting, art direction, moodboards, and technical recommendations
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Input Form */}
            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Wand2 className="h-5 w-5 text-primary" />
                    Project Brief
                  </CardTitle>
                  <CardDescription>Tell us about your shoot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label htmlFor="project-type" className="text-foreground">Project Type</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger id="project-type" className="border-border bg-secondary/50 text-foreground">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
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
                      <SelectTrigger id="mood" className="border-border bg-secondary/50 text-foreground">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
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
                      <SelectTrigger id="location" className="border-border bg-secondary/50 text-foreground">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
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
                      className="min-h-[100px] border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full bg-primary text-background hover:bg-primary-dark disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {showResults && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary hover:text-primary bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </Button>
                    <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary hover:text-primary bg-transparent">
                      <Save className="mr-2 h-4 w-4" />
                      Save to Project
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              {!showResults ? (
                <Card className="border-border bg-card h-full flex items-center justify-center min-h-[500px]">
                  <CardContent className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Ready to Plan Your Shoot</h3>
                    <p className="mt-2 text-muted-foreground max-w-md">
                      Fill in the project brief and click generate to receive AI-powered lighting, art direction, and technical recommendations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="lighting" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-secondary">
                    <TabsTrigger value="lighting" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                      <Sun className="mr-2 h-4 w-4" />
                      Lighting
                    </TabsTrigger>
                    <TabsTrigger value="direction" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                      <Palette className="mr-2 h-4 w-4" />
                      Art Direction
                    </TabsTrigger>
                    <TabsTrigger value="moodboard" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                      <Layout className="mr-2 h-4 w-4" />
                      Moodboard
                    </TabsTrigger>
                    <TabsTrigger value="technical" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                      <Camera className="mr-2 h-4 w-4" />
                      Technical
                    </TabsTrigger>
                  </TabsList>

                  {/* Lighting Tab */}
                  <TabsContent value="lighting" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Sun className="h-5 w-5 text-primary" />
                          Lighting Setup
                        </CardTitle>
                        <CardDescription>Recommended lighting configuration for your shoot</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                          <h4 className="font-semibold text-primary mb-2">{mockRecommendations.lighting.primary}</h4>
                          <div className="space-y-2 text-sm text-foreground">
                            <p><span className="text-muted-foreground">Key Light:</span> {mockRecommendations.lighting.keyLight}</p>
                            <p><span className="text-muted-foreground">Fill Light:</span> {mockRecommendations.lighting.fillLight}</p>
                            <p><span className="text-muted-foreground">Back Light:</span> {mockRecommendations.lighting.backLight}</p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Light Ratio</p>
                            <p className="text-lg font-semibold text-foreground">{mockRecommendations.lighting.ratio}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Color Temperature</p>
                            <p className="text-lg font-semibold text-foreground">{mockRecommendations.lighting.colorTemp}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Recommended Modifiers</p>
                          <div className="flex flex-wrap gap-2">
                            {mockRecommendations.lighting.modifiers.map((modifier) => (
                              <Badge key={modifier} className="bg-primary/20 text-primary">{modifier}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Art Direction Tab */}
                  <TabsContent value="direction" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Palette className="h-5 w-5 text-primary" />
                          Art Direction
                        </CardTitle>
                        <CardDescription>Visual style and composition guidelines</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                          <p className="text-sm text-muted-foreground">Recommended Style</p>
                          <p className="text-lg font-semibold text-primary">{mockRecommendations.artDirection.style}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-3">Color Palette</p>
                          <div className="flex gap-3">
                            {mockRecommendations.artDirection.colorPalette.map((color) => (
                              <div key={color} className="text-center">
                                <div 
                                  className="h-16 w-16 rounded-lg border border-border"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="mt-1 text-xs text-muted-foreground">{color}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Composition</p>
                            <p className="text-foreground">{mockRecommendations.artDirection.composition}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Depth of Field</p>
                            <p className="text-foreground">{mockRecommendations.artDirection.depth}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Suggested Props</p>
                          <div className="flex flex-wrap gap-2">
                            {mockRecommendations.artDirection.props.map((prop) => (
                              <Badge key={prop} variant="outline" className="border-border text-foreground">{prop}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Moodboard Tab */}
                  <TabsContent value="moodboard" className="mt-6">
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Layout className="h-5 w-5 text-primary" />
                          Moodboard
                        </CardTitle>
                        <CardDescription>Visual references for your shoot</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {mockRecommendations.moodboard.map((item, index) => (
                            <div key={index} className="overflow-hidden rounded-lg border border-border bg-secondary/30">
                              <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
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
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Camera className="h-5 w-5 text-primary" />
                          Technical Recommendations
                        </CardTitle>
                        <CardDescription>Camera settings and equipment suggestions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Camera</p>
                            <p className="font-semibold text-foreground">{mockRecommendations.technical.camera}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Lens</p>
                            <p className="font-semibold text-foreground">{mockRecommendations.technical.lens}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">ISO</p>
                            <p className="font-semibold text-foreground">{mockRecommendations.technical.iso}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                            <p className="text-sm text-muted-foreground">Aperture</p>
                            <p className="font-semibold text-foreground">{mockRecommendations.technical.aperture}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50 border border-border sm:col-span-2">
                            <p className="text-sm text-muted-foreground">Shutter Speed</p>
                            <p className="font-semibold text-foreground">{mockRecommendations.technical.shutter}</p>
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
