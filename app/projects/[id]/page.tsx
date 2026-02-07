"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabaseBrowser } from "@/lib/supabase-browser";

const mockProject = {
 id: "1",
 name: "Saudi Tourism Campaign",
 client: "Ministry of Tourism",
 status: "in-progress",
 lastUpdated: "2026-02-03",
 owner: "Ahmed Al-Rashid",
 summary: "Hero visual campaign for Visit Saudi featuring heritage sites and modern experiences.",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const analysisRuns = [
 {
  id: "run_001",
  createdAt: "2026-02-03 10:12",
  status: "complete",
  progress: 100,
  stages: [
   { name: "Upload", status: "complete" },
   { name: "Technical", status: "complete" },
   { name: "Cinematic", status: "complete" },
   { name: "Storyboard", status: "complete" },
   { name: "Insights", status: "complete" },
  ],
 },
 {
  id: "run_002",
  createdAt: "2026-02-04 16:40",
  status: "processing",
  progress: 62,
  stages: [
   { name: "Upload", status: "complete" },
   { name: "Technical", status: "complete" },
   { name: "Cinematic", status: "in-progress" },
   { name: "Storyboard", status: "pending" },
   { name: "Insights", status: "pending" },
  ],
 },
];

const storyboardFrames = [
 { id: 1, frame: 1, image: "/placeholder.svg?height=180&width=320", notes: "Fade in from black" },
 { id: 2, frame: 2, image: "/placeholder.svg?height=180&width=320", notes: "Pan left to reveal city" },
 { id: 3, frame: 3, image: "/placeholder.svg?height=180&width=320", notes: "Close-up detail shot" },
 { id: 4, frame: 4, image: "/placeholder.svg?height=180&width=320", notes: "Tracking shot follows subject" },
];

const moodboardItems = [
 { id: 1, type: "image", src: "/placeholder.svg?height=300&width=400", label: "Warm architecture" },
 { id: 2, type: "color", color: "#d4af37", label: "Primary Gold" },
 { id: 3, type: "image", src: "/placeholder.svg?height=250&width=350", label: "Evening skyline" },
 { id: 4, type: "color", color: "#1a1a2e", label: "Deep Navy" },
];

const insightsVersions = [
 {
  version: "v1.2",
  createdAt: "2026-02-03 10:18",
  decisionSummary: "Shift key scene to golden hour; increase negative space for brand lockup.",
  riskFlags: ["Overexposure risk on reflective surfaces", "Crowd density variability"],
  recommendedActions: ["Add ND filter", "Schedule b-roll buffer window"],
  raw: {
   confidence: 0.82,
   intentAlignment: 0.76,
   compositionScore: 0.84,
   colorScore: 0.79,
  },
 },
 {
  version: "v1.3",
  createdAt: "2026-02-04 16:49",
  decisionSummary: "Keep golden hour but add dusk alternative; tighten focal length for hero shot.",
  riskFlags: ["Low light noise risk", "Crowd density variability"],
  recommendedActions: ["Add fast prime lens", "Schedule b-roll buffer window"],
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
  mood: "Cinematic Drama",
  energy: "Medium",
  shotType: "Medium",
  genre: "Travel Documentary",
  narrativePotential: 0.86,
 },
};

const traceability = {
 runId: "run_002",
 assetId: "asset_9f12",
 analysisId: "analysis_7c31",
 insightId: "insight_43b2",
 exportId: "export_8a10",
 pipelineVersion: "analysis-pipeline@1.4.2",
 inputHash: "sha256:7f5d...a91c",
 cache: {
  key: "cache:asset_9f12:intent_v3",
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
 { id: 1, at: "2026-02-04 16:49", action: "analysis.run.completed", entity: "analysis_runs", ref: "run_002" },
 { id: 2, at: "2026-02-04 16:50", action: "insight.version.created", entity: "creative_insights", ref: "v1.3" },
 { id: 3, at: "2026-02-04 16:52", action: "storyboard.generated", entity: "storyboards", ref: "sb_102" },
 { id: 4, at: "2026-02-04 16:53", action: "moodboard.generated", entity: "moodboards", ref: "mb_341" },
 { id: 5, at: "2026-02-04 17:02", action: "export.requested", entity: "exports", ref: "export_8a10" },
];

const optimizationPolicies = [
 { id: 1, rule: "Reuse cached results when input_hash matches", status: "enabled" },
 { id: 2, rule: "Regenerate if intent changes or confidence < 0.75", status: "enabled" },
 { id: 3, rule: "Skip heavy modules when cache_hit = true", status: "enabled" },
];

const baseStages = ["Upload", "Technical", "Cinematic", "Storyboard", "Insights"];

function buildStages(progress: number, complete: boolean) {
 if (complete) {
  return baseStages.map((name) => ({ name, status: "complete" }));
 }

 const thresholds = [10, 30, 55, 75, 90];
 return baseStages.map((name, index) => {
  if (progress >= thresholds[index]) {
   return { name, status: "complete" };
  }
  if (index === 0 || progress >= Math.max(0, thresholds[index] - 10)) {
   return { name, status: "in-progress" };
  }
  return { name, status: "pending" };
 });
}

function versionDiff(a: typeof insightsVersions[0], b: typeof insightsVersions[0]) {
 const added = b.recommendedActions.filter((x) => !a.recommendedActions.includes(x));
 const removed = a.recommendedActions.filter((x) => !b.recommendedActions.includes(x));
 const riskAdded = b.riskFlags.filter((x) => !a.riskFlags.includes(x));
 const riskRemoved = a.riskFlags.filter((x) => !b.riskFlags.includes(x));
 return { added, removed, riskAdded, riskRemoved };
}

export default function ProjectDetailPage() {
 const params = useParams();
 const projectIdParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;
 const projectId = typeof projectIdParam === "string" ? projectIdParam : null;

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
 const [liveInsightsVersions, setLiveInsightsVersions] = useState<typeof insightsVersions>([]);
 const [liveStatus, setLiveStatus] = useState<"loading" | "authed" | "anon" | "error">("loading");
 const [liveError, setLiveError] = useState<string | null>(null);
 const [liveRuns, setLiveRuns] = useState<typeof analysisRuns>([]);
 const [liveStoryboardFrames, setLiveStoryboardFrames] = useState<typeof storyboardFrames>([]);
 const [liveMoodboardItems, setLiveMoodboardItems] = useState<typeof moodboardItems>([]);
 const [liveTraceability, setLiveTraceability] = useState<typeof traceability | null>(null);
 const [liveAuditLogs, setLiveAuditLogs] = useState<typeof auditLogs>([]);

 const [leftVersion, setLeftVersion] = useState(insightsVersions[0].version);
 const [rightVersion, setRightVersion] = useState(insightsVersions[1].version);
 const [showOverviewData, setShowOverviewData] = useState(false);
 const [showVisualData, setShowVisualData] = useState(false);
 const [showCinematicData, setShowCinematicData] = useState(false);
 const [showStoryboardData, setShowStoryboardData] = useState(false);
 const [showMoodData, setShowMoodData] = useState(false);
 const [showInsightsData, setShowInsightsData] = useState(false);
 const [showExportData, setShowExportData] = useState(false);

 const displayInsightsVersions = liveStatus === "authed" && liveInsightsVersions.length
  ? liveInsightsVersions
  : insightsVersions;

 const left = useMemo(
  () => displayInsightsVersions.find((v) => v.version === leftVersion) || displayInsightsVersions[0],
  [displayInsightsVersions, leftVersion]
 );
 const right = useMemo(
  () =>
   displayInsightsVersions.find((v) => v.version === rightVersion) ||
   displayInsightsVersions[Math.min(1, displayInsightsVersions.length - 1)],
  [displayInsightsVersions, rightVersion]
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
 ].filter((value) => typeof value === "number").length;

 useEffect(() => {
  let active = true;
  if (!projectId) {
   setLiveStatus("error");
   setLiveError("Missing project id");
   return () => {
    active = false;
   };
  }

  supabaseBrowser.auth
   .getSession()
   .then(async ({ data }) => {
    if (!active) return;
    if (!data.session) {
     setLiveStatus("anon");
     return;
    }
    setLiveStatus("authed");
    const user = data.session.user;

    const { data: projectRows, error: projectError } = await supabaseBrowser
     .from("projects")
     .select("id,name,description,status,created_at,updated_at")
     .eq("id", projectId)
     .limit(1);

    if (!active) return;
    if (projectError || !projectRows?.length) {
     setLiveStatus("error");
     setLiveError(projectError?.message || "Project not found");
     return;
    }

    const row = projectRows[0];
    setProject({
     ...mockProject,
     id: row.id,
     name: row.name || "Untitled Project",
     summary: row.description || mockProject.summary,
     status: row.status || "active",
     lastUpdated: row.updated_at || row.created_at || mockProject.lastUpdated,
     owner: user.email || user.id,
     client: "Self",
    });

    const { data: insightRows } = await supabaseBrowser
     .from("creative_insights")
     .select("insights,created_at")
     .eq("project_id", row.id)
     .order("created_at", { ascending: false })
     .limit(6);

    if (!active) return;
    const latestInsight = insightRows?.[0]?.insights as
     | {
       technical?: { sharpness?: number; noise?: number; contrast?: number; brightness?: number; saturation?: number };
       composition?: { score?: number };
       mood?: string;
       cinematic?: { mood?: string; energy?: string; shotType?: string; genre?: string };
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
       createdAt: row.created_at || "Recently",
       decisionSummary: decision?.decision_summary || "Decision summary unavailable.",
       riskFlags: decision?.risk_flags || [],
       recommendedActions: decision?.recommended_actions || [],
       raw: decision || {},
      };
     });
     setLiveInsightsVersions(mappedVersions as typeof insightsVersions);

     const latest = insightRows[0]?.insights as
      | {
        technical?: { sharpness?: number; noise?: number; contrast?: number; brightness?: number; saturation?: number };
        composition?: { score?: number };
        mood?: string;
        cinematic?: { mood?: string; energy?: string; shotType?: string; genre?: string };
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
      const contrast = technical.contrast ?? defaultAnalysisSummary.technical.contrast;
      const narrativePotential = clamp01((compositionScore * 0.6 + contrast * 0.4) / 100);

      setAnalysisSummary({
       technical: {
        sharpness: technical.sharpness ?? defaultAnalysisSummary.technical.sharpness,
        noise: technical.noise ?? defaultAnalysisSummary.technical.noise,
        contrast,
       },
       cinematic: {
        mood: cinematic.mood || latest.mood || defaultAnalysisSummary.cinematic.mood,
        energy: (cinematic.energy as string) || defaultAnalysisSummary.cinematic.energy,
        shotType: cinematic.shotType || defaultAnalysisSummary.cinematic.shotType,
        genre: cinematic.genre || defaultAnalysisSummary.cinematic.genre,
        narrativePotential,
       },
      });
     }
    }

    const { data: runRows } = await supabaseBrowser
     .from("analysis_runs")
     .select("id,status,progress,created_at,started_at,completed_at,asset_id")
     .eq("project_id", row.id)
     .order("created_at", { ascending: false })
     .limit(6);

    if (!active) return;
    if (runRows?.length) {
     const mappedRuns = runRows.map((run) => {
      const progress = typeof run.progress === "number" ? run.progress : 0;
      const complete = run.status === "completed" || run.status === "complete" || progress >= 100;
      return {
       id: run.id,
       createdAt: run.created_at || run.started_at || "Recently",
       status: complete ? "complete" : "processing",
       progress: complete ? 100 : progress || 45,
       stages: buildStages(complete ? 100 : progress || 45, complete),
       assetId: run.asset_id || null,
      } as typeof analysisRuns[number] & { assetId?: string | null };
     });
     setLiveRuns(mappedRuns as typeof analysisRuns);

     const latestRun = mappedRuns[0] as (typeof mappedRuns)[number] | undefined;
     if (latestRun) {
      const { data: traceRows } = await supabaseBrowser
       .from("analysis_traceability")
       .select("analysis_run_id,insight_id,export_id,input_hash,cache_key,cache_hit,latency_ms,token_cost_usd,kpis,metadata")
       .eq("analysis_run_id", latestRun.id)
       .order("created_at", { ascending: false })
       .limit(1);

      if (!active) return;
      const traceRow = traceRows?.[0];
      if (traceRow) {
       const kpis = (traceRow.kpis ?? {}) as Record<string, number>;
       setLiveTraceability({
        runId: traceRow.analysis_run_id || latestRun.id,
        assetId: latestRun.assetId || "asset",
        analysisId: traceRow.analysis_run_id || latestRun.id,
        insightId: traceRow.insight_id || "insight",
        exportId: traceRow.export_id || "export",
        pipelineVersion: (traceRow.metadata as Record<string, unknown>)?.pipeline_version as string || "ci-v1",
        inputHash: traceRow.input_hash || "sha256:pending",
        cache: {
         key: traceRow.cache_key || "cache:pending",
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

    const { data: storyboardRows } = await supabaseBrowser
     .from("storyboards")
     .select("frames,created_at,title,description")
     .eq("project_id", row.id)
     .order("created_at", { ascending: false })
     .limit(1);

    if (!active) return;
    const storyboard = storyboardRows?.[0];
    if (storyboard?.frames && Array.isArray(storyboard.frames)) {
     const frames = storyboard.frames as Array<Record<string, unknown>>;
     const mappedFrames = frames.map((frame, idx) => ({
      id: (frame.id as number) ?? idx + 1,
      frame: (frame.frame as number) ?? idx + 1,
      image:
       (frame.image as string) ||
       (frame.src as string) ||
       "/placeholder.svg?height=180&width=320",
      notes: (frame.notes as string) || (frame.label as string) || "Storyboard frame",
     }));
     setLiveStoryboardFrames(mappedFrames);
    }

    const { data: moodboardRows } = await supabaseBrowser
     .from("moodboards")
     .select("items,created_at,title,description")
     .eq("project_id", row.id)
     .order("created_at", { ascending: false })
     .limit(1);

    if (!active) return;
    const moodboard = moodboardRows?.[0];
    if (moodboard?.items && Array.isArray(moodboard.items)) {
     const items = moodboard.items as Array<Record<string, unknown>>;
     const mappedItems = items.map((item, idx) => ({
      id: (item.id as number) ?? idx + 1,
      type: (item.type as "image" | "color") || "image",
      src: (item.src as string) || (item.image as string) || "/placeholder.svg?height=300&width=400",
      color: (item.color as string) || "#d4af37",
      label: (item.label as string) || "",
     }));
     setLiveMoodboardItems(mappedItems);
    }

    const { data: auditRows } = await supabaseBrowser
     .from("audit_logs")
     .select("id,occurred_at,action,entity_type,entity_id")
     .eq("project_id", row.id)
     .order("occurred_at", { ascending: false })
     .limit(10);

    if (!active) return;
    if (auditRows?.length) {
     const mappedAudit = auditRows.map((log) => ({
      id: log.id,
      at: log.occurred_at || "Recently",
      action: log.action || "event",
      entity: log.entity_type || "entity",
      ref: log.entity_id || "ref",
     }));
     setLiveAuditLogs(mappedAudit as typeof auditLogs);
    }
   })
   .catch((error: Error) => {
    if (!active) return;
    setLiveStatus("error");
    setLiveError(error.message);
   });

  return () => {
   active = false;
  };
 }, [projectId]);

 const displayRuns = liveStatus === "authed" ? liveRuns : analysisRuns;
 const displayStoryboard = liveStatus === "authed" ? liveStoryboardFrames : storyboardFrames;
 const displayMoodboard = liveStatus === "authed" ? liveMoodboardItems : moodboardItems;
 const displayTraceability = liveStatus === "authed" ? liveTraceability : traceability;
 const displayAuditLogs = liveStatus === "authed" ? liveAuditLogs : auditLogs;

 useEffect(() => {
  if (!displayInsightsVersions.length) return;
  if (!displayInsightsVersions.find((v) => v.version === leftVersion)) {
   setLeftVersion(displayInsightsVersions[0].version);
  }
  const fallbackRight = displayInsightsVersions[Math.min(1, displayInsightsVersions.length - 1)]?.version;
  if (fallbackRight && !displayInsightsVersions.find((v) => v.version === rightVersion)) {
   setRightVersion(fallbackRight);
  }
 }, [displayInsightsVersions, leftVersion, rightVersion]);

 return (
  <div className="min-h-screen bg-background text-foreground">
   <Header />

   <main className="pt-24">
    <div className="mx-auto max-w-7xl px-4 pb-24 lg:px-8 fade-soft">
     <div className="mb-8">
      <Link href="/projects" className="inline-flex items-center text-sm text-white/60 hover:text-white">
       Back to Projects
      </Link>
     </div>

     <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-4">
       <p className="text-eyebrow">Project Detail</p>
       <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white font-display">{project.name}</h1>
       <p className="max-w-2xl text-sm sm:text-base text-white/60">{project.summary}</p>
       <div className="space-y-1 text-sm text-white/60">
        <p>Status: {project.status}</p>
        <p>Client: {project.client}</p>
        <p>Owner: {project.owner}</p>
        <p>Last updated: {project.lastUpdated}</p>
       </div>
       {liveStatus === "anon" && (
        <p className="text-xs text-white/50">Sign in to load live project data from Supabase.</p>
       )}
       {liveStatus === "error" && (
        <p className="text-xs text-white/50">Unable to load live data{liveError ? `: ${liveError}` : "."}</p>
       )}
      </div>
      <div className="flex flex-wrap gap-2">
       <Button className="bg-transparent text-white/60 rounded-full hover:text-white">
        Regenerate
       </Button>
       <Button className="bg-white text-black hover:bg-white/80 rounded-full">Export Package</Button>
      </div>
     </div>

     <Tabs defaultValue="overview" className="space-y-12">
      <div className="pb-2">
       <TabsList className="flex flex-wrap gap-3 bg-transparent p-0">
        <TabsTrigger value="overview" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Overview</TabsTrigger>
        <TabsTrigger value="visual" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Visual Intelligence</TabsTrigger>
        <TabsTrigger value="cinematic" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Cinematic Reading</TabsTrigger>
        <TabsTrigger value="storyboard" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Storyboard</TabsTrigger>
        <TabsTrigger value="mood" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Mood Direction</TabsTrigger>
        <TabsTrigger value="insights" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">AI Insights</TabsTrigger>
        <TabsTrigger value="export" className="px-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 data-[state=active]:text-white">Export</TabsTrigger>
       </TabsList>
      </div>

      <TabsContent value="overview" className="space-y-12">
       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Overview</p>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
         <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">Project Context</h2>
          <p className="text-sm text-white/70">{project.summary}</p>
         </div>
         <div className="text-sm text-white/70 space-y-2">
          <div className="flex justify-between"><span>Status</span><span className="text-white">{project.status}</span></div>
          <div className="flex justify-between"><span>Client</span><span className="text-white">{project.client}</span></div>
          <div className="flex justify-between"><span>Owner</span><span className="text-white">{project.owner}</span></div>
          <div className="flex justify-between"><span>Last updated</span><span className="text-white">{project.lastUpdated}</span></div>
         </div>
        </div>
       </section>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Asset Intake</p>
        <div className="grid gap-6 lg:grid-cols-2">
         <div className="p-6 text-center">
          <p className="text-sm text-white/60">Drag and drop or browse</p>
          <Button className="mt-4 bg-white text-black hover:bg-white/80 rounded-full" size="sm">Select File</Button>
         </div>
         <div className="space-y-3">
          <Input placeholder="Asset name" className="bg-white/5 border-transparent text-white placeholder:text-white/40" />
          <Textarea placeholder="Notes for this upload" className="bg-white/5 border-transparent text-white placeholder:text-white/40 min-h-[120px]" />
         </div>
        </div>
        <div className="flex flex-wrap gap-2">
         <Button asChild className="bg-transparent text-white/60 rounded-full hover:text-white">
          <Link href="/upload">Open Upload Flow</Link>
         </Button>
         <Button className="bg-white text-black hover:bg-white/80 rounded-full">Attach to Project</Button>
        </div>
       </section>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Activity</p>
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
             <p className="text-xs uppercase tracking-[0.3em] text-white/50">{run.status}</p>
            </div>
            <div className="mt-3 text-sm text-white/70">
             <span className="text-white/50">Progress</span> {run.progress}%
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
             {run.stages.map((stage) => (
              <span key={stage.name}>{stage.name} · {stage.status}</span>
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
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Governance</p>
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
         {showOverviewData ? "Hide Data" : "Show Data"}
        </Button>
        {showOverviewData && (
         <div className="mt-8 space-y-8">
          <section className="space-y-4">
           <p className="text-xs uppercase tracking-[0.4em] text-white/50">Governance</p>
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
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Visual Intelligence</p>
        <h2 className="text-2xl font-semibold text-white">Technical Summary</h2>
        <div className="max-w-2xl space-y-4 text-sm text-white/70">
         <p>Technical scoring reflects deterministic analysis of clarity, noise profile, and dynamic range.</p>
         <p className="text-white/60">Quantitative scores are available under “Show Data.”</p>
         <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Focus Areas</p>
          <p>Sharpness, noise profile, contrast stability.</p>
         </div>
        </div>
       </section>

       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Processing</p>
        <h3 className="text-xl font-semibold text-white">Optimization Policies</h3>
        <div className="space-y-3">
         {optimizationPolicies.map((policy) => (
          <div key={policy.id} className="flex flex-wrap items-center justify-between gap-3 pb-3 last:pb-0 text-sm text-white/70">
           <span>{policy.rule}</span>
           <span className="text-xs uppercase tracking-[0.3em] text-white/50">{policy.status}</span>
          </div>
         ))}
        </div>
       </section>

       <div className="pt-2">
        <Button
         className="bg-transparent text-white/60 rounded-full hover:text-white"
         onClick={() => setShowVisualData((value) => !value)}
        >
         {showVisualData ? "Hide Data" : "Show Data"}
        </Button>
        {showVisualData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Data Snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
           <div className="flex justify-between"><span>Sharpness</span><span className="text-white">{analysisSummary.technical.sharpness}%</span></div>
           <div className="flex justify-between"><span>Noise</span><span className="text-white">{analysisSummary.technical.noise}%</span></div>
           <div className="flex justify-between"><span>Contrast</span><span className="text-white">{analysisSummary.technical.contrast}%</span></div>
           {(() => {
            const technical = (analysisRaw as Record<string, unknown> | null)?.technical as Record<string, unknown> | undefined;
            const brightness = technical ? technical["brightness"] : undefined;
            if (typeof brightness === "number") {
             return (
              <div className="flex justify-between"><span>Brightness</span><span className="text-white">{Math.round(brightness)}%</span></div>
             );
            }
            return null;
           })()}
           {(() => {
            const technical = (analysisRaw as Record<string, unknown> | null)?.technical as Record<string, unknown> | undefined;
            const saturation = technical ? technical["saturation"] : undefined;
            if (typeof saturation === "number") {
             return (
              <div className="flex justify-between"><span>Saturation</span><span className="text-white">{Math.round(saturation)}%</span></div>
             );
            }
            return null;
           })()}
           {(() => {
            const composition = (analysisRaw as Record<string, unknown> | null)?.composition as Record<string, unknown> | undefined;
            const score = composition ? composition["score"] : undefined;
            if (typeof score === "number") {
             return (
              <div className="flex justify-between"><span>Composition Score</span><span className="text-white">{Math.round(score)}%</span></div>
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
       <p className="text-xs uppercase tracking-[0.4em] text-white/50">Cinematic Reading</p>
       <h2 className="text-2xl font-semibold text-white">Narrative Signals</h2>
       <div className="max-w-2xl space-y-4 text-sm text-white/70">
        <p>The cinematic reading synthesizes mood, energy, shot type, and genre cues into a single narrative profile.</p>
        <p className="text-white/60">Narrative potential is computed from composition and contrast alignment. View the quantified profile under “Show Data.”</p>
        <div className="space-y-2">
         <p className="text-xs uppercase tracking-[0.3em] text-white/50">Signal Families</p>
         <p>Mood, energy, shot type, genre, narrative potential.</p>
        </div>
       </div>
      </section>

       <div className="pt-2">
        <Button
         className="bg-transparent text-white/60 rounded-full hover:text-white"
         onClick={() => setShowCinematicData((value) => !value)}
        >
         {showCinematicData ? "Hide Data" : "Show Data"}
        </Button>
        {showCinematicData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Data Snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
           <div className="flex justify-between"><span>Mood</span><span className="text-white">{analysisSummary.cinematic.mood}</span></div>
           <div className="flex justify-between"><span>Energy</span><span className="text-white">{analysisSummary.cinematic.energy}</span></div>
           <div className="flex justify-between"><span>Shot Type</span><span className="text-white">{analysisSummary.cinematic.shotType}</span></div>
           <div className="flex justify-between"><span>Genre</span><span className="text-white">{analysisSummary.cinematic.genre}</span></div>
           <div className="flex justify-between"><span>Narrative Potential</span><span className="text-white">{Math.round(analysisSummary.cinematic.narrativePotential * 100)}%</span></div>
           {(() => {
            const cinematic = (analysisRaw as Record<string, unknown> | null)?.cinematic as Record<string, unknown> | undefined;
            const mood = cinematic ? cinematic["mood"] : undefined;
            if (typeof mood === "string") {
             return (
              <div className="flex justify-between"><span>Detected Mood</span><span className="text-white">{mood}</span></div>
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
       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Storyboard</p>
        <h2 className="text-2xl font-semibold text-white">Visual Sequence</h2>
        {displayStoryboard.length ? (
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayStoryboard.map((frame) => (
           <div key={frame.id} className="overflow-hidden rounded-3xl">
            <div className="aspect-video bg-white/10">
             <img src={frame.image} alt={`Frame ${frame.frame}`} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 text-sm text-white/70">
             <p className="text-white font-medium">Frame {frame.frame}</p>
             <p className="text-white/50">{frame.notes}</p>
            </div>
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
         {showStoryboardData ? "Hide Data" : "Show Data"}
        </Button>
        {showStoryboardData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Shot List</p>
          {displayStoryboard.length ? (
           <div className="mt-4 space-y-2">
            {displayStoryboard.map((frame) => (
             <div key={frame.id} className="flex flex-wrap items-start justify-between gap-4">
              <span className="text-white">Frame {frame.frame}</span>
              <span className="text-white/60">{frame.notes}</span>
             </div>
            ))}
           </div>
          ) : (
           <p className="mt-3 text-sm text-white/60">Storyboard data not available.</p>
          )}
         </div>
        )}
       </div>
      </TabsContent>

            <TabsContent value="mood" className="space-y-12">
       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Mood Direction</p>
        <h2 className="text-2xl font-semibold text-white">Reference Palette</h2>
        {displayMoodboard.length ? (
         <div className="grid gap-6 grid-cols-2 sm:grid-cols-3">
          {displayMoodboard.map((item) => (
           <div key={item.id} className="overflow-hidden rounded-3xl">
            {item.type === "image" ? (
             <img src={item.src} alt={item.label} className="h-36 w-full object-cover" />
            ) : (
             <div className="h-36 w-full" style={{ backgroundColor: item.color }} />
            )}
            <div className="p-3 text-xs text-white/60">{item.label}</div>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-sm text-white/60">No moodboard items yet.</p>
        )}
       </section>

       <div className="pt-2">
        <Button
         className="bg-transparent text-white/60 rounded-full hover:text-white"
         onClick={() => setShowMoodData((value) => !value)}
        >
         {showMoodData ? "Hide Data" : "Show Data"}
        </Button>
        {showMoodData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Moodboard Notes</p>
          {displayMoodboard.length ? (
           <div className="mt-4 space-y-2">
            {displayMoodboard.map((item) => (
             <div key={item.id} className="flex flex-wrap items-start justify-between gap-4">
              <span className="text-white">{item.label || "Untitled"}</span>
              <span className="text-white/60">{item.type === "color" ? item.color : "Image reference"}</span>
             </div>
            ))}
           </div>
          ) : (
           <p className="mt-3 text-sm text-white/60">Moodboard data not available.</p>
          )}
         </div>
        )}
       </div>
      </TabsContent>

            <TabsContent value="insights" className="space-y-12">
       <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">AI Insights</p>
        <h2 className="text-2xl font-semibold text-white">Creative Brief</h2>
        {decisionOutput ? (
         <div className="space-y-8">
          <div className="space-y-3">
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Creative Direction</p>
           <p className="text-lg text-white">{decisionOutput.decision_summary || "Decision summary unavailable."}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 text-sm text-white/70">
           <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Key Opportunities</p>
            {decisionOutput.recommended_actions?.length ? (
             <ul className="mt-3 space-y-1">
              {decisionOutput.recommended_actions.map((action) => (
               <li key={action}>{action}</li>
              ))}
             </ul>
            ) : (
             <p className="mt-3 text-sm text-white/60">No immediate opportunities noted.</p>
            )}
           </div>
           <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Risks &amp; Trade-offs</p>
            {decisionOutput.risk_flags?.length ? (
             <ul className="mt-3 space-y-1">
              {decisionOutput.risk_flags.map((risk) => (
               <li key={risk}>{risk}</li>
              ))}
             </ul>
            ) : (
             <p className="mt-3 text-sm text-white/60">No major risks detected.</p>
            )}
           </div>
          </div>

          <div className="space-y-3 text-sm text-white/70">
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Confidence Meter</p>
           <p className="text-2xl font-semibold text-white">
            {decisionOutput.confidence !== undefined ? Math.round(decisionOutput.confidence * 100) : 0}%
           </p>
           <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex justify-between"><span>Intent alignment</span><span className="text-white">{decisionOutput.intent_alignment !== undefined ? Math.round(decisionOutput.intent_alignment * 100) : 0}%</span></div>
            <div className="flex justify-between"><span>Composition</span><span className="text-white">{Math.round((decisionOutput.composition_score ?? 0) * 100)}%</span></div>
            <div className="flex justify-between"><span>Color</span><span className="text-white">{Math.round((decisionOutput.color_score ?? 0) * 100)}%</span></div>
            <div className="flex justify-between"><span>Signals</span><span className="text-white">{signalCount}</span></div>
           </div>
           <p className="text-xs text-white/50">Engine: {decisionOutput.engine_version ?? "decision-v1"}{decisionOutput.version ? ` · ${decisionOutput.version}` : ""}</p>
          </div>

          <p className="text-xs text-white/50">
           This decision is generated based on visual signals derived from composition, color, motion, and cinematic patterns.
          </p>
         </div>
        ) : (
         <p className="text-sm text-white/60">No decision output generated yet.</p>
        )}
       </section>

       <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Alternative Visual Paths</p>
        <h3 className="text-xl font-semibold text-white">Version Comparison</h3>
        <div className="grid gap-4 sm:grid-cols-2">
         <div>
          <Label className="text-white/60">Select version A</Label>
          <Select value={leftVersion} onValueChange={setLeftVersion}>
          <SelectTrigger className="bg-transparent text-white border-0 shadow-none">
           <SelectValue />
          </SelectTrigger>
           <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
            {displayInsightsVersions.map((v) => (
             <SelectItem key={v.version} value={v.version}>{v.version} · {v.createdAt}</SelectItem>
            ))}
           </SelectContent>
          </Select>
         </div>
         <div>
          <Label className="text-white/60">Select version B</Label>
          <Select value={rightVersion} onValueChange={setRightVersion}>
          <SelectTrigger className="bg-transparent text-white border-0 shadow-none">
           <SelectValue />
          </SelectTrigger>
           <SelectContent className="bg-[#0b0b0c] text-white border-0 shadow-none">
            {displayInsightsVersions.map((v) => (
             <SelectItem key={v.version} value={v.version}>{v.version} · {v.createdAt}</SelectItem>
            ))}
           </SelectContent>
          </Select>
         </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
         <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Path {left.version}</p>
          <p className="text-sm text-white">{left.decisionSummary}</p>
          <div className="text-sm text-white/70 space-y-2">
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Risks</p>
           {left.riskFlags.length ? (
            <ul className="mt-2 space-y-1">
             {left.riskFlags.map((risk) => (
              <li key={risk}>{risk}</li>
             ))}
            </ul>
           ) : (
            <p className="mt-2 text-white/60">No risks listed.</p>
           )}
          </div>
         </div>
         <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Path {right.version}</p>
          <p className="text-sm text-white">{right.decisionSummary}</p>
          <div className="text-sm text-white/70 space-y-2">
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Risks</p>
           {right.riskFlags.length ? (
            <ul className="mt-2 space-y-1">
             {right.riskFlags.map((risk) => (
              <li key={risk}>{risk}</li>
             ))}
            </ul>
           ) : (
            <p className="mt-2 text-white/60">No risks listed.</p>
           )}
          </div>
         </div>
        </div>

        <div className="space-y-4">
         <p className="text-sm font-medium text-white">Comparison Highlights</p>
         <div className="grid gap-4 sm:grid-cols-2 text-sm text-white/70">
          <div>
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Added Actions</p>
           {diff.added.length ? diff.added.map((item) => (
            <div key={item}>{item}</div>
           )) : <p className="text-white/50">No changes</p>}
          </div>
          <div>
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Removed Actions</p>
           {diff.removed.length ? diff.removed.map((item) => (
            <div key={item}>{item}</div>
           )) : <p className="text-white/50">No changes</p>}
          </div>
          <div>
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">New Risks</p>
           {diff.riskAdded.length ? diff.riskAdded.map((item) => (
            <div key={item}>{item}</div>
           )) : <p className="text-white/50">No changes</p>}
          </div>
          <div>
           <p className="text-xs uppercase tracking-[0.3em] text-white/50">Resolved Risks</p>
           {diff.riskRemoved.length ? diff.riskRemoved.map((item) => (
            <div key={item}>{item}</div>
           )) : <p className="text-white/50">No changes</p>}
          </div>
         </div>
        </div>
       </section>

       <div className="pt-2">
        <Button
         className="bg-transparent text-white/60 rounded-full hover:text-white"
         onClick={() => setShowInsightsData((value) => !value)}
        >
         {showInsightsData ? "Hide Data" : "Show Data"}
        </Button>
        {showInsightsData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Decision Metrics</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
           <div className="flex justify-between"><span>Confidence</span><span className="text-white">{decisionOutput?.confidence !== undefined ? Math.round(decisionOutput.confidence * 100) : 0}%</span></div>
           <div className="flex justify-between"><span>Intent Alignment</span><span className="text-white">{decisionOutput?.intent_alignment !== undefined ? Math.round(decisionOutput.intent_alignment * 100) : 0}%</span></div>
           <div className="flex justify-between"><span>Composition Score</span><span className="text-white">{Math.round((decisionOutput?.composition_score ?? 0) * 100)}%</span></div>
           <div className="flex justify-between"><span>Color Score</span><span className="text-white">{Math.round((decisionOutput?.color_score ?? 0) * 100)}%</span></div>
           <div className="flex justify-between"><span>Engine Version</span><span className="text-white">{decisionOutput?.engine_version ?? "decision-v1"}</span></div>
           {decisionOutput?.version ? (
            <div className="flex justify-between"><span>Decision Version</span><span className="text-white">{decisionOutput.version}</span></div>
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
           <p className="text-xs text-white/60">Storyboard + Moodboard + Insights</p>
          </div>
          <Button className="bg-white text-black hover:bg-white/80 rounded-full" size="sm">Export PDF</Button>
         </div>
         <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div>
           <p className="text-sm font-medium text-white">Production Handoff</p>
           <p className="text-xs text-white/60">Shot list + Settings + Risks</p>
          </div>
          <Button className="bg-transparent text-white/60 rounded-full hover:text-white" size="sm">Export ZIP</Button>
         </div>
        </div>
        <Button asChild className="bg-transparent text-white/60 rounded-full hover:text-white">
         <Link href="/export">Go to Export Hub</Link>
        </Button>
      </section>

      <div className="pt-2">
        <Button
         className="bg-transparent text-white/60 rounded-full hover:text-white"
         onClick={() => setShowExportData((value) => !value)}
        >
         {showExportData ? "Hide Data" : "Show Data"}
        </Button>
        {showExportData && (
         <div className="mt-8 space-y-4 text-sm text-white/70">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Export Metadata</p>
          {displayTraceability ? (
           <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex justify-between"><span>Export Id</span><span className="text-white">{displayTraceability.exportId}</span></div>
            <div className="flex justify-between"><span>Analysis Run</span><span className="text-white">{displayTraceability.runId}</span></div>
            <div className="flex justify-between"><span>Pipeline Version</span><span className="text-white">{displayTraceability.pipelineVersion}</span></div>
           </div>
          ) : (
           <p className="mt-3 text-sm text-white/60">Export metadata not available.</p>
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
