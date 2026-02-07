"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] pt-40 pb-28 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 cinematic-surface" />
      <div className="absolute inset-0 hero-diffusion" />
      <div className="absolute inset-0 hero-veil" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto fade-soft">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.04] text-balance text-white font-display">
            Cinematic Intelligence for Creative Decisions
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/60">
            Decisions shaped by visual intelligence.
          </p>
          <div className="mt-12 flex justify-center">
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
