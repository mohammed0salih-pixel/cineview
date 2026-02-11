"use client"

import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "CineView AI transformed how I approach my photography. The AI analysis helped me understand my weak points and improve dramatically.",
    author: "Sarah Ahmed",
    role: "Professional Photographer",
    location: "Riyadh",
  },
  {
    quote: "I have made over $5,000 selling my drone footage on the marketplace. The platform makes it incredibly easy to reach buyers.",
    author: "Mohammed Al-Rashid",
    role: "Videographer",
    location: "Jeddah",
  },
  {
    quote: "The team collaboration features saved us hours on every project. Client approvals that took days now happen in minutes.",
    author: "Noura Khalid",
    role: "Creative Director",
    location: "Dubai",
  },
]

export function VisionSection() {
  return (
    <section className="py-24 lg:py-32 border-t border-border/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
            Trusted by creators across the region
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of photographers, videographers, and content creators who are growing their skills 
            and income with CineView AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-border/50 bg-card/30 hover:border-primary/20 transition-colors"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <blockquote className="text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">{testimonial.author[0]}</span>
                </div>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision 2030 Banner */}
        <div className="mt-16 p-8 lg:p-12 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Saudi Vision 2030</p>
              <h3 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">
                Building the future of Saudi creative economy
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                CineView AI is proud to support Saudi Vision 2030 goals by empowering local creators, 
                fostering digital innovation, and building a thriving marketplace for Saudi visual content.
              </p>
              <Link 
                href="/pitch-deck" 
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Learn about our mission <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-6 rounded-xl bg-background border border-border/50">
                  <p className="text-3xl font-bold text-primary">25K+</p>
                  <p className="text-sm text-muted-foreground mt-1">Saudi Creators</p>
                </div>
                <div className="p-6 rounded-xl bg-background border border-border/50">
                  <p className="text-3xl font-bold">$2M+</p>
                  <p className="text-sm text-muted-foreground mt-1">Creator Earnings</p>
                </div>
                <div className="p-6 rounded-xl bg-background border border-border/50">
                  <p className="text-3xl font-bold">500K</p>
                  <p className="text-sm text-muted-foreground mt-1">Assets Sold</p>
                </div>
                <div className="p-6 rounded-xl bg-background border border-border/50">
                  <p className="text-3xl font-bold text-primary">150+</p>
                  <p className="text-sm text-muted-foreground mt-1">Enterprise Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
