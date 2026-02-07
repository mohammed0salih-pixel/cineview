"use client"

import Link from "next/link"

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
    <section className="section-spacing motion-fade">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-eyebrow mb-4">Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-6 text-white font-display">
            Trusted by creators across the region
          </h2>
          <p className="text-lg text-white/60">
            Join thousands of photographers, videographers, and content creators who are growing their skills 
            and income with CineView AI.
          </p>
        </div>

        <div className="space-y-10 max-w-4xl">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-4">
              <blockquote className="text-lg leading-relaxed text-white">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <p className="font-medium text-white">{testimonial.author}</p>
                <p className="text-sm text-white/60">{testimonial.role}, {testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="space-y-10">
            <div>
              <p className="text-eyebrow mb-4">Saudi Vision 2030</p>
              <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4 text-white font-display">
                Building the future of Saudi creative economy
              </h3>
              <p className="text-white/60 leading-relaxed mb-6">
                CineView AI is proud to support Saudi Vision 2030 goals by empowering local creators, 
                fostering digital innovation, and building a thriving marketplace for Saudi visual content.
              </p>
              <Link
                href="/pitch-deck"
                className="inline-flex items-center gap-2 text-white/70 font-medium hover:underline"
              >
                Learn about our mission
              </Link>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <p className="text-3xl font-bold text-white">25K+</p>
                <p className="text-sm text-white/60 mt-1">Saudi Creators</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">$2M+</p>
                <p className="text-sm text-white/60 mt-1">Creator Earnings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">500K</p>
                <p className="text-sm text-white/60 mt-1">Assets Sold</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">150+</p>
                <p className="text-sm text-white/60 mt-1">Enterprise Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
