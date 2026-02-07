"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const tools = [
  { name: "Upload & Analyze", href: "/upload", description: "Start a new AI analysis" },
  { name: "Analysis Studio", href: "/tools", description: "Advanced visual analysis tools" },
  { name: "Social Optimizer", href: "/social", description: "Optimize for social platforms" },
  { name: "Export Center", href: "/export", description: "Export to editing software" },
]

const creators = [
  { name: "Projects", href: "/projects", description: "Manage your creative projects" },
  { name: "Team", href: "/team", description: "Collaborate with your team" },
  { name: "Learn", href: "/learn", description: "Tutorials and courses" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-white font-display">CineView AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-[var(--cv-accent)] data-[state=open]:text-white">
                Tools
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#0b0b0c]">
              {tools.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-xs text-white/50">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-[var(--cv-accent)] data-[state=open]:text-white">
                Creators
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#0b0b0c]">
              {creators.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-xs text-white/50">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/sell" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 hover:text-[var(--cv-accent)] transition-colors">
            Sell Content
          </Link>
          <Link href="/marketplace" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 hover:text-[var(--cv-accent)] transition-colors">
            Marketplace
          </Link>
          <Link href="/feed" className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 hover:text-[var(--cv-accent)] transition-colors">
            Inspiration
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Link href="/auth" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60 hover:text-[var(--cv-accent)] transition-colors">
            Sign in
          </Link>
          <Link href="/upload">
            <Button className="bg-[var(--cv-accent)] text-white hover:bg-[color-mix(in_srgb,var(--cv-accent)_80%,#000)] h-10 px-5 text-sm font-semibold">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" className="text-white/80 hover:text-white">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm bg-background p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-3">Tools</p>
                  <nav className="flex flex-col gap-1">
                    {tools.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-2.5 text-white/80 hover:text-[var(--cv-accent)] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-3">Creators</p>
                  <nav className="flex flex-col gap-1">
                    {creators.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-2.5 text-white/80 hover:text-[var(--cv-accent)] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.3em] mb-3">More</p>
                  <nav className="flex flex-col gap-1">
                    <Link href="/sell" onClick={() => setIsOpen(false)} className="py-2.5 text-white/80 hover:text-[var(--cv-accent)] transition-colors">
                      Sell Content
                    </Link>
                    <Link href="/marketplace" onClick={() => setIsOpen(false)} className="py-2.5 text-white/80 hover:text-[var(--cv-accent)] transition-colors">
                      Marketplace
                    </Link>
                    <Link href="/feed" onClick={() => setIsOpen(false)} className="py-2.5 text-white/80 hover:text-[var(--cv-accent)] transition-colors">
                      Inspiration
                    </Link>
                  </nav>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-white/5 text-white hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/upload" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[var(--cv-accent)] text-white hover:bg-[color-mix(in_srgb,var(--cv-accent)_80%,#000)]">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
