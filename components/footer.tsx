"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  tools: [
    { name: "Start Analysis", href: "/upload" },
    { name: "Social Optimizer", href: "/social" },
    { name: "Export Center", href: "/export" },
    { name: "Presets", href: "/presets" },
  ],
  creators: [
    { name: "Projects", href: "/projects" },
    { name: "Team", href: "/team" },
    { name: "Learning Hub", href: "/learn" },
    { name: "Inspiration", href: "/feed" },
  ],
  marketplace: [
    { name: "Browse Content", href: "/marketplace" },
    { name: "Sell Your Work", href: "/sell" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Licensing", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Inspiration", href: "/feed" },
    { name: "Contact", href: "#" },
    { name: "Careers", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-8 pb-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Stay updated</h3>
            <p className="mt-2 text-sm text-white/60">Get the latest features, tips, and creator news.</p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-full border-transparent bg-white/5 text-sm text-white placeholder:text-white/40"
            />
            <Button className="h-11 rounded-full bg-white px-6 text-black hover:bg-white/80">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-4">Tools</h4>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-4">Creators</h4>
            <ul className="space-y-3">
              {footerLinks.creators.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-4">Marketplace</h4>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 md:flex-row md:items-center">
          <span className="font-semibold text-white">CineView AI</span>
          <p className="text-sm text-white/50">
            {new Date().getFullYear()} CineView AI. All rights reserved. Supporting Saudi Vision 2030.
          </p>
        </div>
      </div>
    </footer>
  )
}
