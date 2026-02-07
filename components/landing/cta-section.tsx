"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="section-spacing motion-fade">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight mb-6 text-balance text-white font-display">
              Ready to elevate your creative work?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl">
              Join thousands of photographers and videographers who are using CineView AI to
              improve their craft and monetize their content.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link href="/upload">
                <Button size="lg" className="bg-[var(--cv-accent)] text-white hover:bg-[color-mix(in_srgb,var(--cv-accent)_80%,#000)] h-12 px-8 text-base w-full sm:w-auto">
                  Start for free
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" className="h-12 px-8 text-base bg-white/5 text-white hover:bg-white/10 w-full sm:w-auto">
                  Start selling
                </Button>
              </Link>
            </div>

            <div className="space-y-6 max-w-2xl text-left">
              <Link href="/upload" className="space-y-2 text-white/80 hover:text-white transition-colors">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">AI Analysis</p>
                <p className="text-sm text-white/60">Analyze your work</p>
              </Link>
              <Link href="/marketplace" className="space-y-2 text-white/80 hover:text-white transition-colors">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Marketplace</p>
                <p className="text-sm text-white/60">Browse content</p>
              </Link>
              <Link href="/sell" className="space-y-2 text-white/80 hover:text-white transition-colors">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Sell Content</p>
                <p className="text-sm text-white/60">Earn from your work</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
