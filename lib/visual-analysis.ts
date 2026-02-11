// ============================================================================
// ANALYSIS CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Target size for analysis normalization.
 * All images are conceptually analyzed at this resolution for consistency.
 */
const ANALYSIS_TARGET_SIZE = 256;

/**
 * Fixed sampling step to ensure deterministic results.
 * Instead of varying by image size, we use a consistent step.
 */
const SAMPLE_STEP = 4;

/**
 * Scale factor for contrast calculation.
 * Multiplier applied to (p98 - p02) to match perceptual contrast.
 * Calibrated empirically for typical photographic content.
 */
const CONTRAST_SCALE = 1.3;

/**
 * Sharpness normalization factor.
 * Laplacian variance is divided by this to produce 0-100 scale.
 * Calibrated for ANALYSIS_TARGET_SIZE with SAMPLE_STEP=4.
 */
const SHARPNESS_NORMALIZATION = 1200;

/**
 * Noise normalization factor.
 * High-frequency variance is divided by this to produce 0-100 scale.
 * Based on typical sensor noise levels at ISO 400-800.
 */
const NOISE_NORMALIZATION = 15;

/**
 * Shadow percentile threshold for contrast calculation.
 * We use 2nd percentile to ignore extreme dark outliers.
 */
const SHADOW_PERCENTILE = 0.02;

/**
 * Highlight percentile threshold for contrast calculation.
 * We use 98th percentile to ignore extreme bright outliers.
 */
const HIGHLIGHT_PERCENTILE = 0.98;

/**
 * Color quantization level (bits per channel).
 * Colors are reduced to 16 levels per channel (4-bit) = 4096 total colors.
 */
const COLOR_QUANTIZATION_BITS = 4;

/**
 * Composition region size as fraction of minimum dimension.
 * Rule-of-thirds intersection points use ±8% region for edge detection.
 */
const COMPOSITION_REGION_PERCENT = 0.08;

/**
 * Composition score multiplier.
 * Applied to ratio of thirds-energy to total-energy.
 */
const COMPOSITION_SCALE = 2.0;

/**
 * Golden ratio constant (φ = 1.618...).
 * Used for golden spiral and golden ratio composition analysis.
 */
const GOLDEN_RATIO = 1.618033988749;

/**
 * Weights for different composition metrics.
 * Combined to produce final composition score.
 */
const COMPOSITION_WEIGHTS = {
  ruleOfThirds: 0.35,   // Rule of thirds alignment
  goldenRatio: 0.25,    // Golden ratio alignment
  symmetry: 0.20,       // Horizontal/vertical symmetry
  diagonals: 0.20,      // Diagonal energy
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type DominantColor = {
  name: string;
  hex: string;
  percentage: number;
};

export type CinematicIntelligence = {
  mood: {
    label: string;
    confidence: number;
    alternatives: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  energy: {
    level: 'Very Low' | 'Low' | 'Medium-Low' | 'Medium' | 'Medium-High' | 'High' | 'Very High';
    score: number;
    confidence: number;
    localized?: { ar?: string; en?: string };
    trend?: 'rising' | 'stable' | 'falling';
  };
  shotType: {
    label: string;
    confidence: number;
    alternatives: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  genre: {
    label: string;
    confidence: number;
    alternatives: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  rulesVersion: string;
  culture?: string;
  explainability?: {
    matchedConditions: Record<string, string[]>;
    confidenceFactors: Record<string, number>;
  };
};

type VisualAnalysisCore = {
  lighting: {
    type: string;
    direction: string;
    intensity: number;
    quality: string;
    source: string;
  };
  color: {
    temperature: string;
    temperatureKelvin: number;
    dominantColors: DominantColor[];
  };
  technical: {
    contrast: number;
    saturation: number;
    brightness: number;
    highlights: number;
    shadows: number;
    tint: number;
    sharpness: number;
    noise: number;
  };
  composition: {
    score: number;
  };
  mood: string;
  style: string;
};

export type VisualAnalysisResult = VisualAnalysisCore & {
  cinematic: CinematicIntelligence;
};

import { logger } from './logger';
import cinematicRulesData from './cinematic-rules.json';
import culturalMappingsData from './cultural-mappings.json';

// ============================================================================
// CINEMATIC RULES ENGINE
// ============================================================================

type RuleCondition = {
  metric: string;
  op: string;
  value: string | number;
};

type RuleDefinition = {
  conditions: RuleCondition[];
  weight: number;
  confidenceBase: number;
  description: string;
};

type RulesDatabase = {
  version: string;
  moods: Record<string, RuleDefinition>;
  shotTypes: Record<string, RuleDefinition>;
  genres: Record<string, RuleDefinition>;
  energy: {
    thresholds: Array<{ level: string; min: number; max: number }>;
    formula: { weights: Record<string, number> };
  };
};

type CulturalMapping = {
  label: string;
  culturalContext?: string;
  description?: string;
};

type CulturalDatabase = {
  version: string;
  cultures: Record<string, {
    code: string;
    name: string;
    moodMappings?: Record<string, CulturalMapping>;
    genreMappings?: Record<string, CulturalMapping>;
    shotTypeMappings?: Record<string, CulturalMapping>;
    energyMappings?: Record<string, CulturalMapping>;
    regionalAdjustments?: {
      moodWeights?: Record<string, number>;
      description?: string;
    };
  }>;
};

const cinematicRules = cinematicRulesData as RulesDatabase;
const culturalMappings = culturalMappingsData as CulturalDatabase;

function evaluateCondition(
  condition: RuleCondition,
  metrics: Record<string, string | number>,
): boolean {
  const value = metrics[condition.metric];
  if (value === undefined) return false;

  switch (condition.op) {
    case '>=':
      return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value;
    case '<=':
      return typeof value === 'number' && typeof condition.value === 'number' && value <= condition.value;
    case '==':
      return value === condition.value;
    case '>':
      return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value;
    case '<':
      return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value;
    default:
      return false;
  }
}

function explainCondition(condition: RuleCondition, metrics: Record<string, string | number>): string {
  const value = metrics[condition.metric];
  const metricName = condition.metric;
  const op = condition.op === '>=' ? '≥' : condition.op === '<=' ? '≤' : condition.op;
  
  return `${metricName}(${value}) ${op} ${condition.value}`;
}

function matchRule(
  rule: RuleDefinition,
  metrics: Record<string, string | number>,
  culture?: string,
): { matches: boolean; confidence: number; matchedConditions: string[] } {
  const matchedConditions: string[] = [];
  
  for (const condition of rule.conditions) {
    if (evaluateCondition(condition, metrics)) {
      matchedConditions.push(explainCondition(condition, metrics));
    }
  }
  
  const allConditionsMet = matchedConditions.length === rule.conditions.length;

  if (!allConditionsMet) {
    return { matches: false, confidence: 0, matchedConditions: [] };
  }

  // Calculate confidence based on how well metrics align with rule
  const conditionCount = rule.conditions.length;
  const complexityBonus = Math.min(10, conditionCount * 2); // More conditions = higher confidence
  let confidence = Math.min(100, rule.confidenceBase + complexityBonus);
  
  // Apply cultural adjustment if provided
  if (culture && culturalMappings.cultures[culture]?.regionalAdjustments?.moodWeights) {
    // This will be applied at the rule level
  }

  return { matches: true, confidence, matchedConditions };
}

type MatchResult = {
  label: string;
  confidence: number;
  weight: number;
  matchedConditions: string[];
  description: string;
};

function findBestMatches(
  rules: Record<string, RuleDefinition>,
  metrics: Record<string, string | number>,
  culture?: string,
  topN = 3,
): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const [label, rule] of Object.entries(rules)) {
    const result = matchRule(rule, metrics, culture);
    if (result.matches) {
      let weight = rule.weight;
      
      // Apply cultural weight adjustment
      if (culture && culturalMappings.cultures[culture]?.regionalAdjustments?.moodWeights?.[label]) {
        weight *= culturalMappings.cultures[culture].regionalAdjustments!.moodWeights![label];
      }
      
      matches.push({
        label,
        confidence: result.confidence,
        weight,
        matchedConditions: result.matchedConditions,
        description: rule.description,
      });
    }
  }

  // Sort by weighted confidence
  matches.sort((a, b) => {
    const scoreA = a.confidence * a.weight;
    const scoreB = b.confidence * b.weight;
    return scoreB - scoreA;
  });

  return matches.slice(0, topN);
}

function getLocalizedLabel(
  category: 'moodMappings' | 'genreMappings' | 'shotTypeMappings' | 'energyMappings',
  label: string,
  culture?: string,
): { ar?: string; en?: string; culturalContext?: string } {
  const result: { ar?: string; en?: string; culturalContext?: string } = { en: label };
  
  if (culture && culturalMappings.cultures[culture]) {
    const mapping = culturalMappings.cultures[culture][category]?.[label];
    if (mapping) {
      if (culturalMappings.cultures[culture].code === 'ar') {
        result.ar = mapping.label;
      }
      result.culturalContext = mapping.culturalContext;
    }
  }
  
  // Always try to get Arabic mapping
  const arabicMapping = culturalMappings.cultures['arabic']?.[category]?.[label];
  if (arabicMapping && !result.ar) {
    result.ar = arabicMapping.label;
  }
  
  return result;
}

// Simple in-memory caches to memoize expensive image/video analysis.
// Keys are the source URL (string). In long-running server processes
// a bounded LRU cache should be used; this in-memory Map is sufficient
// for client/browser sessions and improves determinism for identical inputs.
const imageAnalysisCache = new Map<string, VisualAnalysisResult>();
const videoAnalysisCache = new Map<string, VisualAnalysisResult>();

export function clearVisualAnalysisCache(url: string, type?: 'image' | 'video') {
  if (!type || type === 'image') {
    imageAnalysisCache.delete(url);
  }
  if (!type || type === 'video') {
    for (const key of videoAnalysisCache.keys()) {
      if (key.startsWith(`${url}::`)) {
        videoAnalysisCache.delete(key);
      }
    }
  }
}

const DEFAULT_ANALYSIS_CORE: VisualAnalysisCore = {
  lighting: {
    type: 'Soft',
    direction: 'Top-Left',
    intensity: 70,
    quality: 'Natural',
    source: 'Window Light',
  },
  color: {
    temperature: 'Warm',
    temperatureKelvin: 5200,
    dominantColors: [
      { name: 'Deep Blue', hex: '#1a365d', percentage: 35 },
      { name: 'Gold', hex: '#d4a574', percentage: 25 },
      { name: 'Charcoal', hex: '#2d3748', percentage: 20 },
      { name: 'Cream', hex: '#f7f3e9', percentage: 15 },
      { name: 'Bronze', hex: '#8b6914', percentage: 5 },
    ],
  },
  technical: {
    contrast: 68,
    saturation: 54,
    brightness: 62,
    highlights: 70,
    shadows: 32,
    tint: 50,
    sharpness: 78,
    noise: 12,
  },
  composition: {
    score: 72,
  },
  mood: 'Cinematic Drama',
  style: 'Film Noir with Modern Elements',
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

function rgbToHsl(r: number, g: number, b: number) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      default:
        h = (rNorm - gNorm) / d + 4;
    }
    h *= 60;
  }

  return { h, s, l };
}

function nameFromHsl(h: number, s: number, l: number) {
  if (s < 0.08) {
    if (l < 0.2) return 'Black';
    if (l > 0.85) return 'White';
    return 'Gray';
  }
  if (h < 20 || h >= 340) return 'Red';
  if (h < 45) return 'Orange';
  if (h < 70) return 'Yellow';
  if (h < 160) return 'Green';
  if (h < 200) return 'Teal';
  if (h < 250) return 'Blue';
  if (h < 290) return 'Purple';
  return 'Magenta';
}

export function computeCinematicIntelligence(
  input: VisualAnalysisCore,
  culture: string = 'western',
): CinematicIntelligence {
  const contrast = input.technical.contrast;
  const saturation = input.technical.saturation;
  const brightness = input.technical.brightness;
  const sharpness = input.technical.sharpness;
  const noise = input.technical.noise;
  const composition = input.composition.score;
  const temperature = input.color.temperature;

  // Prepare metrics object for rule evaluation
  const metrics = {
    contrast,
    saturation,
    brightness,
    sharpness,
    noise,
    composition,
    temperature,
  };

  // Calculate energy score using formula from rules
  const energyWeights = cinematicRules.energy.formula.weights;
  const rawEnergyScore =
    contrast * energyWeights.contrast +
    saturation * energyWeights.saturation +
    sharpness * energyWeights.sharpness +
    composition * energyWeights.composition +
    noise * energyWeights.noise;
  const energyScore = clamp(Number.isFinite(rawEnergyScore) ? rawEnergyScore : 50);

  // Determine energy level from thresholds
  let energyLevel: CinematicIntelligence['energy']['level'] = 'Medium';
  for (const threshold of cinematicRules.energy.thresholds) {
    if (energyScore >= threshold.min && energyScore < threshold.max) {
      energyLevel = threshold.level as CinematicIntelligence['energy']['level'];
      break;
    }
  }

  // Find best matching mood with cultural adjustment
  const moodMatches = findBestMatches(cinematicRules.moods, metrics, culture, 3);
  const mood = moodMatches.length > 0
    ? moodMatches[0]
    : { label: 'Cinematic Drama', confidence: 70, matchedConditions: [], description: '', weight: 1 };
  const moodAlternatives = moodMatches.slice(1).map(m => ({ 
    label: m.label, 
    confidence: Math.round(m.confidence) 
  }));

  // Find best matching shot type
  const shotTypeMatches = findBestMatches(cinematicRules.shotTypes, metrics, culture, 3);
  const shotType = shotTypeMatches.length > 0
    ? shotTypeMatches[0]
    : { label: 'Medium Shot', confidence: 70, matchedConditions: [], description: '', weight: 1 };
  const shotTypeAlternatives = shotTypeMatches.slice(1).map(m => ({ 
    label: m.label, 
    confidence: Math.round(m.confidence) 
  }));

  // Find best matching genre
  const genreMatches = findBestMatches(cinematicRules.genres, metrics, culture, 3);
  const genre = genreMatches.length > 0
    ? genreMatches[0]
    : { label: 'Editorial', confidence: 68, matchedConditions: [], description: '', weight: 1 };
  const genreAlternatives = genreMatches.slice(1).map(m => ({ 
    label: m.label, 
    confidence: Math.round(m.confidence) 
  }));

  // Energy confidence based on how definitive the score is
  const energyConfidence = Math.round(
    energyScore > 85 || energyScore < 25 ? 90 : 75 + Math.abs(energyScore - 50) / 5,
  );

  // Get localized labels
  const moodLocalization = getLocalizedLabel('moodMappings', mood.label, culture);
  const shotTypeLocalization = getLocalizedLabel('shotTypeMappings', shotType.label, culture);
  const genreLocalization = getLocalizedLabel('genreMappings', genre.label, culture);
  const energyLocalization = getLocalizedLabel('energyMappings', energyLevel, culture);

  return {
    mood: {
      label: mood.label,
      confidence: Math.round(mood.confidence),
      alternatives: moodAlternatives,
      localized: moodLocalization,
      explanation: `Matched ${mood.matchedConditions.length} conditions: ${mood.matchedConditions.join(', ')}`,
      culturalContext: moodLocalization.culturalContext,
    },
    energy: {
      level: energyLevel,
      score: Math.round(energyScore),
      confidence: energyConfidence,
      localized: energyLocalization,
      trend: 'stable', // Default for single frame, will be calculated for video sequences
    },
    shotType: {
      label: shotType.label,
      confidence: Math.round(shotType.confidence),
      alternatives: shotTypeAlternatives,
      localized: shotTypeLocalization,
      explanation: `Matched ${shotType.matchedConditions.length} conditions: ${shotType.matchedConditions.join(', ')}`,
      culturalContext: shotTypeLocalization.culturalContext,
    },
    genre: {
      label: genre.label,
      confidence: Math.round(genre.confidence),
      alternatives: genreAlternatives,
      localized: genreLocalization,
      explanation: `Matched ${genre.matchedConditions.length} conditions: ${genre.matchedConditions.join(', ')}`,
      culturalContext: genreLocalization.culturalContext,
    },
    rulesVersion: cinematicRules.version,
    culture,
    explainability: {
      matchedConditions: {
        mood: mood.matchedConditions,
        shotType: shotType.matchedConditions,
        genre: genre.matchedConditions,
      },
      confidenceFactors: {
        moodComplexity: mood.matchedConditions.length,
        shotTypeComplexity: shotType.matchedConditions.length,
        genreComplexity: genre.matchedConditions.length,
        energyDefinitiveness: energyScore > 85 || energyScore < 25 ? 1.0 : 0.85,
      },
    },
  };
}

// ============================================================================
// TEMPORAL VIDEO ANALYSIS HELPERS
// ============================================================================

export function analyzeEnergyTrend(energyScores: number[]): 'rising' | 'stable' | 'falling' {
  if (energyScores.length < 3) return 'stable';
  
  // Calculate linear regression slope
  const n = energyScores.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = energyScores.reduce((a, b) => a + b, 0);
  const sumXY = energyScores.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Threshold for significant change
  if (slope > 2) return 'rising';
  if (slope < -2) return 'falling';
  return 'stable';
}

export function detectSceneChange(
  frame1: VisualAnalysisResult,
  frame2: VisualAnalysisResult,
  threshold: number = 25,
): boolean {
  // Calculate difference in key metrics
  const brightnessDiff = Math.abs(frame1.technical.brightness - frame2.technical.brightness);
  const contrastDiff = Math.abs(frame1.technical.contrast - frame2.technical.contrast);
  const saturationDiff = Math.abs(frame1.technical.saturation - frame2.technical.saturation);
  
  const totalDiff = brightnessDiff + contrastDiff + saturationDiff;
  return totalDiff > threshold;
}

export function analyzeVideoSequence(
  frames: VisualAnalysisResult[],
  culture: string = 'western',
): {
  averageEnergy: number;
  energyTrend: 'rising' | 'stable' | 'falling';
  sceneChanges: number;
  dominantMood: string;
  dominantGenre: string;
} {
  if (frames.length === 0) {
    return {
      averageEnergy: 50,
      energyTrend: 'stable',
      sceneChanges: 0,
      dominantMood: 'Cinematic Drama',
      dominantGenre: 'Editorial',
    };
  }
  
  // Calculate energy trend
  const energyScores = frames.map(f => f.cinematic.energy.score);
  const averageEnergy = energyScores.reduce((a, b) => a + b, 0) / energyScores.length;
  const energyTrend = analyzeEnergyTrend(energyScores);
  
  // Detect scene changes
  let sceneChanges = 0;
  for (let i = 1; i < frames.length; i++) {
    if (detectSceneChange(frames[i - 1], frames[i])) {
      sceneChanges++;
    }
  }
  
  // Find dominant mood (most frequent)
  const moodCounts: Record<string, number> = {};
  frames.forEach(f => {
    const mood = f.cinematic.mood.label;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Cinematic Drama';
  
  // Find dominant genre
  const genreCounts: Record<string, number> = {};
  frames.forEach(f => {
    const genre = f.cinematic.genre.label;
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  const dominantGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Editorial';
  
  return {
    averageEnergy: Math.round(averageEnergy),
    energyTrend,
    sceneChanges,
    dominantMood,
    dominantGenre,
  };
}

export async function getImageDataFromUrl(src: string, maxSize = 256) {
  return new Promise<ImageData>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const data = ctx.getImageData(0, 0, width, height);
      resolve(data);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export function computeHistogram(imageData: ImageData) {
  const { data } = imageData;
  const rCounts = new Array(256).fill(0);
  const gCounts = new Array(256).fill(0);
  const bCounts = new Array(256).fill(0);
  const lCounts = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    rCounts[r] += 1;
    gCounts[g] += 1;
    bCounts[b] += 1;
    lCounts[lum] += 1;
  }

  const maxR = Math.max(...rCounts);
  const maxG = Math.max(...gCounts);
  const maxB = Math.max(...bCounts);
  const maxL = Math.max(...lCounts);

  return Array.from({ length: 256 }, (_, i) => ({
    value: i,
    r: maxR ? (rCounts[i] / maxR) * 100 : 0,
    g: maxG ? (gCounts[i] / maxG) * 100 : 0,
    b: maxB ? (bCounts[i] / maxB) * 100 : 0,
    lum: maxL ? (lCounts[i] / maxL) * 100 : 0,
  }));
}

export function analyzeImageData(imageData: ImageData): VisualAnalysisResult {
  const { width, height, data } = imageData;
  const totalPixels = width * height;
  if (totalPixels === 0) return DEFAULT_ANALYSIS;

  // Use fixed sampling step for deterministic results
  const sampleStep = SAMPLE_STEP;
  
  // Calculate pixel density for metric normalization
  const pixelDensity = Math.sqrt(width * height);
  const densityFactor = pixelDensity / ANALYSIS_TARGET_SIZE;
  
  let lumSum = 0;
  let lumSqSum = 0;
  let satSum = 0;
  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let count = 0;
  const lumCounts = Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const hsl = rgbToHsl(r, g, b);
    lumSum += lum;
    lumSqSum += lum * lum;
    satSum += hsl.s;
    rSum += r;
    gSum += g;
    bSum += b;
    const lumIndex = Math.max(0, Math.min(255, Math.round(lum * 255)));
    lumCounts[lumIndex] += 1;
    count += 1;
  }

  const meanLum = lumSum / count;
  const varianceLum = lumSqSum / count - meanLum * meanLum;
  const stdLum = Math.sqrt(Math.max(0, varianceLum));
  const avgSat = satSum / count;

  const avgR = rSum / count;
  const avgG = gSum / count;
  const avgB = bSum / count;
  const tempNormalized = clamp(((avgR - avgB + 255) / 510) * 100, 0, 100);
  const tint = clamp(((avgG - (avgR + avgB) / 2 + 255) / 510) * 100, 0, 100);
  const temperatureKelvin = Math.round(2000 + (tempNormalized / 100) * 6000);
  const temperature =
    temperatureKelvin > 6000 ? 'Cool' : temperatureKelvin < 4000 ? 'Warm' : 'Neutral';

  const percentile = (counts: number[], p: number) => {
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const target = total * p;
    let acc = 0;
    for (let i = 0; i < counts.length; i++) {
      acc += counts[i];
      if (acc >= target) return (i / 255) * 100;
    }
    return 0;
  };

  const p02 = percentile(lumCounts, SHADOW_PERCENTILE);
  const p50 = percentile(lumCounts, 0.5);
  const p98 = percentile(lumCounts, HIGHLIGHT_PERCENTILE);

  const brightness = clamp(p50);
  const contrast = clamp((p98 - p02) * CONTRAST_SCALE);
  const highlights = clamp(p98);
  const shadows = clamp(p02);
  const saturation = clamp(avgSat * 120);

  let lapSum = 0;
  let lapSqSum = 0;
  let lapCount = 0;
  let noiseSum = 0;
  let noiseSqSum = 0;
  let noiseCount = 0;

  const idx = (x: number, y: number) => (y * width + x) * 4;
  for (let y = 1; y < height - 1; y += sampleStep) {
    for (let x = 1; x < width - 1; x += sampleStep) {
      const c = idx(x, y);
      const center = data[c];
      const top = data[idx(x, y - 1)];
      const bottom = data[idx(x, y + 1)];
      const left = data[idx(x - 1, y)];
      const right = data[idx(x + 1, y)];
      const lap = top + bottom + left + right - 4 * center;
      lapSum += lap;
      lapSqSum += lap * lap;
      lapCount += 1;

      const blur = (top + bottom + left + right + center) / 5;
      const residual = center - blur;
      noiseSum += residual;
      noiseSqSum += residual * residual;
      noiseCount += 1;
    }
  }

  const lapMean = lapSum / lapCount;
  const lapVar = lapSqSum / lapCount - lapMean * lapMean;
  
  // Normalize sharpness by pixel density for resolution independence
  const normalizedLapVar = lapVar / (densityFactor * densityFactor);
  const sharpness = clamp((normalizedLapVar / SHARPNESS_NORMALIZATION) * 100);

  const noiseMean = noiseSum / noiseCount;
  const noiseVar = noiseSqSum / noiseCount - noiseMean * noiseMean;
  
  // Normalize noise by pixel density for resolution independence
  const normalizedNoiseVar = noiseVar / (densityFactor * densityFactor);
  const noise = clamp((Math.sqrt(Math.max(0, normalizedNoiseVar)) / NOISE_NORMALIZATION) * 100);

  const palette = new Map<number, number>();
  const quantizationDivisor = Math.pow(2, 8 - COLOR_QUANTIZATION_BITS);
  for (let i = 0; i < data.length; i += 4 * sampleStep) {
    const r = Math.floor(data[i] / quantizationDivisor);
    const g = Math.floor(data[i + 1] / quantizationDivisor);
    const b = Math.floor(data[i + 2] / quantizationDivisor);
    const key = (r << (COLOR_QUANTIZATION_BITS * 2)) | (g << COLOR_QUANTIZATION_BITS) | b;
    palette.set(key, (palette.get(key) ?? 0) + 1);
  }

  const totalSamples = Array.from(palette.values()).reduce((a, b) => a + b, 0);
  const dominantColors: DominantColor[] = Array.from(palette.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, value]) => {
      const mask = (1 << COLOR_QUANTIZATION_BITS) - 1;
      const r = ((key >> (COLOR_QUANTIZATION_BITS * 2)) & mask) * quantizationDivisor + quantizationDivisor / 2;
      const g = ((key >> COLOR_QUANTIZATION_BITS) & mask) * quantizationDivisor + quantizationDivisor / 2;
      const b = (key & mask) * quantizationDivisor + quantizationDivisor / 2;
      const hsl = rgbToHsl(r, g, b);
      return {
        name: nameFromHsl(hsl.h, hsl.s, hsl.l),
        hex: rgbToHex(r, g, b),
        percentage: Math.round((value / totalSamples) * 100),
      };
    });

  // ============================================================================
  // ADVANCED COMPOSITION ANALYSIS
  // ============================================================================
  
  let gradientTotal = 0;
  let thirdsEnergy = 0;
  let goldenEnergy = 0;
  let diagonalEnergy = 0;
  let leftEnergy = 0;
  let rightEnergy = 0;
  let topEnergy = 0;
  let bottomEnergy = 0;
  
  // Rule of thirds lines
  const x1 = Math.floor(width / 3);
  const x2 = Math.floor((2 * width) / 3);
  const y1 = Math.floor(height / 3);
  const y2 = Math.floor((2 * height) / 3);
  
  // Golden ratio lines
  const goldenX = Math.floor(width / GOLDEN_RATIO);
  const goldenY = Math.floor(height / GOLDEN_RATIO);
  
  // Center lines for symmetry
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  // Region size as percentage of minimum dimension (resolution-independent)
  const regionSize = Math.max(1, Math.floor(Math.min(width, height) * COMPOSITION_REGION_PERCENT));

  for (let y = 1; y < height - 1; y += sampleStep) {
    for (let x = 1; x < width - 1; x += sampleStep) {
      const c = idx(x, y);
      const gx = data[idx(x + 1, y)] - data[idx(x - 1, y)];
      const gy = data[idx(x, y + 1)] - data[idx(x, y - 1)];
      const gmag = Math.abs(gx) + Math.abs(gy);
      gradientTotal += gmag;

      // Rule of thirds energy
      const inThirdsX = Math.abs(x - x1) < regionSize || Math.abs(x - x2) < regionSize;
      const inThirdsY = Math.abs(y - y1) < regionSize || Math.abs(y - y2) < regionSize;
      if (inThirdsX && inThirdsY) {
        thirdsEnergy += gmag;
      }
      
      // Golden ratio energy
      const inGoldenX = Math.abs(x - goldenX) < regionSize || Math.abs(x - (width - goldenX)) < regionSize;
      const inGoldenY = Math.abs(y - goldenY) < regionSize || Math.abs(y - (height - goldenY)) < regionSize;
      if (inGoldenX && inGoldenY) {
        goldenEnergy += gmag;
      }
      
      // Diagonal energy (main diagonals)
      const onMainDiag = Math.abs((x * height) - (y * width)) < (regionSize * Math.max(width, height));
      const onAntiDiag = Math.abs((x * height) - ((height - y) * width)) < (regionSize * Math.max(width, height));
      if (onMainDiag || onAntiDiag) {
        diagonalEnergy += gmag;
      }
      
      // Symmetry energy accumulation
      if (x < centerX) leftEnergy += gmag;
      else rightEnergy += gmag;
      
      if (y < centerY) topEnergy += gmag;
      else bottomEnergy += gmag;
    }
  }

  // Calculate individual composition metrics
  const thirdsScore = gradientTotal ? (thirdsEnergy / gradientTotal) * 100 : 0;
  const goldenScore = gradientTotal ? (goldenEnergy / gradientTotal) * 100 : 0;
  const diagonalScore = gradientTotal ? (diagonalEnergy / gradientTotal) * 100 : 0;
  
  // Symmetry score: lower difference = better symmetry
  const horizontalSymmetry = leftEnergy && rightEnergy
    ? 100 * (1 - Math.abs(leftEnergy - rightEnergy) / (leftEnergy + rightEnergy))
    : 50;
  const verticalSymmetry = topEnergy && bottomEnergy
    ? 100 * (1 - Math.abs(topEnergy - bottomEnergy) / (topEnergy + bottomEnergy))
    : 50;
  const symmetryScore = (horizontalSymmetry + verticalSymmetry) / 2;
  
  // Weighted composition score
  const compositionScore = clamp(
    thirdsScore * COMPOSITION_WEIGHTS.ruleOfThirds * COMPOSITION_SCALE +
    goldenScore * COMPOSITION_WEIGHTS.goldenRatio * COMPOSITION_SCALE +
    symmetryScore * COMPOSITION_WEIGHTS.symmetry +
    diagonalScore * COMPOSITION_WEIGHTS.diagonals * COMPOSITION_SCALE
  );

  const lightingType = contrast > 60 ? 'Hard' : 'Soft';
  const lightingQuality = temperature === 'Cool' ? 'Studio' : 'Natural';
  const mood = contrast > 60 ? 'Cinematic Drama' : 'Soft Documentary';
  const style = saturation > 55 ? 'Modern Cinematic' : 'Film Noir with Modern Elements';

  const core: VisualAnalysisCore = {
    lighting: {
      type: lightingType,
      direction: DEFAULT_ANALYSIS_CORE.lighting.direction,
      intensity: clamp(brightness),
      quality: lightingQuality,
      source: DEFAULT_ANALYSIS_CORE.lighting.source,
    },
    color: {
      temperature,
      temperatureKelvin,
      dominantColors: dominantColors.length
        ? dominantColors
        : DEFAULT_ANALYSIS_CORE.color.dominantColors,
    },
    technical: {
      contrast: Math.round(contrast),
      saturation: Math.round(saturation),
      brightness: Math.round(brightness),
      highlights: Math.round(highlights),
      shadows: Math.round(shadows),
      tint: Math.round(tint),
      sharpness: Math.round(sharpness),
      noise: Math.round(noise),
    },
    composition: {
      score: Math.round(compositionScore),
    },
    mood,
    style,
  };

  return {
    ...core,
    cinematic: computeCinematicIntelligence(core, 'western'),
  };
}

export function analyzeImageDataWithCulture(imageData: ImageData, culture: string = 'western'): VisualAnalysisResult {
  const core = analyzeImageData(imageData) as VisualAnalysisCore & { cinematic: CinematicIntelligence };
  return {
    ...core,
    cinematic: computeCinematicIntelligence(core, culture),
  };
}

export async function analyzeImageFromUrl(src: string, culture: string = 'western') {
  // Return cached result when available to ensure determinism and speed.
  const cacheKey = `${src}::${culture}`;
  if (imageAnalysisCache.has(cacheKey)) {
    return imageAnalysisCache.get(cacheKey) as VisualAnalysisResult;
  }

  const imageData = await getImageDataFromUrl(src);
  const result = analyzeImageDataWithCulture(imageData, culture);
  try {
    imageAnalysisCache.set(cacheKey, result);
  } catch (e) {
    logger.warn('imageAnalysis cache set failed', { src, culture, error: String(e) });
  }
  return result;
}

const waitForEvent = (target: EventTarget, event: string) =>
  new Promise<void>((resolve, reject) => {
    const onEvent = () => {
      target.removeEventListener(event, onEvent as EventListener);
      target.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      target.removeEventListener(event, onEvent as EventListener);
      reject(new Error('Failed to load media'));
    };
    target.addEventListener(event, onEvent as EventListener, { once: true });
    target.addEventListener('error', onError, { once: true });
  });

const seekTo = (video: HTMLVideoElement, time: number) =>
  new Promise<void>((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      resolve();
    };
    const onError = () => {
      video.removeEventListener('seeked', onSeeked);
      reject(new Error('Failed to seek video'));
    };
    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError, { once: true });
    video.currentTime = time;
  });

const normalizeTemperature = (temperatureKelvin: number) =>
  temperatureKelvin > 6000 ? 'Cool' : temperatureKelvin < 4000 ? 'Warm' : 'Neutral';

export async function analyzeVideoFromUrl(
  src: string,
  options: { maxSize?: number; samples?: number } = {},
) {
  // Use cache by src+options key for repeatable results.
  const cacheKey = `${src}::${JSON.stringify(options)}`;
  if (videoAnalysisCache.has(cacheKey)) {
    return videoAnalysisCache.get(cacheKey) as VisualAnalysisResult;
  }
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;
  video.src = src;

  await waitForEvent(video, 'loadedmetadata');

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  
  // Fixed temporal sampling: 1 frame every 2 seconds, minimum 3, maximum 10
  // This ensures consistent sampling regardless of video length
  const FRAMES_PER_SECOND = 0.5;
  const MIN_SAMPLES = 3;
  const MAX_SAMPLES = 10;
  
  const sampleCount = options.samples ??
    (duration > 0 
      ? Math.max(MIN_SAMPLES, Math.min(MAX_SAMPLES, Math.round(duration * FRAMES_PER_SECOND)))
      : MIN_SAMPLES);
      
  const times =
    duration > 0
      ? Array.from(
          { length: sampleCount },
          (_, i) => (duration * (i + 1)) / (sampleCount + 1),
        )
      : [0];

  const aggregate = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0,
    noise: 0,
    intensity: 0,
    temperatureKelvin: 0,
    composition: 0,
  };
  const palette = new Map<string, { name: string; weight: number }>();

  const maxSize = options.maxSize ?? 256;

  for (const time of times) {
    await seekTo(video, time);
    const scale = Math.min(
      1,
      maxSize / Math.max(video.videoWidth || 1, video.videoHeight || 1),
    );
    const width = Math.max(1, Math.round((video.videoWidth || 1) * scale));
    const height = Math.max(1, Math.round((video.videoHeight || 1) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      continue;
    }
    ctx.drawImage(video, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const analysis = analyzeImageData(imageData);

    aggregate.brightness += analysis.technical.brightness;
    aggregate.contrast += analysis.technical.contrast;
    aggregate.saturation += analysis.technical.saturation;
    aggregate.sharpness += analysis.technical.sharpness;
    aggregate.noise += analysis.technical.noise;
    aggregate.intensity += analysis.lighting.intensity;
    aggregate.temperatureKelvin += analysis.color.temperatureKelvin;
    aggregate.composition += analysis.composition.score;

    analysis.color.dominantColors.forEach((color) => {
      const entry = palette.get(color.hex);
      if (entry) {
        entry.weight += color.percentage;
      } else {
        palette.set(color.hex, { name: color.name, weight: color.percentage });
      }
    });
  }

  const frames = times.length || 1;
  const brightness = clamp(aggregate.brightness / frames);
  const contrast = clamp(aggregate.contrast / frames);
  const saturation = clamp(aggregate.saturation / frames);
  const sharpness = clamp(aggregate.sharpness / frames);
  const noise = clamp(aggregate.noise / frames);
  const intensity = clamp(aggregate.intensity / frames);
  const temperatureKelvin = Math.round(aggregate.temperatureKelvin / frames);
  const temperature = normalizeTemperature(temperatureKelvin);
  const composition = clamp(aggregate.composition / frames);

  const totalWeight =
    Array.from(palette.values()).reduce((sum, c) => sum + c.weight, 0) || 1;
  const dominantColors = Array.from(palette.entries())
    .sort((a, b) => b[1].weight - a[1].weight)
    .slice(0, 5)
    .map(([hex, data]) => ({
      name: data.name,
      hex,
      percentage: Math.round((data.weight / totalWeight) * 100),
    }));

  const lightingType = contrast > 60 ? 'Hard' : 'Soft';
  const lightingQuality = temperature === 'Cool' ? 'Studio' : 'Natural';
  const mood = contrast > 60 ? 'Cinematic Drama' : 'Soft Documentary';
  const style = saturation > 55 ? 'Modern Cinematic' : 'Film Noir with Modern Elements';

  const core: VisualAnalysisCore = {
    lighting: {
      type: lightingType,
      direction: DEFAULT_ANALYSIS_CORE.lighting.direction,
      intensity: Math.round(intensity),
      quality: lightingQuality,
      source: DEFAULT_ANALYSIS_CORE.lighting.source,
    },
    color: {
      temperature,
      temperatureKelvin,
      dominantColors: dominantColors.length
        ? dominantColors
        : DEFAULT_ANALYSIS_CORE.color.dominantColors,
    },
    technical: {
      contrast: Math.round(contrast),
      saturation: Math.round(saturation),
      brightness: Math.round(brightness),
      highlights: DEFAULT_ANALYSIS_CORE.technical.highlights,
      shadows: DEFAULT_ANALYSIS_CORE.technical.shadows,
      tint: DEFAULT_ANALYSIS_CORE.technical.tint,
      sharpness: Math.round(sharpness),
      noise: Math.round(noise),
    },
    composition: {
      score: Math.round(composition),
    },
    mood,
    style,
  };

  const final = {
    ...core,
    cinematic: computeCinematicIntelligence(core),
  };
  try {
    videoAnalysisCache.set(cacheKey, final);
  } catch (e) {
    logger.warn('videoAnalysis cache set failed', { cacheKey, error: String(e) });
  }
  return final;
}

const DEFAULT_ANALYSIS: VisualAnalysisResult = {
  ...DEFAULT_ANALYSIS_CORE,
  cinematic: computeCinematicIntelligence(DEFAULT_ANALYSIS_CORE),
};

export const defaultVisualAnalysis = DEFAULT_ANALYSIS;
