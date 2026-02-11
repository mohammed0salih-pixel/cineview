import { describe, expect, it } from '@jest/globals';
import { buildCreativeDecision } from '../../lib/decision-engine';

describe('Decision Engine – Determinism & Reliability', () => {
  it('returns deterministic output for same input', () => {
    const input = { lighting: 'soft', contrast: 0.4 } as any;
    const a = buildCreativeDecision(input);
    const b = buildCreativeDecision(input);
    expect(a).toEqual(b);
  });

  it('handles missing optional data safely', () => {
    const input = { lighting: 'soft' } as any;
    expect(() => buildCreativeDecision(input)).not.toThrow();
  });

  it('fails gracefully on invalid input', () => {
    const input = null as any;
    expect(() => buildCreativeDecision(input)).toThrow();
  });
});
