export type PreproductionInput = {
  projectType: string;
  mood: string;
  location: string;
  description?: string;
};

export type PreproductionRecommendations = {
  lighting: {
    primary: string;
    keyLight: string;
    fillLight: string;
    backLight: string;
    ratio: string;
    colorTemp: string;
    modifiers: string[];
  };
  artDirection: {
    style: string;
    colorPalette: string[];
    props: string[];
    composition: string;
    depth: string;
  };
  moodboard: Array<{ title: string; description: string }>;
  technical: {
    camera: string;
    lens: string;
    iso: string;
    aperture: string;
    shutter: string;
  };
};

const paletteByMood: Record<string, string[]> = {
  dramatic: ['#1a1a2e', '#3a0ca3', '#d4a373', '#0b132b'],
  minimal: ['#f8f9fa', '#dee2e6', '#adb5bd', '#495057'],
  luxury: ['#0f172a', '#d4af37', '#1f2937', '#f5f3ef'],
  warm: ['#f59e0b', '#fbbf24', '#f97316', '#7c2d12'],
  cool: ['#0ea5e9', '#38bdf8', '#0f172a', '#64748b'],
  cinematic: ['#111827', '#dc2626', '#f5f5f4', '#1f2937'],
};

const lightingByLocation: Record<
  string,
  { primary: string; key: string; fill: string; back: string }
> = {
  studio: {
    primary: 'Three-point lighting setup',
    key: 'Softbox at 45° camera left',
    fill: 'Large reflector at 30° camera right',
    back: 'Rim light to separate subject',
  },
  outdoor: {
    primary: 'Natural light with bounce',
    key: 'Sunlight with diffusion',
    fill: 'Reflector for shadow lift',
    back: 'Use sun as back light when possible',
  },
  interior: {
    primary: 'Practical + soft key blend',
    key: 'Soft LED panel at 45°',
    fill: 'Bounce off wall or ceiling',
    back: 'Small kicker for depth',
  },
  urban: {
    primary: 'Mixed ambient + motivated key',
    key: 'LED key mimicking signage',
    fill: 'Subtle fill from bounce',
    back: 'Edge light from street sources',
  },
  nature: {
    primary: 'Golden hour soft key',
    key: 'Sunlight through diffusion',
    fill: 'Bounce from reflector',
    back: 'Natural rim from sun',
  },
};

const styleByProject: Record<string, string> = {
  advertising: 'Bold, high-contrast hero imagery',
  'real-estate': 'Bright, clean, and spacious framing',
  fashion: 'Editorial styling with controlled contrast',
  product: 'Clean product focus with precise highlights',
  portrait: 'Soft tonal range with subject isolation',
  cinema: 'Cinematic storytelling with layered depth',
};

const compositionByProject: Record<string, string> = {
  advertising: 'Rule of thirds with clear subject separation',
  'real-estate': 'Wide establishing with strong verticals',
  fashion: 'Central framing with negative space',
  product: 'Symmetrical framing with clean background',
  portrait: 'Eye-line at upper third, shallow depth',
  cinema: 'Layered depth with foreground framing',
};

export function generatePreproductionRecommendations(
  input: PreproductionInput,
): PreproductionRecommendations {
  const palette = paletteByMood[input.mood] || paletteByMood.cinematic;
  const lighting = lightingByLocation[input.location] || lightingByLocation.studio;
  const style = styleByProject[input.projectType] || 'Cinematic storytelling';
  const composition =
    compositionByProject[input.projectType] || 'Balanced framing with negative space';

  const depth =
    input.projectType === 'product' ? 'f/5.6 for detail clarity' : 'f/2.8 for separation';
  const camera =
    input.projectType === 'cinema'
      ? 'Cinema camera or full-frame mirrorless'
      : 'Full-frame mirrorless';
  const lens =
    input.projectType === 'product' ? 'Macro 90mm or 100mm' : '35mm + 85mm primes';

  return {
    lighting: {
      primary: lighting.primary,
      keyLight: lighting.key,
      fillLight: lighting.fill,
      backLight: lighting.back,
      ratio:
        input.mood === 'dramatic' ? '4:1 key to fill ratio' : '2:1 key to fill ratio',
      colorTemp: input.mood === 'cool' ? '4800K for cool tone' : '5600K for neutral tone',
      modifiers:
        input.mood === 'dramatic'
          ? ['Grid', 'Flag', 'Softbox']
          : ['Softbox', 'Diffusion', 'Reflector'],
    },
    artDirection: {
      style,
      colorPalette: palette,
      props:
        input.projectType === 'fashion'
          ? ['Textured fabrics', 'Minimal props']
          : ['Clean surfaces', 'Simple accents'],
      composition,
      depth,
    },
    moodboard: [
      {
        title: 'Primary Mood',
        description: `${input.mood} tone with ${style.toLowerCase()}`,
      },
      { title: 'Color Palette', description: `Key palette: ${palette.join(', ')}` },
      { title: 'Lighting Intent', description: lighting.primary },
      { title: 'Composition', description: composition },
    ],
    technical: {
      camera,
      lens,
      iso: input.location === 'outdoor' ? 'ISO 100-400' : 'ISO 400-800',
      aperture: depth,
      shutter: '1/125s minimum for sharp results',
    },
  };
}
