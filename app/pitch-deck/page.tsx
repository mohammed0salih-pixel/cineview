"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
        Loading PDF Generator...
      </Button>
    ),
  }
);

export default function PitchDeckPage() {

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
    { label: "TAM", value: "$3.2B" },
    { label: "Target Users", value: "2M+" },
    { label: "Initial Market", value: "Saudi Arabia" },
    { label: "Seeking", value: "$2.5M Seed" },
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
            <div className="text-xs font-medium text-foreground/60 uppercase tracking-[0.3em] mb-6">
              Investor Presentation
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4 text-balance font-display">
              CineView AI <span className="text-foreground">Pitch Deck</span>
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
                className="p-5 text-center"
              >
                <div className="text-2xl font-bold text-foreground mb-1">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Slides Preview */}
          <div className="p-8 mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Slides Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-foreground">{slide}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="flex flex-col items-center gap-6 mb-16">
            <PDFDownloadButton />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>PDF Format</span>
              <span>Landscape A4</span>
              <span>Print Ready</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-4">11</div>
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Coverage</h3>
              <p className="text-sm text-muted-foreground">
                All key aspects from problem to investment opportunity
              </p>
            </div>
            <div className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Data-Driven</h3>
              <p className="text-sm text-muted-foreground">
                Market research, projections, and competitive analysis
              </p>
            </div>
            <div className="p-6 text-center">
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
