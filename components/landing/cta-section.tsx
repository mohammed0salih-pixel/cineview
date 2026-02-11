"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Video, DollarSign } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/30 to-transparent overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-primary/10 blur-3xl" />
          
          <div className="relative p-12 lg:p-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6 max-w-3xl mx-auto text-balance">
              Ready to <span className="text-primary">elevate</span> your creative work?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of photographers and videographers who are using CineView AI to 
              improve their craft and monetize their content.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/upload">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base w-full sm:w-auto glow-red">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent border-border hover:border-primary/50 w-full sm:w-auto">
                  Start selling
                </Button>
              </Link>
            </div>

            {/* Quick links */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Link 
                href="/tools"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">AI Analysis</p>
                  <p className="text-sm text-muted-foreground">Analyze your work</p>
                </div>
              </Link>
              <Link 
                href="/marketplace"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Marketplace</p>
                  <p className="text-sm text-muted-foreground">Browse content</p>
                </div>
              </Link>
              <Link 
                href="/sell"
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Sell Content</p>
                  <p className="text-sm text-muted-foreground">Earn from your work</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
