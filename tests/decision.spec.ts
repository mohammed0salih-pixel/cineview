import { describe, it, expect } from '@jest/globals';
import { buildCreativeDecision } from '../lib/decision-engine';

describe('buildCreativeDecision determinism', () => {
  const analysisA = {
    technical: { contrast: 60, saturation: 50, brightness: 55, sharpness: 65, noise: 10 },
    composition: { score: 70 },
    cinematic: { mood: 'Bright', energy: 'High', shotType: 'Close', genre: 'Editorial' },
    color: {
      temperature: 'Neutral',
      dominantColors: [{ hex: '#ffffff', percentage: 100 }],
    },
  };
  const contextA = {
    projectType: 'advertising',
    platform: 'social',
    objective: 'brand_awareness',
  };

  it('returns identical outputs for identical inputs', () => {
    const a = buildCreativeDecision(analysisA as any, contextA as any);
    const b = buildCreativeDecision(analysisA as any, contextA as any);
    expect(a).toEqual(b);
    expect(a.engine_version).toBe('decision-v1');
  });

  it('varies for different inputs', () => {
    const analysisB = {
      ...analysisA,
      technical: { ...analysisA.technical, brightness: 20 },
    };
    const a = buildCreativeDecision(analysisA as any, contextA as any);
    const c = buildCreativeDecision(analysisB as any, contextA as any);
    expect(a).not.toEqual(c);
  });
});
