"use client"

import React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sun, 
  Thermometer, 
  Palette, 
  Contrast, 
  Download, 
  Share2, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Lightbulb,
  Droplets,
  Sparkles
} from "lucide-react"
import Link from "next/link"

// Mock analysis data
const analysisData = {
  lighting: {
    type: "Soft",
    direction: "Top-Left",
    intensity: 72,
    quality: "Natural",
    source: "Window Light",
  },
  color: {
    temperature: "Warm",
    temperatureKelvin: 5200,
    dominantColors: [
      { name: "Deep Blue", hex: "#1a365d", percentage: 35 },
      { name: "Gold", hex: "#d4a574", percentage: 25 },
      { name: "Charcoal", hex: "#2d3748", percentage: 20 },
      { name: "Cream", hex: "#f7f3e9", percentage: 15 },
      { name: "Bronze", hex: "#8b6914", percentage: 5 },
    ],
  },
  technical: {
    contrast: 68,
    saturation: 54,
    brightness: 62,
    sharpness: 78,
    noise: 12,
  },
  mood: "Cinematic Drama",
  style: "Film Noir with Modern Elements",
}

const lightingDirectionIcons: Record<string, React.ReactNode> = {
  "Top-Left": <ArrowUpRight className="h-5 w-5 rotate-[-135deg]" />,
  "Top-Right": <ArrowUpRight className="h-5 w-5" />,
  "Bottom-Left": <ArrowDownRight className="h-5 w-5 rotate-180" />,
  "Bottom-Right": <ArrowDownRight className="h-5 w-5" />,
  "Left": <ArrowLeft className="h-5 w-5" />,
  "Right": <ArrowRight className="h-5 w-5" />,
}

export default function AnalysisPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Analysis Complete</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Visual Analysis <span className="text-gradient-gold">Results</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                AI-powered breakdown of your visual content
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border/50 text-foreground hover:bg-secondary bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-gold">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Preview Card */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Your uploaded image preview</p>
                  </div>
                </div>
              </Card>

              {/* Analysis Tabs */}
              <Tabs defaultValue="lighting" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-secondary">
                  <TabsTrigger value="lighting" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                    Lighting
                  </TabsTrigger>
                  <TabsTrigger value="color" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                    Color
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:bg-primary data-[state=active]:text-background">
                    Technical
                  </TabsTrigger>
                </TabsList>

                {/* Lighting Tab */}
                <TabsContent value="lighting" className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Sun className="h-4 w-4 text-primary" />
                          Lighting Type
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{analysisData.lighting.type}</div>
                        <p className="text-sm text-muted-foreground">
                          {analysisData.lighting.quality} quality from {analysisData.lighting.source}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <ArrowUpRight className="h-4 w-4 text-primary" />
                          Light Direction
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                            {lightingDirectionIcons[analysisData.lighting.direction]}
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{analysisData.lighting.direction}</div>
                            <p className="text-sm text-muted-foreground">Primary light source</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm sm:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Light Intensity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Progress value={analysisData.lighting.intensity} className="flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-lg font-semibold text-primary">{analysisData.lighting.intensity}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Color Tab */}
                <TabsContent value="color" className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Thermometer className="h-4 w-4 text-primary" />
                          Color Temperature
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">{analysisData.color.temperature}</div>
                        <p className="text-sm text-muted-foreground">
                          ~{analysisData.color.temperatureKelvin}K
                        </p>
                        <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-blue-500 via-white to-orange-500">
                          <div 
                            className="relative h-4 w-4 -translate-y-1 rounded-full border-2 border-background bg-primary"
                            style={{ marginLeft: `${((analysisData.color.temperatureKelvin - 2000) / 8000) * 100}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Palette className="h-4 w-4 text-primary" />
                          Color Palette
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4">
                          {analysisData.color.dominantColors.map((color) => (
                            <div
                              key={color.hex}
                              className="h-10 flex-1 rounded-md border border-border"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name}: ${color.percentage}%`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm sm:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-foreground">Color Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysisData.color.dominantColors.map((color) => (
                            <div key={color.hex} className="flex items-center gap-3">
                              <div
                                className="h-4 w-4 rounded border border-border"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="w-24 text-sm text-foreground">{color.name}</span>
                              <Progress value={color.percentage} className="flex-1 bg-secondary [&>div]:bg-primary" />
                              <span className="w-12 text-right text-sm text-muted-foreground">{color.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Technical Tab */}
                <TabsContent value="technical" className="mt-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Contrast className="h-4 w-4 text-primary" />
                          Contrast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Progress value={analysisData.technical.contrast} className="flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-lg font-semibold text-primary">{analysisData.technical.contrast}%</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">High contrast for dramatic effect</p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-foreground">
                          <Droplets className="h-4 w-4 text-primary" />
                          Saturation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Progress value={analysisData.technical.saturation} className="flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-lg font-semibold text-primary">{analysisData.technical.saturation}%</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Balanced saturation levels</p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-foreground">Brightness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Progress value={analysisData.technical.brightness} className="flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-lg font-semibold text-primary">{analysisData.technical.brightness}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base text-foreground">Sharpness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <Progress value={analysisData.technical.sharpness} className="flex-1 bg-secondary [&>div]:bg-primary" />
                          <span className="text-lg font-semibold text-primary">{analysisData.technical.sharpness}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Overall Assessment */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Overall Assessment</CardTitle>
                  <CardDescription>AI-detected style and mood</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Detected Mood</p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">{analysisData.mood}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Visual Style</p>
                    <p className="text-foreground font-medium">{analysisData.style}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Next Steps</CardTitle>
                  <CardDescription>Continue with your content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-primary text-background hover:bg-primary-dark">
                    <Link href="/presets">
                      Get Preset Suggestions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent">
                    <Link href="/assistant">
                      Plan Pre-Production
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent">
                    <Link href="/upload">
                      Analyze Another
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Save to Project */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Save Analysis</CardTitle>
                  <CardDescription>Add to your project library</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary hover:text-primary bg-transparent">
                    Save to Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
