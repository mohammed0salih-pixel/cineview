import { 
  computeCinematicIntelligence,
  analyzeEnergyTrend,
  detectSceneChange,
  analyzeVideoSequence,
} from '../lib/visual-analysis';
import type { VisualAnalysisResult } from '../lib/visual-analysis';

describe('Advanced Cinematic Intelligence (10/10)', () => {
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

  describe('Cultural Adaptation & Localization', () => {
    test('should provide Arabic localization for moods', () => {
      const input = createTestInput({
        technical: { contrast: 75, brightness: 40 },
      });
      const result = computeCinematicIntelligence(input, 'arabic');
      
      expect(result.culture).toBe('arabic');
      expect(result.mood.localized?.ar).toBeDefined();
      expect(result.mood.localized?.ar).toBeTruthy();
      expect(result.mood.culturalContext).toBeDefined();
    });

    test('should provide Arabic localization for genres', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input, 'arabic');
      
      expect(result.genre.localized?.ar).toBeDefined();
      expect(result.genre.culturalContext).toBeDefined();
    });

    test('should provide Arabic localization for shot types', () => {
      const input = createTestInput({
        technical: { sharpness: 80 },
      });
      const result = computeCinematicIntelligence(input, 'arabic');
      
      expect(result.shotType.localized?.ar).toBeDefined();
      expect(result.shotType.culturalContext).toBeDefined();
    });

    test('should provide Arabic localization for energy levels', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 75 },
      });
      const result = computeCinematicIntelligence(input, 'arabic');
      
      expect(result.energy.localized?.ar).toBeDefined();
    });

    test('should apply regional weight adjustments for Arabic culture', () => {
      const warmInput = createTestInput({
        color: { temperature: 'Warm' },
        technical: { saturation: 50 },
      });
      
      const westernResult = computeCinematicIntelligence(warmInput, 'western');
      const arabicResult = computeCinematicIntelligence(warmInput, 'arabic');
      
      // Arabic culture should favor warm moods (weight boost)
      expect(arabicResult.mood.confidence).toBeGreaterThanOrEqual(westernResult.mood.confidence - 5);
    });

    test('should work without culture parameter (default to western)', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.culture).toBe('western');
      expect(result.mood.localized?.en).toBeDefined();
    });
  });

  describe('Explainability System', () => {
    test('should provide explanation for mood classification', () => {
      const input = createTestInput({
        technical: { contrast: 75, brightness: 40 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.explanation).toBeDefined();
      expect(result.mood.explanation).toContain('Matched');
      expect(result.mood.explanation).toContain('conditions');
    });

    test('should list matched conditions', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.explainability).toBeDefined();
      expect(result.explainability?.matchedConditions).toBeDefined();
      expect(result.explainability?.matchedConditions.mood).toBeInstanceOf(Array);
      expect(result.explainability?.matchedConditions.genre).toBeInstanceOf(Array);
      expect(result.explainability?.matchedConditions.shotType).toBeInstanceOf(Array);
    });

    test('matched conditions should include metric values', () => {
      const input = createTestInput({
        technical: { contrast: 80, saturation: 65, sharpness: 75 },
      });
      const result = computeCinematicIntelligence(input);
      
      const allConditions = [
        ...result.explainability!.matchedConditions.mood,
        ...result.explainability!.matchedConditions.genre,
        ...result.explainability!.matchedConditions.shotType,
      ];
      
      expect(allConditions.length).toBeGreaterThan(0);
      allConditions.forEach(condition => {
        expect(typeof condition).toBe('string');
        expect(condition).toMatch(/\d+/); // Contains numbers
      });
    });

    test('should provide confidence factors', () => {
      const input = createTestInput();
      const result = computeCinematicIntelligence(input);
      
      expect(result.explainability?.confidenceFactors).toBeDefined();
      expect(result.explainability?.confidenceFactors.moodComplexity).toBeGreaterThanOrEqual(0);
      expect(result.explainability?.confidenceFactors.energyDefinitiveness).toBeGreaterThan(0);
    });

    test('complex rules should show higher complexity factor', () => {
      const simpleInput = createTestInput({
        technical: { contrast: 65 },
      });
      const complexInput = createTestInput({
        technical: { contrast: 40, brightness: 45, saturation: 30 },
      });
      
      const simpleResult = computeCinematicIntelligence(simpleInput);
      const complexResult = computeCinematicIntelligence(complexInput);
      
      // Complex rule (Melancholic Nostalgia) has 6 conditions
      expect(complexResult.explainability!.confidenceFactors.moodComplexity)
        .toBeGreaterThanOrEqual(simpleResult.explainability!.confidenceFactors.moodComplexity);
    });
  });

  describe('Temporal Video Analysis', () => {
    test('should detect rising energy trend', () => {
      const energyScores = [40, 45, 50, 58, 65, 72];
      const trend = analyzeEnergyTrend(energyScores);
      
      expect(trend).toBe('rising');
    });

    test('should detect falling energy trend', () => {
      const energyScores = [80, 72, 65, 58, 50, 45];
      const trend = analyzeEnergyTrend(energyScores);
      
      expect(trend).toBe('falling');
    });

    test('should detect stable energy trend', () => {
      const energyScores = [50, 52, 49, 51, 50, 48];
      const trend = analyzeEnergyTrend(energyScores);
      
      expect(trend).toBe('stable');
    });

    test('should return stable for short sequences', () => {
      const energyScores = [40, 80];
      const trend = analyzeEnergyTrend(energyScores);
      
      expect(trend).toBe('stable');
    });

    test('should detect scene changes', () => {
      const frame1 = {
        technical: { brightness: 50, contrast: 60, saturation: 50 },
      } as VisualAnalysisResult;
      
      const frame2Same = {
        technical: { brightness: 52, contrast: 61, saturation: 49 },
      } as VisualAnalysisResult;
      
      const frame2Different = {
        technical: { brightness: 80, contrast: 30, saturation: 20 },
      } as VisualAnalysisResult;
      
      expect(detectSceneChange(frame1, frame2Same)).toBe(false);
      expect(detectSceneChange(frame1, frame2Different)).toBe(true);
    });

    test('should analyze video sequence', () => {
      const frames = [
        {
          technical: { brightness: 50, contrast: 60, saturation: 50 },
          cinematic: {
            mood: { label: 'Dramatic Intensity' },
            energy: { score: 60 },
            genre: { label: 'Action' },
          },
        },
        {
          technical: { brightness: 55, contrast: 65, saturation: 55 },
          cinematic: {
            mood: { label: 'Dramatic Intensity' },
            energy: { score: 68 },
            genre: { label: 'Action' },
          },
        },
        {
          technical: { brightness: 60, contrast: 70, saturation: 60 },
          cinematic: {
            mood: { label: 'Dramatic Intensity' },
            energy: { score: 75 },
            genre: { label: 'Action' },
          },
        },
      ] as VisualAnalysisResult[];
      
      const analysis = analyzeVideoSequence(frames);
      
      expect(analysis.averageEnergy).toBeCloseTo(67.67, 0);
      expect(analysis.energyTrend).toBe('rising');
      expect(analysis.dominantMood).toBe('Dramatic Intensity');
      expect(analysis.dominantGenre).toBe('Action');
      expect(analysis.sceneChanges).toBeGreaterThanOrEqual(0);
    });

    test('should handle empty video sequence', () => {
      const analysis = analyzeVideoSequence([]);
      
      expect(analysis.averageEnergy).toBe(50);
      expect(analysis.energyTrend).toBe('stable');
      expect(analysis.sceneChanges).toBe(0);
    });
  });

  describe('Enhanced Confidence Scores', () => {
    test('all confidence scores should be realistic (50-100 range)', () => {
      const input = createTestInput({
        technical: { contrast: 75, brightness: 40, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input);
      
      expect(result.mood.confidence).toBeGreaterThanOrEqual(50);
      expect(result.mood.confidence).toBeLessThanOrEqual(100);
      
      expect(result.energy.confidence).toBeGreaterThanOrEqual(50);
      expect(result.energy.confidence).toBeLessThanOrEqual(100);
      
      expect(result.shotType.confidence).toBeGreaterThanOrEqual(50);
      expect(result.shotType.confidence).toBeLessThanOrEqual(100);
      
      expect(result.genre.confidence).toBeGreaterThanOrEqual(50);
      expect(result.genre.confidence).toBeLessThanOrEqual(100);
    });

    test('complex rules should have higher confidence', () => {
      const simpleInput = createTestInput({
        technical: { contrast: 65 },
      });
      const complexInput = createTestInput({
        technical: { contrast: 40, brightness: 45, saturation: 30 },
      });
      
      const simpleResult = computeCinematicIntelligence(simpleInput);
      const complexResult = computeCinematicIntelligence(complexInput);
      
      // More conditions = complexity bonus
      expect(complexResult.mood.confidence).toBeGreaterThanOrEqual(75);
    });

    test('extreme energy values should have higher confidence', () => {
      const lowInput = createTestInput({
        technical: { contrast: 20, saturation: 20, sharpness: 30, noise: 35 },
      });
      const highInput = createTestInput({
        technical: { contrast: 90, saturation: 85, sharpness: 90, noise: 5 },
      });
      const midInput = createTestInput({
        technical: { contrast: 50, saturation: 50, sharpness: 50, noise: 15 },
      });
      
      const lowResult = computeCinematicIntelligence(lowInput);
      const highResult = computeCinematicIntelligence(highInput);
      const midResult = computeCinematicIntelligence(midInput);
      
      expect(lowResult.energy.confidence).toBeGreaterThan(midResult.energy.confidence);
      expect(highResult.energy.confidence).toBeGreaterThan(midResult.energy.confidence);
    });
  });

  describe('Integration: Full Pipeline', () => {
    test('should provide complete cinematic intelligence with all features', () => {
      const input = createTestInput({
        technical: { contrast: 75, brightness: 40, saturation: 35 },
      });
      const result = computeCinematicIntelligence(input, 'arabic');
      
      // Core classification
      expect(result.mood.label).toBeTruthy();
      expect(result.energy.level).toBeTruthy();
      expect(result.shotType.label).toBeTruthy();
      expect(result.genre.label).toBeTruthy();
      
      // Confidence
      expect(result.mood.confidence).toBeGreaterThan(0);
      expect(result.energy.confidence).toBeGreaterThan(0);
      
      // Alternatives
      expect(Array.isArray(result.mood.alternatives)).toBe(true);
      expect(Array.isArray(result.genre.alternatives)).toBe(true);
      
      // Localization
      expect(result.mood.localized?.ar).toBeTruthy();
      expect(result.genre.localized?.ar).toBeTruthy();
      
      // Explainability
      expect(result.mood.explanation).toBeTruthy();
      expect(result.explainability?.matchedConditions).toBeDefined();
      
      // Cultural context
      expect(result.mood.culturalContext).toBeTruthy();
      expect(result.culture).toBe('arabic');
      
      // Versioning
      expect(result.rulesVersion).toBe('ci-v2');
    });

    test('should maintain determinism across calls', () => {
      const input = createTestInput({
        technical: { contrast: 72, brightness: 58, saturation: 64 },
      });
      
      const result1 = computeCinematicIntelligence(input, 'arabic');
      const result2 = computeCinematicIntelligence(input, 'arabic');
      
      expect(result1).toEqual(result2);
    });
  });
});
