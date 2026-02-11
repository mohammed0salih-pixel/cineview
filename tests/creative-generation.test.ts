import { generateStoryboard, generateMoodboard } from '../lib/creative-generation';

type TestAnalysis = Parameters<typeof generateStoryboard>[0];

const createCinematicAnalysis = (overrides: Partial<TestAnalysis> = {}): TestAnalysis => ({
  cinematic: {
    mood: {
      label: 'Noir Tension',
      confidence: 86,
      explanation: 'High contrast, low brightness, desaturated tones',
      culturalContext: 'إضاءة عالية التباين وظلال قوية',
    },
    energy: {
      level: 'High',
      score: 78,
      confidence: 82,
    },
    shotType: {
      label: 'Close-up Detail',
      confidence: 80,
    },
    genre: {
      label: 'Film Noir',
      confidence: 84,
    },
    rulesVersion: 'ci-v2',
    culture: 'ar',
  },
  technical: {
    contrast: 75,
    brightness: 40,
    saturation: 35,
    sharpness: 70,
    noise: 12,
  },
  composition: {
    score: 72,
    ruleOfThirds: true,
    symmetry: true,
    leadingLines: true,
    depthLayers: 3,
  },
  color: {
    temperature: 'Warm',
    temperatureKelvin: 3200,
    dominantColors: [
      { name: 'Gold', hex: '#d4af37', percentage: 28 },
      { name: 'Sienna', hex: '#8b7355', percentage: 22 },
      { name: 'Ivory', hex: '#f4e4c1', percentage: 18 },
      { name: 'Charcoal', hex: '#2c2c2c', percentage: 17 },
      { name: 'White', hex: '#ffffff', percentage: 15 },
    ],
  },
  lighting: {
    direction: 'Left',
    intensity: 70,
    quality: 'Hard',
    source: 'Practical',
  },
  ...overrides,
});

describe('Creative generation (storyboard + moodboard)', () => {
  test('returns empty storyboard when cinematic is missing', () => {
    const result = generateStoryboard({});

    expect(result.frames).toHaveLength(0);
    expect(result.metadata.totalFrames).toBe(0);
    expect(result.description).toBe('Cinematic analysis not available');
  });

  test('generates 24 production-grade storyboard frames', () => {
    const analysis = createCinematicAnalysis();
    const result = generateStoryboard(analysis, '/preview.jpg');

    expect(result.frames).toHaveLength(24);
    expect(result.metadata.totalFrames).toBe(24);
    expect(result.frames[0].image).toBe('/preview.jpg');
    expect(result.frames[0].shotType).toBe('Wide Establishing Shot');
    expect(result.frames[0].cameraSetup).toBeDefined();
    expect(result.frames[0].lighting).toBeDefined();
    expect(result.frames[0].composition).toBeDefined();
    expect(result.frames[0].talent).toBeDefined();
    expect(result.frames[23].transitionOut).toBeDefined();
  });

  test('generates categorized moodboard with film references and metadata', () => {
    const analysis = createCinematicAnalysis();
    const result = generateMoodboard(analysis, '/preview.jpg');

    expect(result.items.length).toBeGreaterThanOrEqual(15);
    expect(result.metadata.totalItems).toBe(result.items.length);
    expect(result.items[0]).toMatchObject({
      type: 'image',
      src: '/preview.jpg',
    });
    expect(result.metadata.colorScheme).toContain('Tetradic');
    expect(
      result.items.some(item => item.type === 'image' && item.label.includes('Blade Runner 2049')),
    ).toBe(true);
  });

  test('returns empty moodboard when cinematic is missing', () => {
    const result = generateMoodboard({});

    expect(result.items).toHaveLength(0);
    expect(result.metadata.totalItems).toBe(0);
    expect(result.description).toBe('Cinematic analysis not available');
  });
});
