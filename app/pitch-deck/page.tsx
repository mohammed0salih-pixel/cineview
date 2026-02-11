"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, ArrowLeft, CheckCircle2, TrendingUp, Users, Globe, Sparkles } from "lucide-react";
import Link from "next/link";

// Dynamically import the PDF download component to avoid SSR issues
const PDFDownloadButton = dynamic(
  () => import("@/components/pdf-download-button"),
  {
    ssr: false,
    loading: () => (
      <Button
        size="lg"
        className="bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-6 text-lg gap-3"
        disabled
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading PDF Generator...
      </Button>
    ),
  }
);

export default function PitchDeckPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const slides = [
    "Cover - Company Overview",
    "The Problem",
    "Our Solution",
    "Market Opportunity",
    "Platform Overview",
    "Business Model & Pricing",
    "Traction & Projections",
    "Competitive Advantage",
    "Product Roadmap",
    "Investment Opportunity",
    "Contact Information",
  ];

  const highlights = [
    { icon: TrendingUp, label: "TAM", value: "$3.2B" },
    { icon: Users, label: "Target Users", value: "2M+" },
    { icon: Globe, label: "Initial Market", value: "Saudi Arabia" },
    { icon: Sparkles, label: "Seeking", value: "$2.5M Seed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">CV</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              CineView AI
            </span>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 mb-6">
              <FileText className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Investor Presentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              CineView AI <span className="text-gradient-gold">Pitch Deck</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              A comprehensive 11-slide investor presentation covering our vision, 
              market opportunity, product features, business model, and growth strategy.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="bg-card/50 border border-border/50 rounded-xl p-5 text-center hover:border-primary/30 transition-colors"
              >
                <item.icon className="w-6 h-6 text-foreground mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Slides Preview */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">11</span>
              </span>
              Slides Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{slide}</span>
                  <CheckCircle2 className="w-4 h-4 text-foreground/50 ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="flex flex-col items-center gap-6 mb-16">
            {mounted && <PDFDownloadButton />}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                PDF Format
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Landscape A4
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Print Ready
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-foreground">11</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-muted-foreground">
                All key aspects from problem to investment opportunity
              </p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Data-Driven</h3>
              <p className="text-sm text-muted-foreground">
                Market research, projections, and competitive analysis
              </p>
            </div>
            <div className="bg-card/50 border border-border/50 rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Vision 2030 Aligned</h3>
              <p className="text-sm text-muted-foreground">
                Strategic alignment with Saudi national initiatives
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 CineView AI. All rights reserved. Confidential investor materials.
          </p>
        </div>
      </footer>
    </div>
  );
}
