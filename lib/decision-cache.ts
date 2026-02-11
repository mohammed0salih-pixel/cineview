type DecisionCacheValue = {
  decision: unknown;
  engine_version?: string;
  created_at: string;
};

// Simple in-memory cache for decisions. For production use a persistent
// store (Redis) with TTL and eviction policy.
const cache = new Map<string, DecisionCacheValue>();

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
}

export function makeCacheKey(payload: {
  analysis: unknown;
  context?: unknown;
  pipeline?: string;
}) {
  return stableStringify({
    analysis: payload.analysis,
    context: payload.context ?? {},
    pipeline: payload.pipeline ?? '',
  });
}

export function getCachedDecision(key: string) {
  const v = cache.get(key);
  if (!v) return null;
  return v.decision;
}

export function setCachedDecision(
  key: string,
  decision: unknown,
  engine_version?: string,
) {
  try {
    cache.set(key, { decision, engine_version, created_at: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

const decisionCache = { getCachedDecision, setCachedDecision, makeCacheKey };

export default decisionCache;
