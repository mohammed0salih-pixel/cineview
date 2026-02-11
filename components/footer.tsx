"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  tools: [
    { name: "AI Analysis", href: "/tools" },
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
    <footer className="border-t border-border/30 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Top section with newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-12 border-b border-border/30">
          <div>
            <h3 className="text-lg font-semibold mb-2">Stay updated</h3>
            <p className="text-muted-foreground">Get the latest features, tips, and creator news.</p>
          </div>
          <div className="flex gap-3 max-w-md w-full lg:w-auto">
            <Input 
              type="email"
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card border-border/50 h-11 focus:border-primary"
            />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shrink-0">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">Tools</h4>
            <ul className="space-y-3">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">Creators</h4>
            <ul className="space-y-3">
              {footerLinks.creators.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">Marketplace</h4>
            <ul className="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-red">
              <span className="text-sm font-bold text-primary-foreground">CV</span>
            </div>
            <span className="font-semibold">CineView AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} CineView AI. All rights reserved. Supporting Saudi Vision 2030.
          </p>
        </div>
      </div>
    </footer>
  )
}
