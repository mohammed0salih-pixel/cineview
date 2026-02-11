'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PDFDownloadLink } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StoryboardPdfDocument } from '@/components/storyboard-pdf';
import { MoodboardPdfDocument } from '@/components/moodboard-pdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabaseBrowser } from '@/lib/supabase-browser';

const mockProject = {
  id: '1',
  name: 'Saudi Tourism Campaign',
  client: 'Ministry of Tourism',
  status: 'in-progress',
  lastUpdated: '2026-02-03',
  owner: 'Ahmed Al-Rashid',
  summary:
    'Hero visual campaign for Visit Saudi featuring heritage sites and modern experiences.',
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const buildPdfFileName = (name: string, suffix: string) =>
  `${name || 'project'}-${suffix}`.replace(/\s+/g, '-');

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

type MoodboardItem = {
  id: number;
  type: 'image' | 'color';
  label?: string;
  src?: string;
  notes?: string;
  color?: string;
  role?: string;
  harmony?: string;
};

const getMoodboardCategory = (item: MoodboardItem) => {
  if (item.type === 'color') return 'colors';
  const label = (item.label || '').toLowerCase();
  if (label.includes('lighting') || label.includes('golden hour') || label.includes('blue hour')) {
    return 'lighting';
  }
  if (
    label.includes('composition') ||
    label.includes('rule of thirds') ||
    label.includes('leading lines') ||
    label.includes('symmetry') ||
    label.includes('depth')
  ) {
    return 'composition';
  }
  if (label.includes('texture') || label.includes('surface')) {
    return 'texture';
  }
  if (label.includes('film ref') || label.includes('film')) {
    return 'film';
  }
  return 'references';
};

type StoryboardFrame = {
  id: number;
  frame: number;
  image: string;
  notes: string;
  shotType: string;
  timing?: string;
  cameraSetup?: {
    lens?: string;
    aperture?: string;
    iso?: string;
    shutterSpeed?: string;
    movement?: string;
    height?: string;
  };
  lighting?: {
    key?: string;
    fill?: string;
    back?: string;
    kelvin?: string;
    ratio?: string;
  };
  composition?: {
    rule?: string;
    leadingLines?: string;
    depth?: string;
    focus?: string;
  };
  talent?: {
    blocking?: string;
    expression?: string;
    wardrobe?: string;
  };
  transitionIn?: string;
  transitionOut?: string;
};

const analysisRuns = [
  {
    id: 'run_001',
    createdAt: '2026-02-03 10:12',
    status: 'complete',
    progress: 100,
    stages: [
      { name: 'Upload', status: 'complete' },
      { name: 'Technical', status: 'complete' },
      { name: 'Cinematic', status: 'complete' },
      { name: 'Storyboard', status: 'complete' },
      { name: 'Insights', status: 'complete' },
    ],
  },
  {
    id: 'run_002',
    createdAt: '2026-02-04 16:40',
    status: 'processing',
    progress: 62,
    stages: [
      { name: 'Upload', status: 'complete' },
      { name: 'Technical', status: 'complete' },
      { name: 'Cinematic', status: 'in-progress' },
      { name: 'Storyboard', status: 'pending' },
      { name: 'Insights', status: 'pending' },
    ],
  },
];

const storyboardFrames: StoryboardFrame[] = [
  {
    id: 1,
    frame: 1,
    image: '/placeholder.svg?height=180&width=320',
    notes: 'Fade in from black. Establish wide context with warm horizon.',
    shotType: 'Wide Establishing Shot',
    timing: '00:00 - 00:08',
    cameraSetup: {
      lens: '24mm wide angle',
      aperture: 'f/5.6 for deep focus',
      iso: 'ISO 400-800',
      shutterSpeed: '1/50 for natural motion',
      movement: 'Static or very slow push-in',
      height: 'Slightly elevated for context',
    },
    lighting: {
      key: 'Soft diffused key from left, 45° angle',
      fill: 'Balanced fill (1:2 ratio)',
      back: 'Subtle rim light for separation',
      kelvin: '5000K neutral daylight',
      ratio: '1:2 balanced commercial',
    },
    composition: {
      rule: 'Rule of thirds - horizon on lower third',
      leadingLines: 'Leading lines guide eye to subject',
      depth: 'Foreground, midground, background layers',
      focus: 'Deep focus environment',
    },
    talent: {
      blocking: 'Subject enters frame right to center',
      expression: 'Calm, observant',
      wardrobe: 'Earth tones, neutral layers',
    },
    transitionOut: 'Match cut on gaze direction',
  },
  {
    id: 2,
    frame: 2,
    image: '/placeholder.svg?height=180&width=320',
    notes: 'Pan left to reveal cityscape. Maintain warm ambient tone.',
    shotType: 'Medium Shot',
    timing: '00:08 - 00:14',
    cameraSetup: {
      lens: '50mm standard',
      aperture: 'f/2.8 for balanced depth',
      iso: 'ISO 400-800',
      shutterSpeed: '1/50 for natural motion',
      movement: 'Slow pan left',
      height: 'Eye level',
    },
    lighting: {
      key: 'Soft diffused key from left, 45° angle',
      fill: 'Balanced fill (1:2 ratio)',
      back: 'Subtle rim light for separation',
      kelvin: '5000K neutral daylight',
      ratio: '1:2 balanced commercial',
    },
    composition: {
      rule: 'Subject at thirds intersection',
      depth: 'Foreground soft blur, subject sharp',
      focus: 'Selective focus',
    },
    talent: {
      blocking: 'Hold position, slight head turn',
      expression: 'Engaged, attentive',
      wardrobe: 'Earth tones, neutral layers',
    },
  },
  {
    id: 3,
    frame: 3,
    image: '/placeholder.svg?height=180&width=320',
    notes: 'Close-up detail shot on texture and material.',
    shotType: 'Close-up Detail',
    timing: '00:26 - 00:31',
    cameraSetup: {
      lens: '85mm portrait',
      aperture: 'f/1.8 for shallow DoF',
      iso: 'ISO 400-800',
      shutterSpeed: '1/50',
      movement: 'Static',
      height: 'Eye level',
    },
    lighting: {
      key: 'Soft key with gentle falloff',
      fill: 'Minimal fill (1:3 ratio)',
      back: 'Subtle rim light',
      kelvin: '4800K warm neutral',
      ratio: '1:3 soft cinematic',
    },
    composition: {
      rule: 'Tight framing, minimal headroom',
      focus: 'Eyes sharp, shallow DoF',
    },
    talent: {
      blocking: 'Minimal movement, micro-expressions',
      expression: 'Reflective',
      wardrobe: 'Muted palette',
    },
  },
  {
    id: 4,
    frame: 4,
    image: '/placeholder.svg?height=180&width=320',
    notes: 'Tracking shot follows subject, build momentum.',
    shotType: 'Tracking Shot',
    timing: '01:22 - 01:26',
    cameraSetup: {
      lens: '35mm wide',
      aperture: 'f/2.8 for depth',
      iso: 'ISO 500',
      shutterSpeed: '1/60',
      movement: 'Tracking with subject',
      height: 'Chest level',
    },
    lighting: {
      key: 'Directional key with movement',
      fill: 'Balanced fill (1:2 ratio)',
      back: 'Backlight for separation',
      kelvin: '5200K neutral',
      ratio: '1:2 balanced commercial',
    },
    composition: {
      rule: 'Subject leading space',
      depth: 'Layered depth with parallax',
      focus: 'Subject sharp, background motion blur',
    },
    talent: {
      blocking: 'Steady forward movement',
      expression: 'Determined',
      wardrobe: 'Clean silhouettes',
    },
    transitionOut: 'Cut on motion to next beat',
  },
];

const moodboardItems: MoodboardItem[] = [
  {
    id: 1,
    type: 'image',
    src: '/placeholder.svg?height=300&width=400',
    label: 'Warm architecture',
    notes: 'Primary reference for heritage texture and warm sandstone palette.',
  },
  {
    id: 2,
    type: 'color',
    color: '#d4af37',
    label: 'Primary Gold',
    role: 'Key lighting anchor and highlight hue',
    harmony: 'Defines warm tonal identity',
  },
  {
    id: 3,
    type: 'image',
    src: '/placeholder.svg?height=250&width=350',
    label: 'Golden Hour Lighting',
    notes: 'Soft directional light, warm temperature, long shadows.',
  },
  {
    id: 4,
    type: 'color',
    color: '#1a1a2e',
    label: 'Deep Navy',
    role: 'Shadow depth and contrast control',
    harmony: 'Adds tonal balance and cinematic weight',
  },
  {
    id: 5,
    type: 'image',
    src: '/placeholder.svg?height=250&width=350',
    label: 'Rule of Thirds Composition',
    notes: 'Subject placement on thirds intersections for balance.',
  },
  {
    id: 6,
    type: 'image',
    src: '/placeholder.svg?height=250&width=350',
    label: 'Texture Reference',
    notes: 'Stone, fabric, brushed metal - tactile authenticity.',
  },
  {
    id: 7,
    type: 'image',
    src: '/placeholder.svg?height=250&width=350',
    label: 'Film Ref: Blade Runner 2049',
    notes: 'Roger Deakins - atmospheric depth, contrast control.',
  },
];

const insightsVersions = [
  {
    version: 'v1.2',
    createdAt: '2026-02-03 10:18',
    decisionSummary:
      'Shift key scene to golden hour; increase negative space for brand lockup.',
    riskFlags: ['Overexposure risk on reflective surfaces', 'Crowd density variability'],
    recommendedActions: ['Add ND filter', 'Schedule b-roll buffer window'],
    raw: {
      confidence: 0.82,
      intentAlignment: 0.76,
      compositionScore: 0.84,
      colorScore: 0.79,
    },
  },
  {
    version: 'v1.3',
    createdAt: '2026-02-04 16:49',
    decisionSummary:
      'Keep golden hour but add dusk alternative; tighten focal length for hero shot.',
    riskFlags: ['Low light noise risk', 'Crowd density variability'],
    recommendedActions: ['Add fast prime lens', 'Schedule b-roll buffer window'],
    raw: {
      confidence: 0.85,
      intentAlignment: 0.81,
      compositionScore: 0.88,
      colorScore: 0.83,
    },
  },
];

const defaultAnalysisSummary = {
  technical: {
    sharpness: 78,
    noise: 12,
    contrast: 68,
  },
  cinematic: {
    mood: 'Cinematic Drama',
    energy: 'Medium',
    shotType: 'Medium',
    genre: 'Travel Documentary',
    narrativePotential: 0.86,
  },
};

const traceability = {
  runId: 'run_002',
  assetId: 'asset_9f12',
  analysisId: 'analysis_7c31',
  insightId: 'insight_43b2',
  exportId: 'export_8a10',
  pipelineVersion: 'analysis-pipeline@1.4.2',
  inputHash: 'sha256:7f5d...a91c',
  cache: {
    key: 'cache:asset_9f12:intent_v3',
    hit: false,
  },
  performance: {
    latencyMs: 1820,
    tokenCostUsd: 0.18,
  },
  kpis: {
    decisionQuality: 0.84,
    riskCoverage: 0.76,
    intentAlignment: 0.81,
  },
};

const auditLogs = [
  {
    id: 1,
    at: '2026-02-04 16:49',
    action: 'analysis.run.completed',
    entity: 'analysis_runs',
    ref: 'run_002',
  },
  {
    id: 2,
    at: '2026-02-04 16:50',
    action: 'insight.version.created',
    entity: 'creative_insights',
    ref: 'v1.3',
  },
  {
    id: 3,
    at: '2026-02-04 16:52',
    action: 'storyboard.generated',
    entity: 'storyboards',
    ref: 'sb_102',
  },
  {
    id: 4,
    at: '2026-02-04 16:53',
    action: 'moodboard.generated',
    entity: 'moodboards',
    ref: 'mb_341',
  },
  {
    id: 5,
    at: '2026-02-04 17:02',
    action: 'export.requested',
    entity: 'exports',
    ref: 'export_8a10',
  },
];

const exportHistory = [
  {
    id: 'export_8a10',
    createdAt: '2026-02-04 17:02',
    exportType: 'project_report',
    format: 'pdf',
    storagePath: 'projects/saudi-tourism/exports/run_002-2026-02-04.pdf',
    version: 3,
    fileName: 'saudi-tourism-project-report-v3.pdf',
    runId: 'run_002',
  },
  {
    id: 'export_7c11',
    createdAt: '2026-02-03 10:20',
    exportType: 'production_handoff',
    format: 'zip',
    storagePath: 'projects/saudi-tourism/exports/local-zip-run_001.zip',
    version: 2,
    fileName: 'saudi-tourism-production-handoff-v2.zip',
    runId: 'run_001',
  },
];

const optimizationPolicies = [
  { id: 1, rule: 'Reuse cached results when input_hash matches', status: 'enabled' },
  { id: 2, rule: 'Regenerate if intent changes or confidence < 0.75', status: 'enabled' },
  { id: 3, rule: 'Skip heavy modules when cache_hit = true', status: 'enabled' },
];

const baseStages = ['Upload', 'Technical', 'Cinematic', 'Storyboard', 'Insights'];

function buildStages(progress: number, complete: boolean) {
  if (complete) {
    return baseStages.map((name) => ({ name, status: 'complete' }));
  }

  const thresholds = [10, 30, 55, 75, 90];
  return baseStages.map((name, index) => {
    if (progress >= thresholds[index]) {
      return { name, status: 'complete' };
    }
    if (index === 0 || progress >= Math.max(0, thresholds[index] - 10)) {
      return { name, status: 'in-progress' };
    }
    return { name, status: 'pending' };
  });
}

function versionDiff(a: (typeof insightsVersions)[0], b: (typeof insightsVersions)[0]) {
  const added = b.recommendedActions.filter((x) => !a.recommendedActions.includes(x));
  const removed = a.recommendedActions.filter((x) => !b.recommendedActions.includes(x));
  const riskAdded = b.riskFlags.filter((x) => !a.riskFlags.includes(x));
  const riskRemoved = a.riskFlags.filter((x) => !b.riskFlags.includes(x));
  return { added, removed, riskAdded, riskRemoved };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectIdParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const projectId = typeof projectIdParam === 'string' ? projectIdParam : null;

  const [project, setProject] = useState(mockProject);
  const [analysisSummary, setAnalysisSummary] = useState(defaultAnalysisSummary);
  const [analysisRaw, setAnalysisRaw] = useState<Record<string, unknown> | null>(null);
  const [decisionOutput, setDecisionOutput] = useState<{
    decision_summary?: string;
    risk_flags?: string[];
    recommended_actions?: string[];
    confidence?: number;
    intent_alignment?: number;
    composition_score?: number;
    color_score?: number;
    engine_version?: string;
    version?: string;
  } | null>(null);
  const [liveInsightsVersions, setLiveInsightsVersions] = useState<
    typeof insightsVersions
  >([]);
  const [liveStatus, setLiveStatus] = useState<'loading' | 'authed' | 'anon' | 'error'>(
    'loading',
  );
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveRuns, setLiveRuns] = useState<typeof analysisRuns>([]);
  const [liveStoryboardFrames, setLiveStoryboardFrames] = useState<StoryboardFrame[]>([]);
  const [liveMoodboardItems, setLiveMoodboardItems] = useState<MoodboardItem[]>([]);
  const [liveTraceability, setLiveTraceability] = useState<typeof traceability | null>(
    null,
  );
  const [liveAuditLogs, setLiveAuditLogs] = useState<typeof auditLogs>([]);
  const [liveExports, setLiveExports] = useState<typeof exportHistory>([]);

  const [leftVersion, setLeftVersion] = useState(insightsVersions[0].version);
  const [rightVersion, setRightVersion] = useState(insightsVersions[1].version);
  const [showOverviewData, setShowOverviewData] = useState(false);
  const [showVisualData, setShowVisualData] = useState(false);
  const [showCinematicData, setShowCinematicData] = useState(false);
  const [showStoryboardData, setShowStoryboardData] = useState(false);
  const [showMoodData, setShowMoodData] = useState(false);
  const [showInsightsData, setShowInsightsData] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportZipLoading, setExportZipLoading] = useState(false);
  const [exportZipError, setExportZipError] = useState<string | null>(null);

  const displayInsightsVersions =
    liveStatus === 'authed' && liveInsightsVersions.length
      ? liveInsightsVersions
      : insightsVersions;

  const left = useMemo(
    () =>
      displayInsightsVersions.find((v) => v.version === leftVersion) ||
      displayInsightsVersions[0],
    [displayInsightsVersions, leftVersion],
  );
  const right = useMemo(
    () =>
      displayInsightsVersions.find((v) => v.version === rightVersion) ||
      displayInsightsVersions[Math.min(1, displayInsightsVersions.length - 1)],
    [displayInsightsVersions, rightVersion],
  );
  const diff = versionDiff(left, right);

  const signalCount = [
    decisionOutput?.confidence,
    decisionOutput?.intent_alignment,
    decisionOutput?.composition_score,
    decisionOutput?.color_score,
    analysisSummary.technical.sharpness,
    analysisSummary.technical.noise,
    analysisSummary.technical.contrast,
    analysisSummary.cinematic.narrativePotential,
  ].filter((value) => typeof value === 'number').length;

  useEffect(() => {
    let active = true;
    if (!projectId) {
      setTimeout(() => {
        if (!active) return;
        setLiveStatus('error');
        setLiveError('Missing project id');
      }, 0);
      return () => {
        active = false;
      };
    }

    supabaseBrowser.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active) return;
        if (!data.session) {
          setLiveStatus('anon');
          return;
        }
        setLiveStatus('authed');
        const user = data.session.user;

        const { data: projectRows, error: projectError } = await supabaseBrowser
          .from('projects')
          .select('id,name,description,status,created_at,updated_at')
          .eq('id', projectId)
          .limit(1);

        if (!active) return;
        if (projectError || !projectRows?.length) {
          setLiveStatus('error');
          setLiveError(projectError?.message || 'Project not found');
          return;
        }

        const row = projectRows[0];
        setProject({
          ...mockProject,
          id: row.id,
          name: row.name || 'Untitled Project',
          summary: row.description || mockProject.summary,
          status: row.status || 'active',
          lastUpdated: row.updated_at || row.created_at || mockProject.lastUpdated,
          owner: user.email || user.id,
          client: 'Self',
        });

        const { data: insightRows } = await supabaseBrowser
          .from('creative_insights')
          .select('insights,created_at')
          .eq('project_id', row.id)
          .order('created_at', { ascending: false })
          .limit(6);

        if (!active) return;
        const latestInsight = insightRows?.[0]?.insights as
          | {
              technical?: {
                sharpness?: number;
                noise?: number;
                contrast?: number;
                brightness?: number;
                saturation?: number;
              };
              composition?: { score?: number };
              mood?: string;
              cinematic?: {
                mood?: string;
                energy?: string;
                shotType?: string;
                genre?: string;
              };
              decision?: {
                decision_summary?: string;
                risk_flags?: string[];
                recommended_actions?: string[];
                confidence?: number;
                intent_alignment?: number;
                composition_score?: number;
                color_score?: number;
                engine_version?: string;
              };
            }
          | undefined;

        if (insightRows?.length) {
          const mappedVersions = insightRows.map((row, idx) => {
            const insight = row.insights as
              | {
                  decision?: {
                    decision_summary?: string;
                    risk_flags?: string[];
                    recommended_actions?: string[];
                    confidence?: number;
                    intent_alignment?: number;
                    composition_score?: number;
                    version?: string;
                  };
                }
              | undefined;
            const decision = insight?.decision;
            const fallbackVersion = `v${insightRows.length - idx}`;
            return {
              version: decision?.version || fallbackVersion,
              createdAt: row.created_at || 'Recently',
              decisionSummary:
                decision?.decision_summary || 'Decision summary unavailable.',
              riskFlags: decision?.risk_flags || [],
              recommendedActions: decision?.recommended_actions || [],
              raw: decision || {},
            };
          });
          setLiveInsightsVersions(mappedVersions as typeof insightsVersions);

          const latest = insightRows[0]?.insights as
            | {
                technical?: {
                  sharpness?: number;
                  noise?: number;
                  contrast?: number;
                  brightness?: number;
                  saturation?: number;
                };
                composition?: { score?: number };
                mood?: string;
                cinematic?: {
                  mood?: string;
                  energy?: string;
                  shotType?: string;
                  genre?: string;
                };
                decision?: {
                  decision_summary?: string;
                  risk_flags?: string[];
                  recommended_actions?: string[];
                  confidence?: number;
                  intent_alignment?: number;
                  composition_score?: number;
                  color_score?: number;
                  version?: string;
                };
              }
            | undefined;

          if (latest) {
            setAnalysisRaw(latest as Record<string, unknown>);
            setDecisionOutput(latest.decision ?? null);
            const technical = latest.technical || {};
            const cinematic = latest.cinematic || {};
            const compositionScore = latest.composition?.score ?? 0;
            const contrast =
              technical.contrast ?? defaultAnalysisSummary.technical.contrast;
            const narrativePotential = clamp01(
              (compositionScore * 0.6 + contrast * 0.4) / 100,
            );

            setAnalysisSummary({
              technical: {
                sharpness:
                  technical.sharpness ?? defaultAnalysisSummary.technical.sharpness,
                noise: technical.noise ?? defaultAnalysisSummary.technical.noise,
                contrast,
              },
              cinematic: {
                mood:
                  cinematic.mood || latest.mood || defaultAnalysisSummary.cinematic.mood,
                energy:
                  (cinematic.energy as string) || defaultAnalysisSummary.cinematic.energy,
                shotType: cinematic.shotType || defaultAnalysisSummary.cinematic.shotType,
                genre: cinematic.genre || defaultAnalysisSummary.cinematic.genre,
                narrativePotential,
              },
            });
          }
        }

        const { data: runRows } = await supabaseBrowser
          .from('analysis_runs')
          .select('id,status,progress,created_at,started_at,completed_at,asset_id')
          .eq('project_id', row.id)
          .order('created_at', { ascending: false })
          .limit(6);

        if (!active) return;
        if (runRows?.length) {
          const mappedRuns = runRows.map((run) => {
            const progress = typeof run.progress === 'number' ? run.progress : 0;
            const complete =
              run.status === 'completed' || run.status === 'complete' || progress >= 100;
            return {
              id: run.id,
              createdAt: run.created_at || run.started_at || 'Recently',
              status: complete ? 'complete' : 'processing',
              progress: complete ? 100 : progress || 45,
              stages: buildStages(complete ? 100 : progress || 45, complete),
              assetId: run.asset_id || null,
            } as (typeof analysisRuns)[number] & { assetId?: string | null };
          });
          setLiveRuns(mappedRuns as typeof analysisRuns);

          const latestRun = mappedRuns[0] as (typeof mappedRuns)[number] | undefined;
          if (latestRun) {
            const { data: traceRows } = await supabaseBrowser
              .from('analysis_traceability')
              .select(
                'analysis_run_id,insight_id,export_id,input_hash,cache_key,cache_hit,latency_ms,token_cost_usd,kpis,metadata',
              )
              .eq('analysis_run_id', latestRun.id)
              .order('created_at', { ascending: false })
              .limit(1);

            if (!active) return;
            const traceRow = traceRows?.[0];
            if (traceRow) {
              const kpis = (traceRow.kpis ?? {}) as Record<string, number>;
              setLiveTraceability({
                runId: traceRow.analysis_run_id || latestRun.id,
                assetId: latestRun.assetId || 'asset',
                analysisId: traceRow.analysis_run_id || latestRun.id,
                insightId: traceRow.insight_id || 'insight',
                exportId: traceRow.export_id || 'export',
                pipelineVersion:
                  ((traceRow.metadata as Record<string, unknown>)
                    ?.pipeline_version as string) || 'ci-v1',
                inputHash: traceRow.input_hash || 'sha256:pending',
                cache: {
                  key: traceRow.cache_key || 'cache:pending',
                  hit: traceRow.cache_hit || false,
                },
                performance: {
                  latencyMs: traceRow.latency_ms || 0,
                  tokenCostUsd: traceRow.token_cost_usd || 0,
                },
                kpis: {
                  decisionQuality: kpis.decisionQuality ?? kpis.decision_quality ?? 0,
                  riskCoverage: kpis.riskCoverage ?? kpis.risk_coverage ?? 0,
                  intentAlignment: kpis.intentAlignment ?? kpis.intent_alignment ?? 0,
                },
              });
            }
          }
        }

        const [storyboardResponse, moodboardResponse, auditResponse, exportResponse] = await Promise.all([
          supabaseBrowser
            .from('storyboards')
            .select('frames,created_at,title,description')
            .eq('project_id', row.id)
            .order('created_at', { ascending: false })
            .limit(1),
          supabaseBrowser
            .from('moodboards')
            .select('items,created_at,title,description')
            .eq('project_id', row.id)
            .order('created_at', { ascending: false })
            .limit(1),
          supabaseBrowser
            .from('audit_logs')
            .select('id,occurred_at,action,entity_type,entity_id')
            .eq('project_id', row.id)
            .order('occurred_at', { ascending: false })
            .limit(10),
          supabaseBrowser
            .from('exports')
            .select('id,export_type,format,created_at,storage_path,metadata,analysis_run_id')
            .eq('project_id', row.id)
            .order('created_at', { ascending: false })
            .limit(8),
        ]);

        if (!active) return;

        const storyboard = storyboardResponse.data?.[0];
        if (storyboard?.frames && Array.isArray(storyboard.frames)) {
          const frames = storyboard.frames as Array<Record<string, unknown>>;
          const toStringValue = (value: unknown) =>
            typeof value === 'string' ? value : undefined;

          const mappedFrames: StoryboardFrame[] = frames.map((frame, idx) => {
            const cameraRaw =
              (frame.cameraSetup as Record<string, unknown>) ||
              (frame.camera_setup as Record<string, unknown>) ||
              undefined;
            const lightingRaw =
              (frame.lighting as Record<string, unknown>) ||
              (frame.light as Record<string, unknown>) ||
              undefined;
            const compositionRaw =
              (frame.composition as Record<string, unknown>) ||
              (frame.composition_notes as Record<string, unknown>) ||
              undefined;
            const talentRaw =
              (frame.talent as Record<string, unknown>) ||
              (frame.talent_direction as Record<string, unknown>) ||
              undefined;

            return {
              id: (frame.id as number) ?? idx + 1,
              frame: (frame.frame as number) ?? idx + 1,
              image:
                (frame.image as string) ||
                (frame.src as string) ||
                '/placeholder.svg?height=180&width=320',
              notes:
                (frame.notes as string) ||
                (frame.label as string) ||
                'Storyboard frame',
              shotType:
                (frame.shotType as string) ||
                (frame.shot_type as string) ||
                'Shot',
              timing: (frame.timing as string) || undefined,
              cameraSetup: cameraRaw
                ? {
                    lens: toStringValue(cameraRaw.lens),
                    aperture: toStringValue(cameraRaw.aperture),
                    iso: toStringValue(cameraRaw.iso),
                    shutterSpeed: toStringValue(cameraRaw.shutterSpeed),
                    movement: toStringValue(cameraRaw.movement),
                    height: toStringValue(cameraRaw.height),
                  }
                : undefined,
              lighting: lightingRaw
                ? {
                    key: toStringValue(lightingRaw.key),
                    fill: toStringValue(lightingRaw.fill),
                    back: toStringValue(lightingRaw.back),
                    kelvin: toStringValue(lightingRaw.kelvin),
                    ratio: toStringValue(lightingRaw.ratio),
                  }
                : undefined,
              composition: compositionRaw
                ? {
                    rule: toStringValue(compositionRaw.rule),
                    leadingLines: toStringValue(compositionRaw.leadingLines),
                    depth: toStringValue(compositionRaw.depth),
                    focus: toStringValue(compositionRaw.focus),
                  }
                : undefined,
              talent: talentRaw
                ? {
                    blocking: toStringValue(talentRaw.blocking),
                    expression: toStringValue(talentRaw.expression),
                    wardrobe: toStringValue(talentRaw.wardrobe),
                  }
                : undefined,
              transitionIn:
                (frame.transitionIn as string) ||
                (frame.transition_in as string) ||
                undefined,
              transitionOut:
                (frame.transitionOut as string) ||
                (frame.transition_out as string) ||
                undefined,
            };
          });

          setLiveStoryboardFrames(mappedFrames);
        }

        const moodboard = moodboardResponse.data?.[0];
        if (moodboard?.items && Array.isArray(moodboard.items)) {
          const items = moodboard.items as Array<Record<string, unknown>>;
          const mappedItems = items.map((item, idx) => {
            const type = (item.type as 'image' | 'color') || 'image';
            const id = (item.id as number) ?? idx + 1;
            const label = (item.label as string) || '';
            if (type === 'color') {
              return {
                id,
                type,
                color: (item.color as string) || '#d4af37',
                label,
                role: (item.role as string) || undefined,
                harmony: (item.harmony as string) || undefined,
              };
            }
            return {
              id,
              type,
              src:
                (item.src as string) ||
                (item.image as string) ||
                '/placeholder.svg?height=300&width=400',
              label,
              notes: (item.notes as string) || undefined,
            };
          });
          setLiveMoodboardItems(mappedItems);
        }

        const auditRows = auditResponse.data;
        if (auditRows?.length) {
          const mappedAudit = auditRows.map((log) => ({
            id: log.id,
            at: log.occurred_at || 'Recently',
            action: log.action || 'event',
            entity: log.entity_type || 'entity',
            ref: log.entity_id || 'ref',
          }));
          setLiveAuditLogs(mappedAudit as typeof auditLogs);
        }

        const exportRows = exportResponse.data;
        if (exportRows?.length) {
          const mappedExports = exportRows.map((row) => {
            const metadata = (row.metadata ?? {}) as Record<string, unknown>;
            return {
              id: row.id,
              createdAt: row.created_at || 'Recently',
              exportType: row.export_type || 'export',
              format: row.format || 'file',
              storagePath: row.storage_path || '',
              version:
                typeof metadata.export_version === 'number'
                  ? metadata.export_version
                  : undefined,
              fileName:
                typeof metadata.file_name === 'string'
                  ? metadata.file_name
                  : undefined,
              runId: row.analysis_run_id || undefined,
            };
          });
          setLiveExports(mappedExports as typeof exportHistory);
        }
      })
      .catch((error: Error) => {
        if (!active) return;
        setLiveStatus('error');
        setLiveError(error.message);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const displayRuns = liveStatus === 'authed' ? liveRuns : analysisRuns;
  const displayStoryboard =
    liveStatus === 'authed' ? liveStoryboardFrames : storyboardFrames;
  const displayMoodboard = liveStatus === 'authed' ? liveMoodboardItems : moodboardItems;
  const displayTraceability = liveStatus === 'authed' ? liveTraceability : traceability;
  const displayAuditLogs = liveStatus === 'authed' ? liveAuditLogs : auditLogs;
  const displayExports =
    liveStatus === 'authed' && liveExports.length ? liveExports : exportHistory;
  const latestRunId = displayRuns[0]?.id;

  const moodboardBuckets = useMemo(() => {
    const buckets = {
      all: displayMoodboard,
      colors: [] as typeof displayMoodboard,
      lighting: [] as typeof displayMoodboard,
      composition: [] as typeof displayMoodboard,
      texture: [] as typeof displayMoodboard,
      film: [] as typeof displayMoodboard,
      references: [] as typeof displayMoodboard,
    };
    displayMoodboard.forEach((item) => {
      const category = getMoodboardCategory(item);
      buckets[category].push(item);
    });
    return buckets;
  }, [displayMoodboard]);

  const storyboardStats = useMemo(() => {
    const totalFrames = displayStoryboard.length;
    const shotTypes = new Map<string, number>();
    let withCamera = 0;
    let withLighting = 0;
    let withComposition = 0;
    let withTalent = 0;
    let transitions = 0;

    displayStoryboard.forEach((frame) => {
      const shot = frame.shotType || 'Shot';
      shotTypes.set(shot, (shotTypes.get(shot) ?? 0) + 1);
      if (frame.cameraSetup) withCamera += 1;
      if (frame.lighting) withLighting += 1;
      if (frame.composition) withComposition += 1;
      if (frame.talent) withTalent += 1;
      if (frame.transitionIn || frame.transitionOut) transitions += 1;
    });

    const topShotTypes = Array.from(shotTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return {
      totalFrames,
      withCamera,
      withLighting,
      withComposition,
      withTalent,
      transitions,
      topShotTypes,
    };
  }, [displayStoryboard]);

  const moodboardStats = useMemo(() => {
    const totalItems = displayMoodboard.length;
    const imageCount = displayMoodboard.filter((item) => item.type === 'image').length;
    const colorCount = totalItems - imageCount;
    return {
      totalItems,
      imageCount,
      colorCount,
      categories: {
        colors: moodboardBuckets.colors.length,
        lighting: moodboardBuckets.lighting.length,
        composition: moodboardBuckets.composition.length,
        texture: moodboardBuckets.texture.length,
        film: moodboardBuckets.film.length,
        references: moodboardBuckets.references.length,
      },
    };
  }, [displayMoodboard, moodboardBuckets]);

  useEffect(() => {
    if (!displayInsightsVersions.length) return;
    setTimeout(() => {
      if (!displayInsightsVersions.find((v) => v.version === leftVersion)) {
        setLeftVersion(displayInsightsVersions[0].version);
      }
      const fallbackRight =
        displayInsightsVersions[Math.min(1, displayInsightsVersions.length - 1)]?.version;
      if (
        fallbackRight &&
        !displayInsightsVersions.find((v) => v.version === rightVersion)
      ) {
        setRightVersion(fallbackRight);
      }
    }, 0);
  }, [displayInsightsVersions, leftVersion, rightVersion]);

  const renderMoodboardItems = (items: typeof displayMoodboard) =>
    items.length ? (
      <div className="flex flex-wrap gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] space-y-2"
          >
            <div className="h-52 overflow-hidden rounded-3xl bg-black/40">
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={item.label}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full" style={{ backgroundColor: item.color }} />
              )}
            </div>
            {item.label ? (
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                {item.label}
              </p>
            ) : null}
            {'notes' in item && item.notes ? (
              <p className="text-sm text-white/60">{item.notes}</p>
            ) : null}
            {'role' in item && item.role ? (
              <p className="text-xs text-white/50">Role: {item.role}</p>
            ) : null}
            {'harmony' in item && item.harmony ? (
              <p className="text-xs text-white/50">Harmony: {item.harmony}</p>
            ) : null}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-white/60">No moodboard items yet.</p>
    );

  const handleExportPackage = async () => {
    if (liveStatus !== 'authed') {
      setExportError('Sign in to export.');
      return;
    }
    if (!latestRunId || exportLoading) return;
    setExportLoading(true);
    setExportError(null);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis_run_id: latestRunId, export_type: 'project_report' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to export PDF');
      }
      if (data?.signed_url) {
        window.open(data.signed_url as string, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const handleExportZip = async () => {
    if (exportZipLoading) return;
    if (liveStatus !== 'authed') {
      setExportZipError('Sign in to export.');
      return;
    }
    if (!latestRunId) {
      setExportZipError('No analysis run available for ZIP export.');
      return;
    }
    setExportZipLoading(true);
    setExportZipError(null);
    try {
      const zip = new JSZip();
      const now = new Date().toISOString();
      const fileName = `${buildPdfFileName(project.name, 'production-handoff')}.zip`;

      const storyboardJson = JSON.stringify(
        {
          generatedAt: now,
          project: project.name,
          frames: displayStoryboard,
        },
        null,
        2,
      );

      const moodboardJson = JSON.stringify(
        {
          generatedAt: now,
          project: project.name,
          items: displayMoodboard,
        },
        null,
        2,
      );

      const insightsJson = JSON.stringify(
        {
          generatedAt: now,
          decision: decisionOutput,
          analysisSummary,
        },
        null,
        2,
      );

      const traceabilityJson = JSON.stringify(
        {
          generatedAt: now,
          traceability: displayTraceability,
        },
        null,
        2,
      );

      const shotListCsv = [
        ['Frame', 'Shot Type', 'Timing', 'Notes'].join(','),
        ...displayStoryboard.map((frame) =>
          [
            frame.frame,
            `"${(frame.shotType || '').replace(/"/g, '""')}"`,
            `"${(frame.timing || '').replace(/"/g, '""')}"`,
            `"${(frame.notes || '').replace(/"/g, '""')}"`,
          ].join(','),
        ),
      ].join('\n');

      const moodboardCsv = [
        ['Id', 'Type', 'Label', 'Notes', 'Color', 'Role', 'Harmony'].join(','),
        ...displayMoodboard.map((item) =>
          [
            item.id,
            item.type,
            `"${(item.label || '').replace(/"/g, '""')}"`,
            `"${('notes' in item ? item.notes || '' : '').replace(/"/g, '""')}"`,
            `"${('color' in item ? item.color || '' : '').replace(/"/g, '""')}"`,
            `"${('role' in item ? item.role || '' : '').replace(/"/g, '""')}"`,
            `"${('harmony' in item ? item.harmony || '' : '').replace(/"/g, '""')}"`,
          ].join(','),
        ),
      ].join('\n');

      const readme = [
        'CineView AI — Production Handoff',
        `Project: ${project.name}`,
        `Generated: ${now}`,
        '',
        'Contents:',
        '- storyboard.json (production frames)',
        '- storyboard-shot-list.csv (quick shot list)',
        '- moodboard.json (reference items)',
        '- moodboard-items.csv (reference index)',
        '- insights.json (decision + summary)',
        '- traceability.json (audit metadata)',
      ].join('\n');

      zip.file('storyboard.json', storyboardJson);
      zip.file('storyboard-shot-list.csv', shotListCsv);
      zip.file('moodboard.json', moodboardJson);
      zip.file('moodboard-items.csv', moodboardCsv);
      zip.file('insights.json', insightsJson);
      zip.file('traceability.json', traceabilityJson);
      zip.file('README.txt', readme);

      const blob = await zip.generateAsync({ type: 'blob' });
      const recordResponse = await fetch('/api/export-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_run_id: latestRunId,
          export_type: 'production_handoff',
          format: 'zip',
          metadata: {
            file_name: fileName,
            format: 'zip',
            includes_storyboard: displayStoryboard.length > 0,
            includes_moodboard: displayMoodboard.length > 0,
            includes_insights: Boolean(decisionOutput),
            generated_at: now,
          },
        }),
      });

      const recordPayload = await recordResponse.json();
      if (!recordResponse.ok) {
        throw new Error(recordPayload?.error || 'Failed to record ZIP export');
      }

      downloadBlob(blob, fileName);
    } catch (error) {
      setExportZipError(error instanceof Error ? error.message : 'ZIP export failed');
    } finally {
      setExportZipLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pb-24 lg:px-8 motion-fade">
          <div className="mb-8">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm text-white/60 hover:text-white"
            >
              Back to Projects
            </Link>
          </div>

          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="text-eyebrow">Project Detail</p>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-display">
                {project.name}
              </h1>
              <p className="max-w-2xl text-sm sm:text-base text-white/60">
                {project.summary}
              </p>
              <div className="space-y-1 text-sm text-white/60">
                <p>Status: {project.status}</p>
                <p>Client: {project.client}</p>
                <p>Owner: {project.owner}</p>
                <p>Last updated: {project.lastUpdated}</p>
              </div>
              {liveStatus === 'anon' && (
                <p className="text-xs text-white/50">
                  Sign in to load live project data from Supabase.
                </p>
              )}
              {liveStatus === 'error' && (
                <p className="text-xs text-white/50">
                  Unable to load live data{liveError ? `: ${liveError}` : '.'}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-transparent text-white/60 rounded-full hover:text-white">
                Regenerate
              </Button>
              <Button className="bg-white text-black hover:bg-white/80 rounded-full">
                Export Package
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-12">
            <div className="pb-2">
              <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="visual"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Visual Intelligence
                </TabsTrigger>
                <TabsTrigger
                  value="cinematic"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Cinematic Reading
                </TabsTrigger>
                <TabsTrigger
                  value="storyboard"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Storyboard
                </TabsTrigger>
                <TabsTrigger
                  value="mood"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Mood Direction
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  AI Insights
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                >
                  Export
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-12">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Overview
                </p>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-white">Project Context</h2>
                    <p className="text-sm text-white/70">{project.summary}</p>
                  </div>
                  <div className="text-sm text-white/70 space-y-2 lg:text-right">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <span className="text-white">{project.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client</span>
                      <span className="text-white">{project.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner</span>
                      <span className="text-white">{project.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last updated</span>
                      <span className="text-white">{project.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Asset Intake
                </p>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <div className="p-6 text-center">
                    <p className="text-sm text-white/60">Drag and drop or browse</p>
                    <Button
                      className="mt-4 bg-white text-black hover:bg-white/80 rounded-full"
                      size="sm"
                    >
                      Select File
                    </Button>
                  </div>
                  <div className="space-y-3 flex-1">
                    <Input
                      placeholder="Asset name"
                      className="bg-white/5 border-transparent text-white placeholder:text-white/40"
                    />
                    <Textarea
                      placeholder="Notes for this upload"
                      className="bg-white/5 border-transparent text-white placeholder:text-white/40 min-h-[120px]"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    asChild
                    className="bg-transparent text-white/60 rounded-full hover:text-white"
                  >
                    <Link href="/upload">Open Upload Flow</Link>
                  </Button>
                  <Button className="bg-white text-black hover:bg-white/80 rounded-full">
                    Attach to Project
                  </Button>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Activity
                </p>
                <h2 className="text-2xl font-semibold text-white">Analysis Runs</h2>
                {displayRuns.length ? (
                  <div className="space-y-4">
                    {displayRuns.map((run) => (
                      <div key={run.id} className="pb-4 last:pb-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">{run.id}</p>
                            <p className="text-xs text-white/50">{run.createdAt}</p>
                          </div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                            {run.status}
                          </p>
                        </div>
                        <div className="mt-3 text-sm text-white/70">
                          <span className="text-white/50">Progress</span> {run.progress}%
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
                          {run.stages.map((stage) => (
                            <span key={stage.name}>
                              {stage.name} · {stage.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">No analysis runs yet.</p>
                )}
              </section>

              <section className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Governance
                </p>
                <div className="text-sm text-white/70 space-y-1">
                  <p>Every decision is traceable.</p>
                  <p>All outputs are versioned.</p>
                  <p>Creative accountability is built-in.</p>
                </div>
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowOverviewData((value) => !value)}
                >
                  {showOverviewData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showOverviewData && (
                  <div className="mt-8 space-y-8">
                    <section className="space-y-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                        Governance
                      </p>
                      <h3 className="text-xl font-semibold text-white">Accountability</h3>
                      <div className="space-y-2 text-sm text-white/70">
                        <p>Every decision is traceable.</p>
                        <p>All outputs are versioned.</p>
                        <p>Creative accountability is built-in.</p>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-12">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Visual Intelligence
                </p>
                <h2 className="text-2xl font-semibold text-white">Technical Summary</h2>
                <div className="max-w-2xl space-y-4 text-sm text-white/70">
                  <p>
                    Technical scoring reflects deterministic analysis of clarity, noise
                    profile, and dynamic range.
                  </p>
                  <p className="text-white/60">
                    Quantitative scores are available under “Show Data.”
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Focus Areas
                    </p>
                    <p>Sharpness, noise profile, contrast stability.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Processing
                </p>
                <h3 className="text-xl font-semibold text-white">
                  Optimization Policies
                </h3>
                <div className="space-y-3">
                  {optimizationPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="flex flex-wrap items-center justify-between gap-3 pb-3 last:pb-0 text-sm text-white/70"
                    >
                      <span>{policy.rule}</span>
                      <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                        {policy.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowVisualData((value) => !value)}
                >
                  {showVisualData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showVisualData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Data Snapshot
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Sharpness</span>
                        <span className="text-white">
                          {analysisSummary.technical.sharpness}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Noise</span>
                        <span className="text-white">
                          {analysisSummary.technical.noise}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contrast</span>
                        <span className="text-white">
                          {analysisSummary.technical.contrast}%
                        </span>
                      </div>
                      {(() => {
                        const technical = (analysisRaw as Record<string, unknown> | null)
                          ?.technical as Record<string, unknown> | undefined;
                        const brightness = technical
                          ? technical['brightness']
                          : undefined;
                        if (typeof brightness === 'number') {
                          return (
                            <div className="flex justify-between">
                              <span>Brightness</span>
                              <span className="text-white">
                                {Math.round(brightness)}%
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {(() => {
                        const technical = (analysisRaw as Record<string, unknown> | null)
                          ?.technical as Record<string, unknown> | undefined;
                        const saturation = technical
                          ? technical['saturation']
                          : undefined;
                        if (typeof saturation === 'number') {
                          return (
                            <div className="flex justify-between">
                              <span>Saturation</span>
                              <span className="text-white">
                                {Math.round(saturation)}%
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {(() => {
                        const composition = (
                          analysisRaw as Record<string, unknown> | null
                        )?.composition as Record<string, unknown> | undefined;
                        const score = composition ? composition['score'] : undefined;
                        if (typeof score === 'number') {
                          return (
                            <div className="flex justify-between">
                              <span>Composition Score</span>
                              <span className="text-white">{Math.round(score)}%</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cinematic" className="space-y-12">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Cinematic Reading
                </p>
                <h2 className="text-2xl font-semibold text-white">Narrative Signals</h2>
                <div className="max-w-2xl space-y-4 text-sm text-white/70">
                  <p>
                    The cinematic reading synthesizes mood, energy, shot type, and genre
                    cues into a single narrative profile.
                  </p>
                  <p className="text-white/60">
                    Narrative potential is computed from composition and contrast
                    alignment. View the quantified profile under “Show Data.”
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Signal Families
                    </p>
                    <p>Mood, energy, shot type, genre, narrative potential.</p>
                  </div>
                </div>
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowCinematicData((value) => !value)}
                >
                  {showCinematicData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showCinematicData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Data Snapshot
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Mood</span>
                        <span className="text-white">
                          {analysisSummary.cinematic.mood}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Energy</span>
                        <span className="text-white">
                          {analysisSummary.cinematic.energy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shot Type</span>
                        <span className="text-white">
                          {analysisSummary.cinematic.shotType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Genre</span>
                        <span className="text-white">
                          {analysisSummary.cinematic.genre}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Narrative Potential</span>
                        <span className="text-white">
                          {Math.round(analysisSummary.cinematic.narrativePotential * 100)}
                          %
                        </span>
                      </div>
                      {(() => {
                        const cinematic = (analysisRaw as Record<string, unknown> | null)
                          ?.cinematic as Record<string, unknown> | undefined;
                        const mood = cinematic ? cinematic['mood'] : undefined;
                        if (typeof mood === 'string') {
                          return (
                            <div className="flex justify-between">
                              <span>Detected Mood</span>
                              <span className="text-white">{mood}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="storyboard" className="space-y-12">
              <section className="space-y-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Storyboard
                </p>
                <h2 className="text-2xl font-semibold text-white">Visual Sequence</h2>
                <p className="max-w-2xl text-sm text-white/60">
                  A director’s shot list, presented as a cinematic sequence with minimal
                  annotation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <PDFDownloadLink
                    document={
                      <StoryboardPdfDocument
                        projectName={project.name}
                        frames={displayStoryboard}
                        generatedAt={new Date().toISOString()}
                      />
                    }
                    fileName={`${buildPdfFileName(project.name, 'storyboard')}.pdf`}
                    className="inline-flex"
                  >
                    {({ loading }) => (
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/80 rounded-full"
                        disabled={loading || !displayStoryboard.length}
                      >
                        {loading ? 'Preparing PDF…' : 'Export Storyboard PDF'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
                <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Frames
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {storyboardStats.totalFrames}
                    </p>
                    <p className="text-xs text-white/50">Production beats</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Coverage
                    </p>
                    <p className="text-sm text-white/70">
                      Camera: {storyboardStats.withCamera}
                    </p>
                    <p className="text-sm text-white/70">
                      Lighting: {storyboardStats.withLighting}
                    </p>
                    <p className="text-sm text-white/70">
                      Composition: {storyboardStats.withComposition}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Direction
                    </p>
                    <p className="text-sm text-white/70">
                      Talent notes: {storyboardStats.withTalent}
                    </p>
                    <p className="text-sm text-white/70">
                      Transitions: {storyboardStats.transitions}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Top shots
                    </p>
                    {storyboardStats.topShotTypes.length ? (
                      <div className="space-y-1 text-sm text-white/70">
                        {storyboardStats.topShotTypes.map(([shot, count]) => (
                          <p key={shot}>
                            {shot} · {count}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/60">No shot data.</p>
                    )}
                  </div>
                </div>
                {displayStoryboard.length ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {displayStoryboard.map((frame) => (
                      <div
                        key={frame.id}
                        className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6"
                      >
                        <div className="aspect-[1.85/1] overflow-hidden rounded-2xl bg-black/40">
                          <img
                            src={frame.image}
                            alt={`Frame ${frame.frame}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                              Frame {frame.frame}
                            </p>
                            <p className="text-sm text-white/70">{frame.notes}</p>
                          </div>
                          <div className="text-right text-xs text-white/50 space-y-1">
                            <p className="text-white/70">{frame.shotType}</p>
                            {frame.timing ? <p>{frame.timing}</p> : null}
                          </div>
                        </div>
                        <Accordion type="single" collapsible className="border-t border-white/10 pt-2">
                          <AccordionItem value={`details-${frame.id}`} className="border-none">
                            <AccordionTrigger className="text-xs uppercase tracking-[0.3em] text-white/60">
                              Production details
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-white/70">
                              <div className="grid gap-4 md:grid-cols-2">
                                {frame.cameraSetup ? (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                                      Camera
                                    </p>
                                    <ul className="space-y-1">
                                      <li>Lens: {frame.cameraSetup.lens}</li>
                                      <li>Aperture: {frame.cameraSetup.aperture}</li>
                                      <li>ISO: {frame.cameraSetup.iso}</li>
                                      <li>Shutter: {frame.cameraSetup.shutterSpeed}</li>
                                      <li>Movement: {frame.cameraSetup.movement}</li>
                                      <li>Height: {frame.cameraSetup.height}</li>
                                    </ul>
                                  </div>
                                ) : null}
                                {frame.lighting ? (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                                      Lighting
                                    </p>
                                    <ul className="space-y-1">
                                      <li>Key: {frame.lighting.key}</li>
                                      <li>Fill: {frame.lighting.fill}</li>
                                      <li>Back: {frame.lighting.back}</li>
                                      <li>Kelvin: {frame.lighting.kelvin}</li>
                                      <li>Ratio: {frame.lighting.ratio}</li>
                                    </ul>
                                  </div>
                                ) : null}
                                {frame.composition ? (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                                      Composition
                                    </p>
                                    <ul className="space-y-1">
                                      <li>Rule: {frame.composition.rule}</li>
                                      {frame.composition.leadingLines ? (
                                        <li>Lines: {frame.composition.leadingLines}</li>
                                      ) : null}
                                      {frame.composition.depth ? (
                                        <li>Depth: {frame.composition.depth}</li>
                                      ) : null}
                                      {frame.composition.focus ? (
                                        <li>Focus: {frame.composition.focus}</li>
                                      ) : null}
                                    </ul>
                                  </div>
                                ) : null}
                                {frame.talent ? (
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                                      Talent
                                    </p>
                                    <ul className="space-y-1">
                                      <li>Blocking: {frame.talent.blocking}</li>
                                      <li>Expression: {frame.talent.expression}</li>
                                      <li>Wardrobe: {frame.talent.wardrobe}</li>
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                              {frame.transitionIn || frame.transitionOut ? (
                                <div className="mt-4 text-xs text-white/60">
                                  {frame.transitionIn ? (
                                    <p>Transition In: {frame.transitionIn}</p>
                                  ) : null}
                                  {frame.transitionOut ? (
                                    <p>Transition Out: {frame.transitionOut}</p>
                                  ) : null}
                                </div>
                              ) : null}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">No storyboard generated yet.</p>
                )}
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowStoryboardData((value) => !value)}
                >
                  {showStoryboardData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showStoryboardData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Shot List
                    </p>
                    {displayStoryboard.length ? (
                      <div className="mt-4 space-y-2">
                        {displayStoryboard.map((frame) => (
                          <div
                            key={frame.id}
                            className="flex flex-wrap items-start justify-between gap-4"
                          >
                            <span className="text-white">
                              Frame {frame.frame} · {frame.shotType}
                            </span>
                            <span className="text-white/60">
                              {frame.timing ? `${frame.timing} · ` : ''}
                              {frame.notes}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/60">
                        Storyboard data not available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mood" className="space-y-12">
              <section className="space-y-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Mood Direction
                </p>
                <h2 className="text-2xl font-semibold text-white">Reference Palette</h2>
                <p className="max-w-2xl text-sm text-white/60">
                  Atmospheric references prioritizing light, texture, and tonal direction.
                </p>
                <div className="flex flex-wrap gap-3">
                  <PDFDownloadLink
                    document={
                      <MoodboardPdfDocument
                        projectName={project.name}
                        items={displayMoodboard}
                        generatedAt={new Date().toISOString()}
                      />
                    }
                    fileName={`${buildPdfFileName(project.name, 'moodboard')}.pdf`}
                    className="inline-flex"
                  >
                    {({ loading }) => (
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/80 rounded-full"
                        disabled={loading || !displayMoodboard.length}
                      >
                        {loading ? 'Preparing PDF…' : 'Export Moodboard PDF'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
                <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Items
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {moodboardStats.totalItems}
                    </p>
                    <p className="text-xs text-white/50">
                      {moodboardStats.imageCount} images · {moodboardStats.colorCount} colors
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Lighting
                    </p>
                    <p className="text-sm text-white/70">
                      References: {moodboardStats.categories.lighting}
                    </p>
                    <p className="text-xs text-white/50">Mood by illumination</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Composition
                    </p>
                    <p className="text-sm text-white/70">
                      References: {moodboardStats.categories.composition}
                    </p>
                    <p className="text-xs text-white/50">Framing & balance</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Film
                    </p>
                    <p className="text-sm text-white/70">
                      References: {moodboardStats.categories.film}
                    </p>
                    <p className="text-xs text-white/50">Cinematography cues</p>
                  </div>
                </div>
                <Tabs defaultValue="all" className="space-y-6">
                  <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
                    <TabsTrigger
                      value="all"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="colors"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      Colors
                    </TabsTrigger>
                    <TabsTrigger
                      value="lighting"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      Lighting
                    </TabsTrigger>
                    <TabsTrigger
                      value="composition"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      Composition
                    </TabsTrigger>
                    <TabsTrigger
                      value="texture"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      Texture
                    </TabsTrigger>
                    <TabsTrigger
                      value="film"
                      className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white"
                    >
                      Film
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.all)}
                  </TabsContent>
                  <TabsContent value="colors" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.colors)}
                  </TabsContent>
                  <TabsContent value="lighting" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.lighting)}
                  </TabsContent>
                  <TabsContent value="composition" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.composition)}
                  </TabsContent>
                  <TabsContent value="texture" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.texture)}
                  </TabsContent>
                  <TabsContent value="film" className="space-y-4">
                    {renderMoodboardItems(moodboardBuckets.film)}
                  </TabsContent>
                </Tabs>
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowMoodData((value) => !value)}
                >
                  {showMoodData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showMoodData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Moodboard Notes
                    </p>
                    {displayMoodboard.length ? (
                      <div className="mt-4 space-y-2">
                        {displayMoodboard.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-start justify-between gap-4"
                          >
                            <span className="text-white">{item.label || 'Untitled'}</span>
                            <span className="text-white/60">
                              {item.type === 'color' ? item.color : 'Image reference'}
                              {'notes' in item && item.notes ? ` · ${item.notes}` : ''}
                              {'role' in item && item.role ? ` · ${item.role}` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/60">
                        Moodboard data not available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-12">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  AI Insights
                </p>
                <h2 className="text-2xl font-semibold text-white">Creative Brief</h2>
                {decisionOutput ? (
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Creative Direction
                      </p>
                      <p className="text-lg text-white">
                        {decisionOutput.decision_summary ||
                          'Decision summary unavailable.'}
                      </p>
                      <p className="text-sm text-white/70">
                        {decisionOutput.recommended_actions?.length
                          ? decisionOutput.recommended_actions.join('. ')
                          : 'No immediate opportunities noted.'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Risks
                      </p>
                      <p className="text-sm text-white/70">
                        {decisionOutput.risk_flags?.length
                          ? decisionOutput.risk_flags.join('. ')
                          : 'No major risks detected.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Alternative Visual Paths
                      </p>
                      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                        <div className="space-y-2">
                          <Label className="text-white/60">Select version A</Label>
                          <Select value={leftVersion} onValueChange={setLeftVersion}>
                            <SelectTrigger className="bg-card text-foreground border border-input shadow-sm px-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground border border-input">
                              {displayInsightsVersions.map((v) => (
                                <SelectItem key={v.version} value={v.version}>
                                  {v.version} · {v.createdAt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/60">Select version B</Label>
                          <Select value={rightVersion} onValueChange={setRightVersion}>
                            <SelectTrigger className="bg-card text-foreground border border-input shadow-sm px-3">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground border border-input">
                              {displayInsightsVersions.map((v) => (
                                <SelectItem key={v.version} value={v.version}>
                                  {v.version} · {v.createdAt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm text-white/70">
                        <p>
                          <span className="text-white">Path {left.version}:</span>{' '}
                          {left.decisionSummary}
                        </p>
                        <p>
                          {left.riskFlags.length
                            ? `Risks: ${left.riskFlags.join('. ')}`
                            : 'Risks: None listed.'}
                        </p>
                      </div>
                      <div className="space-y-3 text-sm text-white/70">
                        <p>
                          <span className="text-white">Path {right.version}:</span>{' '}
                          {right.decisionSummary}
                        </p>
                        <p>
                          {right.riskFlags.length
                            ? `Risks: ${right.riskFlags.join('. ')}`
                            : 'Risks: None listed.'}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-white/70">
                        <p>
                          Added actions:{' '}
                          {diff.added.length ? diff.added.join('. ') : 'No changes.'}
                        </p>
                        <p>
                          Removed actions:{' '}
                          {diff.removed.length ? diff.removed.join('. ') : 'No changes.'}
                        </p>
                        <p>
                          New risks:{' '}
                          {diff.riskAdded.length
                            ? diff.riskAdded.join('. ')
                            : 'No changes.'}
                        </p>
                        <p>
                          Resolved risks:{' '}
                          {diff.riskRemoved.length
                            ? diff.riskRemoved.join('. ')
                            : 'No changes.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-white/70">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Confidence Meter
                      </p>
                      <p className="text-2xl font-semibold text-white">
                        {decisionOutput.confidence !== undefined
                          ? Math.round(decisionOutput.confidence * 100)
                          : 0}
                        %
                      </p>
                      <p>
                        Intent alignment:{' '}
                        {decisionOutput.intent_alignment !== undefined
                          ? Math.round(decisionOutput.intent_alignment * 100)
                          : 0}
                        %.
                      </p>
                      <p>
                        Composition:{' '}
                        {Math.round((decisionOutput.composition_score ?? 0) * 100)}% ·
                        Color: {Math.round((decisionOutput.color_score ?? 0) * 100)}% ·
                        Signals: {signalCount}.
                      </p>
                      <p className="text-xs text-white/50">
                        Engine: {decisionOutput.engine_version ?? 'decision-v1'}
                        {decisionOutput.version ? ` · ${decisionOutput.version}` : ''}
                      </p>
                    </div>

                    <p className="text-xs text-white/50">
                      This decision is generated based on visual signals detected in the
                      source material.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-white/60">
                    No decision output generated yet.
                  </p>
                )}
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowInsightsData((value) => !value)}
                >
                  {showInsightsData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showInsightsData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Decision Metrics
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <span>Confidence</span>
                        <span className="text-white">
                          {decisionOutput?.confidence !== undefined
                            ? Math.round(decisionOutput.confidence * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Intent Alignment</span>
                        <span className="text-white">
                          {decisionOutput?.intent_alignment !== undefined
                            ? Math.round(decisionOutput.intent_alignment * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Composition Score</span>
                        <span className="text-white">
                          {Math.round((decisionOutput?.composition_score ?? 0) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Color Score</span>
                        <span className="text-white">
                          {Math.round((decisionOutput?.color_score ?? 0) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engine Version</span>
                        <span className="text-white">
                          {decisionOutput?.engine_version ?? 'decision-v1'}
                        </span>
                      </div>
                      {decisionOutput?.version ? (
                        <div className="flex justify-between">
                          <span>Decision Version</span>
                          <span className="text-white">{decisionOutput.version}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-12">
              <section className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Export</p>
                <h2 className="text-2xl font-semibold text-white">Deliverables</h2>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
                    <div>
                      <p className="text-sm font-medium text-white">Client Package</p>
                      <p className="text-xs text-white/60">
                        Storyboard + Moodboard + Insights
                      </p>
                    </div>
                    <Button
                      className="bg-white text-black hover:bg-white/80 rounded-full"
                      size="sm"
                      onClick={handleExportPackage}
                      disabled={!latestRunId || exportLoading}
                    >
                      {exportLoading ? 'Exporting…' : 'Export PDF'}
                    </Button>
                  </div>
                  {exportError ? (
                    <p className="text-xs text-rose-200">
                      Export failed: {exportError}
                    </p>
                  ) : null}
                  {!latestRunId ? (
                    <p className="text-xs text-white/50">
                      Run an analysis to enable exports.
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
                    <div>
                      <p className="text-sm font-medium text-white">Production Handoff</p>
                      <p className="text-xs text-white/60">
                        Shot list + Settings + Risks
                      </p>
                    </div>
                    <Button
                      className="bg-transparent text-white/60 rounded-full hover:text-white"
                      size="sm"
                      onClick={handleExportZip}
                      disabled={exportZipLoading || (!displayStoryboard.length && !displayMoodboard.length)}
                    >
                      {exportZipLoading ? 'Exporting…' : 'Export ZIP'}
                    </Button>
                  </div>
                  {exportZipError ? (
                    <p className="text-xs text-rose-200">
                      ZIP export failed: {exportZipError}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Export History
                  </p>
                  {displayExports.length ? (
                    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                      {displayExports.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-none last:pb-0"
                        >
                          <div className="space-y-1">
                            <p className="text-sm text-white">
                              {item.exportType.replace(/_/g, ' ')} · {item.format.toUpperCase()}
                              {item.version ? ` · v${item.version}` : ''}
                            </p>
                            <p className="text-xs text-white/50">{item.createdAt}</p>
                            {item.fileName ? (
                              <p className="text-xs text-white/60">{item.fileName}</p>
                            ) : null}
                          </div>
                          <div className="text-xs text-white/50 space-y-1 text-right">
                            {item.runId ? <p>Run: {item.runId}</p> : null}
                            {item.storagePath ? <p>{item.storagePath}</p> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">No exports recorded yet.</p>
                  )}
                </div>
                <Button
                  asChild
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                >
                  <Link href="/export">Go to Export Hub</Link>
                </Button>
              </section>

              <div className="pt-2">
                <Button
                  className="bg-transparent text-white/60 rounded-full hover:text-white"
                  onClick={() => setShowExportData((value) => !value)}
                >
                  {showExportData ? 'Hide Data' : 'Show Data'}
                </Button>
                {showExportData && (
                  <div className="mt-8 space-y-4 text-sm text-white/70">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      Export Metadata
                    </p>
                    {displayTraceability ? (
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Export Id</span>
                          <span className="text-white">
                            {displayTraceability.exportId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Analysis Run</span>
                          <span className="text-white">{displayTraceability.runId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pipeline Version</span>
                          <span className="text-white">
                            {displayTraceability.pipelineVersion}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-white/60">
                        Export metadata not available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
