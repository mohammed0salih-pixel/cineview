"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Upload,
  BarChart3,
  Grid3X3,
  Palette,
  Camera,
  Sun,
  Thermometer,
  Droplets,
  Aperture,
  Sparkles,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Info,
  ImageIcon,
  Film,
  Sliders,
  SlidersHorizontal,
  Eye,
  Crosshair,
  Clock,
  MapPin,
  Layers,
  Focus,
  Ruler,
  FileImage,
  Share2,
  Star,
  Bookmark,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

type HistogramPoint = {
  value: number;
  r: number;
  g: number;
  b: number;
  lum: number;
};

type ColorSwatch = {
  color: string;
  name: string;
  percentage: number;
};

const createEmptyHistogram = (): HistogramPoint[] =>
  Array.from({ length: 256 }, (_, i) => ({ value: i, r: 0, g: 0, b: 0, lum: 0 }));

const compositionOverlays = [
  { id: "thirds", name: "Rule of Thirds", icon: Grid3X3 },
  { id: "golden", name: "Golden Ratio", icon: Sparkles },
  { id: "diagonal", name: "Diagonal", icon: Ruler },
  { id: "center", name: "Center", icon: Crosshair },
  { id: "fibonacci", name: "Fibonacci", icon: Focus },
  { id: "triangles", name: "Triangles", icon: Layers },
];

const defaultColorAnalysis = {
  dominant: [] as ColorSwatch[],
  harmony: "Auto",
  mood: "Auto",
  style: "Auto",
};

const defaultCameraInfo = {
  make: "-",
  model: "-",
  lens: "-",
  focalLength: "-",
  aperture: "-",
  shutterSpeed: "-",
  iso: "-",
  flash: "-",
  meteringMode: "-",
  whiteBalance: "-",
  focusMode: "-",
  focusArea: "-",
};

const defaultTechnicalInfo = {
  resolution: "-",
  aspectRatio: "-",
  colorSpace: "-",
  bitDepth: "-",
  fileSize: "-",
  fileFormat: "-",
  dateTaken: "-",
  location: "-",
};

const defaultExifStatus = {
  available: false,
  keyCount: 0,
  error: "",
};

const formatFileSize = (bytes: number) => {
  if (!bytes && bytes !== 0) return "-";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)) || 0);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const formatAspectRatio = (width: number, height: number) => {
  if (!width || !height) return "-";
  const divisor = gcd(width, height);
  const w = Math.round(width / divisor);
  const h = Math.round(height / divisor);
  return `${w}:${h}`;
};

const formatExposureTime = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") {
    if (value >= 1) return `${value.toFixed(2)}s`;
    const denom = Math.round(1 / value);
    return denom > 0 ? `1/${denom}s` : `${value}s`;
  }
  const text = String(value);
  return text.includes("s") ? text : `${text}s`;
};

const formatFNumber = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isNaN(num) && Number.isFinite(num)) return `f/${num.toFixed(1)}`;
  const text = String(value);
  return text.startsWith("f/") ? text : `f/${text}`;
};

const formatFocalLength = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isNaN(num) && Number.isFinite(num)) return `${num.toFixed(0)}mm`;
  return String(value);
};

const formatBitDepth = (value: unknown) => {
  if (!value) return "-";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

const formatColorSpace = (value: unknown) => {
  if (!value && value !== 0) return "-";
  if (value === 1 || value === "sRGB") return "sRGB";
  if (value === 65535 || value === "Uncalibrated") return "Uncalibrated";
  return String(value);
};

const formatDate = (value: unknown) => {
  if (!value) return "-";
  if (value instanceof Date) return value.toLocaleString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const formatGps = (lat?: number | null, lon?: number | null) => {
  if (lat === null || lon === null || lat === undefined || lon === undefined) return "-";
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
};

const normalizeGpsValue = (value: unknown) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [deg, min, sec] = value.map((v) => Number(v));
    if ([deg, min, sec].every((v) => Number.isFinite(v))) {
      return deg + min / 60 + sec / 3600;
    }
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
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
  const [histogramData, setHistogramData] = useState<HistogramPoint[]>(createEmptyHistogram());
  const [colorAnalysis, setColorAnalysis] = useState(defaultColorAnalysis);
  const [cameraInfo, setCameraInfo] = useState(defaultCameraInfo);
  const [technicalInfo, setTechnicalInfo] = useState(defaultTechnicalInfo);
  const [exifStatus, setExifStatus] = useState(defaultExifStatus);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const resetAnalysisData = () => {
    setHistogramData(createEmptyHistogram());
    setColorAnalysis(defaultColorAnalysis);
    setCameraInfo(defaultCameraInfo);
    setTechnicalInfo(defaultTechnicalInfo);
    setExifStatus(defaultExifStatus);
  };

  const computeHistogram = (data: Uint8ClampedArray) => {
    const r = new Array(256).fill(0);
    const g = new Array(256).fill(0);
    const b = new Array(256).fill(0);
    const lum = new Array(256).fill(0);

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];
      if (alpha < 10) continue;
      r[red] += 1;
      g[green] += 1;
      b[blue] += 1;
      const l = Math.round(0.2126 * red + 0.7152 * green + 0.0722 * blue);
      lum[l] += 1;
    }

    const max = (arr: number[]) => Math.max(1, ...arr);
    const maxR = max(r);
    const maxG = max(g);
    const maxB = max(b);
    const maxL = max(lum);

    return Array.from({ length: 256 }, (_, i) => ({
      value: i,
      r: Math.round((r[i] / maxR) * 100),
      g: Math.round((g[i] / maxG) * 100),
      b: Math.round((b[i] / maxB) * 100),
      lum: Math.round((lum[i] / maxL) * 100),
    }));
  };

  const computeDominantColors = (data: Uint8ClampedArray) => {
    const bucketMap = new Map<string, { count: number; r: number; g: number; b: number }>();
    const totalPixels = data.length / 4;
    const sampleStep = Math.max(1, Math.floor(totalPixels / 50000));

    for (let i = 0; i < data.length; i += 4 * sampleStep) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];
      if (alpha < 10) continue;

      const rBucket = red >> 5;
      const gBucket = green >> 5;
      const bBucket = blue >> 5;
      const key = `${rBucket}-${gBucket}-${bBucket}`;
      const bucket = bucketMap.get(key) ?? { count: 0, r: 0, g: 0, b: 0 };
      bucket.count += 1;
      bucket.r += red;
      bucket.g += green;
      bucket.b += blue;
      bucketMap.set(key, bucket);
    }

    const entries = [...bucketMap.values()].sort((a, b) => b.count - a.count).slice(0, 5);
    const totalCount = entries.reduce((sum, entry) => sum + entry.count, 0) || 1;

    return entries.map((entry) => {
      const avgR = Math.round(entry.r / entry.count);
      const avgG = Math.round(entry.g / entry.count);
      const avgB = Math.round(entry.b / entry.count);
      const hex = `#${[avgR, avgG, avgB].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
      return {
        color: hex,
        name: hex.toUpperCase(),
        percentage: Math.round((entry.count / totalCount) * 100),
      } as ColorSwatch;
    });
  };

  const clampValue = (value: number, min = -100, max = 100) => Math.min(max, Math.max(min, value));

  const computeImageMetrics = (data: Uint8ClampedArray) => {
    const totalPixels = data.length / 4;
    const sampleStep = Math.max(1, Math.floor(totalPixels / 80000));

    let count = 0;
    let sumLum = 0;
    let sumLumSq = 0;
    let sumSat = 0;
    let sumSatLow = 0;
    let lowSatCount = 0;
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let highlights = 0;
    let shadows = 0;

    for (let i = 0; i < data.length; i += 4 * sampleStep) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];
      if (alpha < 10) continue;

      const max = Math.max(red, green, blue);
      const min = Math.min(red, green, blue);
      const lum = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
      const sat = max === 0 ? 0 : (max - min) / max;

      sumLum += lum;
      sumLumSq += lum * lum;
      sumSat += sat;
      if (sat < 0.5) {
        sumSatLow += sat;
        lowSatCount += 1;
      }
      sumR += red;
      sumG += green;
      sumB += blue;
      if (lum > 0.9) highlights += 1;
      if (lum < 0.1) shadows += 1;
      count += 1;
    }

    if (count === 0) {
      return {
        exposure: 0,
        contrast: 0,
        highlights: 0,
        shadows: 0,
        saturation: 0,
        vibrance: 0,
        temperature: 0,
        tint: 0,
      };
    }

    const avgLum = sumLum / count;
    const variance = sumLumSq / count - avgLum * avgLum;
    const stdLum = Math.sqrt(Math.max(0, variance));
    const avgSat = sumSat / count;
    const avgSatLow = lowSatCount ? sumSatLow / lowSatCount : 0;
    const avgR = sumR / count;
    const avgG = sumG / count;
    const avgB = sumB / count;
    const highlightPct = highlights / count;
    const shadowPct = shadows / count;

    return {
      exposure: clampValue(Math.round((avgLum - 0.5) * 100)),
      contrast: clampValue(Math.round(((stdLum - 0.2) / 0.2) * 50)),
      highlights: clampValue(Math.round((highlightPct - 0.05) * 200)),
      shadows: clampValue(Math.round((shadowPct - 0.05) * 200)),
      saturation: clampValue(Math.round((avgSat - 0.25) * 120)),
      vibrance: clampValue(Math.round((avgSatLow - 0.2) * 150)),
      temperature: clampValue(Math.round(((avgR - avgB) / 255) * 100)),
      tint: clampValue(Math.round(((avgG - (avgR + avgB) / 2) / 255) * 150)),
    };
  };

  const analyzeImageFile = async (file: File, objectUrl: string) => {
    try {
      setIsAnalyzing(true);
      let exif: Record<string, any> | null = null;
      try {
        const exifrModule = await import("exifr/dist/full.esm.mjs");
        const exifr = (exifrModule as { default?: any }).default ?? exifrModule;
        exif = await exifr.parse(file, {
          exif: true,
          tiff: true,
          ifd0: true,
          gps: true,
          xmp: true,
          iptc: true,
          translateValues: true,
          translateKeys: true,
          parse: true,
          reviveValues: true,
          mergeOutput: true,
        });
        const keys = exif ? Object.keys(exif) : [];
        setExifStatus({
          available: keys.length > 0,
          keyCount: keys.length,
          error: "",
        });
      } catch {
        exif = null;
        setExifStatus({
          available: false,
          keyCount: 0,
          error: "EXIF parse failed",
        });
      }

      const image = new window.Image();
      image.src = objectUrl;
      await image.decode();

      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;

      const maxSize = 256;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const metrics = computeImageMetrics(data);
      setExposure([metrics.exposure]);
      setContrast([metrics.contrast]);
      setHighlights([metrics.highlights]);
      setShadows([metrics.shadows]);
      setSaturation([metrics.saturation]);
      setVibrance([metrics.vibrance]);
      setTemperature([metrics.temperature]);
      setTint([metrics.tint]);

      const dominant = computeDominantColors(data);
      const histogram = computeHistogram(data);
      setHistogramData(histogram);
      setColorAnalysis((prev) => ({
        ...prev,
        dominant,
        mood: dominant.length ? "Auto" : prev.mood,
        harmony: dominant.length ? "Auto" : prev.harmony,
        style: dominant.length ? "Auto" : prev.style,
      }));

      const make = exif?.Make ?? exif?.make ?? "-";
      const model = exif?.Model ?? exif?.model ?? "-";
      const lens = exif?.LensModel ?? exif?.Lens ?? exif?.lens ?? "-";
      const focalLength = formatFocalLength(exif?.FocalLength);
      const aperture = formatFNumber(exif?.FNumber ?? exif?.ApertureValue);
      const shutterSpeed = formatExposureTime(exif?.ExposureTime ?? exif?.ShutterSpeedValue);
      const iso = exif?.ISO ?? exif?.ISOSpeedRatings ?? exif?.iso ?? "-";
      const flash = exif?.Flash ?? exif?.flash ?? "-";
      const meteringMode = exif?.MeteringMode ?? exif?.meteringMode ?? "-";
      const whiteBalance = exif?.WhiteBalance ?? exif?.whiteBalance ?? "-";
      const focusMode = exif?.FocusMode ?? exif?.focusMode ?? "-";
      const focusArea = exif?.FocusArea ?? exif?.focusArea ?? "-";

      setCameraInfo({
        make: make || "-",
        model: model || "-",
        lens: lens || "-",
        focalLength: focalLength || "-",
        aperture: aperture || "-",
        shutterSpeed: shutterSpeed || "-",
        iso: iso ? String(iso) : "-",
        flash: flash ? String(flash) : "-",
        meteringMode: meteringMode ? String(meteringMode) : "-",
        whiteBalance: whiteBalance ? String(whiteBalance) : "-",
        focusMode: focusMode ? String(focusMode) : "-",
        focusArea: focusArea ? String(focusArea) : "-",
      });

      const dateTaken = formatDate(exif?.DateTimeOriginal ?? exif?.CreateDate ?? exif?.ModifyDate ?? exif?.DateCreated);
      const latRaw = normalizeGpsValue(exif?.GPSLatitude ?? exif?.latitude ?? exif?.gps?.latitude);
      const lonRaw = normalizeGpsValue(exif?.GPSLongitude ?? exif?.longitude ?? exif?.gps?.longitude);
      const latRef = exif?.GPSLatitudeRef ?? exif?.latitudeRef;
      const lonRef = exif?.GPSLongitudeRef ?? exif?.longitudeRef;
      const lat = latRaw === null ? null : latRef === "S" ? -Math.abs(latRaw) : latRaw;
      const lon = lonRaw === null ? null : lonRef === "W" ? -Math.abs(lonRaw) : lonRaw;
      const location = formatGps(lat, lon);

      const colorSpace = formatColorSpace(exif?.ColorSpace);
      const bitDepth = formatBitDepth(exif?.BitsPerSample);

      setTechnicalInfo({
        resolution: width && height ? `${width} x ${height}` : "-",
        aspectRatio: formatAspectRatio(width, height),
        colorSpace: colorSpace === "-" ? "sRGB" : colorSpace,
        bitDepth: bitDepth === "-" ? "8-bit" : bitDepth,
        fileSize: formatFileSize(file.size),
        fileFormat: file.type || "-",
        dateTaken: dateTaken !== "-" ? dateTaken : file.lastModified ? new Date(file.lastModified).toLocaleString() : "-",
        location,
      });
      setAnalysisApplied(true);
    } catch {
      resetAnalysisData();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeWithAI = async () => {
    if (!uploadedImage && !uploadedVideo) {
      setAiError("Please upload an image or video first");
      return;
    }

    setIsAiAnalyzing(true);
    setAiError(null);
    setAiAnalysis(null);

    try {
      // Build comprehensive metadata for AI analysis
      const metadata = {
        type: contentType,
        resolution: technicalInfo.resolution,
        aspectRatio: technicalInfo.aspectRatio,
        fileSize: technicalInfo.fileSize,
        colorSpace: technicalInfo.colorSpace,
        ...(cameraInfo.make !== "-" && { camera: `${cameraInfo.make} ${cameraInfo.model}` }),
        ...(cameraInfo.lens !== "-" && { lens: cameraInfo.lens }),
        ...(colorAnalysis.dominant.length > 0 && {
          dominantColors: colorAnalysis.dominant.slice(0, 3),
        }),
        exposure: exposure[0],
        contrast: contrast[0],
        saturation: saturation[0],
      };

      const prompt = contentType === "image"
        ? `Analyze this professional ${cameraInfo.make !== "-" ? cameraInfo.make : ""} photo. Provide actionable insights on composition, lighting, color palette, and technical quality. Give 3-5 specific recommendations for improvement.`
        : "Analyze this video content and provide insights on composition, lighting, and quality.";

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          metadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Engine error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "error") {
        throw new Error(data.error || "AI analysis failed");
      }

      setAiAnalysis(data.summary || "No analysis available");
    } catch (error: any) {
      console.error("AI analysis error:", error);
      setAiError(error.message || "Failed to analyze with AI. Make sure AI Engine is running.");
    } finally {
      setIsAiAnalyzing(false);
    }
  };

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
      setImageName(file.name);
      const objectUrl = URL.createObjectURL(file);
      
      if (file.type.startsWith("video/")) {
        setContentType("video");
        setUploadedVideo(objectUrl);
        setUploadedImage(null);
        resetAnalysisData();
        setTechnicalInfo((prev) => ({
          ...prev,
          fileSize: formatFileSize(file.size),
          fileFormat: file.type || "-",
        }));
      } else {
        setContentType("image");
        setUploadedImage(objectUrl);
        setUploadedVideo(null);
        analyzeImageFile(file, objectUrl);
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
    setImageName(null);
    resetAnalysisData();
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
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Complete Visual Analysis
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                All-in-one analysis tools for photographers and videographers
              </p>
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
                <Upload className="mr-2 h-4 w-4" />
                Upload Image/Video
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-red">
                <Download className="mr-2 h-4 w-4" />
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
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFavorite(!isFavorite)}>
                            <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsBookmarked(!isBookmarked)}>
                            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={handleDeleteContent}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="w-px h-4 bg-border mx-1" />
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground w-10 text-center">{zoomLevel}%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoomLevel(100)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    {uploadedImage ? (
                      <>
                        <Image
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded for analysis"
                          fill
                          sizes="100vw"
                          className="object-contain transition-all duration-300"
                          style={{
                            transform: `scale(${zoomLevel / 100})`,
                            filter: getImageFilters(),
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
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
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
                              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-sm text-white">Analyzing...</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex justify-center gap-3 mb-3">
                            <Camera className="h-10 w-10 text-muted-foreground/30" />
                            <Film className="h-10 w-10 text-muted-foreground/30" />
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">Upload an image or video to analyze</p>
                          <Button 
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={triggerFileInput}
                          >
                            <Upload className="mr-2 h-4 w-4" />
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
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 text-white text-xs px-2 py-1 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Highlights
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-blue-500/90 text-white text-xs px-2 py-1 rounded">
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
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
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
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Grid3X3 className="h-4 w-4 text-primary" />
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
                      {compositionOverlays.map((overlay) => {
                        const Icon = overlay.icon;
                        return (
                          <Button
                            key={overlay.id}
                            variant="ghost"
                            size="sm"
                            className={`h-auto py-2 flex-col gap-1 ${
                              selectedOverlay === overlay.id ? "bg-primary/20 text-primary border border-primary/30" : "hover:bg-secondary"
                            }`}
                            onClick={() => setSelectedOverlay(selectedOverlay === overlay.id ? null : overlay.id)}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-[10px]">{overlay.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Color Analysis */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
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
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      Quick Adjustments
                    </CardTitle>
                    <div className="flex gap-2">
<Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 bg-transparent" 
                        onClick={handleResetAdjustments}
                      >
                        <RotateCcw className="mr-1 h-3 w-3" />
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
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                        <Sun className="h-3 w-3" /> Light
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
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                        <Palette className="h-3 w-3" /> Color
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

              {/* AI Analysis Card */}
              {(uploadedImage || uploadedVideo) && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Analysis
                      </CardTitle>
                      <Button 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={analyzeWithAI}
                        disabled={isAiAnalyzing}
                      >
                        {isAiAnalyzing ? (
                          <>
                            <div className="mr-1.5 h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    {!aiAnalysis && !aiError && !isAiAnalyzing && (
                      <div className="text-center py-6">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-xs text-muted-foreground">
                          Click &quot;Analyze&quot; to get AI-powered insights on composition, lighting, and quality
                        </p>
                      </div>
                    )}
                    
                    {aiError && (
                      <div className="p-3 rounded bg-destructive/10 border border-destructive/20">
                        <p className="text-xs text-destructive">{aiError}</p>
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="space-y-3">
                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                          <div className="text-xs leading-relaxed whitespace-pre-wrap">
                            {aiAnalysis}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            <span>Powered by Gemini 2.5 Flash</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Photo Information - Current Adjustments */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="py-3 border-b border-border/50">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
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
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      Camera Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    {!exifStatus.available && (
                      <p className="mb-2 text-xs text-muted-foreground">
                        No EXIF metadata found in this file. Camera details will be empty.
                      </p>
                    )}
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
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Aperture className="h-4 w-4 text-primary" />
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
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Technical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <ImageIcon className="h-3 w-3" /> Resolution
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.resolution}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <Layers className="h-3 w-3" /> Aspect Ratio
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.aspectRatio}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <Palette className="h-3 w-3" /> Color Space
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.colorSpace}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <Eye className="h-3 w-3" /> Bit Depth
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.bitDepth}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <FileImage className="h-3 w-3" /> File Size
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.fileSize}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <Film className="h-3 w-3" /> Format
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.fileFormat}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> Date Taken
                        </span>
                        <span className="text-xs font-medium">{technicalInfo.dateTaken}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                        <span className="text-muted-foreground text-xs flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> Location
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
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Photo Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <Download className="h-5 w-5 text-primary" />
                      <span className="text-xs">Download</span>
                      <span className="text-[10px] text-muted-foreground">Original Quality</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <Share2 className="h-5 w-5 text-primary" />
                      <span className="text-xs">Share</span>
                      <span className="text-[10px] text-muted-foreground">Get Link</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 border-border/50 bg-transparent hover:bg-primary/10 hover:border-primary/30">
                      <Sparkles className="h-5 w-5 text-primary" />
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
