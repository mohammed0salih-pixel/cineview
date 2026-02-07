"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { computeHistogram, getImageDataFromUrl } from "@/lib/visual-analysis";

const generateHistogramData = () =>
  Array.from({ length: 256 }, (_, i) => ({
    value: i,
    r: (i / 255) * 100,
    g: (i / 255) * 100,
    b: (i / 255) * 100,
    lum: (i / 255) * 100,
  }));

const compositionOverlays = [
  { id: "thirds", name: "Rule of Thirds" },
  { id: "golden", name: "Golden Ratio" },
  { id: "diagonal", name: "Diagonal" },
  { id: "center", name: "Center" },
  { id: "fibonacci", name: "Fibonacci" },
  { id: "triangles", name: "Triangles" },
];

const colorAnalysis = {
  dominant: [
    { color: "#1a1a2e", name: "Deep Navy", percentage: 35 },
    { color: "#dc2626", name: "Red", percentage: 25 },
    { color: "#16213e", name: "Dark Blue", percentage: 20 },
    { color: "#0f3460", name: "Ocean", percentage: 12 },
    { color: "#fafafa", name: "White", percentage: 8 },
  ],
  harmony: "Complementary",
  mood: "Dramatic",
  style: "Cinematic",
};

const cameraInfo = {
  make: "Sony",
  model: "Alpha A7 IV",
  lens: "Sony FE 24-70mm f/2.8 GM II",
  focalLength: "50mm",
  aperture: "f/2.8",
  shutterSpeed: "1/250s",
  iso: "400",
  flash: "Off",
  meteringMode: "Multi-segment",
  whiteBalance: "Auto (5600K)",
  focusMode: "AF-C",
  focusArea: "Wide",
};

const technicalInfo = {
  resolution: "4096 x 2160",
  aspectRatio: "1.896:1 (Cinematic)",
  colorSpace: "sRGB",
  bitDepth: "8-bit",
  fileSize: "4.2 MB",
  fileFormat: "JPEG",
  dateTaken: "Jan 15, 2026, 14:32",
  location: "Riyadh, Saudi Arabia",
};

export default function ToolsPage() {
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>("thirds");
  const [histogramChannel, setHistogramChannel] = useState<"rgb" | "r" | "g" | "b" | "lum">("rgb");
  const [showClipping, setShowClipping] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  
  // Quick Adjustments
  const [exposure, setExposure] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [highlights, setHighlights] = useState([0]);
  const [shadows, setShadows] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [temperature, setTemperature] = useState([0]);
  const [tint, setTint] = useState([0]);
  const [vibrance, setVibrance] = useState([0]);
  
  const [zoomLevel, setZoomLevel] = useState(100);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"image" | "video">("image");
  const [fileName, setFileName] = useState<string>("");
  const [analysisApplied, setAnalysisApplied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageName, setImageName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [histogramData, setHistogramData] = useState(() => generateHistogramData());

  // Cleanup object URLs on unmount or when content changes
  useEffect(() => {
    return () => {
      if (uploadedImage && uploadedImage.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedImage);
      }
      if (uploadedVideo && uploadedVideo.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedVideo);
      }
    };
  }, [uploadedImage, uploadedVideo]);

  const handleResetAdjustments = () => {
    setExposure([0]);
    setContrast([0]);
    setHighlights([0]);
    setShadows([0]);
    setSaturation([0]);
    setTemperature([0]);
    setTint([0]);
    setVibrance([0]);
    setZoomLevel(100);
    setAnalysisApplied(false);
  };

  const handleApplyToAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisApplied(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getImageFilters = () => {
    const brightnessValue = 1 + (exposure[0] / 100);
    const contrastValue = 1 + (contrast[0] / 100);
    const saturateValue = 1 + (saturation[0] / 100);
    const tempValue = temperature[0] > 0 ? `sepia(${temperature[0] / 200})` : "";
    return `brightness(${brightnessValue}) contrast(${contrastValue}) saturate(${saturateValue}) ${tempValue}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous object URLs to prevent memory leaks
      if (uploadedImage && uploadedImage.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedImage);
      }
      if (uploadedVideo && uploadedVideo.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedVideo);
      }

      setFileName(file.name);
      const objectUrl = URL.createObjectURL(file);
      
      if (file.type.startsWith("video/")) {
        setContentType("video");
        setUploadedVideo(objectUrl);
        setUploadedImage(null);
        setHistogramData(generateHistogramData());
      } else {
        setContentType("image");
        setUploadedImage(objectUrl);
        setUploadedVideo(null);
        getImageDataFromUrl(objectUrl)
          .then((imageData) => setHistogramData(computeHistogram(imageData)))
          .catch(() => setHistogramData(generateHistogramData()));
      }
      setAnalysisApplied(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteContent = () => {
    if (uploadedImage && uploadedImage.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage);
    }
    if (uploadedVideo && uploadedVideo.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedVideo);
    }
    setUploadedImage(null);
    setUploadedVideo(null);
    setFileName("");
    setAnalysisApplied(false);
    handleResetAdjustments();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-[1600px] px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                Back to Home
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Complete Visual Analysis
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                All-in-one analysis tools for photographers and videographers
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
                <span>New here?</span>
                <Link href="/upload" className="font-medium text-primary hover:underline">
                  Start with Upload
                </Link>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                className="hidden"
              />
              <Button variant="outline" className="border-border/50 bg-transparent" onClick={triggerFileInput}>
                Upload Image/Video
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Export Report
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Left Column - Image Preview & Histogram */}
            <div className="lg:col-span-2 space-y-4">
              {/* Image Preview */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-border/50 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base font-semibold">Preview</CardTitle>
                      {fileName && (
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{fileName}</span>
                      )}
                      {(uploadedImage || uploadedVideo) && (
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {contentType === "video" ? "Video" : "Image"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {(uploadedImage || uploadedVideo) && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[10px] uppercase tracking-[0.2em]" onClick={() => setIsFavorite(!isFavorite)}>
                            Fav
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[10px] uppercase tracking-[0.2em]" onClick={() => setIsBookmarked(!isBookmarked)}>
                            Save
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[10px] uppercase tracking-[0.2em]">
                            Share
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[10px] uppercase tracking-[0.2em]" onClick={handleDeleteContent}>
                            Delete
                          </Button>
                          <div className="w-px h-4 bg-border mx-1" />
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[12px]" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                        –
                      </Button>
                      <span className="text-xs text-muted-foreground w-10 text-center">{zoomLevel}%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[12px]" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                        +
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[10px] uppercase tracking-[0.2em]" onClick={() => setZoomLevel(100)}>
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    {uploadedImage ? (
                      <>
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded for analysis"
                          className="absolute inset-0 w-full h-full object-contain transition-all duration-300"
                          style={{ 
                            transform: `scale(${zoomLevel / 100})`,
                            filter: getImageFilters()
                          }}
                        />
                        {analysisApplied && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium">
                            Analysis Applied
                          </div>
                        )}
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center">
                              <div className="keep-border w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-sm text-white">Analyzing...</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : uploadedVideo ? (
                      <>
                        <video
                          src={uploadedVideo}
                          controls
                          className="absolute inset-0 w-full h-full object-contain"
                          style={{ transform: `scale(${zoomLevel / 100})` }}
                        />
                        {analysisApplied && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium z-10">
                            Analysis Applied
                          </div>
                        )}
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <div className="text-center">
                              <div className="keep-border w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-sm text-white">Analyzing...</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground text-sm mb-3">Upload an image or video to analyze</p>
                          <Button 
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={triggerFileInput}
                          >
                            Select File
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Composition Overlays */}
                    {showOverlay && uploadedImage && (
                      <>
                        {selectedOverlay === "thirds" && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/60" />
                            <div className="absolute top-2/3 left-0 right-0 h-px bg-primary/60" />
                            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-primary/60" />
                            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-primary/60" />
                            <div className="absolute top-1/3 left-1/3 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                            <div className="absolute top-1/3 left-2/3 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                            <div className="absolute top-2/3 left-1/3 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                            <div className="absolute top-2/3 left-2/3 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                          </div>
                        )}
                        {selectedOverlay === "golden" && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[38.2%] left-0 right-0 h-px bg-primary/60" />
                            <div className="absolute top-[61.8%] left-0 right-0 h-px bg-primary/60" />
                            <div className="absolute top-0 bottom-0 left-[38.2%] w-px bg-primary/60" />
                            <div className="absolute top-0 bottom-0 left-[61.8%] w-px bg-primary/60" />
                          </div>
                        )}
                        {selectedOverlay === "center" && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-primary" />
                            <div className="absolute w-px h-full bg-primary/30" />
                            <div className="absolute w-full h-px bg-primary/30" />
                          </div>
                        )}
                        {selectedOverlay === "diagonal" && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary/60" />
                            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary/60" />
                          </svg>
                        )}
                      </>
                    )}

                    {/* Clipping Warnings */}
                    {showClipping && uploadedImage && (
                      <>
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-neutral-900/90 text-white text-xs px-2 py-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Highlights
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-neutral-900/90 text-white text-xs px-2 py-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Shadows
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Histogram & Composition Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Histogram */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">
                        Histogram
                      </CardTitle>
                      <div className="flex gap-0.5">
                        {(["rgb", "r", "g", "b", "lum"] as const).map((ch) => (
                          <Button
                            key={ch}
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${histogramChannel === ch ? "bg-primary/20 text-primary" : ""}`}
                            onClick={() => setHistogramChannel(ch)}
                          >
                            {ch.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="h-24 bg-black/50 rounded relative overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 256 100" preserveAspectRatio="none">
                        {(histogramChannel === "rgb" || histogramChannel === "r") && (
                          <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.r}`).join(" ")} L256,100 Z`} fill="rgba(239, 68, 68, 0.4)" stroke="rgb(239, 68, 68)" strokeWidth="0.5" />
                        )}
                        {(histogramChannel === "rgb" || histogramChannel === "g") && (
                          <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.g}`).join(" ")} L256,100 Z`} fill="rgba(34, 197, 94, 0.4)" stroke="rgb(34, 197, 94)" strokeWidth="0.5" />
                        )}
                        {(histogramChannel === "rgb" || histogramChannel === "b") && (
                          <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.b}`).join(" ")} L256,100 Z`} fill="rgba(59, 130, 246, 0.4)" stroke="rgb(59, 130, 246)" strokeWidth="0.5" />
                        )}
                        {histogramChannel === "lum" && (
                          <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.lum}`).join(" ")} L256,100 Z`} fill="rgba(255, 255, 255, 0.4)" stroke="white" strokeWidth="0.5" />
                        )}
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-500 to-white" />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                      <span>Shadows</span>
                      <span>Midtones</span>
                      <span>Highlights</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <Switch id="clipping" checked={showClipping} onCheckedChange={setShowClipping} className="scale-75" />
                        <Label htmlFor="clipping" className="text-xs text-muted-foreground">Clipping</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Composition Guides */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">
                        Composition
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch id="overlay" checked={showOverlay} onCheckedChange={setShowOverlay} className="scale-75" />
                        <Label htmlFor="overlay" className="text-xs text-muted-foreground">Show</Label>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {compositionOverlays.map((overlay) => (
                        <Button
                          key={overlay.id}
                          variant="ghost"
                          size="sm"
                          className={`h-auto py-2 ${
                            selectedOverlay === overlay.id ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-secondary"
                          }`}
                          onClick={() => setSelectedOverlay(selectedOverlay === overlay.id ? null : overlay.id)}
                        >
                          <span className="text-[10px]">{overlay.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Color Analysis */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold">
                    Color Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Dominant Colors</p>
                      <div className="flex gap-1 mb-3">
                        {colorAnalysis.dominant.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 h-10 rounded relative group cursor-pointer transition-transform hover:scale-105"
                            style={{ backgroundColor: color.color }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-border">
                              {color.name} ({color.percentage}%)
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {colorAnalysis.dominant.map((color, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: color.color }} />
                            <span className="text-muted-foreground">{color.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Harmony</p>
                        <p className="text-sm font-medium mt-0.5">{colorAnalysis.harmony}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mood</p>
                        <p className="text-sm font-medium mt-0.5">{colorAnalysis.mood}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 col-span-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Visual Style</p>
                        <p className="text-sm font-medium mt-0.5">{colorAnalysis.style}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Adjustments & Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Adjustments */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      Quick Adjustments
                    </CardTitle>
                    <div className="flex gap-2">
<Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-border hover:bg-secondary/40 bg-transparent" 
                        onClick={handleResetAdjustments}
                      >
                        Reset
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleApplyToAnalysis} disabled={isAnalyzing}>
                        {isAnalyzing ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Light Section */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground font-medium">
                        Light
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Exposure</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{exposure[0] > 0 ? "+" : ""}{exposure[0]}</span>
                          </div>
                          <Slider value={exposure} onValueChange={setExposure} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Contrast</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{contrast[0] > 0 ? "+" : ""}{contrast[0]}</span>
                          </div>
                          <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Highlights</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{highlights[0] > 0 ? "+" : ""}{highlights[0]}</span>
                          </div>
                          <Slider value={highlights} onValueChange={setHighlights} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Shadows</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{shadows[0] > 0 ? "+" : ""}{shadows[0]}</span>
                          </div>
                          <Slider value={shadows} onValueChange={setShadows} min={-100} max={100} step={1} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Color Section */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground font-medium">
                        Color
                      </p>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Temperature</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{temperature[0] > 0 ? "+" : ""}{temperature[0]}</span>
                          </div>
                          <Slider value={temperature} onValueChange={setTemperature} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Tint</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{tint[0] > 0 ? "+" : ""}{tint[0]}</span>
                          </div>
                          <Slider value={tint} onValueChange={setTint} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Vibrance</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{vibrance[0] > 0 ? "+" : ""}{vibrance[0]}</span>
                          </div>
                          <Slider value={vibrance} onValueChange={setVibrance} min={-100} max={100} step={1} />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Saturation</Label>
                            <span className="text-[10px] text-muted-foreground font-mono">{saturation[0] > 0 ? "+" : ""}{saturation[0]}</span>
                          </div>
                          <Slider value={saturation} onValueChange={setSaturation} min={-100} max={100} step={1} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Information - Current Adjustments */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold">
                    Photo Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Light</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Exposure</span>
                          <span className={`text-xs font-mono font-medium ${exposure[0] !== 0 ? "text-primary" : ""}`}>
                            {exposure[0] > 0 ? "+" : ""}{exposure[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Contrast</span>
                          <span className={`text-xs font-mono font-medium ${contrast[0] !== 0 ? "text-primary" : ""}`}>
                            {contrast[0] > 0 ? "+" : ""}{contrast[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Highlights</span>
                          <span className={`text-xs font-mono font-medium ${highlights[0] !== 0 ? "text-primary" : ""}`}>
                            {highlights[0] > 0 ? "+" : ""}{highlights[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Shadows</span>
                          <span className={`text-xs font-mono font-medium ${shadows[0] !== 0 ? "text-primary" : ""}`}>
                            {shadows[0] > 0 ? "+" : ""}{shadows[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Color</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Saturation</span>
                          <span className={`text-xs font-mono font-medium ${saturation[0] !== 0 ? "text-primary" : ""}`}>
                            {saturation[0] > 0 ? "+" : ""}{saturation[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Vibrance</span>
                          <span className={`text-xs font-mono font-medium ${vibrance[0] !== 0 ? "text-primary" : ""}`}>
                            {vibrance[0] > 0 ? "+" : ""}{vibrance[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Temperature</span>
                          <span className={`text-xs font-mono font-medium ${temperature[0] !== 0 ? "text-primary" : ""}`}>
                            {temperature[0] > 0 ? "+" : ""}{temperature[0]}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Tint</span>
                          <span className={`text-xs font-mono font-medium ${tint[0] !== 0 ? "text-primary" : ""}`}>
                            {tint[0] > 0 ? "+" : ""}{tint[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">View</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Zoom Level</span>
                          <span className="text-xs font-mono font-medium">{zoomLevel}%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Content Type</span>
                          <span className="text-xs font-medium capitalize">{contentType}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Analysis</span>
                          <span className={`text-xs font-medium ${analysisApplied ? "text-primary" : "text-muted-foreground"}`}>
                            {analysisApplied ? "Applied" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Modified Values</span>
                          <span className="text-xs font-mono font-medium text-primary">
                            {[exposure[0], contrast[0], highlights[0], shadows[0], saturation[0], vibrance[0], temperature[0], tint[0]].filter(v => v !== 0).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Favorite</span>
                          <span className={`text-xs font-medium ${isFavorite ? "text-primary" : "text-muted-foreground"}`}>
                            {isFavorite ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                          <span className="text-xs text-muted-foreground">Bookmarked</span>
                          <span className={`text-xs font-medium ${isBookmarked ? "text-primary" : "text-muted-foreground"}`}>
                            {isBookmarked ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Camera & Lens Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold">
                      Camera Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Camera</span>
                        <span className="text-xs font-medium">{cameraInfo.make} {cameraInfo.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Lens</span>
                        <span className="text-xs font-medium truncate max-w-[150px]">{cameraInfo.lens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Focal Length</span>
                        <span className="text-xs font-medium">{cameraInfo.focalLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Aperture</span>
                        <span className="text-xs font-medium">{cameraInfo.aperture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Shutter</span>
                        <span className="text-xs font-medium">{cameraInfo.shutterSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">ISO</span>
                        <span className="text-xs font-medium">{cameraInfo.iso}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold">
                      Lens Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">White Balance</span>
                        <span className="text-xs font-medium">{cameraInfo.whiteBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Focus Mode</span>
                        <span className="text-xs font-medium">{cameraInfo.focusMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Focus Area</span>
                        <span className="text-xs font-medium">{cameraInfo.focusArea}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Metering</span>
                        <span className="text-xs font-medium">{cameraInfo.meteringMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-xs">Flash</span>
                        <span className="text-xs font-medium">{cameraInfo.flash}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Technical Information */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold">
                    Technical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Resolution
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.resolution}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Aspect Ratio
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.aspectRatio}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Color Space
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.colorSpace}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Bit Depth
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.bitDepth}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          File Size
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.fileSize}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Format
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.fileFormat}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Date Taken
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.dateTaken}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs">
                          Location
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Management */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold">
                    Photo Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <span className="text-xs">Download</span>
                      <span className="text-[10px] text-muted-foreground">Original Quality</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <span className="text-xs">Share</span>
                      <span className="text-[10px] text-muted-foreground">Get Link</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <span className="text-xs">AI Enhance</span>
                      <span className="text-[10px] text-muted-foreground">Auto Improve</span>
                    </Button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <Label className="text-xs text-muted-foreground mb-2 block">Add Tags</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Portrait</Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Cinematic</Badge>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Saudi</Badge>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">+ Add Tag</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
