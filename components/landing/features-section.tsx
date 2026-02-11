"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ImageIcon, Video, Wand2, Users, TrendingUp, Download } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Analysis",
    description: "Get instant feedback on composition, lighting, color grading, and technical quality. Our AI learns from millions of professional images.",
    link: "/tools",
    image: "/images/ai-analysis-feature.jpg",
  },
  {
    icon: ImageIcon,
    title: "Photo Marketplace",
    description: "List your photographs for sale. High-resolution downloads, flexible licensing, and instant payments to creators.",
    link: "/sell",
    image: "/images/marketplace-showcase.jpg",
  },
  {
    icon: Video,
    title: "Video Marketplace", 
    description: "Sell stock footage, B-roll, and cinematic clips. 4K and RAW formats supported with preview watermarking.",
    link: "/sell",
    image: "/images/video-marketplace.jpg",
  },
  {
    icon: TrendingUp,
    title: "Social Optimization",
    description: "Auto-resize for every platform, AI-generated captions, optimal posting times, and hashtag recommendations.",
    link: "/social",
    image: "/images/social-optimization.jpg",
  },
  {
    icon: Users,
    title: "Team Workspace",
    description: "Collaborate with your team and clients. Shared projects, approval workflows, and real-time feedback.",
    link: "/team",
    image: "/images/team-collaboration.jpg",
  },
  {
    icon: Download,
    title: "Pro Integrations",
    description: "Export LUTs to Lightroom, DaVinci Resolve, and Premiere Pro. Sync with cloud storage automatically.",
    link: "/export",
    image: "/images/pro-integrations.jpg",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Features</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
            One platform for creating, analyzing, and <span className="text-primary">selling</span> your visual content.
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you are a photographer, videographer, or content creator, CineView AI gives you everything 
            you need to improve your craft and monetize your work.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              href={feature.link}
              className="group rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all overflow-hidden"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-primary/20 backdrop-blur border border-primary/30 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sell">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 glow-red">
              Start selling your content <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" className="h-11 px-6 bg-transparent border-border hover:border-primary/50">
              Explore marketplace
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
