"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Camera, Video, DollarSign, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm text-primary font-medium">✨ Powered by Gemini 2.5 AI</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance">
            Create. Analyze.
            <br />
            <span className="text-gradient-red">Sell your work.</span>
          </h1>
          <p className="mt-8 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The complete platform for photographers and videographers. AI-powered analysis, 
            professional tools, and a marketplace to monetize your creative content.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-semibold w-full sm:w-auto glow-red">
                Start creating <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium bg-transparent border-border hover:bg-card hover:border-primary/50 w-full sm:w-auto">
                <Play className="mr-2 h-4 w-4" /> Browse marketplace
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          <Link href="/tools" className="group p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Visual Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get instant feedback on composition, lighting, color theory, and technical quality with our advanced AI.
            </p>
          </Link>

          <Link href="/projects" className="group p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Pro Creator Tools</h3>
            <p className="text-muted-foreground leading-relaxed">
              Project management, team collaboration, social optimization, and export to all major editing software.
            </p>
          </Link>

          <Link href="/sell" className="group p-8 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sell Your Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              List your photos and videos on our marketplace. Set your prices, reach global buyers, keep 85% of sales.
            </p>
          </Link>
        </div>

        {/* Hero Image Showcase */}
        <div className="mt-20 relative">
          <div className="relative rounded-2xl border border-border/50 overflow-hidden bg-card/30 p-2">
            <Image
              src="/images/hero-visual-analysis.jpg"
              alt="CineView AI Visual Analysis Platform"
              width={1600}
              height={900}
              sizes="100vw"
              className="w-full rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-xl" />
          </div>
          {/* Floating badges */}
          <div className="absolute -left-4 top-1/4 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">AI Analysis Active</span>
          </div>
          <div className="absolute -right-4 top-1/3 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/30 shadow-lg">
            <span className="text-sm font-medium text-primary">+85% Quality Score</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 flex flex-wrap justify-center gap-x-16 gap-y-8 text-center">
          <div>
            <p className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">10K+</p>
            <p className="mt-2 text-sm text-muted-foreground">Active Creators</p>
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">500K+</p>
            <p className="mt-2 text-sm text-muted-foreground">Images Analyzed</p>
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">85%</p>
            <p className="mt-2 text-sm text-muted-foreground">Creator Revenue</p>
          </div>
          <div>
            <p className="text-4xl lg:text-5xl font-bold tracking-tight text-primary">4.9/5</p>
            <p className="mt-2 text-sm text-muted-foreground">User Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
