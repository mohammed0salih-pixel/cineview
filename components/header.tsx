"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const tools = [
  { name: "Dashboard", href: "/dashboard", description: "Overview & stats" },
  { name: "AI Tools", href: "/tools", description: "Analyze with AI (Gemini 2.5)" },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary glow-red">
            <span className="text-sm font-bold text-primary-foreground">CV</span>
          </div>
          <span className="text-xl font-bold tracking-tight">CineView AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tools <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border-border/50">
              {tools.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Creators <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-card border-border/50">
              {creators.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/sell" className="px-4 py-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors">
            Sell Content
          </Link>
          <Link href="/marketplace" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link href="/feed" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Inspiration
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 text-sm font-semibold glow-red">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm bg-background border-l border-border/30 p-6">
            <SheetTitle className="sr-only">Main menu</SheetTitle>
            <div className="flex flex-col h-full pt-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Tools</p>
                  <nav className="flex flex-col gap-1">
                    {tools.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-2.5 text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Creators</p>
                  <nav className="flex flex-col gap-1">
                    {creators.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="py-2.5 text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">More</p>
                  <nav className="flex flex-col gap-1">
                    <Link href="/sell" onClick={() => setIsOpen(false)} className="py-2.5 text-foreground hover:text-primary transition-colors">
                      Sell Content
                    </Link>
                    <Link href="/marketplace" onClick={() => setIsOpen(false)} className="py-2.5 text-foreground hover:text-primary transition-colors">
                      Marketplace
                    </Link>
                    <Link href="/feed" onClick={() => setIsOpen(false)} className="py-2.5 text-foreground hover:text-primary transition-colors">
                      Inspiration
                    </Link>
                  </nav>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-8 border-t border-border/30">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent border-border/50 hover:bg-secondary">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-red">
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
