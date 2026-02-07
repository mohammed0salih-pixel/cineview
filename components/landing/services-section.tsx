"use client"

import { Button } from "@/components/ui/button"
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
    <section className="section-spacing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-eyebrow mb-4">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 text-white font-display">
            Plans for every creator
          </h2>
          <p className="text-white/60">
            Start free and scale as you grow. All plans include access to our marketplace.
          </p>
        </div>

        <div className="space-y-14 max-w-3xl">
          {tiers.map((tier, index) => (
            <div key={index} className="space-y-6 py-4">
              {tier.featured && (
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Most popular</p>
              )}
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-white font-display">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
                  {tier.period && <span className="text-white/50">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm text-white/60">{tier.description}</p>
              </div>

              <div className="space-y-2">
                {tier.features.map((feature) => (
                  <p key={feature} className="text-sm text-white/80">
                    {feature}
                  </p>
                ))}
              </div>

              <Link href={tier.href}>
                <Button className="bg-white/5 hover:bg-white/10 text-white px-6">
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-white/50">
          All prices in USD. Cancel anytime. Need custom enterprise solutions?{" "}
          <Link href="/team" className="text-white/70 hover:underline">Contact us</Link>
        </p>
      </div>
    </section>
  )
}
