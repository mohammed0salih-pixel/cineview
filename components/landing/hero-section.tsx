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
        <div className="mx-auto max-w-4xl text-center motion-rise">
          <p className="text-eyebrow mb-6">CineView AI</p>
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.02] text-balance text-white font-display">
            Cinematic Intelligence for{" "}
            <span className="text-[var(--cv-accent)]">Creative Decisions</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto motion-fade motion-delay-1">
            Decisions shaped by visual intelligence.
          </p>
          <div className="mt-12 flex justify-center motion-fade motion-delay-2">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-[var(--cv-accent)] text-white hover:bg-[color-mix(in_srgb,var(--cv-accent)_80%,#000)] h-12 px-10 text-base font-semibold tracking-wide"
              >
                Run Analysis →
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 motion-fade motion-delay-2">
          <div className="relative overflow-hidden rounded-[28px] bg-[#141416] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/60" />
            <img
              src="/images/hero-visual-analysis.jpg"
              alt=""
              aria-hidden
              className="relative w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
