"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, Images } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const images = [
  // New Cinematic Assets
  { name: "hero-cinematic.jpg", title: "Cinematic Hero - AI Visual Intelligence", category: "Hero" },
  { name: "visual-analysis-service.jpg", title: "Visual Analysis Service", category: "Services" },
  { name: "storyboard-generation.jpg", title: "Storyboard Generation", category: "Services" },
  { name: "moodboard-creative.jpg", title: "Moodboard & Creative Direction", category: "Services" },
  { name: "ai-creative-insights.jpg", title: "AI Creative Insights", category: "Services" },
  { name: "dashboard-preview.jpg", title: "Dashboard UI Preview", category: "Platform" },
  { name: "export-professional.jpg", title: "Export & Professional Output", category: "Services" },
  // Original Assets
  { name: "hero-camera.jpg", title: "Hero Camera", category: "Hero" },
  { name: "hero-visual-analysis.jpg", title: "Visual Analysis Workspace", category: "Hero" },
  { name: "ai-analysis-feature.jpg", title: "AI Analysis Feature", category: "Features" },
  { name: "analysis-preview.jpg", title: "Analysis Preview", category: "Features" },
  { name: "marketplace-preview.jpg", title: "Marketplace Preview", category: "Marketplace" },
  { name: "marketplace-showcase.jpg", title: "Marketplace Showcase", category: "Marketplace" },
  { name: "video-marketplace.jpg", title: "Video Marketplace", category: "Marketplace" },
  { name: "creator-tools.jpg", title: "Creator Tools", category: "Tools" },
  { name: "social-optimization.jpg", title: "Social Optimization", category: "Features" },
  { name: "team-collaboration.jpg", title: "Team Collaboration", category: "Features" },
  { name: "pro-integrations.jpg", title: "Pro Integrations", category: "Features" },
  { name: "sample-photo-1.jpg", title: "Sample Landscape", category: "Samples" },
  { name: "sample-photo-2.jpg", title: "Sample Portrait", category: "Samples" },
  { name: "sample-photo-3.jpg", title: "Sample Urban", category: "Samples" },
];

export default function GalleryPage() {
  const handleDownload = async (imageName: string) => {
    try {
      const response = await fetch(`/images/${imageName}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadAll = async () => {
    for (const image of images) {
      await handleDownload(image.name);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" className="border-border/50 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Images className="h-6 w-6 text-primary" />
                  Image Gallery
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {images.length} images available for download
                </p>
              </div>
            </div>
            <Button onClick={handleDownloadAll} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <Card key={index} className="border-border/50 bg-card/30 overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={`/images/${image.name}`}
                  alt={image.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90"
                  onClick={() => handleDownload(image.name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm">{image.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-secondary/50">
                    {image.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{image.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 rounded-xl border border-border/50 bg-card/30">
          <h2 className="font-semibold mb-4">How to Download</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2">Single Image:</p>
              <p>
                Hover over any image and click the download button, or right-click and select &ldquo;Save Image As&rdquo;
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">All Images:</p>
              <p>
                Click &ldquo;Download All&rdquo; button above to download all images one by one automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
