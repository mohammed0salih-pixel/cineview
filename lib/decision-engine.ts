type AnalysisSnapshot = {
  mood?: string;
  cinematic?: {
    mood?: string;
    energy?: string;
    shotType?: string;
    genre?: string;
  };
  technical?: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    sharpness?: number;
    noise?: number;
  };
  composition?: {
    score?: number;
  };
  color?: {
    temperature?: string;
    dominantColors?: Array<{ hex?: string; percentage?: number }>;
  };
};

export type DecisionContext = {
  projectType?: string;
  platform?: string;
  objective?: string | null;
  media?: {
    name?: string;
    type?: string;
    mimeType?: string;
    sizeBytes?: number | null;
  };
};

export type DecisionOutput = {
  decision_summary: string;
  risk_flags: string[];
  recommended_actions: string[];
  confidence: number;
  intent_alignment: number;
  composition_score: number;
  color_score: number;
  engine_version: string;
  version?: string;
  inputs: {
    project_type: string;
    platform: string;
    objective: string | null;
    mood: string;
    energy: string;
    shot_type: string;
    genre: string;
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
    noise: number;
    composition: number;
    temperature: string;
  };
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const clamp100 = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const safeNumber = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const safeString = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim().length ? value : fallback;

const normalizeEnergy = (value: number) =>
  value >= 70 ? 'High' : value >= 45 ? 'Medium' : 'Low';

const scoreBand = (value: number, low: number, high: number) => {
  if (value <= low) return 0;
  if (value >= high) return 1;
  return (value - low) / (high - low);
};

const mapRiskToAction: Record<string, string> = {
  'Overexposure risk': 'Reduce exposure or add ND filter to preserve highlights.',
  'Underexposure risk': 'Increase key light or raise exposure to recover shadow detail.',
  'High noise risk': 'Use lower ISO or add light to reduce sensor noise.',
  'Soft focus risk': 'Increase shutter speed or adjust focus for sharper edges.',
  'High contrast risk': 'Add fill light or reduce contrast in grade to protect detail.',
  'Over-saturation risk': 'Dial back saturation for a more cinematic palette.',
  'Weak framing risk': 'Reframe subject using rule of thirds or tighter crop.',
  'Inconsistent temperature': 'Normalize white balance across shots.',
  'Platform thumb-stop risk':
    'Increase subject separation and clarity for small-screen impact.',
};

function buildIntentAlignment(
  projectType: string,
  platform: string,
  metrics: {
    contrast: number;
    saturation: number;
    brightness: number;
    sharpness: number;
    noise: number;
    composition: number;
  },
) {
  const goals: Array<[number, number]> = [];

  if (projectType === 'advertising') {
    goals.push([metrics.contrast, 60]);
    goals.push([metrics.saturation, 55]);
    goals.push([metrics.brightness, 55]);
  } else if (projectType === 'real-estate') {
    goals.push([metrics.brightness, 60]);
    goals.push([metrics.sharpness, 65]);
    goals.push([metrics.contrast, 50]);
  } else if (projectType === 'fashion') {
    goals.push([metrics.contrast, 55]);
    goals.push([metrics.sharpness, 65]);
    goals.push([metrics.saturation, 45]);
  } else if (projectType === 'cinema') {
    goals.push([metrics.contrast, 50]);
    goals.push([100 - metrics.noise, 70]);
    goals.push([metrics.composition, 60]);
  } else if (projectType === 'product') {
    goals.push([metrics.sharpness, 70]);
    goals.push([metrics.brightness, 60]);
    goals.push([metrics.contrast, 55]);
  } else if (projectType === 'portrait') {
    goals.push([metrics.sharpness, 60]);
    goals.push([metrics.contrast, 50]);
    goals.push([metrics.saturation, 40]);
  } else {
    goals.push([metrics.composition, 55]);
    goals.push([metrics.contrast, 50]);
  }

  if (platform === 'social') {
    goals.push([metrics.contrast, 55]);
    goals.push([metrics.sharpness, 60]);
  } else if (platform === 'print') {
    goals.push([metrics.brightness, 55]);
    goals.push([100 - metrics.noise, 70]);
  }

  if (!goals.length) return 0.6;
  const score =
    goals.reduce((acc, [value, target]) => acc + clamp(value / target, 0, 1), 0) /
    goals.length;
  return clamp(score, 0, 1);
}

export function buildCreativeDecision(
  analysis: AnalysisSnapshot,
  context: DecisionContext = {},
): DecisionOutput {
  const contrast = clamp100(safeNumber(analysis.technical?.contrast, 55));
  const saturation = clamp100(safeNumber(analysis.technical?.saturation, 50));
  const brightness = clamp100(safeNumber(analysis.technical?.brightness, 55));
  const sharpness = clamp100(safeNumber(analysis.technical?.sharpness, 60));
  const noise = clamp100(safeNumber(analysis.technical?.noise, 15));
  const composition = clamp100(safeNumber(analysis.composition?.score, 60));

  const temperature = safeString(analysis.color?.temperature, 'Neutral');
  const mood = safeString(
    analysis.cinematic?.mood,
    safeString(analysis.mood, 'Cinematic'),
  );
  const energy = safeString(
    analysis.cinematic?.energy,
    normalizeEnergy(
      contrast * 0.3 +
        saturation * 0.25 +
        sharpness * 0.25 +
        composition * 0.2 -
        noise * 0.15,
    ),
  );
  const shotType = safeString(analysis.cinematic?.shotType, 'Medium');
  const genre = safeString(analysis.cinematic?.genre, 'Editorial');

  const exposureBalance = 1 - Math.abs(brightness - 55) / 55;
  const contrastBalance = 1 - Math.abs(contrast - 60) / 60;
  const technicalScore = clamp(
    exposureBalance * 0.25 +
      contrastBalance * 0.25 +
      scoreBand(sharpness, 45, 80) * 0.25 +
      (1 - noise / 100) * 0.25,
  );

  const dominant = analysis.color?.dominantColors ?? [];
  const totalColorWeight = dominant.reduce((sum, c) => sum + (c.percentage ?? 0), 0) || 1;
  const colorDiversity = dominant.length ? dominant.length / 5 : 0.4;
  const colorScore = clamp(
    (scoreBand(saturation, 35, 75) * 0.6 + colorDiversity * 0.4) *
      (totalColorWeight > 0 ? 1 : 0.8),
  );

  const alignment = buildIntentAlignment(
    safeString(context.projectType, 'general'),
    safeString(context.platform, 'general'),
    { contrast, saturation, brightness, sharpness, noise, composition },
  );

  const confidence = clamp(
    technicalScore * 0.4 + (composition / 100) * 0.3 + alignment * 0.3,
    0,
    1,
  );

  const riskFlags: string[] = [];
  if (brightness >= 82) riskFlags.push('Overexposure risk');
  if (brightness <= 22) riskFlags.push('Underexposure risk');
  if (noise >= 38) riskFlags.push('High noise risk');
  if (sharpness <= 40) riskFlags.push('Soft focus risk');
  if (contrast >= 82) riskFlags.push('High contrast risk');
  if (saturation >= 82) riskFlags.push('Over-saturation risk');
  if (composition <= 45) riskFlags.push('Weak framing risk');
  if (temperature === 'Mixed') riskFlags.push('Inconsistent temperature');
  if (
    safeString(context.platform, '') === 'social' &&
    (sharpness < 55 || contrast < 50)
  ) {
    riskFlags.push('Platform thumb-stop risk');
  }

  const recommendedActions = Array.from(
    new Set(riskFlags.map((risk) => mapRiskToAction[risk]).filter(Boolean)),
  );

  const projectLabel = safeString(context.projectType, 'creative project');
  const platformLabel = safeString(context.platform, 'multi-platform');
  const decisionSummary =
    `For ${projectLabel} on ${platformLabel}, prioritize a ${shotType.toLowerCase()} framing ` +
    `with ${mood.toLowerCase()} tone. Energy is ${energy.toLowerCase()} with a ${genre.toLowerCase()} lean.`;

  return {
    decision_summary: decisionSummary,
    risk_flags: riskFlags,
    recommended_actions: recommendedActions,
    confidence: Number(confidence.toFixed(2)),
    intent_alignment: Number(alignment.toFixed(2)),
    composition_score: Number((composition / 100).toFixed(2)),
    color_score: Number(colorScore.toFixed(2)),
    engine_version: 'decision-v1',
    inputs: {
      project_type: projectLabel,
      platform: platformLabel,
      objective: context.objective ?? null,
      mood,
      energy,
      shot_type: shotType,
      genre,
      brightness,
      contrast,
      saturation,
      sharpness,
      noise,
      composition,
      temperature,
    },
  };
}
