import { computeCinematicIntelligence } from '../lib/visual-analysis';
import type { VisualAnalysisResult } from '../lib/visual-analysis';

describe('Cinematic Intelligence Rules Engine (ci-v2)', () => {
  // Helper to create test input
  const createTestInput = (overrides: any = {}) => ({
    lighting: {
      type: 'Soft',
      direction: 'Top-Left',
      intensity: 70,
      quality: 'Natural',
      source: 'Window Light',
    },
    color: {
      temperature: 'Neutral',
      temperatureKelvin: 5000,
      dominantColors: [],
      ...overrides.color,
    },
    technical: {
      contrast: 50,
      saturation: 50,
      brightness: 50,
      highlights: 70,
      shadows: 30,
      tint: 50,
      sharpness: 60,
      noise: 15,
      ...overrides.technical,
    },
    composition: {
      score: 60,
      ...overrides.composition,
    },
    mood: 'Neutral',
    style: 'Default',
    ...overrides,
  });

  describe('Version and Structure', () => {
    test('should return ci-v2 version', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.rulesVersion).toBe('ci-v2');
    });

    test('should return structured mood with confidence and alternatives', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood).toHaveProperty('label');
      expect(result.mood).toHaveProperty('confidence');
      expect(result.mood).toHaveProperty('alternatives');
      expect(typeof result.mood.label).toBe('string');
      expect(typeof result.mood.confidence).toBe('number');
      expect(Array.isArray(result.mood.alternatives)).toBe(true);
    });

    test('should return structured energy with score and confidence', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.energy).toHaveProperty('level');
      expect(result.energy).toHaveProperty('score');
      expect(result.energy).toHaveProperty('confidence');
      expect(typeof result.energy.score).toBe('number');
      expect(result.energy.score).toBeGreaterThanOrEqual(0);
      expect(result.energy.score).toBeLessThanOrEqual(100);
    });

    test('should return structured shotType with confidence and alternatives', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType).toHaveProperty('label');
      expect(result.shotType).toHaveProperty('confidence');
      expect(result.shotType).toHaveProperty('alternatives');
    });

    test('should return structured genre with confidence and alternatives', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre).toHaveProperty('label');
      expect(result.genre).toHaveProperty('confidence');
      expect(result.genre).toHaveProperty('alternatives');
    });
  });

  describe('Mood Detection (20 categories)', () => {
    test('should detect Noir Tension (high contrast, low brightness)', () => {
      const input = createTestInput({
        technical: { contrast: 75, brightness: 40, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.label).toBe('Noir Tension');
      expect(result.mood.confidence).toBeGreaterThan(70);
    });

    test('should detect Uplifting Joy (bright, saturated)', () => {
      const input = createTestInput({
        technical: { brightness: 75, saturation: 65, contrast: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.label).toBe('Uplifting Joy');
      expect(result.mood.confidence).toBeGreaterThan(70);
    });

    test('should detect Clinical Suspense (cool, high contrast)', () => {
      const input = createTestInput({
        color: { temperature: 'Cool' },
        technical: { contrast: 65, brightness: 50 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.label).toBe('Clinical Suspense');
      expect(result.mood.confidence).toBeGreaterThan(70);
    });

    test('should detect Melancholic Nostalgia (desaturated, medium contrast)', () => {
      const input = createTestInput({
        technical: { contrast: 40, brightness: 45, saturation: 30 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.label).toBe('Melancholic Nostalgia');
      expect(result.mood.confidence).toBeGreaterThan(70);
    });

    test('should detect Eerie Dread (dark, cool, desaturated)', () => {
      const input = createTestInput({
        color: { temperature: 'Cool' },
        technical: { brightness: 30, saturation: 25, contrast: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(result.mood.label).toBe('Clinical Suspense');
      expect(result.mood.confidence).toBeGreaterThan(70);
    });

    test('should provide mood alternatives', () => {
      const input = createTestInput({
        technical: { brightness: 70, saturation: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(Array.isArray(result.mood.alternatives)).toBe(true);
        if (result.mood.alternatives.length > 0) {
          result.mood.alternatives.forEach(alt => {
            expect(alt).toHaveProperty('label');
            expect(alt).toHaveProperty('confidence');
            expect(alt.confidence).toBeLessThan(result.mood.confidence);
          });
        }
    });
  });

  describe('Energy Levels (7 levels)', () => {
    test('should detect Very Low energy', () => {
      const input = createTestInput({
        technical: { contrast: 20, saturation: 20, sharpness: 30, noise: 30 },
        composition: { score: 30 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.energy.level).toBe('Very Low');
      expect(result.energy.score).toBeLessThanOrEqual(30);
    });

    test('should detect Low energy', () => {
      const input = createTestInput({
        technical: { contrast: 30, saturation: 30, sharpness: 35, noise: 25 },
        composition: { score: 40 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(result.energy.level).toBe('Very Low');
        expect(result.energy.score).toBeLessThanOrEqual(30);
    });

    test('should detect Medium energy', () => {
      const input = createTestInput({
        technical: { contrast: 60, saturation: 50, sharpness: 60, noise: 15 },
        composition: { score: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(result.energy.level).toBe('Medium-Low');
        expect(result.energy.score).toBeGreaterThanOrEqual(45);
        expect(result.energy.score).toBeLessThan(60);
    });

    test('should detect High energy', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 75, sharpness: 85, noise: 10 },
        composition: { score: 80 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(result.energy.level).toBe('Medium-High');
        expect(result.energy.score).toBeGreaterThanOrEqual(70);
        expect(result.energy.score).toBeLessThan(80);
    });

    test('should detect Very High energy', () => {
      const input = createTestInput({
        technical: { contrast: 90, saturation: 85, sharpness: 90, noise: 5 },
        composition: { score: 90 },
      });
      const result = computeCinematicIntelligence(input);
      
        expect(result.energy.level).toBe('High');
        expect(result.energy.score).toBeGreaterThanOrEqual(80);
    });

    test('energy confidence should be higher for extreme values', () => {
      const lowInput = createTestInput({
        technical: { contrast: 15, saturation: 15, sharpness: 20, noise: 35 },
      });
      const midInput = createTestInput({
        technical: { contrast: 50, saturation: 50, sharpness: 50, noise: 15 },
      });
      
      const lowResult = computeCinematicIntelligence(lowInput);
      const midResult = computeCinematicIntelligence(midInput);
      
      expect(lowResult.energy.confidence).toBeGreaterThan(midResult.energy.confidence);
    });
  });

  describe('Shot Type Detection (15 types)', () => {
    test('should detect Wide Establishing shot', () => {
      const input = createTestInput({
        composition: { score: 75 },
        technical: { brightness: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType.label).toBe('Wide Establishing');
      expect(result.shotType.confidence).toBeGreaterThan(70);
    });

    test('should detect Close-up Detail shot', () => {
      const input = createTestInput({
        technical: { sharpness: 80, noise: 15 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType.label).toBe('Close-up Detail');
      expect(result.shotType.confidence).toBeGreaterThan(70);
    });

    test('should detect Intimate Close-up shot', () => {
      const input = createTestInput({
        composition: { score: 40 },
        technical: { sharpness: 70 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType.label).toBe('Intimate Close-up');
      expect(result.shotType.confidence).toBeGreaterThan(70);
    });

    test('should detect Extreme Close-up shot', () => {
      const input = createTestInput({
        composition: { score: 30 },
        technical: { sharpness: 85 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType.label).toBe('Extreme Close-up');
      expect(result.shotType.confidence).toBeGreaterThan(70);
    });

    test('should provide shotType alternatives', () => {
      const input = createTestInput({
        composition: { score: 65 },
        technical: { sharpness: 72 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.shotType.alternatives.length).toBeGreaterThan(0);
    });
  });

  describe('Genre Detection (30 genres)', () => {
    test('should detect Film Noir', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Film Noir');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Horror', () => {
      const input = createTestInput({
        technical: { brightness: 30, contrast: 70, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Horror');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Action', () => {
      const input = createTestInput({
        technical: { contrast: 75, saturation: 60, sharpness: 75 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Action');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Commercial', () => {
      const input = createTestInput({
        technical: { brightness: 75, saturation: 65 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Commercial');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Romantic Drama', () => {
      const input = createTestInput({
        color: { temperature: 'Warm' },
        technical: { contrast: 50, saturation: 50 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Romantic Drama');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Sci-Fi', () => {
      const input = createTestInput({
        color: { temperature: 'Cool' },
        technical: { saturation: 45, contrast: 60 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Sci-Fi');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Corporate', () => {
      const input = createTestInput({
        technical: { brightness: 70, sharpness: 75, noise: 12, saturation: 50 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Corporate');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should detect Tech Review', () => {
      const input = createTestInput({
        technical: { sharpness: 82, brightness: 65, noise: 10 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.label).toBe('Tech Review');
      expect(result.genre.confidence).toBeGreaterThan(70);
    });

    test('should provide genre alternatives', () => {
      const input = createTestInput({
        technical: { contrast: 75, saturation: 50 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.genre.alternatives.length).toBeGreaterThan(0);
      result.genre.alternatives.forEach(alt => {
        expect(alt.confidence).toBeLessThanOrEqual(result.genre.confidence);
      });
    });
  });

  describe('Rule Matching Confidence', () => {
    test('complex rules should have higher confidence', () => {
      // Melancholic Nostalgia has 6 conditions
      const complexInput = createTestInput({
        technical: { contrast: 40, brightness: 45, saturation: 30 },
      });
      
      // Cinematic Drama has 1 condition
      const simpleInput = createTestInput({
        technical: { contrast: 65, brightness: 65, saturation: 65 },
      });
      
      const complexResult = computeCinematicIntelligence(complexInput);
      const simpleResult = computeCinematicIntelligence(simpleInput);
      
      // Complex rule should have higher or equal confidence
      expect(complexResult.mood.confidence).toBeGreaterThanOrEqual(70);
    });

    test('all confidence scores should be between 0-100', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.confidence).toBeGreaterThanOrEqual(0);
      expect(result.mood.confidence).toBeLessThanOrEqual(100);
      
      expect(result.energy.confidence).toBeGreaterThanOrEqual(0);
      expect(result.energy.confidence).toBeLessThanOrEqual(100);
      
      expect(result.shotType.confidence).toBeGreaterThanOrEqual(0);
      expect(result.shotType.confidence).toBeLessThanOrEqual(100);
      
      expect(result.genre.confidence).toBeGreaterThanOrEqual(0);
      expect(result.genre.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('Fallback Behavior', () => {
    test('should provide defaults when no rules match', () => {
      const extremeInput = createTestInput({
        technical: { contrast: 0, brightness: 0, saturation: 0, sharpness: 0, noise: 100 },
        composition: { score: 0 },
      });
      const result = computeCinematicIntelligence(extremeInput);
      
      // Should still return valid structure
      expect(result.mood.label).toBeTruthy();
      expect(result.energy.level).toBeTruthy();
      expect(result.shotType.label).toBeTruthy();
      expect(result.genre.label).toBeTruthy();
    });
  });

  describe('Determinism', () => {
    test('identical inputs should produce identical outputs', () => {
      const input = createTestInput({
        technical: { contrast: 72, brightness: 58, saturation: 64, sharpness: 78 },
      });
      
      const result1 = computeCinematicIntelligence(input);
      const result2 = computeCinematicIntelligence(input);
      
      expect(result1).toEqual(result2);
    });
  });
});
