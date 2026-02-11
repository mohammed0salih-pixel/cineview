export type TokenCostRates = {
  pricePer1kPrompt?: number;
  pricePer1kCompletion?: number;
};

export type TokenCounts = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
};

export function computeTotalTokens(counts: TokenCounts) {
  if (typeof counts.totalTokens === 'number') return counts.totalTokens;
  const prompt = counts.promptTokens ?? 0;
  const completion = counts.completionTokens ?? 0;
  return prompt + completion;
}

export function estimateCostUsd(
  counts: TokenCounts,
  rates: TokenCostRates,
): number | null {
  const promptRate = rates.pricePer1kPrompt;
  const completionRate = rates.pricePer1kCompletion;
  if (typeof promptRate !== 'number' && typeof completionRate !== 'number') {
    return null;
  }
  const promptTokens = counts.promptTokens ?? 0;
  const completionTokens = counts.completionTokens ?? 0;
  const promptCost =
    typeof promptRate === 'number' ? (promptTokens / 1000) * promptRate : 0;
  const completionCost =
    typeof completionRate === 'number' ? (completionTokens / 1000) * completionRate : 0;
  return Number((promptCost + completionCost).toFixed(4));
}
