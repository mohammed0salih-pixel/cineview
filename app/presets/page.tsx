"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import Link from "next/link"

const presets = [
  {
    id: 1,
    name: "Cinematic Drama",
    style: "Drama",
    description: "Deep shadows, rich contrast, and moody tones for emotional storytelling",
    adjustments: {
      exposure: -0.3,
      contrast: 25,
      saturation: -10,
      temperature: -5,
      highlights: -20,
      shadows: 15,
    },
    tags: ["Film", "Moody", "High Contrast"],
    recommended: true,
  },
  {
    id: 2,
    name: "Luxury Gold",
    style: "Luxury",
    description: "Warm golden tones with elegant contrast for premium brand content",
    adjustments: {
      exposure: 0.2,
      contrast: 15,
      saturation: 5,
      temperature: 15,
      highlights: 10,
      shadows: 5,
    },
    tags: ["Premium", "Warm", "Elegant"],
    recommended: false,
  },
  {
    id: 3,
    name: "Commercial Clean",
    style: "Commercial",
    description: "Bright, clean look with balanced colors for advertising campaigns",
    adjustments: {
      exposure: 0.5,
      contrast: 10,
      saturation: 15,
      temperature: 0,
      highlights: -10,
      shadows: 20,
    },
    tags: ["Bright", "Clean", "Vibrant"],
    recommended: false,
  },
  {
    id: 4,
    name: "Minimal Modern",
    style: "Minimal",
    description: "Desaturated, soft contrast for minimalist aesthetic",
    adjustments: {
      exposure: 0.1,
      contrast: -5,
      saturation: -20,
      temperature: -3,
      highlights: 5,
      shadows: 10,
    },
    tags: ["Soft", "Minimal", "Modern"],
    recommended: false,
  },
]

export default function PresetsPage() {
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [adjustments, setAdjustments] = useState(presets[0].adjustments)

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedPreset(preset)
    setAdjustments(preset.adjustments)
  }

  const updateAdjustment = (key: keyof typeof adjustments, value: number) => {
    setAdjustments(prev => ({ ...prev, [key]: value }))
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cinematic Preset Suggestions
            </h1>
            <p className="mt-4 text-lg text-white/60">
              AI-recommended presets based on your visual analysis
            </p>
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Recommended Presets</p>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className="block w-full text-left space-y-2"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <div className="flex flex-wrap items-center gap-2 text-white">
                    <span className="text-lg font-semibold">{preset.name}</span>
                    {preset.recommended && (
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Best Match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">{preset.style} Style</p>
                  <p className="text-sm text-white/50">{preset.description}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {preset.tags.join(" · ")}
                  </p>
                </button>
              ))}
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Preview</p>
              <div className="aspect-video bg-black/40 flex items-center justify-center relative">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-white/50 mb-2">Before</p>
                      <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-white/10 via-black/30 to-black/70" />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-white/50 mb-2">After: {selectedPreset.name}</p>
                      <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-white/15 via-black/20 to-black/80" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Fine-tune Adjustments</p>
              <p className="text-sm text-white/60">Customize the preset to your preference</p>
              <div className="space-y-6">
                  {/* Exposure */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">
                        Exposure
                      </label>
                      <span className="text-sm text-white/50">
                        {adjustments.exposure > 0 ? "+" : ""}{adjustments.exposure.toFixed(1)}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.exposure]}
                      min={-2}
                      max={2}
                      step={0.1}
                      onValueChange={([value]) => updateAdjustment("exposure", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">
                        Contrast
                      </label>
                      <span className="text-sm text-white/50">
                        {adjustments.contrast > 0 ? "+" : ""}{adjustments.contrast}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.contrast]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={([value]) => updateAdjustment("contrast", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">
                        Saturation
                      </label>
                      <span className="text-sm text-white/50">
                        {adjustments.saturation > 0 ? "+" : ""}{adjustments.saturation}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.saturation]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={([value]) => updateAdjustment("saturation", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">Temperature</label>
                      <span className="text-sm text-white/50">
                        {adjustments.temperature > 0 ? "+" : ""}{adjustments.temperature}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.temperature]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={([value]) => updateAdjustment("temperature", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">Highlights</label>
                      <span className="text-sm text-white/50">
                        {adjustments.highlights > 0 ? "+" : ""}{adjustments.highlights}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.highlights]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={([value]) => updateAdjustment("highlights", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>

                  {/* Shadows */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-white">Shadows</label>
                      <span className="text-sm text-white/50">
                        {adjustments.shadows > 0 ? "+" : ""}{adjustments.shadows}
                      </span>
                    </div>
                    <Slider
                      value={[adjustments.shadows]}
                      min={-50}
                      max={50}
                      step={1}
                      onValueChange={([value]) => updateAdjustment("shadows", value)}
                      className="[&>span:first-child]:bg-secondary [&>span:first-child>span]:bg-white/40"
                    />
                  </div>
              </div>
            </section>

            <section className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Actions</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1 bg-white text-black hover:bg-white/80">
                  Download Preset
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent text-white/70 hover:text-white">
                  Save to Project
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent text-white/70 hover:text-white">
                  <Link href="/assistant">
                    Plan Shoot
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
