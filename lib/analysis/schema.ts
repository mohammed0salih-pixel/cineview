// Canonical analysis schema and utilities

export type VisualAnalysis = {
  score: number;
  details: string;
  // Add more fields as needed
};

export type CinematicAnalysis = {
  genre: string;
  mood: string;
  // Add more fields as needed
};

export type AnalysisResult = {
  id: string;
  projectId?: string;
  assetId?: string;
  createdAt: string;
  userId: string;
  visual: VisualAnalysis;
  cinematic: CinematicAnalysis;
  // Add more fields as needed
};

export function canonicalizeAnalysisResult(raw: any): AnalysisResult {
  // Transform raw result into canonical AnalysisResult
  if (!raw) throw new Error('No input provided');
  return {
    id: raw.id || '',
    projectId: raw.projectId,
    assetId: raw.assetId,
    createdAt: raw.createdAt || new Date().toISOString(),
    userId: raw.userId || '',
    visual: raw.visual || { score: 0, details: '' },
    cinematic: raw.cinematic || { genre: '', mood: '' },
    // Add more fields as needed
  };
}

export function validateAnalysisResult(result: any): void {
  if (!result || typeof result !== 'object') throw new Error('Result must be an object');
  if (!result.id) throw new Error('Missing id');
  if (!result.userId) throw new Error('Missing userId');
  if (!result.createdAt) throw new Error('Missing createdAt');
  if (!result.visual) throw new Error('Missing visual analysis');
  if (!result.cinematic) throw new Error('Missing cinematic analysis');
  // Add more validation as needed
}
