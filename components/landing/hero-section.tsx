"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] pt-40 pb-32 lg:pt-52 lg:pb-36 overflow-hidden">
      <div className="absolute inset-0 cinematic-surface" />
      <div className="absolute inset-0 hero-diffusion" />
      <div className="absolute inset-0 hero-veil" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-4xl fade-soft">
          <p className="text-eyebrow mb-6">CineView AI</p>
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.02] text-balance text-white font-display">
            Cinematic Intelligence for Creative Decisions
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl">
            Decisions shaped by visual intelligence.
          </p>
          <div className="mt-12 flex">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-white/5 text-white hover:bg-white/10 h-12 px-10 text-base font-semibold tracking-wide"
              >
                Run Analysis →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
