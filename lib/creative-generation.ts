type DominantColor = {
  name?: string;
  hex?: string;
  percentage?: number;
};

type MoodboardItem =
  | { id: number; type: 'image'; src: string; label: string; notes?: string }
  | { id: number; type: 'color'; color: string; label: string; role?: string; harmony?: string };

type CinematicIntelligence = {
  mood: {
    label: string;
    confidence: number;
    alternatives?: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  energy: {
    level: string;
    score: number;
    confidence: number;
    localized?: { ar?: string; en?: string };
    trend?: 'rising' | 'stable' | 'falling';
  };
  shotType: {
    label: string;
    confidence: number;
    alternatives?: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  genre: {
    label: string;
    confidence: number;
    alternatives?: Array<{ label: string; confidence: number }>;
    localized?: { ar?: string; en?: string };
    explanation?: string;
    culturalContext?: string;
  };
  rulesVersion?: string;
  culture?: string;
  explainability?: {
    matchedConditions: Record<string, string[]>;
    confidenceFactors: Record<string, number>;
  };
};

type AnalysisSnapshot = {
  mood?: string;
  cinematic?: CinematicIntelligence;
  technical?: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    sharpness?: number;
    noise?: number;
    highlights?: number;
    shadows?: number;
    tint?: number;
  };
  composition?: {
    score?: number;
    ruleOfThirds?: boolean;
    symmetry?: boolean;
    leadingLines?: boolean;
    depthLayers?: number;
    focalPoint?: { x: number; y: number };
  };
  color?: {
    temperature?: string;
    temperatureKelvin?: number;
    dominantColors?: DominantColor[];
  };
  lighting?: {
    type?: string;
    direction?: string;
    intensity?: number;
    quality?: string;
    source?: string;
  };
};

type StoryboardFrame = {
  id: number;
  frame: number;
  image: string;
  shotType: string;
  notes: string;
  timing?: string;
  cameraSetup?: {
    lens: string;
    aperture: string;
    iso: string;
    shutterSpeed: string;
    movement: string;
    height: string;
  };
  lighting?: {
    key: string;
    fill: string;
    back: string;
    kelvin: string;
    ratio: string;
  };
  composition?: {
    rule: string;
    leadingLines?: string;
    depth?: string;
    focus?: string;
  };
  talent?: {
    blocking: string;
    expression: string;
    wardrobe: string;
  };
  transitionIn?: string;
  transitionOut?: string;
};

type CameraSetup = NonNullable<StoryboardFrame['cameraSetup']>;
type LightingSetup = NonNullable<StoryboardFrame['lighting']>;
type TalentDirection = NonNullable<StoryboardFrame['talent']>;

const safeNumber = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const safeString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length ? value : fallback;

// Composition analysis helpers
function analyzeComposition(analysis: AnalysisSnapshot): {
  hasRuleOfThirds: boolean;
  hasLeadingLines: boolean;
  hasDepth: boolean;
  symmetryScore: number;
  focalPointStrength: number;
} {
  const composition = analysis.composition;
  const technical = analysis.technical;
  
  return {
    hasRuleOfThirds: composition?.ruleOfThirds ?? false,
    hasLeadingLines: composition?.leadingLines ?? false,
    hasDepth: (composition?.depthLayers ?? 0) >= 2,
    symmetryScore: composition?.symmetry ? 85 : 45,
    focalPointStrength: composition?.score ? composition.score : 60,
  };
}

// Camera specs generator based on shot type and energy
function generateCameraSpecs(
  shotType: string,
  energyLevel: string,
  energyScore: number
): CameraSetup {
  const isWide = shotType.toLowerCase().includes('wide') || shotType.toLowerCase().includes('establishing');
  const isClose = shotType.toLowerCase().includes('close') || shotType.toLowerCase().includes('intimate');
  const isMedium = !isWide && !isClose;
  
  const isHighEnergy = energyLevel.includes('High') || energyScore >= 70;
  const isLowEnergy = energyLevel.includes('Low') || energyScore <= 40;
  
  return {
    lens: isWide ? '24mm wide angle' : isClose ? '85mm portrait' : '50mm standard',
    aperture: isClose ? 'f/1.8 for shallow DoF' : isMedium ? 'f/2.8 for balanced depth' : 'f/5.6 for deep focus',
    iso: 'ISO 400-800 (adaptable to lighting)',
    shutterSpeed: isHighEnergy ? '1/125 for sharp action' : '1/50 for natural motion blur',
    movement: isHighEnergy 
      ? 'Dynamic handheld or fast tracking shot' 
      : isLowEnergy 
        ? 'Static or very slow push-in (2-3 seconds)' 
        : 'Gentle dolly or smooth gimbal movement',
    height: isClose ? 'Eye level for intimacy' : isWide ? 'Slightly elevated for context' : 'Eye to chest level',
  };
}

// Lighting specs generator based on technical metrics
function generateLightingSpecs(
  analysis: AnalysisSnapshot
): LightingSetup {
  const contrast = safeNumber(analysis.technical?.contrast, 55);
  const brightness = safeNumber(analysis.technical?.brightness, 55);
  const kelvin = safeNumber(analysis.color?.temperatureKelvin, 5000);
  const lightingDirection = safeString(analysis.lighting?.direction, 'Front');
  
  const isHighContrast = contrast >= 65;
  const isLowKey = brightness <= 45;
  const isWarm = kelvin < 4500;
  
  return {
    key: isHighContrast 
      ? `Hard directional light from ${lightingDirection.toLowerCase()}, 60° angle` 
      : `Soft diffused light from ${lightingDirection.toLowerCase()}, 45° angle`,
    fill: isHighContrast 
      ? `Minimal fill (1:4 ratio) for dramatic shadows` 
      : `Balanced fill (1:2 ratio) with bounce card or softbox`,
    back: isLowKey 
      ? `Subtle rim light for edge definition` 
      : `Strong backlight for separation and depth`,
    kelvin: isWarm ? `${kelvin}K warm tungsten` : kelvin > 5500 ? `${kelvin}K cool daylight` : `${kelvin}K neutral`,
    ratio: isHighContrast ? '1:4 high-contrast noir' : '1:2 balanced commercial',
  };
}

// Talent direction generator based on mood and composition
function generateTalentDirection(
  mood: string,
  shotType: string,
  composition: ReturnType<typeof analyzeComposition>
): TalentDirection {
  const isIntimate = shotType.toLowerCase().includes('close') || shotType.toLowerCase().includes('intimate');
  const isDramatic = mood.toLowerCase().includes('tension') || mood.toLowerCase().includes('suspense') || mood.toLowerCase().includes('noir');
  const isJoyful = mood.toLowerCase().includes('joy') || mood.toLowerCase().includes('uplifting') || mood.toLowerCase().includes('playful');
  
  return {
    blocking: composition.hasRuleOfThirds 
      ? 'Position subject at thirds intersection, leave looking space' 
      : composition.symmetryScore > 70
        ? 'Center subject for symmetrical framing'
        : 'Natural blocking following scene flow',
    expression: isDramatic 
      ? 'Contemplative, intense gaze, minimal movement' 
      : isJoyful 
        ? 'Open expression, engaging eye contact, dynamic movement'
        : 'Neutral to subtle emotional range',
    wardrobe: isDramatic 
      ? 'Dark, muted tones (blacks, grays, deep blues)' 
      : isJoyful 
        ? 'Bright, saturated colors complementing scene palette'
        : 'Earth tones matching environmental color scheme',
  };
}

// Enhanced storyboard generation with ci-v2 integration
export function generateStoryboard(
  analysis: AnalysisSnapshot,
  previewUrl?: string | null,
): {
  title: string;
  description: string;
  frames: StoryboardFrame[];
  metadata: {
    totalFrames: number;
    estimatedDuration: string;
    cinematicProfile: string;
    culturalContext?: string;
  };
} {
  // Use existing ci-v2 cinematic intelligence instead of re-implementing
  const cinematic = analysis.cinematic;
  
  if (!cinematic) {
    // Fallback if cinematic analysis not available
    return {
      title: 'Storyboard',
      description: 'Cinematic analysis not available',
      frames: [],
      metadata: {
        totalFrames: 0,
        estimatedDuration: '0:00',
        cinematicProfile: 'Unknown',
      },
    };
  }
  
  const mood = cinematic.mood.label;
  const moodConfidence = cinematic.mood.confidence;
  const moodExplanation = cinematic.mood.explanation || '';
  const culturalContext = cinematic.mood.culturalContext;
  const energyLevel = cinematic.energy.level;
  const energyScore = cinematic.energy.score;
  const shotType = cinematic.shotType.label;
  const genre = cinematic.genre.label;
  
  const compositionAnalysis = analyzeComposition(analysis);
  const cameraSpecs = generateCameraSpecs(shotType, energyLevel, energyScore);
  const lightingSpecs = generateLightingSpecs(analysis);
  const talentDirection =
    generateTalentDirection(mood, shotType, compositionAnalysis) ?? {
      blocking: 'Natural movement with subtle direction',
      expression: `${mood.toLowerCase()} expression`,
      wardrobe: 'Neutral wardrobe aligned to brand palette',
    };
  
  // Generate comprehensive frame sequence (20-30 frames for production)
  const frames: StoryboardFrame[] = [];
  
  // Frame 1: Establishing Wide (Master Shot)
  frames.push({
    id: 1,
    frame: 1,
    image: previewUrl || '/placeholder.svg?height=180&width=320',
    shotType: 'Wide Establishing Shot',
    notes: `Open with wide establishing shot to set context. ${moodExplanation}`,
    timing: '00:00 - 00:08',
    cameraSetup: {
      lens: '24mm wide angle',
      aperture: 'f/5.6 for deep focus',
      iso: 'ISO 400-800',
      shutterSpeed: '1/50 for natural motion',
      movement: 'Static or very slow push-in over 8 seconds',
      height: 'Slightly elevated (5-6 feet) for environmental context',
    },
    lighting: lightingSpecs,
    composition: {
      rule: compositionAnalysis.hasRuleOfThirds ? 'Rule of thirds - horizon at lower third' : 'Centered composition for symmetry',
      leadingLines: compositionAnalysis.hasLeadingLines ? 'Utilize leading lines to guide eye to subject' : 'Natural composition flow',
      depth: compositionAnalysis.hasDepth ? 'Foreground, midground, background layers' : 'Single plane focus',
      focus: 'Deep focus to show full environment',
    },
    talent: {
      blocking: 'Subject enters from frame right, walks to focal point',
      expression: `${mood.toLowerCase()} expression - establish emotional tone`,
      wardrobe: talentDirection.wardrobe,
    },
    transitionOut: 'Match cut on subject gaze direction',
  });
  
  // Frame 2-4: Coverage sequence (Medium shots)
  for (let i = 2; i <= 4; i++) {
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: 'Medium Shot',
      notes: `Medium shot ${i - 1}/3 - ${mood} mood maintained. Coverage for editing flexibility.`,
      timing: `00:${String(8 + (i - 2) * 6).padStart(2, '0')} - 00:${String(14 + (i - 2) * 6).padStart(2, '0')}`,
      cameraSetup: {
        ...cameraSpecs,
        lens: '50mm standard',
        aperture: 'f/2.8 for balanced depth',
      },
      lighting: lightingSpecs,
      composition: {
        rule: compositionAnalysis.hasRuleOfThirds ? 'Subject at thirds intersection' : 'Centered framing',
        depth: 'Foreground soft blur, subject sharp, background bokeh',
        focus: 'Selective focus on subject',
      },
      talent: talentDirection,
    });
  }
  
  // Frame 5-8: Close-up sequence (Emotional beats)
  for (let i = 5; i <= 8; i++) {
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: shotType.includes('Close') ? shotType : 'Close-up Detail',
      notes: `Close-up ${i - 4}/4 - Capture emotional nuance. ${shotType} framing.`,
      timing: `00:${String(26 + (i - 5) * 5).padStart(2, '0')} - 00:${String(31 + (i - 5) * 5).padStart(2, '0')}`,
      cameraSetup: {
        lens: '85mm portrait',
        aperture: 'f/1.8 for shallow DoF',
        iso: 'ISO 400-800',
        shutterSpeed: cameraSpecs.shutterSpeed,
        movement: energyScore >= 70 ? 'Subtle handheld for intimacy' : 'Static for contemplation',
        height: 'Eye level for direct connection',
      },
      lighting: lightingSpecs,
      composition: {
        rule: 'Headroom and looking space per thirds',
        focus: 'Eyes sharp, shallow DoF f/1.8',
      },
      talent: {
        blocking: 'Minimal movement, focus on micro-expressions',
        expression: `${mood} intensity - key emotional beat`,
        wardrobe: talentDirection.wardrobe,
      },
    });
  }
  
  // Frame 9-12: Reaction shots / Insert details
  for (let i = 9; i <= 12; i++) {
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: 'Insert Detail / Cutaway',
      notes: `Insert detail ${i - 8}/4 - Environmental storytelling, ${genre.toLowerCase()} aesthetic.`,
      timing: `00:${String(46 + (i - 9) * 4).padStart(2, '0')} - 00:${String(50 + (i - 9) * 4).padStart(2, '0')}`,
      cameraSetup: {
        lens: '85mm or 100mm macro',
        aperture: 'f/2.8 for selective focus',
        iso: 'ISO 400',
        shutterSpeed: '1/50',
        movement: 'Slow dolly or static',
        height: 'Object level',
      },
      lighting: lightingSpecs,
      composition: {
        rule: 'Negative space for visual breathing room',
        focus: 'Shallow depth, subject isolated',
      },
      talent: {
        blocking: 'Hands, objects, environmental details',
        expression: 'Visual metaphor for emotional state',
        wardrobe: 'Detail consistency with main wardrobe',
      },
    });
  }
  
  // Frame 13-16: Alternative angles (Reverse shots, OTS)
  for (let i = 13; i <= 16; i++) {
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: 'Over-the-Shoulder / Reverse',
      notes: `Reverse angle ${i - 12}/4 - Maintain 180° rule, ${mood} continuity.`,
      timing: `01:${String(2 + (i - 13) * 5).padStart(2, '0')} - 01:${String(7 + (i - 13) * 5).padStart(2, '0')}`,
      cameraSetup: {
        lens: '50mm standard',
        aperture: 'f/2.8',
        iso: 'ISO 400-800',
        shutterSpeed: cameraSpecs.shutterSpeed,
        movement: cameraSpecs.movement,
        height: 'Eye level, respecting 180° axis',
      },
      lighting: lightingSpecs,
      composition: {
        rule: 'OTS shoulder at thirds, subject at opposite third',
        depth: 'Foreground shoulder blur, subject sharp',
      },
      talent: talentDirection,
    });
  }
  
  // Frame 17-20: Build to climax
  for (let i = 17; i <= 20; i++) {
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: energyScore >= 70 ? 'Dynamic Action' : 'Sustained Tension',
      notes: `Build tension ${i - 16}/4 - ${energyLevel} energy escalation.`,
      timing: `01:${String(22 + (i - 17) * 4).padStart(2, '0')} - 01:${String(26 + (i - 17) * 4).padStart(2, '0')}`,
      cameraSetup: {
        ...cameraSpecs,
        movement: energyScore >= 70 
          ? 'Aggressive handheld or fast tracking' 
          : 'Slow intensifying push-in',
      },
      lighting: {
        ...lightingSpecs,
        ratio: 'Increase contrast for dramatic peak',
      },
      composition: {
        rule: 'Breaking rules for tension - tighter framing, headroom reduction',
        focus: 'Sharp focus, heightened clarity',
      },
      talent: {
        blocking: 'Intensifying movement or stillness (depends on mood)',
        expression: `Peak ${mood} emotion`,
        wardrobe: talentDirection.wardrobe,
      },
    });
  }
  
  // Frame 21-24: Resolution / Closing beats
  for (let i = 21; i <= 24; i++) {
    const isLast = i === 24;
    frames.push({
      id: i,
      frame: i,
      image: '/placeholder.svg?height=180&width=320',
      shotType: isLast ? 'Wide Closing' : 'Medium Resolve',
      notes: `Resolution ${i - 20}/4 - ${isLast ? 'Final visual statement' : 'De-escalate tension'}.`,
      timing: `01:${String(38 + (i - 21) * 5).padStart(2, '0')} - 01:${String(43 + (i - 21) * 5).padStart(2, '0')}`,
      cameraSetup: {
        lens: isLast ? '24mm wide' : '50mm standard',
        aperture: isLast ? 'f/5.6' : 'f/2.8',
        iso: 'ISO 400-800',
        shutterSpeed: '1/50',
        movement: isLast ? 'Slow pull-back to reveal context' : 'Minimal movement',
        height: isLast ? 'Return to establishing height' : 'Eye level',
      },
      lighting: lightingSpecs,
      composition: {
        rule: isLast ? 'Return to rule of thirds symmetry' : 'Balanced composition',
        focus: isLast ? 'Deep focus' : 'Selective focus',
      },
      talent: {
        blocking: isLast ? 'Subject in context, resolved position' : talentDirection.blocking,
        expression: `Resolved ${mood} - clear emotional landing`,
        wardrobe: talentDirection.wardrobe,
      },
      transitionOut: isLast ? 'Fade to black or cut to next scene' : undefined,
    });
  }
  
  return {
    title: `${genre} Storyboard - ${mood} (${moodConfidence}% confidence)`,
    description: `Production storyboard for ${genre.toLowerCase()} scene with ${mood.toLowerCase()} mood and ${energyLevel.toLowerCase()} energy. ${moodExplanation}`,
    frames,
    metadata: {
      totalFrames: frames.length,
      estimatedDuration: '1:58 (118 seconds)',
      cinematicProfile: `${mood} / ${energyLevel} / ${shotType} / ${genre}`,
      culturalContext,
    },
  };
}

// Enhanced moodboard generation with categorized references
export function generateMoodboard(
  analysis: AnalysisSnapshot,
  previewUrl?: string | null,
): {
  title: string;
  description: string;
  items: MoodboardItem[];
  metadata: {
    totalItems: number;
    colorScheme: string;
    moodProfile: string;
    culturalContext?: string;
  };
} {
  const cinematic = analysis.cinematic;
  
  if (!cinematic) {
    return {
      title: 'Moodboard',
      description: 'Cinematic analysis not available',
      items: [],
      metadata: {
        totalItems: 0,
        colorScheme: 'Unknown',
        moodProfile: 'Unknown',
      },
    };
  }
  
  const mood = cinematic.mood.label;
  const culturalContext = cinematic.mood.culturalContext;
  const genre = cinematic.genre.label;
  const energyLevel = cinematic.energy.level;
  
  const dominant = analysis.color?.dominantColors ?? [];
  const items: MoodboardItem[] = [];
  let itemId = 1;
  
  // 1. Hero image reference
  items.push({
    id: itemId++,
    type: 'image',
    src: previewUrl || '/placeholder.svg?height=300&width=400',
    label: `${mood} Hero Reference`,
    notes: `Primary visual reference establishing ${mood.toLowerCase()} mood with ${energyLevel.toLowerCase()} energy`,
  });
  
  // 2. Color Palette (Primary, Secondary, Accent)
  const colors = dominant.slice(0, 5);
  if (colors.length >= 3) {
    // Primary color
    items.push({
      id: itemId++,
      type: 'color',
      color: colors[0].hex || '#d4af37',
      label: `Primary: ${colors[0].name || 'Dominant'}`,
      role: 'Key lighting color and primary palette anchor',
      harmony: 'Defines overall temperature and emotional tone',
    });
    
    // Secondary color
    items.push({
      id: itemId++,
      type: 'color',
      color: colors[1].hex || '#8b7355',
      label: `Secondary: ${colors[1].name || 'Support'}`,
      role: 'Shadow tones and compositional balance',
      harmony: 'Complementary relationship with primary',
    });
    
    // Accent color
    items.push({
      id: itemId++,
      type: 'color',
      color: colors[2].hex || '#f4e4c1',
      label: `Accent: ${colors[2].name || 'Highlight'}`,
      role: 'Highlights, practical lights, and focal points',
      harmony: 'Provides visual interest and depth',
    });
    
    // Additional colors if available
    if (colors.length >= 4) {
      items.push({
        id: itemId++,
        type: 'color',
        color: colors[3].hex || '#2c2c2c',
        label: `Depth: ${colors[3].name || 'Shadow'}`,
        role: 'Deep shadows and background tones',
        harmony: 'Adds dimensionality and contrast',
      });
    }
    
    if (colors.length >= 5) {
      items.push({
        id: itemId++,
        type: 'color',
        color: colors[4].hex || '#ffffff',
        label: `Contrast: ${colors[4].name || 'Bright'}`,
        role: 'Highlights and specular reflections',
        harmony: 'Maximum contrast for visual pop',
      });
    }
  }
  
  // 3. Lighting References
  const isHighContrast = (analysis.technical?.contrast ?? 55) >= 65;
  const isWarm = (analysis.color?.temperatureKelvin ?? 5000) < 4500;
  const isCool = (analysis.color?.temperatureKelvin ?? 5000) > 5500;
  
  if (isWarm) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Golden Hour Lighting',
      notes: `${analysis.color?.temperatureKelvin}K warm tungsten - soft directional light with warm color cast`,
    });
  }
  
  if (isCool) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Blue Hour / Cool Lighting',
      notes: `${analysis.color?.temperatureKelvin}K cool daylight - creates distance and clinical feel`,
    });
  }
  
  if (isHighContrast) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'High-Contrast Lighting',
      notes: `Dramatic key/fill ratio (1:4) - hard shadows and defined edges for ${mood.toLowerCase()} mood`,
    });
  } else {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Soft Lighting Reference',
      notes: `Diffused lighting with balanced fill (1:2 ratio) - gentle shadows for approachable feel`,
    });
  }
  
  // 4. Composition References
  const compositionAnalysis = analyzeComposition(analysis);
  
  if (compositionAnalysis.hasRuleOfThirds) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Rule of Thirds Composition',
      notes: 'Subject placement at thirds intersections creates visual balance and professional framing',
    });
  }
  
  if (compositionAnalysis.symmetryScore > 70) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Symmetrical Composition',
      notes: 'Centered framing and symmetry creates order, formality, and visual impact',
    });
  }
  
  if (compositionAnalysis.hasLeadingLines) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Leading Lines Reference',
      notes: 'Architectural or natural lines guide viewer eye to subject - creates depth and flow',
    });
  }
  
  if (compositionAnalysis.hasDepth) {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: 'Depth Layering',
      notes: 'Foreground, midground, background separation - creates 3D space on 2D plane',
    });
  }
  
  // 5. Texture References
  const isDramatic = mood.toLowerCase().includes('noir') || mood.toLowerCase().includes('tension') || mood.toLowerCase().includes('suspense');
  const isWarmMood = mood.toLowerCase().includes('warm') || mood.toLowerCase().includes('romantic');
  
  items.push({
    id: itemId++,
    type: 'image',
    src: '/placeholder.svg?height=300&width=400',
    label: isDramatic ? 'Hard Texture: Concrete/Metal' : isWarmMood ? 'Soft Texture: Fabric/Wood' : 'Balanced Texture',
    notes: isDramatic 
      ? 'Hard surfaces reflect light dramatically - concrete, brushed metal, glass for urban tension'
      : isWarmMood 
        ? 'Soft materials absorb light gently - natural fabrics, aged wood, leather for warmth'
        : 'Mixed textures create visual interest and realism',
  });
  
  items.push({
    id: itemId++,
    type: 'image',
    src: '/placeholder.svg?height=300&width=400',
    label: 'Surface Detail Reference',
    notes: `Macro texture details for ${genre.toLowerCase()} aesthetic - informs set design and prop selection`,
  });
  
  // 6. Film References (Cinematography inspiration)
  const filmRefs = getFilmReferences(mood, genre);
  filmRefs.forEach(ref => {
    items.push({
      id: itemId++,
      type: 'image',
      src: '/placeholder.svg?height=300&width=400',
      label: `Film Ref: ${ref.title}`,
      notes: `${ref.director} (${ref.cinematographer}) - ${ref.relevance}`,
    });
  });
  
  // Determine color scheme
  const colorScheme = determineColorScheme(colors);
  
  return {
    title: `${genre} Moodboard - ${mood}`,
    description: `Visual reference board for ${genre.toLowerCase()} production with ${mood.toLowerCase()} atmosphere. ${culturalContext ? `Cultural context: ${culturalContext}` : ''}`,
    items,
    metadata: {
      totalItems: items.length,
      colorScheme,
      moodProfile: `${mood} / ${energyLevel} / ${genre}`,
      culturalContext,
    },
  };
}

// Helper: Get film cinematography references based on mood and genre
function getFilmReferences(mood: string, genre: string): Array<{
  title: string;
  director: string;
  cinematographer: string;
  relevance: string;
}> {
  const refs: Array<{ title: string; director: string; cinematographer: string; relevance: string }> = [];
  
  // Noir/Dramatic references
  if (mood.toLowerCase().includes('noir') || mood.toLowerCase().includes('tension')) {
    refs.push({
      title: 'Blade Runner 2049',
      director: 'Denis Villeneuve',
      cinematographer: 'Roger Deakins',
      relevance: 'High-contrast lighting, orange/teal color grading, atmospheric depth',
    });
  }
  
  // Warm/Romantic references
  if (mood.toLowerCase().includes('warm') || mood.toLowerCase().includes('romantic') || mood.toLowerCase().includes('nostalgia')) {
    refs.push({
      title: 'In the Mood for Love',
      director: 'Wong Kar-wai',
      cinematographer: 'Christopher Doyle',
      relevance: 'Warm color palette, intimate framing, emotional closeups',
    });
  }
  
  // Uplifting/Joyful references
  if (mood.toLowerCase().includes('joy') || mood.toLowerCase().includes('uplifting') || mood.toLowerCase().includes('playful')) {
    refs.push({
      title: 'La La Land',
      director: 'Damien Chazelle',
      cinematographer: 'Linus Sandgren',
      relevance: 'Vibrant colors, dynamic camera movement, optimistic lighting',
    });
  }
  
  // Documentary/Natural references
  if (genre.toLowerCase().includes('documentary') || genre.toLowerCase().includes('natural')) {
    refs.push({
      title: 'Planet Earth II',
      director: 'Various',
      cinematographer: 'Various',
      relevance: 'Natural lighting, patient composition, authentic moments',
    });
  }
  
  // Sci-Fi/Clinical references
  if (mood.toLowerCase().includes('clinical') || genre.toLowerCase().includes('sci-fi')) {
    refs.push({
      title: 'Ex Machina',
      director: 'Alex Garland',
      cinematographer: 'Rob Hardy',
      relevance: 'Cool color temperature, symmetrical framing, sterile aesthetic',
    });
  }
  
  // Add genre-specific references
  if (genre.toLowerCase().includes('commercial')) {
    refs.push({
      title: 'Apple Commercial (Shot on iPhone)',
      director: 'Various',
      cinematographer: 'Various',
      relevance: 'Clean composition, product focus, aspirational lighting',
    });
  }
  
  // Ensure at least 2 references
  if (refs.length < 2) {
    refs.push({
      title: 'The Grand Budapest Hotel',
      director: 'Wes Anderson',
      cinematographer: 'Robert Yeoman',
      relevance: 'Precise symmetry, vibrant color palette, meticulous framing',
    });
  }
  
  return refs.slice(0, 3); // Max 3 film references
}

// Helper: Determine color harmony scheme
function determineColorScheme(colors: DominantColor[]): string {
  if (colors.length < 2) return 'Monochromatic';
  
  // Simple heuristic based on color count and variety
  if (colors.length >= 4) {
    return 'Tetradic (4-color harmony for complexity)';
  } else if (colors.length === 3) {
    return 'Triadic (3-color harmony for balance)';
  } else {
    return 'Complementary (2-color contrast)';
  }
}
