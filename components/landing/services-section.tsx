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
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-eyebrow mb-4">Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-4 text-white font-display">
            Plans for every creator
          </h2>
          <p className="text-white/60">
            Start free and scale as you grow. All plans include access to our marketplace.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">{tier.price}</span>
                  {tier.period && <span className="text-white/50">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm text-white/60">{tier.description}</p>
              </div>
              
              <ul className="flex-1 space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="text-sm text-white/80">
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={tier.href}>
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white">
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-12 text-center text-sm text-white/50">
          All prices in USD. Cancel anytime. Need custom enterprise solutions?{" "}
          <Link href="/team" className="text-white/70 hover:underline">Contact us</Link>
        </p>
      </div>
    </section>
  )
}
