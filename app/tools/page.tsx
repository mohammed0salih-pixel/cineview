"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  const [showData, setShowData] = useState(false);
  
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
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-display">
                Complete Visual Analysis
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                All-in-one analysis tools for photographers and videographers
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span>New here?</span>
                <Link href="/upload" className="font-medium text-foreground/70 hover:text-foreground">
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
              <Button variant="outline" className="bg-transparent text-foreground/70" onClick={triggerFileInput}>
                Upload Image/Video
              </Button>
              <Button className="bg-white text-black hover:bg-white/80">
                Export Report
              </Button>
            </div>
          </div>

          <section className="space-y-16">
            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Preview</p>
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
                <div className="flex flex-wrap items-center gap-3">
                  {fileName && <span className="text-white/70 truncate max-w-[200px]">{fileName}</span>}
                  {(uploadedImage || uploadedVideo) && (
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {contentType === "video" ? "Video" : "Image"}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {(uploadedImage || uploadedVideo) && (
                    <>
                      <button onClick={() => setIsFavorite(!isFavorite)} className="hover:text-white">Fav</button>
                      <button onClick={() => setIsBookmarked(!isBookmarked)} className="hover:text-white">Save</button>
                      <button className="hover:text-white">Share</button>
                      <button onClick={handleDeleteContent} className="hover:text-white">Delete</button>
                    </>
                  )}
                  <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))} className="hover:text-white">–</button>
                  <span className="text-white/60">{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))} className="hover:text-white">+</button>
                  <button onClick={() => setZoomLevel(100)} className="hover:text-white">Reset</button>
                </div>
              </div>

              <div className="relative aspect-[16/10] bg-black/70 overflow-hidden">
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded for analysis"
                      className="absolute inset-0 w-full h-full object-contain transition-all duration-300"
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        filter: getImageFilters(),
                      }}
                    />
                    {analysisApplied && (
                      <div className="absolute top-3 right-3 text-xs text-white/70 uppercase tracking-[0.3em]">
                        Analysis Applied
                      </div>
                    )}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-white/70">Analyzing…</p>
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
                      <div className="absolute top-3 right-3 text-xs text-white/70 uppercase tracking-[0.3em] z-10">
                        Analysis Applied
                      </div>
                    )}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="text-center">
                          <p className="text-sm text-white/70">Analyzing…</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/60 text-sm mb-3">Upload an image or video to analyze</p>
                      <Button size="sm" className="bg-white text-black hover:bg-white/80" onClick={triggerFileInput}>
                        Select File
                      </Button>
                    </div>
                  </div>
                )}

                {showOverlay && uploadedImage && (
                  <>
                    {selectedOverlay === "thirds" && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/30" />
                        <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/30" />
                      </div>
                    )}
                    {selectedOverlay === "golden" && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[38.2%] left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-[61.8%] left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-0 bottom-0 left-[38.2%] w-px bg-white/30" />
                        <div className="absolute top-0 bottom-0 left-[61.8%] w-px bg-white/30" />
                      </div>
                    )}
                    {selectedOverlay === "center" && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-white/50" />
                        <div className="absolute w-px h-full bg-white/20" />
                        <div className="absolute w-full h-px bg-white/20" />
                      </div>
                    )}
                    {selectedOverlay === "diagonal" && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-white/30" />
                        <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" className="text-white/30" />
                      </svg>
                    )}
                  </>
                )}

                {showClipping && uploadedImage && (
                  <>
                    <div className="absolute top-3 left-3 text-xs text-white/70 uppercase tracking-[0.3em]">
                      Highlights
                    </div>
                    <div className="absolute bottom-3 left-3 text-xs text-white/70 uppercase tracking-[0.3em]">
                      Shadows
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-white/50">
                <div className="flex items-center gap-2">
                  <Switch id="clipping" checked={showClipping} onCheckedChange={setShowClipping} className="scale-75" />
                  <Label htmlFor="clipping" className="text-xs text-white/50">Clipping</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="overlay" checked={showOverlay} onCheckedChange={setShowOverlay} className="scale-75" />
                  <Label htmlFor="overlay" className="text-xs text-white/50">Overlay</Label>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Composition Guides</p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                {compositionOverlays.map((overlay) => (
                  <button
                    key={overlay.id}
                    className={selectedOverlay === overlay.id ? "text-white" : "text-white/50 hover:text-white"}
                    onClick={() => setSelectedOverlay(selectedOverlay === overlay.id ? null : overlay.id)}
                  >
                    {overlay.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Histogram</p>
              <Button
                className="bg-transparent text-white/60 rounded-full hover:text-white"
                onClick={() => setShowData((value) => !value)}
              >
                {showData ? "Hide Data" : "Show Data"}
              </Button>
              {!showData && (
                <p className="text-sm text-white/60">Quantitative histogram data is available under “Show Data.”</p>
              )}
              {showData && (
                <>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
                    {(["rgb", "r", "g", "b", "lum"] as const).map((ch) => (
                      <button
                        key={ch}
                        className={histogramChannel === ch ? "text-white" : "text-white/50 hover:text-white"}
                        onClick={() => setHistogramChannel(ch)}
                      >
                        {ch.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="h-28 bg-black/60 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 256 100" preserveAspectRatio="none">
                      {(histogramChannel === "rgb" || histogramChannel === "r") && (
                        <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.r}`).join(" ")} L256,100 Z`} fill="rgba(255, 255, 255, 0.08)" stroke="white" strokeWidth="0.5" />
                      )}
                      {(histogramChannel === "rgb" || histogramChannel === "g") && (
                        <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.g}`).join(" ")} L256,100 Z`} fill="rgba(255, 255, 255, 0.06)" stroke="white" strokeWidth="0.5" />
                      )}
                      {(histogramChannel === "rgb" || histogramChannel === "b") && (
                        <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.b}`).join(" ")} L256,100 Z`} fill="rgba(255, 255, 255, 0.05)" stroke="white" strokeWidth="0.5" />
                      )}
                      {histogramChannel === "lum" && (
                        <path d={`M0,100 ${histogramData.map((d, i) => `L${i},${100 - d.lum}`).join(" ")} L256,100 Z`} fill="rgba(255, 255, 255, 0.12)" stroke="white" strokeWidth="0.5" />
                      )}
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>Shadows</span>
                    <span>Midtones</span>
                    <span>Highlights</span>
                  </div>
                </>
              )}
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color Analysis</p>
              <div className="space-y-3 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Dominant Colors</p>
                {colorAnalysis.dominant.map((color) => (
                  <div key={color.name} className="flex items-center justify-between">
                    <span className="text-white">{color.name}</span>
                    <span className="text-white/50">{color.percentage}%</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Harmony</span>
                  <span className="text-white">{colorAnalysis.harmony}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mood</span>
                  <span className="text-white">{colorAnalysis.mood}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Visual Style</span>
                  <span className="text-white">{colorAnalysis.style}</span>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quick Adjustments</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="bg-transparent text-white/70" onClick={handleResetAdjustments}>
                    Reset
                  </Button>
                  <Button size="sm" className="bg-white text-black hover:bg-white/80" onClick={handleApplyToAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Light</p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Exposure</Label>
                        <span className="font-mono">{exposure[0] > 0 ? "+" : ""}{exposure[0]}</span>
                      </div>
                      <Slider value={exposure} onValueChange={setExposure} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Contrast</Label>
                        <span className="font-mono">{contrast[0] > 0 ? "+" : ""}{contrast[0]}</span>
                      </div>
                      <Slider value={contrast} onValueChange={setContrast} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Highlights</Label>
                        <span className="font-mono">{highlights[0] > 0 ? "+" : ""}{highlights[0]}</span>
                      </div>
                      <Slider value={highlights} onValueChange={setHighlights} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Shadows</Label>
                        <span className="font-mono">{shadows[0] > 0 ? "+" : ""}{shadows[0]}</span>
                      </div>
                      <Slider value={shadows} onValueChange={setShadows} min={-100} max={100} step={1} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color</p>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Temperature</Label>
                        <span className="font-mono">{temperature[0] > 0 ? "+" : ""}{temperature[0]}</span>
                      </div>
                      <Slider value={temperature} onValueChange={setTemperature} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Tint</Label>
                        <span className="font-mono">{tint[0] > 0 ? "+" : ""}{tint[0]}</span>
                      </div>
                      <Slider value={tint} onValueChange={setTint} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Vibrance</Label>
                        <span className="font-mono">{vibrance[0] > 0 ? "+" : ""}{vibrance[0]}</span>
                      </div>
                      <Slider value={vibrance} onValueChange={setVibrance} min={-100} max={100} step={1} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <Label className="text-xs">Saturation</Label>
                        <span className="font-mono">{saturation[0] > 0 ? "+" : ""}{saturation[0]}</span>
                      </div>
                      <Slider value={saturation} onValueChange={setSaturation} min={-100} max={100} step={1} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Photo Information</p>
              <div className="space-y-6 text-sm text-white/70">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Light</p>
                  <div className="flex items-center justify-between">
                    <span>Exposure</span>
                    <span className="font-mono">{exposure[0] > 0 ? "+" : ""}{exposure[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contrast</span>
                    <span className="font-mono">{contrast[0] > 0 ? "+" : ""}{contrast[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Highlights</span>
                    <span className="font-mono">{highlights[0] > 0 ? "+" : ""}{highlights[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shadows</span>
                    <span className="font-mono">{shadows[0] > 0 ? "+" : ""}{shadows[0]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Color</p>
                  <div className="flex items-center justify-between">
                    <span>Saturation</span>
                    <span className="font-mono">{saturation[0] > 0 ? "+" : ""}{saturation[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vibrance</span>
                    <span className="font-mono">{vibrance[0] > 0 ? "+" : ""}{vibrance[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Temperature</span>
                    <span className="font-mono">{temperature[0] > 0 ? "+" : ""}{temperature[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tint</span>
                    <span className="font-mono">{tint[0] > 0 ? "+" : ""}{tint[0]}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">View</p>
                  <div className="flex items-center justify-between">
                    <span>Zoom Level</span>
                    <span className="font-mono">{zoomLevel}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Content Type</span>
                    <span className="capitalize">{contentType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analysis</span>
                    <span>{analysisApplied ? "Applied" : "Pending"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">Status</p>
                  <div className="flex items-center justify-between">
                    <span>Modified Values</span>
                    <span className="font-mono">{[exposure[0], contrast[0], highlights[0], shadows[0], saturation[0], vibrance[0], temperature[0], tint[0]].filter(v => v !== 0).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Favorite</span>
                    <span>{isFavorite ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bookmarked</span>
                    <span>{isBookmarked ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Camera Info</p>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between"><span>Camera</span><span>{cameraInfo.make} {cameraInfo.model}</span></div>
                  <div className="flex justify-between"><span>Lens</span><span>{cameraInfo.lens}</span></div>
                  <div className="flex justify-between"><span>Focal Length</span><span>{cameraInfo.focalLength}</span></div>
                  <div className="flex justify-between"><span>Aperture</span><span>{cameraInfo.aperture}</span></div>
                  <div className="flex justify-between"><span>Shutter</span><span>{cameraInfo.shutterSpeed}</span></div>
                  <div className="flex justify-between"><span>ISO</span><span>{cameraInfo.iso}</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Lens Settings</p>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between"><span>White Balance</span><span>{cameraInfo.whiteBalance}</span></div>
                  <div className="flex justify-between"><span>Focus Mode</span><span>{cameraInfo.focusMode}</span></div>
                  <div className="flex justify-between"><span>Focus Area</span><span>{cameraInfo.focusArea}</span></div>
                  <div className="flex justify-between"><span>Metering</span><span>{cameraInfo.meteringMode}</span></div>
                  <div className="flex justify-between"><span>Flash</span><span>{cameraInfo.flash}</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Technical Information</p>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between"><span>Resolution</span><span>{technicalInfo.resolution}</span></div>
                  <div className="flex justify-between"><span>Aspect Ratio</span><span>{technicalInfo.aspectRatio}</span></div>
                  <div className="flex justify-between"><span>Color Space</span><span>{technicalInfo.colorSpace}</span></div>
                  <div className="flex justify-between"><span>Bit Depth</span><span>{technicalInfo.bitDepth}</span></div>
                  <div className="flex justify-between"><span>File Size</span><span>{technicalInfo.fileSize}</span></div>
                  <div className="flex justify-between"><span>Format</span><span>{technicalInfo.fileFormat}</span></div>
                  <div className="flex justify-between"><span>Date Taken</span><span>{technicalInfo.dateTaken}</span></div>
                  <div className="flex justify-between"><span>Location</span><span>{technicalInfo.location}</span></div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Photo Management</p>
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-white/50">
                <button className="hover:text-white">Download · Original Quality</button>
                <button className="hover:text-white">Share · Get Link</button>
                <button className="hover:text-white">AI Enhance · Auto Improve</button>
              </div>
              <div className="space-y-2 text-xs text-white/50">
                <Label className="text-xs text-white/50 block">Tags</Label>
                <div className="flex flex-wrap gap-3 uppercase tracking-[0.2em]">
                  <span>Portrait</span>
                  <span>Cinematic</span>
                  <span>Saudi</span>
                  <button className="hover:text-white">+ Add Tag</button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
