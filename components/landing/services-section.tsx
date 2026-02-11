"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Star } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "For hobbyists and beginners",
    features: [
      "5 AI analyses per month",
      "Sell up to 10 items",
      "15% marketplace fee",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get started",
    href: "/upload",
    featured: false,
  },
  {
    name: "Creator",
    price: "$19",
    period: "/month",
    description: "For professional creators",
    features: [
      "Unlimited AI analyses",
      "Unlimited listings",
      "10% marketplace fee",
      "Advanced analytics",
      "Social optimizer",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/upload",
    featured: true,
  },
  {
    name: "Studio",
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Creator",
      "5 team members",
      "5% marketplace fee",
      "Client portals",
      "White-label options",
      "Dedicated manager",
    ],
    cta: "Contact sales",
    href: "/team",
    featured: false,
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 lg:py-32 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Plans for every creator
          </h2>
          <p className="text-muted-foreground">
            Start free and scale as you grow. All plans include access to our marketplace.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.featured
                  ? "border-primary/50 bg-card glow-red"
                  : "border-border/50 bg-background"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3" /> Most popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold tracking-tight ${tier.featured ? 'text-primary' : ''}`}>{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </div>
              
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${tier.featured ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href}>
                <Button 
                  className={`w-full ${
                    tier.featured 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All prices in USD. Cancel anytime. Need custom enterprise solutions?{" "}
          <Link href="/team" className="text-primary hover:underline">Contact us</Link>
        </p>
      </div>
    </section>
  )
}
